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
    isHighTicketService?: boolean
    isPreRevenue?: boolean
    skippedOfferDiagnosis?: boolean
    businessModel: 'high_ticket_service' | 'local_trades' | 'saas_software' | 'physical_location' | 'unknown'
    recommendedModuleId?: number

    // Diagnostic Data (The "Input Upgrade")
    segments: CustomerSegment[]
    vitals: FinancialVitals
    founder: FounderContext
    goals: FutureGoals

    // Phase 0: Offer Health Check
    offerCheck: {
        closeRate: number | null
        grossMargin: number | null
        verdict: 'pass' | 'fail_close_rate' | 'fail_margin' | 'fail_both' | 'warn_underpriced' | null
        acknowledgedUnderpriced: boolean
        underpricedBy: string | null
        timestamp: number | null
    }

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

    // Phase 1: Custom Funnel Audit (New Architecture)
    customFunnel?: {
        timeframeDays: number
        steps: Array<{
            id: string
            stepType: string
            canonicalMetric: string
            quantity: number
        }>
        aggregatedMetrics?: {
            totalOutreach: number
            totalResponses: number
            totalCalls: number
            totalClosed: number
        }
    }

    // Legacy / Generated
    metrics?: Record<string, number>

    // Phase 2: Accountability
    accountability?: {
        prescriptionHistory: Array<{ date: string; prescription: string; completed: boolean }>
        softBottleneckAdmissions: Array<{ date: string; blocker: 'time' | 'energy' | 'effort' | 'belief' }>
        skipCount: number
    }

    // Phase 1: Lead Audit (Legacy V1 - Deprecating)
    leadAudit: {
        metrics: {
            coldOutreach: number
            coldResponses: number
            warmOutreach: number
            warmResponses: number
            inbound: number
            loomsFilmed: number
            salesCalls: number
            clientsClosed: number
        } | null
        bottleneck: string | null
        softBottleneck: string | null
        prescription: {
            action: string
            quantity: number
            timeframe: 'this_week' | 'by_friday'
            explanation: string
        } | null
        skipCount: number
        nextCheckInDate: number | null
        checkInHistory: Array<{
            result: 'yes' | 'partial' | 'no'
            quantity?: number
            blocker?: 'time' | 'energy' | 'attention' | 'effort' | 'belief'
            timestamp: number
        }>
        softBottleneckAdmissions: string[]
        phase1Complete: boolean
    }
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

    // Live Calculator Inputs
    cogs?: number // Cost of Goods Sold / Cost to Deliver
    opex?: number // Operating Expenses
    currentClients?: number
    maxCapacity?: number
}

export type OperatingMood = 'scrambling' | 'plateaued' | 'burnout' | 'scaling' | 'unknown'

export interface FounderContext {
    hoursPerWeek: number
    runwayMonths: number
    yearsExperience: number
    operatingMood: OperatingMood
    hourlyValue?: number
}

export interface FutureGoals {
    revenue90Day: number
    revenue180Day: number
    revenue1Year: number
    operationalChange: string // One change I need
    structuralFix: string // One fix I'm avoiding
    primaryConstraint: 'leads' | 'sales' | 'fulfillment' | 'churn' | 'unknown'
    constraintMetadata: string // Facts about the bottleneck
}

// Daily Check-in State (Phase 2)
export type EvidenceLevel = 'Gold' | 'Silver' | 'Bronze' | 'Unverified'

export interface RhythmState {
    channelName: string
    beat: string
    cadence: string
    firstBeatProof: string
    lastConfirmedAt: number // timestamp
    evidenceLevel: EvidenceLevel
    consecutiveMisses: number
    isActive: boolean
}

export interface DelegationState {
    taskName: string
    sopSteps: string[]
    delegatedTo: string
    lastConfirmedAt: number
    evidenceLevel: EvidenceLevel
    isActive: boolean
}

// Decay thresholds in milliseconds
const DECAY_THRESHOLDS = {
    Bronze: 14 * 24 * 60 * 60 * 1000, // 14 days
    Silver: 21 * 24 * 60 * 60 * 1000, // 21 days
    Gold: 30 * 24 * 60 * 60 * 1000,   // 30 days
}

