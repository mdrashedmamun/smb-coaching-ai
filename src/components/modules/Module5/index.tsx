import { useState, useEffect } from 'react'
import { EfficiencyForm } from './EfficiencyForm'
import { EfficiencyResult } from './EfficiencyResult'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { Loader2 } from 'lucide-react'

interface Module5Props {
    onBack: () => void
}

export function Module5({ onBack }: Module5Props) {
    const [view, setView] = useState<'form' | 'analyzing' | 'result'>('form')
    const [channelData, setChannelData] = useState<any[]>([])
    const { completeModule, updateContext } = useBusinessStore()

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
        // Save winning channels (Simulated logic: assuming last result "green" ones are what user kept)
        // For MVP, we'll just save the ones they entered, but in real app we'd filter by 'Scale' category
        const winningChannels = channelData.map(c => c.name)
        updateContext({ keyChannels: winningChannels })

        completeModule(5, 80) // Mock score
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
                <span className="text-xs font-mono text-muted-foreground">MODULE 05: COST STRATEGIST</span>
            </div>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border overflow-y-auto">
                {view === 'form' && (
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-2">The Money Map.</h1>
                        <p className="text-muted-foreground mb-8">
                            Your time is money. Let's calculate the "True Cost" of every lead source.
                        </p>
                        <EfficiencyForm onSubmit={(data) => {
                            setChannelData(data)
                            setView('analyzing')
                        }} />
                    </div>
                )}

                {view === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Running the Numbers...</p>
                        <p className="text-sm text-muted-foreground">Calculating Time-Adjusted CPL</p>
                    </div>
                )}

                {view === 'result' && (
                    <EfficiencyResult data={channelData} onContinue={handleComplete} />
                )}
            </div>
        </div>
    )
}
