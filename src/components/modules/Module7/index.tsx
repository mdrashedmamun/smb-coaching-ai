import { useState, useEffect } from 'react'
import { PitchForm } from './PitchForm'
import { PitchResult } from './PitchResult'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { Loader2 } from 'lucide-react'

interface Module7Props {
    onBack: () => void
}

export function Module7({ onBack }: Module7Props) {
    const [view, setView] = useState<'form' | 'analyzing' | 'result'>('form')
    const [mode, setMode] = useState<'investor' | 'customer'>('customer')
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
        completeModule(7, 100) // Perfect Score
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
                <span className="text-xs font-mono text-muted-foreground">MODULE 07: NARRATIVE ARCHITECT</span>
            </div>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border overflow-y-auto">
                {view === 'form' && (
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">The Final Pitch.</h1>
                        <p className="text-muted-foreground mb-8">
                            You built the engine. Now, let's sell the journey.
                        </p>
                        <PitchForm onSubmit={(m) => {
                            setMode(m)
                            setView('analyzing')
                        }} />
                    </div>
                )}

                {view === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Connecting The Dots...</p>
                        <p className="text-sm text-muted-foreground">Merging Price, Funnel, and Efficiency Data</p>
                    </div>
                )}

                {view === 'result' && (
                    <PitchResult mode={mode} onContinue={handleComplete} />
                )}
            </div>
        </div>
    )
}
