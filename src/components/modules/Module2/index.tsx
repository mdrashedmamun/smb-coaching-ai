import { useState, useEffect } from 'react'
import { FunnelForm } from './FunnelForm'
import { FunnelResult } from './FunnelResult'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { Loader2 } from 'lucide-react'

interface Module2Props {
    onBack: () => void
}

export function Module2({ onBack }: Module2Props) {
    const [view, setView] = useState<'form' | 'analyzing' | 'result'>('form')
    const { completeModule } = useBusinessStore()

    // Simulate AI Analysis
    useEffect(() => {
        if (view === 'analyzing') {
            const timer = setTimeout(() => {
                setView('result')
            }, 2500)
            return () => clearTimeout(timer)
        }
    }, [view])

    const handleComplete = () => {
        completeModule(2, 70) // Mock score
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
                <span className="text-xs font-mono text-muted-foreground tracking-widest">THE FUNNEL INSPECTOR</span>
            </div>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border overflow-y-auto">
                {view === 'form' && (
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">Let's Map Your Pipeline.</h1>
                        <p className="text-muted-foreground mb-8">
                            We can't fix what we can't see. Draw the steps a stranger takes to pay you money.
                        </p>
                        <FunnelForm onSubmit={() => setView('analyzing')} />
                    </div>
                )}

                {view === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Tracing the leak...</p>
                        <p className="text-sm text-muted-foreground">Analysing step-by-step conversion probability</p>
                    </div>
                )}

                {view === 'result' && (
                    <FunnelResult onContinue={handleComplete} />
                )}
            </div>
        </div>
    )
}
