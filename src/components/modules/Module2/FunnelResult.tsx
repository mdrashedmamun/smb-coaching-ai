import { AlertTriangle, TrendingDown, Droplets } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'

interface FunnelResultProps {
    onContinue: () => void
}

export function FunnelResult({ onContinue }: FunnelResultProps) {
    const { context } = useBusinessStore()

    // Mock Logic (simulating the Prompt's analysis)
    const isLeaky = context.funnelStages.length < 4 // e.g. missing nurture
    const monthlyRevenue = (context.monthlyLeads * context.pricePoint * 0.1) // simple 10% conversion assumption
    const leakAmount = isLeaky ? (monthlyRevenue * 0.4) : (monthlyRevenue * 0.1)

    const funnelData = context.funnelStages.map((stage, i) => {
        // Artificial drop-off
        const width = 100 - (i * (100 / context.funnelStages.length))
        return { name: stage, width: `${Math.max(width, 10)}%` }
    })

    return (
        <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in duration-500">

            {/* The Visual Funnel */}
            <div className="bg-card border rounded-xl p-8 relative overflow-hidden">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Your funnel Shape</h3>
                <div className="flex flex-col items-center space-y-2 relative z-10">
                    {funnelData.map((stage, i) => (
                        <div
                            key={i}
                            className="h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-medium transition-all hover:bg-primary/20"
                            style={{ width: stage.width }}
                        >
                            <span className="truncate px-2">{stage.name}</span>
                        </div>
                    ))}
                </div>

                {/* Leak Alert Overlay */}
                {isLeaky && (
                    <div className="absolute bottom-4 right-4 animate-bounce">
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                            <Droplets className="w-4 h-4 fill-current" />
                            <span className="font-bold text-xs uppercase">Leak Detected</span>
                        </div>
                    </div>
                )}
            </div>

            {/* The Pain Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-muted/20 rounded-xl border border-border">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs font-mono uppercase">Est. Monthly Loss</span>
                    </div>
                    <div className="text-3xl font-black text-red-500">
                        \$\${Math.round(leakAmount).toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Based on your lead volume ({context.monthlyLeads}) and price point.
                    </p>
                </div>

                <div className="p-6 bg-card rounded-xl border border-border">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        Diagnostic
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {context.funnelStages.length < 4 && (
                            <li className="flex gap-2">
                                <span className="text-red-500">•</span> Missing "Nurture" Step.
                            </li>
                        )}
                        <li className="flex gap-2">
                            <span className="text-yellow-500">•</span> Follow-up intensity is low.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-500">•</span> Lead volume is healthy.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Prescription</h3>
                <p className="text-sm">
                    "Add a <b>Lead Magnet</b> step between '{context.funnelStages[0]}' and '{context.funnelStages[1] || 'Next'}'. You are asking for marriage on the first date."
                </p>
            </div>

            <button
                onClick={onContinue}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
                Patch The Leak & Continue
            </button>
        </div>
    )
}
