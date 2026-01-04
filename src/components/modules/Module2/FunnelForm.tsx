import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { ArrowRight, Plus, Trash2, ArrowDown } from 'lucide-react'

interface FunnelFormProps {
    onSubmit: () => void
}

export function FunnelForm({ onSubmit }: FunnelFormProps) {
    const { context, updateContext } = useBusinessStore()

    // Default stages if none exist
    const [stages, setStages] = useState<string[]>(
        context.funnelStages.length > 0
            ? context.funnelStages
            : ['Ad / Content', 'Landing Page', 'Discovery Call', 'Proposal', 'Close']
    )

    const [leads, setLeads] = useState(context.monthlyLeads || '')

    // Additional fields required by prompt logic
    const [followupCount, setFollowupCount] = useState(0)

    const addStage = () => {
        setStages([...stages, 'New Stage'])
    }

    const removeStage = (index: number) => {
        setStages(stages.filter((_, i) => i !== index))
    }

    const updateStage = (index: number, value: string) => {
        const newStages = [...stages]
        newStages[index] = value
        setStages(newStages)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateContext({
            funnelStages: stages,
            monthlyLeads: Number(leads),
            // In a real app we'd store followupCount too
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
                        className="w-full px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="e.g. 50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">How many new leads enter top of funnel?</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Follow-up Intensity</label>
                    <select
                        value={followupCount}
                        onChange={e => setFollowupCount(Number(e.target.value))}
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
                <div className="space-y-2">
                    {stages.map((stage, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="flex items-center gap-2 w-full group">
                                <span className="font-mono text-xs text-muted-foreground w-6 text-right">{index + 1}</span>
                                <input
                                    type="text"
                                    value={stage}
                                    onChange={e => updateStage(index, e.target.value)}
                                    className="flex-1 px-3 py-3 bg-card border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeStage(index)}
                                    className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            {index < stages.length - 1 && (
                                <ArrowDown className="w-3 h-3 text-muted-foreground/30 my-1" />
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addStage}
                    className="mt-4 w-full py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Funnel Step
                </button>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                    Diagnose Funnel <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </form>
    )
}