// Evidence decay function
export function calculateDecayedLevel(current: EvidenceLevel, lastConfirmed: number): EvidenceLevel {
    const now = Date.now()
    const elapsed = now - lastConfirmed

    if (current === 'Gold' && elapsed > DECAY_THRESHOLDS.Gold) return 'Silver'
    if (current === 'Silver' && elapsed > DECAY_THRESHOLDS.Silver) return 'Bronze'
    if (current === 'Bronze' && elapsed > DECAY_THRESHOLDS.Bronze) return 'Unverified'
    return current
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

    // Daily Check-in State (Phase 2)
    rhythm: RhythmState | null
    delegation: DelegationState | null
    lastCheckInDate: string | null // YYYY-MM-DD format

    // Actions
    updateContext: (updates: Partial<BusinessContext>) => void
    updateVitals: (updates: Partial<FinancialVitals>) => void
    addSegment: (segment: Omit<CustomerSegment, 'id'>) => void
    removeSegment: (id: string) => void
    updateFounder: (updates: Partial<FounderContext>) => void
    updateGoals: (updates: Partial<FutureGoals>) => void

    completeModule: (id: number, score?: number) => void
    unlockNextModule: (currentId: number) => void
    unlockSpecificModule: (id: number) => void
    resetProgress: () => void

    // Daily Check-in Actions
    setRhythm: (rhythm: RhythmState) => void
    setDelegation: (delegation: DelegationState) => void
    confirmRhythm: () => void
    confirmDelegation: () => void
    recordRhythmMiss: () => void
    recordDelegationRegression: () => void
    runDecayCheck: () => void
    needsCheckIn: () => boolean

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
    isHighTicketService: undefined,
    isPreRevenue: false,
    skippedOfferDiagnosis: false,
    businessModel: 'unknown',

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
        yearsExperience: 0,
        operatingMood: 'unknown'
    },
    goals: {
        revenue90Day: 0,
        revenue180Day: 0,
        revenue1Year: 0,
        operationalChange: '',
        structuralFix: '',
        primaryConstraint: 'unknown',
        constraintMetadata: ''
    },

    offerCheck: {
        closeRate: null,
        grossMargin: null,
        verdict: null,
        acknowledgedUnderpriced: false,
        underpricedBy: null,
        timestamp: null
    },

    refinedHeadline: '',
    refinedPitch: '',
    funnelSteps: [],
    monthlyLeads: 0,
    followUpIntensity: 0,
    timeBudgetHours: 0,
    teamRole: 'solo',
    hourlyValue: 100,
    keyChannels: [],

    // Phase 1: Custom Funnel Audit (New Architecture)
    customFunnel: undefined,

    // Legacy (Keep for compatibility until full migration)
    metrics: undefined,

    // Phase 2: Accountability
    accountability: undefined,

    // UI State
    isLoading: false,
    error: null,

    // Phase 1: Lead Audit (NEW)
    leadAudit: {
        metrics: null,
        bottleneck: null,
        softBottleneck: null,
        prescription: null,
        skipCount: 0,
        nextCheckInDate: null,
        checkInHistory: [],
        softBottleneckAdmissions: [],
        phase1Complete: false,
    }
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

            // Daily Check-in State (Phase 2)
            rhythm: null,
            delegation: null,
            lastCheckInDate: null,

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

            unlockSpecificModule: (id) =>
                set((state) => ({
                    modules: state.modules.map((m) =>
                        m.id === id ? { ...m, isLocked: false } : m
                    )
                })),

            resetProgress: () => set({
                context: INITIAL_CONTEXT,
                modules: INITIAL_MODULES,
                rhythm: null,
                delegation: null,
                lastCheckInDate: null
            }),

            // Daily Check-in Actions
            setRhythm: (rhythm) => set({ rhythm }),

            setDelegation: (delegation) => set({ delegation }),

            confirmRhythm: () =>
                set((state) => {
                    if (!state.rhythm) return state
                    const today = new Date().toISOString().split('T')[0]
                    return {
                        rhythm: {
                            ...state.rhythm,
                            lastConfirmedAt: Date.now(),
                            consecutiveMisses: 0
                        },
                        lastCheckInDate: today
                    }
                }),

            confirmDelegation: () =>
                set((state) => {
                    if (!state.delegation) return state
                    const today = new Date().toISOString().split('T')[0]
                    return {
                        delegation: {
                            ...state.delegation,
                            lastConfirmedAt: Date.now()
                        },
                        lastCheckInDate: today
                    }
                }),

            recordRhythmMiss: () =>
                set((state) => {
                    if (!state.rhythm) return state
                    const newMisses = state.rhythm.consecutiveMisses + 1
                    // Degrade evidence if 3+ consecutive misses
                    let newLevel = state.rhythm.evidenceLevel
                    if (newMisses >= 3) {
                        if (newLevel === 'Gold') newLevel = 'Silver'
                        else if (newLevel === 'Silver') newLevel = 'Bronze'
                        else if (newLevel === 'Bronze') newLevel = 'Unverified'
                    }
                    return {
                        rhythm: {
                            ...state.rhythm,
                            consecutiveMisses: newMisses,
                            evidenceLevel: newLevel
                        }
                    }
                }),

            recordDelegationRegression: () =>
                set((state) => {
                    if (!state.delegation) return state
                    return {
                        delegation: {
                            ...state.delegation,
                            evidenceLevel: 'Unverified' as const,
                            isActive: false
                        }
                    }
                }),

            runDecayCheck: () =>
                set((state) => {
                    let updates: Partial<BusinessState> = {}

                    if (state.rhythm) {
                        const newLevel = calculateDecayedLevel(
                            state.rhythm.evidenceLevel,
                            state.rhythm.lastConfirmedAt
                        )
                        if (newLevel !== state.rhythm.evidenceLevel) {
                            updates.rhythm = { ...state.rhythm, evidenceLevel: newLevel }
                        }
                    }

                    if (state.delegation) {
                        const newLevel = calculateDecayedLevel(
                            state.delegation.evidenceLevel,
                            state.delegation.lastConfirmedAt
                        )
                        if (newLevel !== state.delegation.evidenceLevel) {
                            updates.delegation = { ...state.delegation, evidenceLevel: newLevel }
                        }
                    }

                    return updates
                }),

            needsCheckIn: () => {
                const state = get()
                const today = new Date().toISOString().split('T')[0]

                // No check-in needed if no active rhythm or delegation
                if (!state.rhythm?.isActive && !state.delegation?.isActive) return false

                // Check-in needed if last check-in was not today
                return state.lastCheckInDate !== today
            },

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
