import { ArrowRight, Trophy, TrendingUp, Clock } from 'lucide-react'
import type { TaskItem } from './TimeAudit'
import type { SOPData } from './SOPExtractor'

interface FreedomDashboardProps {
    task: TaskItem
    sop: SOPData
    hourlyRate: number
    onComplete: () => void
}

export function FreedomDashboard({ task, hourlyRate, onComplete }: FreedomDashboardProps) {
    const annualSavings = task.hours * hourlyRate * 52
    const hoursUnlocked = task.hours * 52

    return (
        <div className="max-w-3xl mx-auto text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 font-medium text-sm">
                    <Trophy className="w-4 h-4" /> Protocol Generated
                </div>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                    You just bought back {task.hours} hours a week.
                </h2>
                <p className="text-xl text-gray-400">
                    By delegating <strong>{task.name}</strong>, you have fundamentally altered your business economics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div className="text-4xl font-mono font-bold text-white">
                        {hoursUnlocked} <span className="text-lg text-gray-500 font-sans font-normal">hrs/yr</span>
                    </div>
                    <div className="text-sm text-gray-400">Founder Capacity Unlocked</div>
                </div>

                <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-2xl flex flex-col items-center justify-center gap-4 hover:bg-green-500/10 transition-colors">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="text-4xl font-mono font-bold text-green-400">
                        ${annualSavings.toLocaleString()} <span className="text-lg text-green-600/70 font-sans font-normal">/yr</span>
                    </div>
                    <div className="text-sm text-gray-400">Potential Revenue Increase</div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 text-left space-y-4">
                <h3 className="font-bold text-lg">Next Steps: The Handoff</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">1</div>
                        <span>Copy the SOP card you just created.</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">2</div>
                        <span>Send it to your {task.role === 'admin' ? 'VA' : 'team member'} today.</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">3</div>
                        <span>Do not intervene unless they fail the "Definition of Done".</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onComplete}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700"
            >
                <span className="mr-2">Mark as Delegated</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                {/* Visual Feedback for Constraint Reduction */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Reduces Labor Ceiling Score ▼
                </div>
            </button>
        </div>
    )
}
