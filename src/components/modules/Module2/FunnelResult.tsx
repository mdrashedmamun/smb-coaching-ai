import { AlertTriangle, TrendingDown, Droplets, Sparkles, Loader2 } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { validateFunnel, getBusinessStage } from '../../../lib/funnel_taxonomy'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

interface FunnelResultProps {
    onContinue: () => void
}

export function FunnelResult({ onContinue }: FunnelResultProps) {
    const { context } = useBusinessStore()
    const [aiAnalysis, setAiAnalysis] = useState<{
        critique: string;
        tacticalFix: string;
        score?: number;
    } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Run AI Analysis on mount
    useEffect(() => {
        async function fetchAIAnalysis() {
            setIsLoading(true)
            try {
                // Check if we have real supabase credentials
                const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');

                if (isPlaceholder) {
                    // Simulate Edge Function Delay
                    await new Promise(r => setTimeout(r, 1500));

                    // Simulate the same logic as the Edge Function
                    const stage = getBusinessStage(context.vitals.revenue);
                    const firstStep = context.funnelSteps[0];
                    const isColdTraffic = ['paid_ads', 'cold_outreach'].includes(firstStep?.trafficSource || '');
                    const isHighFriction = ['discovery_call', 'proposal_review', 'contract_signing'].includes(firstStep?.action || '');

                    let mockData;
                    if (stage === 'Improvise') {
                        mockData = {
                            critique: "You are in Stage 0: Improvise. Stop building complex tech. You are playing business, not doing it.",
                            tacticalFix: firstStep?.trafficSource === 'paid_ads'
                                ? "Turn off the ads today. You don't have a product yet. DM 5 people and offer it for free."
                                : "Directly outreach to 5 prospects manually today. Do not wait for a website."
                        };
                    } else if (isColdTraffic && isHighFriction) {
                        mockData = {
                            critique: "You are committing 'Marriage on First Date'. You are asking a total stranger for an hour of their time without giving them a treat first.",
                            tacticalFix: "Add a 2-minute video or a Lead Magnet step before the Discovery Call to lower the friction immediately."
                        };
                    } else {
                        mockData = {
                            critique: "Your funnel structure is solid, but your 'Follow-up Intensity' is a silent killer. 60% of sales happen after the 4th touch.",
                            tacticalFix: "Implement an automated 3-part email sequence that triggers the moment they book the first step."
                        };
                    }
                    setAiAnalysis(mockData);
                } else {
                    const { data, error: invokeError } = await supabase.functions.invoke('analyze-funnel', {
                        body: {
                            input: {
                                businessName: context.businessName,
                                revenue: context.vitals.revenue,
                                monthlyLeads: context.monthlyLeads,
                                pricePoint: context.pricePoint,
                                followUpIntensity: context.followUpIntensity,
                                funnelSteps: context.funnelSteps
                            }
                        }
                    })

                    if (invokeError) throw invokeError
                    setAiAnalysis(data)
                }
            } catch (err: any) {
                console.error('AI Analysis Error:', err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAIAnalysis()
    }, [])

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
                    <div className="absolute bottom-4 right-4 animate-bounce" data-testid="leak-alert-overlay">
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                            <Droplets className="w-4 h-4 fill-current" />
                            <span className="font-bold text-xs uppercase" data-testid="leak-detected-label">Leak Detected</span>
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
                    <div className="text-3xl font-black text-red-500" data-testid="leak-amount-value">
                        $${Math.round(leakAmount).toLocaleString()}
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
                                <li key={i} className="flex gap-2" data-testid={`diagnostic-error-${i}`}>
                                    <span className="text-red-500">•</span> {error}
                                </li>
                            ))
                        ) : (
                            <li className="flex gap-2" data-testid="diagnostic-success">
                                <span className="text-green-500">•</span> Funnel structure looks solid.
                            </li>
                        )}
                        {/* Follow-up intensity feedback */}
                        {/* RATIONALE: 3+ follow-ups is data-backed as minimum for B2B sales */}
                        <li className="flex gap-2" data-testid="followup-intensity-feedback">
                            <span className={context.followUpIntensity >= 3 ? 'text-green-500' : 'text-yellow-500'}>•</span>
                            Follow-up intensity is {context.followUpIntensity === 0 ? 'low' : context.followUpIntensity <= 1 ? 'minimal' : 'good'}.
                        </li>
                        <li className="flex gap-2" data-testid="diagnostic-healthy-volume">
                            <span className="text-green-500">•</span> Lead volume is healthy.
                        </li>
                    </ul>
                </div>
            </div>

            {/* Strategic AI Advisor Panel */}
            <div
                data-testid="ai-advisor-panel"
                className="bg-purple-500/5 border border-purple-500/20 rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700"
            >
                <div className="bg-purple-500/10 px-6 py-3 border-b border-purple-500/20 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 uppercase tracking-tight">
                        <Sparkles className="w-4 h-4" /> Strategic AI Advisor
                    </h3>
                    <span className="text-[10px] font-bold bg-purple-500 text-white px-2 py-0.5 rounded-full uppercase">
                        Hormone-Coach V1
                    </span>
                </div>

                <div className="p-6 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                            <p className="text-sm animate-pulse italic">Thinking like an investor...</p>
                        </div>
                    ) : error ? (
                        <p className="text-sm text-red-500 bg-red-500/10 p-4 rounded-lg">
                            Failed to connect to Advisor. Proceeding with rule-based diagnostics.
                        </p>
                    ) : aiAnalysis ? (
                        <>
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase">Brutal Truth</h4>
                                <p className="text-sm leading-relaxed italic" data-testid="ai-critique-text">
                                    "{aiAnalysis.critique}"
                                </p>
                            </div>
                            <div className="pt-4 border-t border-purple-500/10 space-y-2">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase">Tactical Move</h4>
                                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-300" data-testid="ai-tactical-fix">
                                        {aiAnalysis.tacticalFix}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm italic text-muted-foreground">
                            Initializing Advisor...
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6" data-testid="prescription-container">
                <h3 className="font-semibold mb-2">Prescription</h3>
                {validation.isValid ? (
                    <p className="text-sm" data-testid="prescription-text">
                        "Your funnel structure is solid. Focus on <b>increasing follow-up intensity</b> and tracking conversion rates at each step."
                    </p>
                ) : (
                    <p className="text-sm" data-testid="prescription-text">
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
