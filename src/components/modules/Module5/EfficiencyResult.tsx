import { AlertTriangle, TrendingUp, Skull } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'


interface ChannelData {
    id: string
    name: string
    spend: number
    hours: number
    leads: number
    trueCpl?: number
    category?: 'kill' | 'keep' | 'scale'
    reason?: string
}

interface EfficiencyResultProps {
    data: ChannelData[]
    onContinue: () => void
}

export function EfficiencyResult({ data, onContinue }: EfficiencyResultProps) {
    const { context } = useBusinessStore()
    const hourlyRate = context.hourlyValue || 100

    // The "True Cost" Logic
    const analyzedChannels = data.map(c => {
        const timeCost = c.hours * hourlyRate
        const totalCost = c.spend + timeCost
        const trueCpl = c.leads > 0 ? totalCost / c.leads : totalCost

        // Categorization Logic (Simplistic for MVP)
        let category: 'kill' | 'keep' | 'scale' = 'keep'
        let reason = "Performing adequately."

        if (c.leads === 0) {
            category = 'kill'
            reason = "Zero leads. Pure burn."
        } else if (trueCpl > (context.pricePoint || 500) * 0.5) {
            category = 'kill'
            reason = `True CPL ($${trueCpl.toFixed(0)}) is >50% of price!`
        } else if (trueCpl < 50 && c.leads > 10) {
            category = 'scale'
            reason = "Low cost & high volume. Pour fuel here."
        }

        return { ...c, trueCpl, category, reason }
    })

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* KILL COLUMN */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-red-500">
                        <Skull className="w-5 h-5 text-red-500" />
                        <h3 className="font-bold text-red-500 uppercase tracking-widest text-sm">Kill</h3>
                    </div>
                    {analyzedChannels.filter(c => c.category === 'kill').map(c => (
                        <div key={c.id} className="bg-card border border-red-500/20 rounded-lg p-4 shadow-sm">
                            <div className="font-bold text-lg mb-1">{c.name}</div>
                            <div className="text-2xl font-black text-red-500 mb-2">${c.trueCpl.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">/lead</span></div>
                            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                {c.reason}
                            </p>
                        </div>
                    ))}
                    {analyzedChannels.filter(c => c.category === 'kill').length === 0 && (
                        <div className="text-xs text-muted-foreground italic text-center py-4">No critical bleeding detected.</div>
                    )}
                </div>

                {/* KEEP COLUMN */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-yellow-500">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-yellow-500 uppercase tracking-widest text-sm">Keep / Tweak</h3>
                    </div>
                    {analyzedChannels.filter(c => c.category === 'keep').map(c => (
                        <div key={c.id} className="bg-card border border-yellow-500/20 rounded-lg p-4 shadow-sm">
                            <div className="font-bold text-lg mb-1">{c.name}</div>
                            <div className="text-2xl font-black text-yellow-500 mb-2">${c.trueCpl.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">/lead</span></div>
                            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                {c.reason}
                            </p>
                        </div>
                    ))}
                </div>

                {/* SCALE COLUMN */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b-2 border-green-500">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <h3 className="font-bold text-green-500 uppercase tracking-widest text-sm">Scale</h3>
                    </div>
                    {analyzedChannels.filter(c => c.category === 'scale').map(c => (
                        <div key={c.id} className="bg-card border border-green-500/20 rounded-lg p-4 shadow-sm bg-green-500/5">
                            <div className="font-bold text-lg mb-1">{c.name}</div>
                            <div className="text-2xl font-black text-green-500 mb-2">${c.trueCpl.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">/lead</span></div>
                            <p className="text-xs text-muted-foreground bg-green-500/10 text-green-600 p-2 rounded border border-green-500/10">
                                {c.reason}
                            </p>
                        </div>
                    ))}
                    {analyzedChannels.filter(c => c.category === 'scale').length === 0 && (
                        <div className="text-xs text-muted-foreground italic text-center py-4">No unicorns found yet.</div>
                    )}
                </div>

            </div>

            <div className="bg-muted border border-border rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                    "Stop feeding the red. Feed the green."
                </p>
                <button
                    onClick={onContinue}
                    className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                    Action Plan Committed
                </button>
            </div>
        </div>
    )
}
