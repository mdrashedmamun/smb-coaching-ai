import { useState } from 'react'
import { ArrowLeft, Zap } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { LeadAudit, type ChannelItem } from './LeadAudit'
import { RhythmBuilder, type RhythmData } from './RhythmBuilder'
import { CadenceDashboard } from './CadenceDashboard'

interface Module3Props {
    onBack: () => void
}

type Step = 'intro' | 'audit' | 'rhythm' | 'dashboard'

export function Module3({ onBack }: Module3Props) {
    const [step, setStep] = useState<Step>('intro')
    const [selectedChannel, setSelectedChannel] = useState<ChannelItem | null>(null)
    const [rhythmData, setRhythmData] = useState<RhythmData | null>(null)

    const { completeModule, setRhythm } = useBusinessStore()
    // Default deal value for high-ticket services
    const avgDealValue = 5000

    const handleAuditComplete = (channel: ChannelItem) => {
        setSelectedChannel(channel)
        setStep('rhythm')
    }

    const handleRhythmComplete = (data: RhythmData) => {
        setRhythmData(data)
        setStep('dashboard')
    }

    const handleFinish = () => {
        // Save rhythm to store for Daily Check-in
        if (rhythmData) {
            setRhythm({
                channelName: rhythmData.channel.name,
                beat: rhythmData.beat,
                cadence: rhythmData.cadence,
                firstBeatProof: rhythmData.firstBeatProof,
                lastConfirmedAt: Date.now(),
                evidenceLevel: 'Bronze',
                consecutiveMisses: 0,
                isActive: true
            })
        }
        // Completing this module reduces distribution_weakness constraint
        completeModule(3, 100)
        onBack()
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="w-6 h-6 text-purple-400" />
                        The Broken Rhythm
                    </h1>
                    <p className="text-gray-400">Build one distribution cadence that sticks.</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {step === 'intro' && (
                    <div className="text-center space-y-8 py-12">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold">The "Lead Trap"</h2>
                            <p className="text-xl text-gray-400">
                                You don't need more channels. You need ONE rhythm you actually maintain.
                                Inconsistency is silently killing your pipeline.
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                "Random acts of marketing" → Predictable revenue drought
                            </p>
                        </div>
                        <button
                            onClick={() => setStep('audit')}
                            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Diagnose My Broken Rhythm
                        </button>
                    </div>
                )}

                {step === 'audit' && (
                    <LeadAudit
                        avgDealValue={avgDealValue}
                        onComplete={handleAuditComplete}
                    />
                )}

                {step === 'rhythm' && selectedChannel && (
                    <RhythmBuilder
                        channel={selectedChannel}
                        onComplete={handleRhythmComplete}
                    />
                )}

                {step === 'dashboard' && rhythmData && (
                    <CadenceDashboard
                        rhythm={rhythmData}
                        avgDealValue={avgDealValue}
                        onComplete={handleFinish}
                    />
                )}
            </div>
        </div>
    )
}
