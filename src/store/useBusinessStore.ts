import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BusinessContext {
    // Module 1: Offer
    businessName: string
    offerHeadline: string
    pricingModel: string
    pricePoint: number
    targetAudience: string

    // Module 2: Funnel
    funnelStages: string[]
    monthlyLeads: number

    // Module 3: System
    timeBudgetHours: number
    teamRole: 'solo' | 'founder_va' | 'small_team'

    // Module 5: Cost
    hourlyValue: number
    keyChannels: string[]
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
    updateContext: (updates: Partial<BusinessContext>) => void
    completeModule: (id: number, score?: number) => void
    unlockNextModule: (currentId: number) => void
    resetProgress: () => void
}

const INITIAL_CONTEXT: BusinessContext = {
    businessName: '',
    offerHeadline: '',
    pricingModel: 'fixed',
    pricePoint: 0,
    targetAudience: '',
    funnelStages: [],
    monthlyLeads: 0,
    timeBudgetHours: 0,
    teamRole: 'solo',
    hourlyValue: 100,
    keyChannels: []
}

const INITIAL_MODULES: ModuleProgress[] = [
    { id: 1, isLocked: false, isCompleted: false }, // Offer Diagnostic
    { id: 2, isLocked: true, isCompleted: false }, // Visual Funnel
    { id: 3, isLocked: true, isCompleted: false }, // Lead System
    { id: 4, isLocked: true, isCompleted: false }, // Quality Architect
    { id: 5, isLocked: true, isCompleted: false }, // Cost Efficiency
    { id: 6, isLocked: true, isCompleted: false }, // Lead Engine
    { id: 7, isLocked: true, isCompleted: false }, // Pitch Architect
]

export const useBusinessStore = create<BusinessState>()(
    persist(
        (set) => ({
            context: INITIAL_CONTEXT,
            modules: INITIAL_MODULES,

            updateContext: (updates) =>
                set((state) => ({
                    context: { ...state.context, ...updates }
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

            resetProgress: () => set({ context: INITIAL_CONTEXT, modules: INITIAL_MODULES })
        }),
        {
            name: 'smb-coaching-store',
        }
    )
)
