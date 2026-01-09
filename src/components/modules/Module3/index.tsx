import { useState, useEffect } from 'react'
import { SystemForm } from './SystemForm'
import { SystemResult } from './SystemResult'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { Loader2 } from 'lucide-react'

interface Module3Props {
    onBack: () => void
}

export function Module3({ onBack }: Module3Props) {
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
        completeModule(3, 90) // Mock score
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
                <span className="text-xs font-mono text-muted-foreground tracking-widest">THE LEAD RHYTHM</span>
            </div>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border overflow-y-auto">
                {view === 'form' && (
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">Design Your Rhythm.</h1>
                        <p className="text-muted-foreground mb-8">
                            Don't build a system for your "ideal self". Build it for your "busy self".
                        </p>
                        <SystemForm onSubmit={() => setView('analyzing')} />
                    </div>
                )}

                {view === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Checking Constraints...</p>
                        <p className="text-sm text-muted-foreground">Ensuring 100% Reality Check Compliance</p>
                    </div>
                )}

                {view === 'result' && (
                    <SystemResult onContinue={handleComplete} />
                )}
            </div>
        </div>
    )
}
