import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import type { FunnelStep } from '../lib/funnel_taxonomy'

export interface BusinessContext {
    // Core Identity
    intakeStatus: 'pending' | 'completed'
    businessType: 'service_local' | 'service_luxury' | 'brick_mortar' | 'agency' | 'saas' | 'hybrid' | 'unknown'
    businessName: string
    offerHeadline: string
    pricingModel: string
    pricePoint: number
    targetAudience: string

    // Diagnostic Data (The "Input Upgrade")
    segments: CustomerSegment[]
    vitals: FinancialVitals
    founder: FounderContext
    goals: FutureGoals

    // Legacy / Generated
    refinedHeadline?: string
    refinedPitch?: string

    // Module 2: Funnel
    funnelSteps: FunnelStep[]
    monthlyLeads: number
    followUpIntensity: 0 | 1 | 3 | 5

    // Module 3: System
    timeBudgetHours: number
    teamRole: 'solo' | 'founder_va' | 'small_team'

    // Module 5: Cost
    hourlyValue: number
    keyChannels: string[]
}

export interface CustomerSegment {
    id: string
    name: string // e.g. "Scatter", "HOA"
    pricePoint: number
    billingFrequency: 'monthly' | 'quarterly' | 'annual' | 'one-time'
    count: number // How many customers?
}

export interface FinancialVitals {
    revenue: number // Annual
    netProfit: number
    grossMargin: number
    utilization: number // 0-100% (Efficiency)
    churnRate?: number // For SaaS/Agency
    upsellRate?: number // For Service/Consulting
}

export interface FounderContext {
    hoursPerWeek: number
    runwayMonths: number
    emotionalDrivers: string // "Baby on the way", "Burnout", etc.
}

export interface FutureGoals {
    revenue90Day: number
    revenue180Day: number
    revenue1Year: number
    primaryConstraint: 'leads' | 'sales' | 'fulfillment' | 'churn' | 'unknown'
}

interface ModuleProgress {
    id: number
    isLocked: boolean
    isCompleted: boolean
    score?: number // 0-100
}

interface BusinessState {
    context: BusinessContext
    modules: ModuleProgress[]

    // Actions
    // Actions
    updateContext: (updates: Partial<BusinessContext>) => void
    updateVitals: (updates: Partial<FinancialVitals>) => void
    addSegment: (segment: Omit<CustomerSegment, 'id'>) => void
    removeSegment: (id: string) => void
    updateFounder: (updates: Partial<FounderContext>) => void
    updateGoals: (updates: Partial<FutureGoals>) => void

    completeModule: (id: number, score?: number) => void
    unlockNextModule: (currentId: number) => void
    resetProgress: () => void

    // Cloud Sync
    syncToSupabase: () => Promise<void>
}

const INITIAL_CONTEXT: BusinessContext = {
    intakeStatus: 'pending',
    businessType: 'unknown',
    businessName: '',
    offerHeadline: '',
    pricingModel: 'fixed',
    pricePoint: 0,
    targetAudience: '',

    segments: [],
    vitals: {
        revenue: 0,
        netProfit: 0,
        grossMargin: 0,
        utilization: 0
    },
    founder: {
        hoursPerWeek: 0,
        runwayMonths: 0,
        emotionalDrivers: ''
    },
    goals: {
        revenue90Day: 0,
        revenue180Day: 0,
        revenue1Year: 0,
        primaryConstraint: 'unknown'
    },

    refinedHeadline: '',
    refinedPitch: '',
    funnelSteps: [],
    monthlyLeads: 0,
    followUpIntensity: 0,
    timeBudgetHours: 0,
    teamRole: 'solo',
    hourlyValue: 100,
    keyChannels: []
}

const INITIAL_MODULES: ModuleProgress[] = [
    { id: 1, isLocked: false, isCompleted: false }, // Offer Diagnostic
    { id: 2, isLocked: false, isCompleted: false }, // Visual Funnel
    { id: 3, isLocked: false, isCompleted: false }, // Lead System
    { id: 4, isLocked: false, isCompleted: false }, // Quality Architect
    { id: 5, isLocked: false, isCompleted: false }, // Cost Efficiency
    { id: 6, isLocked: false, isCompleted: false }, // Lead Engine
    { id: 7, isLocked: false, isCompleted: false }, // Pitch Architect
]

export const useBusinessStore = create<BusinessState>()(
    persist(
        (set, get) => ({
            context: INITIAL_CONTEXT,
            modules: INITIAL_MODULES,

            updateContext: (updates) =>
                set((state) => ({
                    context: { ...state.context, ...updates }
                })),

            updateVitals: (updates) =>
                set((state) => ({
                    context: {
                        ...state.context,
                        vitals: { ...state.context.vitals, ...updates }
                    }
                })),

            addSegment: (segment) =>
                set((state) => ({
                    context: {
                        ...state.context,
                        segments: [
                            ...state.context.segments,
                            { ...segment, id: Math.random().toString(36).substr(2, 9) }
                        ]
                    }
                })),

            removeSegment: (id) =>
                set((state) => ({
                    context: {
                        ...state.context,
                        segments: state.context.segments.filter(s => s.id !== id)
                    }
                })),

            updateFounder: (updates) =>
                set((state) => ({
                    context: {
                        ...state.context,
                        founder: { ...state.context.founder, ...updates }
                    }
                })),

            updateGoals: (updates) =>
                set((state) => ({
                    context: {
                        ...state.context,
                        goals: { ...state.context.goals, ...updates }
                    }
                })),

            completeModule: (id, score) =>
                set((state) => {
                    const newModules = state.modules.map((m) =>
                        m.id === id ? { ...m, isCompleted: true, score } : m
                    )
                    // Auto-unlock next module
                    const nextId = id + 1
                    if (nextId <= 7) {
                        const nextIndex = newModules.findIndex(m => m.id === nextId)
                        if (nextIndex !== -1) newModules[nextIndex].isLocked = false
                    }
                    return { modules: newModules }
                }),

            unlockNextModule: (currentId) =>
                set((state) => ({
                    modules: state.modules.map((m) =>
                        m.id === currentId + 1 ? { ...m, isLocked: false } : m
                    )
                })),

            resetProgress: () => set({ context: INITIAL_CONTEXT, modules: INITIAL_MODULES }),

            syncToSupabase: async () => {
                const state = get()
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) return // Not logged in, keep local only

                // 1. Check if business exists for user
                const { data: existing } = await supabase
                    .from('businesses')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                const payload = {
                    user_id: user.id,
                    name: state.context.businessName,
                    business_type: state.context.businessType,
                    module_1_inputs: {
                        headline: state.context.offerHeadline,
                        pricing_model: state.context.pricingModel,
                        price: state.context.pricePoint
                    },
                    module_2_inputs: {
                        funnel_steps: state.context.funnelSteps,
                        monthly_leads: state.context.monthlyLeads,
                        follow_up_intensity: state.context.followUpIntensity
                    },
                    vitals: state.context.vitals,
                    segments: state.context.segments,
                    founder_context: {
                        ...state.context.founder,
                        goals: state.context.goals
                    }
                }

                if (existing) {
                    await supabase.from('businesses').update(payload).eq('id', existing.id)
                } else {
                    await supabase.from('businesses').insert(payload)
                }
            }
        }),
        {
            name: 'smb-coaching-store',
        }
    )
)
