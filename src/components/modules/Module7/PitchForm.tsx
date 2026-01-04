import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { ArrowRight, Mic, Sparkles } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface PitchFormProps {
    onSubmit: (mode: 'investor' | 'customer') => void
}

export function PitchForm({ onSubmit }: PitchFormProps) {
    const { context } = useBusinessStore()

    const [pitchMode, setPitchMode] = useState<'investor' | 'customer'>('customer')

    // Auto-calculated stats to show "We have your data"
    const revenuePotential = (context.pricePoint || 0) * (context.monthlyLeads || 0)

    return (
        <div className="space-y-8 max-w-2xl mx-auto">

            <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-8 text-center">
                <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Data Synthesis Complete</h3>
                <p className="text-muted-foreground mb-6">
                    We have your Offer, Funnel, and Efficiency metrics.
                    We are ready to write your story.
                </p>

                <div className="bg-background/50 rounded-lg p-4 text-left text-sm space-y-2 max-w-sm mx-auto border mb-6">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Price Point:</span>
                        <span className="font-mono font-bold">${context.pricePoint}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Key Channel:</span>
                        <span className="font-mono font-bold">{context.keyChannels?.[0] || 'Organic'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Pipeline:</span>
                        <span className="font-mono font-bold text-green-500">${revenuePotential.toLocaleString()}/mo</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-medium d-block">Who are you pitching right now?</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setPitchMode('customer')}
                            className={cn(
                                "p-4 rounded-xl border-2 transition-all",
                                pitchMode === 'customer'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-muted hover:border-primary/50'
                            )}
                        >
                            <div className="font-bold mb-1">New Client</div>
                            <div className="text-xs text-muted-foreground">"Why should I buy?"</div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPitchMode('investor')}
                            className={cn(
                                "p-4 rounded-xl border-2 transition-all",
                                pitchMode === 'investor'
                                    ? 'border-purple-500 bg-purple-500/5 text-purple-500'
                                    : 'border-muted hover:border-purple-500/50'
                            )}
                        >
                            <div className="font-bold mb-1">Investor / Partner</div>
                            <div className="text-xs text-muted-foreground">"Why will this scale?"</div>
                        </button>
                    </div>
                </div>
            </div >

            <button
                onClick={() => onSubmit(pitchMode)}
                className="w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
                <Mic className="w-5 h-5" /> Generate My Script
            </button>
        </div >
    )
}
