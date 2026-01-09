import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { ArrowRight, Clock, Users, Lock, Check } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface SystemFormProps {
    onSubmit: () => void
}

export function SystemForm({ onSubmit }: SystemFormProps) {
    const { context, updateContext } = useBusinessStore()

    const [timeBudget, setTimeBudget] = useState(context.timeBudgetHours || 2)
    const [role, setRole] = useState(context.teamRole || 'solo')
    const [channels, setChannels] = useState<string[]>([])

    // Guardrail Logic
    const canDoDailyVideo = timeBudget >= 10 && role !== 'solo'
    const canDoManualOutreach = timeBudget >= 5

    const CHANNEL_OPTIONS = [
        { id: 'ads', label: 'Paid Ads (Set & Forget)', cost: 1, type: 'paid' },
        { id: 'seo', label: 'SEO / Articles', cost: 2, type: 'organic' },
        { id: 'outreach', label: 'Manual DMs', cost: 5, type: 'manual', locked: !canDoManualOutreach },
        { id: 'video', label: 'Daily Reels/TikTok', cost: 10, type: 'organic', locked: !canDoDailyVideo },
    ]

    const toggleChannel = (id: string, locked: boolean) => {
        if (locked) return
        if (channels.includes(id)) {
            setChannels(channels.filter(c => c !== id))
        } else {
            setChannels([...channels, id])
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateContext({
            timeBudgetHours: timeBudget,
            teamRole: role as any,
            // store selected channels in context if we expanded it
        })
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Panel: Constraints */}
                <div className="space-y-6 p-6 bg-card border rounded-xl">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> Reality Check
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Weekly Time Budget</label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={timeBudget}
                                onChange={e => setTimeBudget(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>1h (Side Hustle)</span>
                                <span className="font-bold text-primary">{timeBudget} hours/week</span>
                                <span>20h (Full Time)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Team Strategy</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'solo', label: 'Solo' },
                                    { id: 'founder_va', label: 'Me + VA' },
                                    { id: 'small_team', label: 'Team' }
                                ].map((r) => (
                                    <button
                                        key={r.id}
                                        type="button"
                                        onClick={() => setRole(r.id as any)}
                                        className={cn(
                                            "px-3 py-2 text-xs border rounded-lg transition-colors",
                                            role === r.id
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "hover:bg-muted/50"
                                        )}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: The Mixer */}
                <div className="space-y-6 p-6 bg-muted/10 border rounded-xl">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" /> Available Channels
                    </h3>

                    <div className="space-y-2">
                        {CHANNEL_OPTIONS.map((opt) => (
                            <div
                                key={opt.id}
                                onClick={() => toggleChannel(opt.id, !!opt.locked)}
                                className={cn(
                                    "p-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer",
                                    opt.locked
                                        ? "opacity-50 grayscale cursor-not-allowed bg-muted/20"
                                        : channels.includes(opt.id)
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "bg-card hover:border-primary/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {opt.locked ? (
                                        <Lock className="w-4 h-4 text-muted-foreground" />
                                    ) : channels.includes(opt.id) ? (
                                        <Check className="w-4 h-4 text-primary" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border border-muted" />
                                    )}
                                    <span className="text-sm font-medium">{opt.label}</span>
                                </div>

                                {opt.locked && (
                                    <span className="text-[10px] text-red-500 font-mono uppercase border border-red-500/20 bg-red-500/10 px-2 py-0.5 rounded">
                                        Requires {opt.cost}h+
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {channels.length === 0 && (
                        <p className="text-xs text-center text-muted-foreground animate-pulse">
                            Select at least one channel to proceed.
                        </p>
                    )}
                </div>
            </div>

            <div className="pt-4 text-center">
                <button
                    type="submit"
                    disabled={channels.length === 0}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Generate Weekly Rhythm <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
            </div>
        </form>
    )
}
