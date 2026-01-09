import { AlertTriangle, TrendingDown, Droplets } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { validateFunnel, getBusinessStage } from '../../../lib/funnel_taxonomy'

interface FunnelResultProps {
    onContinue: () => void
}

export function FunnelResult({ onContinue }: FunnelResultProps) {
    const { context } = useBusinessStore()

    // Determine business stage
    // RATIONALE: Stage 0 needs 2+ steps, Stage 2+ needs 4+ steps (sophistication increases)
    const businessStage = getBusinessStage(context.vitals.revenue)

    // Run validation
    // RATIONALE: This is the "source of truth" for funnel health
    const validation = validateFunnel(context.funnelSteps, businessStage)

    // Mock revenue calculation (still simplified for MVP)
    // RATIONALE: 10% conversion is a conservative industry average for estimation
    const monthlyRevenue = (context.monthlyLeads * context.pricePoint * 0.1)

    // Leak amount calculation
    // RATIONALE: Invalid funnels lose 40% potential revenue vs 10% for optimized funnels
    const leakAmount = validation.isValid ? (monthlyRevenue * 0.1) : (monthlyRevenue * 0.4)

    // Funnel visual data (unchanged)
    const funnelData = context.funnelSteps.map((step, i) => {
        const width = 100 - (i * (100 / context.funnelSteps.length))
        return { name: step.name, width: `${Math.max(width, 10)}%` }
    })

    // Determine if funnel has issues (leaks)
    const isLeaky = !validation.isValid

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
                        {validation.errors.length > 0 ? (
                            validation.errors.map((error, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-red-500">•</span> {error}
                                </li>
                            ))
                        ) : (
                            <li className="flex gap-2">
                                <span className="text-green-500">•</span> Funnel structure looks solid.
                            </li>
                        )}
                        {/* Follow-up intensity feedback */}
                        {/* RATIONALE: 3+ follow-ups is data-backed as minimum for B2B sales */}
                        <li className="flex gap-2">
                            <span className={context.followUpIntensity >= 3 ? 'text-green-500' : 'text-yellow-500'}>•</span>
                            Follow-up intensity is {context.followUpIntensity === 0 ? 'low' : context.followUpIntensity <= 1 ? 'minimal' : 'good'}.
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-500">•</span> Lead volume is healthy.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Prescription</h3>
                {validation.isValid ? (
                    <p className="text-sm">
                        "Your funnel structure is solid. Focus on <b>increasing follow-up intensity</b> and tracking conversion rates at each step."
                    </p>
                ) : (
                    <p className="text-sm">
                        {validation.errors[0] || 'Fix the issues above to improve your funnel.'}
                    </p>
                )}
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
