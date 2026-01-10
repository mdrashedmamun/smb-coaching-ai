import { useState } from 'react'
import { Plus, Trash2, ArrowRight, DollarSign, AlertCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface TaskItem {
    id: string
    name: string
    hours: number
    role: 'admin' | 'tech' | 'sales'
}

interface TimeAuditProps {
    onComplete: (selectedTask: TaskItem) => void
    hourlyRate: number
}

export function TimeAudit({ onComplete, hourlyRate }: TimeAuditProps) {
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [newTask, setNewTask] = useState({ name: '', hours: '', role: 'admin' as const })
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

    const addTask = () => {
        if (!newTask.name || !newTask.hours) return
        const hours = parseFloat(newTask.hours)
        if (isNaN(hours) || hours <= 0) return

        const task: TaskItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: newTask.name,
            hours,
            role: newTask.role
        }

        setTasks([...tasks, task])
        setNewTask({ name: '', hours: '', role: 'admin' })
    }

    const totalWastedCost = tasks.reduce((acc, t) => acc + (t.hours * hourlyRate * 52), 0)

    const handleContinue = () => {
        if (!selectedTaskId) return
        const task = tasks.find(t => t.id === selectedTaskId)
        if (task) onComplete(task)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Step 1: The Time Audit</h2>
                <p className="text-muted-foreground">
                    List the low-leverage tasks consuming your week. Be honest.
                    We calculate the "Cost of Chaos" based on your hourly value (${hourlyRate}/hr).
                </p>
            </div>

            {/* Input Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400">Task Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Invoicing"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        value={newTask.name}
                        onChange={e => setNewTask({ ...newTask, name: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400">Hours/Week</label>
                    <input
                        type="number"
                        placeholder="5"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        value={newTask.hours}
                        onChange={e => setNewTask({ ...newTask, hours: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                    />
                </div>
                <button
                    onClick={addTask}
                    disabled={!newTask.name || !newTask.hours}
                    className="h-[42px] flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {/* Task List & Selection */}
            {tasks.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-full">
                                <DollarSign className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <div className="text-sm text-red-300">Annual Cost of Chaos</div>
                                <div className="text-2xl font-bold text-red-400">
                                    ${totalWastedCost.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                            Based on ${hourlyRate}/hr <br /> x 52 weeks
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Crucial: Select the ONE task costing you the most to fix first.</span>
                        </div>

                        {tasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTaskId(task.id)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                    selectedTaskId === task.id
                                        ? "bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        : selectedTaskId // If something else is selected, dim this one
                                            ? "bg-white/5 border-white/5 opacity-40 hover:opacity-60"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                )}
                            >
                                <div>
                                    <div className="font-medium text-lg">{task.name}</div>
                                    <div className="text-sm text-gray-400">{task.hours} hours/week • {task.role.toUpperCase()}</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Cost/Year</div>
                                        <div className="font-mono text-white">
                                            ${(task.hours * hourlyRate * 52).toLocaleString()}
                                        </div>
                                    </div>
                                    {selectedTaskId === task.id && (
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleContinue}
                            disabled={!selectedTaskId}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Fix This Constraint <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
