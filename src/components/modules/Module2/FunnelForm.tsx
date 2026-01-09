import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import {
    DEFAULT_FUNNEL_TEMPLATES,
    TRAFFIC_SOURCE_LABELS,
    STAGE_ACTION_LABELS,
    getFrictionLevel,
    getBusinessStage,
    isTrafficSourceForbidden,
    isTrafficCold,
    isHighFriction,
    type FunnelStep,
    type TrafficSourceType,
    type StageActionType
} from '../../../lib/funnel_taxonomy'
import { ArrowRight, Plus, Trash2, ArrowDown, AlertTriangle } from 'lucide-react'

interface FunnelFormProps {
    onSubmit: () => void
}

export function FunnelForm({ onSubmit }: FunnelFormProps) {
    const { context, updateContext } = useBusinessStore()

    // Default steps if none exist (using SERVICE_BUSINESS template)
    const [steps, setSteps] = useState<FunnelStep[]>(
        context.funnelSteps.length > 0
            ? context.funnelSteps
            : DEFAULT_FUNNEL_TEMPLATES.SERVICE_BUSINESS()
    )

    const [leads, setLeads] = useState(context.monthlyLeads || '')
    const [followupIntensity, setFollowupIntensity] = useState<0 | 1 | 3 | 5>(
        context.followUpIntensity || 0
    )

    // Get business stage from revenue (computed once per render)
    // RATIONALE: Avoids recalculating on every keystroke
    const businessStage = getBusinessStage(context.vitals.revenue)

    // Check for "Marriage on First Date" (cold traffic -> high friction)
    // RATIONALE: This is the #1 funnel mistake we want to prevent
    const hasMarriageWarning = (): boolean => {
        if (steps.length < 2) return false  // Need at least 2 steps to evaluate
        const firstStep = steps[0]
        const secondStep = steps[1]

        if (!firstStep?.trafficSource) return false  // Can't warn until traffic source is set

        // CORE LOGIC: Cold traffic (ads, cold outreach) should NOT go directly to high friction (calls, proposals)
        return (
            isTrafficCold(firstStep.trafficSource) &&
            isHighFriction(secondStep.action)
        )
    }

    // Update step traffic source (first step only)
    // RATIONALE: Only first step needs traffic source (subsequent steps inherit the audience)
    const updateStepTrafficSource = (index: number, source: TrafficSourceType) => {
        const newSteps = [...steps]  // Immutable update pattern
        newSteps[index] = { ...newSteps[index], trafficSource: source }
        setSteps(newSteps)
    }

    // Update step action type
    // RATIONALE: All steps need an action (what happens at this stage?)
    const updateStepAction = (index: number, action: StageActionType) => {
        const newSteps = [...steps]
        newSteps[index] = { ...newSteps[index], action }
        setSteps(newSteps)
    }

    const addStep = () => {
        const newStep: FunnelStep = {
            id: crypto.randomUUID(),
            name: 'New Step',
            action: 'landing_page',
            order: steps.length
        }
        setSteps([...steps, newStep])
    }

    const removeStep = (index: number) => {
        const updated = steps.filter((_, i) => i !== index)
        // Reorder remaining steps
        updated.forEach((step, i) => {
            step.order = i
        })
        setSteps(updated)
    }

    const updateStepName = (index: number, name: string) => {
        const newSteps = [...steps]
        newSteps[index] = { ...newSteps[index], name }
        setSteps(newSteps)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateContext({
            funnelSteps: steps,
            monthlyLeads: Number(leads),
            followUpIntensity: followupIntensity
        })
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Monthly Lead Volume</label>
                    <input
                        required
                        type="number"
                        value={leads}
                        onChange={e => setLeads(Number(e.target.value))}
                        data-testid="lead-volume-input"
                        className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="e.g. 50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">How many new leads enter top of funnel?</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Follow-up Intensity</label>
                    <select
                        value={followupIntensity}
                        onChange={e => setFollowupIntensity(Number(e.target.value) as 0 | 1 | 3 | 5)}
                        data-testid="followup-intensity-select"
                        className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value={0}>I don't follow up</option>
                        <option value={1}>1 follow-up</option>
                        <option value={3}>2-3 times</option>
                        <option value={5}>Until they say no (5+)</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Be honest. The AI knows.</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-3">Map Your Funnel Steps</label>

                {/* Marriage on First Date Warning */}
                {/* RATIONALE: Advisory (non-blocking) allows experts to override if needed */}
                {hasMarriageWarning() && (
                    <div
                        data-testid="marriage-warning-banner"
                        className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-start gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm text-yellow-700 dark:text-yellow-400">
                                ⚠️ WARNING: Marriage on First Date
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                You are sending cold traffic (strangers) directly to a high-friction step (sales call).
                                We recommend adding a <strong>Lead Magnet</strong> or <strong>Video</strong> step first to warm them up.
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex flex-col gap-2">
                            {/* Step Number + Name */}
                            <div className="flex items-center gap-2 w-full group">
                                <span className="font-mono text-xs text-muted-foreground w-6 text-right">
                                    {index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={step.name}
                                    onChange={e => updateStepName(index, e.target.value)}
                                    placeholder={`Step ${index + 1} name`}
                                    data-testid={`step-name-input-${index}`}
                                    className="flex-1 px-3 py-2 bg-card border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Traffic Source (First Step Only) */}
                            {index === 0 && (
                                <div className="flex items-center gap-2 pl-8">
                                    <label className="text-xs text-muted-foreground w-24 text-right">
                                        Traffic Source:
                                    </label>
                                    <select
                                        value={step.trafficSource || ''}
                                        onChange={e => updateStepTrafficSource(index, e.target.value as TrafficSourceType)}
                                        data-testid="traffic-source-select"
                                        className="flex-1 px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                                        required
                                    >
                                        <option value="">Select traffic source...</option>
                                        {Object.entries(TRAFFIC_SOURCE_LABELS).map(([key, label]) => {
                                            const isForbidden = isTrafficSourceForbidden(key as TrafficSourceType, businessStage)
                                            return (
                                                <option key={key} value={key} disabled={isForbidden} data-testid={`traffic-source-option-${key}`}>
                                                    {label} {isForbidden ? '(Forbidden for Stage 0)' : ''}
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>
                            )}

                            {/* Action Type + Friction Badge */}
                            <div className="flex items-center gap-2 pl-8">
                                <label className="text-xs text-muted-foreground w-24 text-right">
                                    Action:
                                </label>
                                <select
                                    value={step.action}
                                    onChange={e => updateStepAction(index, e.target.value as StageActionType)}
                                    data-testid={`step-action-select-${index}`}
                                    className="flex-1 px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                                >
                                    {Object.entries(STAGE_ACTION_LABELS).map(([key, label]) => (
                                        <option key={key} value={key} data-testid={`step-action-option-${index}-${key}`}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                {/* Friction Level Badge */}
                                <span
                                    data-testid={`friction-badge-${index}`}
                                    className={`
                                    px-2 py-1 text-xs font-medium rounded-md whitespace-nowrap
                                    ${getFrictionLevel(step.action) === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                                    ${getFrictionLevel(step.action) === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                    ${getFrictionLevel(step.action) === 'high' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                                `}>
                                    {getFrictionLevel(step.action).toUpperCase()}
                                </span>
                            </div>

                            {/* Arrow Connector */}
                            {index < steps.length - 1 && (
                                <div className="flex justify-center">
                                    <ArrowDown className="w-3 h-3 text-muted-foreground/30" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Step Button */}
                <button
                    type="button"
                    onClick={addStep}
                    data-testid="add-step-button"
                    className="mt-4 w-full py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Funnel Step
                </button>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    data-testid="diagnose-funnel-button"
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    Diagnose Funnel <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </form>
    )
}
