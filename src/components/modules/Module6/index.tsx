import { useState, useEffect } from 'react'
import { SopForm } from './SopForm'
import { SopResult } from './SopResult'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { Loader2 } from 'lucide-react'

interface Module6Props {
    onBack: () => void
}

export function Module6({ onBack }: Module6Props) {
    const [view, setView] = useState<'form' | 'analyzing' | 'result'>('form')
    const [ownerMap, setOwnerMap] = useState<Record<string, string>>({})
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
        completeModule(6, 95) // High score for systemization
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
                <span className="text-xs font-mono text-muted-foreground">MODULE 06: ENGINE ARCHITECT</span>
            </div>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border overflow-y-auto">
                {view === 'form' && (
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">Build The Manual.</h1>
                        <p className="text-muted-foreground mb-8">
                            A business that can't run without you isn't a business. It's a job.
                        </p>
                        <SopForm onSubmit={(data) => {
                            setOwnerMap(data)
                            setView('analyzing')
                        }} />
                    </div>
                )}

                {view === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Drafting Protocols...</p>
                        <p className="text-sm text-muted-foreground">Creating delegation checklists & rescue plans</p>
                    </div>
                )}

                {view === 'result' && (
                    <SopResult ownerMap={ownerMap} onContinue={handleComplete} />
                )}
            </div>
        </div>
    )
}
