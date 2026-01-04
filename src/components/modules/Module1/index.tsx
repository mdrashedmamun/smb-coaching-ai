import { useState, useEffect } from 'react'
import { OfferForm } from './OfferForm'
import { OfferResult } from './OfferResult'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { Loader2 } from 'lucide-react'

interface Module1Props {
    onBack: () => void
}

export function Module1({ onBack }: Module1Props) {
    const [view, setView] = useState<'form' | 'analyzing' | 'result'>('form')
    const { completeModule } = useBusinessStore()

    // Simulate AI Analysis
    useEffect(() => {
        if (view === 'analyzing') {
            const timer = setTimeout(() => {
                setView('result')
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [view])

    const handleComplete = () => {
        completeModule(1, 85) // Mock score
        onBack()
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ← Back to Dashboard
                </button>
                <span className="text-xs font-mono text-muted-foreground">MODULE 01: OFFER DIAGNOSTIC</span>
            </div>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border overflow-y-auto">
                {view === 'form' && (
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">Let's check your Offer.</h1>
                        <p className="text-muted-foreground mb-8">
                            Most offers fail the "Grandmother Test". Paste your current pitch below.
                        </p>
                        <OfferForm onSubmit={() => setView('analyzing')} />
                    </div>
                )}

                {view === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Consulting the Oracle...</p>
                        <p className="text-sm text-muted-foreground">Checking against $100M Leads Framework</p>
                    </div>
                )}

                {view === 'result' && (
                    <OfferResult onContinue={handleComplete} />
                )}
            </div>
        </div>
    )
}
