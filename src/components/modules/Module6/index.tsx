import { useState } from 'react'
import { ArrowLeft, Repeat } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { TimeAudit, type TaskItem } from './TimeAudit'
import { SOPExtractor, type SOPData } from './SOPExtractor'
import { FreedomDashboard } from './FreedomDashboard'

interface Module6Props {
    onBack: () => void
}

type Step = 'intro' | 'audit' | 'sop' | 'freedom'

export function Module6({ onBack }: Module6Props) {
    const [step, setStep] = useState<Step>('intro')
    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
    const [sopData, setSopData] = useState<SOPData | null>(null)

    const { context, completeModule } = useBusinessStore()
    const hourlyRate = context.founder.hourlyValue || 100

    const handleAuditComplete = (task: TaskItem) => {
        setSelectedTask(task)
        setStep('sop')
    }

    const handleSOPComplete = (data: SOPData) => {
        setSopData(data)
        setStep('freedom')
    }

    const handleFinish = () => {
        // "This action directly weakens your primary constraint."
        // We simulate reducing the labor ceiling by completing the module.
        completeModule(6, 100)
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
                        <Repeat className="w-6 h-6 text-blue-400" />
                        Reliability Protocol
                    </h1>
                    <p className="text-gray-400">Standardize delivery to remove founder bottlenecks.</p>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {step === 'intro' && (
                    <div className="text-center space-y-8 py-12">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold">The "Founder Trap"</h2>
                            <p className="text-xl text-gray-400">
                                You are likely doing $100/hr work instead of $1,000/hr work.
                                To break the Labor Ceiling, we must surgically remove ONE recurring task from your plate.
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                Note: This is not a course. This is an extraction tool.
                            </p>
                        </div>
                        <button
                            onClick={() => setStep('audit')}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Start Extraction Protocol
                        </button>
                    </div>
                )}

                {step === 'audit' && (
                    <TimeAudit
                        hourlyRate={hourlyRate}
                        onComplete={handleAuditComplete}
                    />
                )}

                {step === 'sop' && selectedTask && (
                    <SOPExtractor
                        task={selectedTask}
                        onComplete={handleSOPComplete}
                    />
                )}

                {step === 'freedom' && selectedTask && sopData && (
                    <FreedomDashboard
                        task={selectedTask}
                        sop={sopData}
                        hourlyRate={hourlyRate}
                        onComplete={handleFinish}
                    />
                )}
            </div>
        </div>
    )
}
