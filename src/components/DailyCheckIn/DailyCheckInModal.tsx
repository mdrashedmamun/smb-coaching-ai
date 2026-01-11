import { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react'
import { useBusinessStore } from '../../store/useBusinessStore'

interface DailyCheckInModalProps {
    onClose: () => void
}

type CheckInStep = 'rhythm' | 'delegation' | 'done'

export function DailyCheckInModal({ onClose }: DailyCheckInModalProps) {
    const {
        rhythm,
        delegation,
        confirmRhythm,
        confirmDelegation,
        recordRhythmMiss,
        recordDelegationRegression
    } = useBusinessStore()

    const [step, setStep] = useState<CheckInStep>(() => {
        if (rhythm?.isActive) return 'rhythm'
        if (delegation?.isActive) return 'delegation'
        return 'done'
    })
    const [rhythmAnswer, setRhythmAnswer] = useState<'yes' | 'no' | null>(null)
    const [delegationAnswer, setDelegationAnswer] = useState<'yes' | 'no' | null>(null)

    const handleRhythmConfirm = (answer: 'yes' | 'no') => {
        setRhythmAnswer(answer)
        if (answer === 'yes') {
            confirmRhythm()
        } else {
            recordRhythmMiss()
        }
        // Move to next step
        if (delegation?.isActive) {
            setStep('delegation')
        } else {
            setStep('done')
        }
    }

    const handleDelegationConfirm = (answer: 'yes' | 'no') => {
        setDelegationAnswer(answer)
        if (answer === 'yes') {
            confirmDelegation()
        } else {
            recordDelegationRegression()
        }
        setStep('done')
    }

    const handleComplete = () => {
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">

                {/* Rhythm Check-in */}
                {step === 'rhythm' && rhythm && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-full">
                                <Clock className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Quick Check-in</h2>
                                <p className="text-sm text-gray-400">~15 seconds</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="text-sm text-gray-400 mb-1">Your rhythm:</div>
                            <div className="font-semibold text-blue-300">{rhythm.beat}</div>
                            <div className="text-xs text-gray-500">on {rhythm.channelName}</div>
                        </div>

                        <div className="text-center py-4">
                            <h3 className="text-lg font-medium mb-6">
                                Did you stick to the plan yesterday?
                            </h3>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => handleRhythmConfirm('yes')}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-300 font-medium transition-colors"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Yes, I did it
                                </button>
                                <button
                                    onClick={() => handleRhythmConfirm('no')}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-medium transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                    No, I missed it
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delegation Check-in */}
                {step === 'delegation' && delegation && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-full">
                                <Clock className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Quick Check-in</h2>
                                <p className="text-sm text-gray-400">Almost done</p>
                            </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="text-sm text-gray-400 mb-1">Delegated task:</div>
                            <div className="font-semibold text-blue-300">{delegation.taskName}</div>
                            <div className="text-xs text-gray-500">to {delegation.delegatedTo}</div>
                        </div>

                        <div className="text-center py-4">
                            <h3 className="text-lg font-medium mb-6">
                                Is this task still delegated?
                            </h3>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => handleDelegationConfirm('yes')}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-300 font-medium transition-colors"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Yes, they are
                                </button>
                                <button
                                    onClick={() => handleDelegationConfirm('no')}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-medium transition-colors"
                                >
                                    <XCircle className="w-5 h-5" />
                                    No, I took it back
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Done */}
                {step === 'done' && (
                    <div className="space-y-6 text-center">
                        <div className="flex justify-center">
                            <div className="p-4 bg-green-500/20 rounded-full">
                                <CheckCircle2 className="w-10 h-10 text-green-400" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-2">Check-in Complete</h2>
                            <p className="text-gray-400">
                                We've updated your score. See you tomorrow.
                            </p>
                        </div>

                        {(rhythmAnswer === 'no' || delegationAnswer === 'no') && (
                            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-300">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>
                                    {rhythmAnswer === 'no' && "Rhythm miss logged. "}
                                    {delegationAnswer === 'no' && "Delegation regression logged."}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={handleComplete}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
