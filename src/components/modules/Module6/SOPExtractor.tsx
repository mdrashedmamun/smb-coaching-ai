import { useState } from 'react'
import { Plus, X, ArrowRight, FileText, CheckCircle2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { TaskItem } from './TimeAudit'

interface SOPExtractorProps {
    task: TaskItem
    onComplete: (sop: SOPData) => void
}

export interface SOPData {
    trigger: string
    steps: string[]
    definitionOfDone: string
}

const MAX_STEPS = 7

export function SOPExtractor({ task, onComplete }: SOPExtractorProps) {
    const [sop, setSop] = useState<SOPData>({
        trigger: '',
        steps: [''],
        definitionOfDone: ''
    })

    const addStep = () => {
        if (sop.steps.length < MAX_STEPS) {
            setSop({ ...sop, steps: [...sop.steps, ''] })
        }
    }

    const updateStep = (index: number, value: string) => {
        const newSteps = [...sop.steps]
        newSteps[index] = value
        setSop({ ...sop, steps: newSteps })
    }

    const removeStep = (index: number) => {
        const newSteps = sop.steps.filter((_, i) => i !== index)
        setSop({ ...sop, steps: newSteps })
    }

    const canSubmit = sop.trigger && sop.definitionOfDone && sop.steps.every(s => s.trim().length > 0) && sop.steps.length > 0

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Step 2: The "Crude" SOP</h2>
                    <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-medium text-amber-500">
                        Rule: "Good enough to hand off once."
                    </div>
                </div>
                <p className="text-muted-foreground">
                    Don't overthink this. You are documenting <strong>{task.name}</strong> so someone else can do it 80% as well as you.
                    Maximum {MAX_STEPS} steps allowed.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Preview Card */}
                <div className="order-2 lg:order-1 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6 h-full">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-400 uppercase tracking-wider">Standard Operating Procedure</div>
                                <div className="font-bold text-xl">{task.name}</div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-2">When to Start (Trigger)</div>
                                <div className="text-sm text-gray-200 min-h-[20px]">
                                    {sop.trigger || <span className="text-gray-600 italic">e.g. "Every Monday at 9am" or "When a new lead arrives"</span>}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-2">The Process ({sop.steps.length}/{MAX_STEPS} Steps)</div>
                                <ul className="space-y-3">
                                    {sop.steps.map((step, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-xs text-gray-500 mt-0.5 shrink-0">
                                                {i + 1}
                                            </div>
                                            <span className={step ? "text-gray-200" : "text-gray-600 italic"}>
                                                {step || "Step description..."}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <div className="text-xs text-gray-500 uppercase mb-2">Definition of Done</div>
                                <div className="flex items-start gap-2 text-sm text-green-400/90">
                                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{sop.definitionOfDone || <span className="text-gray-600 italic">How do you know it's finished correctly?</span>}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Form */}
                <div className="order-1 lg:order-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">1. The Trigger</label>
                        <input
                            type="text"
                            placeholder="When does this task start?"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                            value={sop.trigger}
                            onChange={(e) => setSop({ ...sop, trigger: e.target.value })}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium flex justify-between">
                            <span>2. The Steps</span>
                            <span className="text-xs text-gray-500">{sop.steps.length}/{MAX_STEPS} used</span>
                        </label>
                        {sop.steps.map((step, i) => (
                            <div key={i} className="flex gap-2">
                                <div className="w-8 h-[46px] flex items-center justify-center text-gray-500 font-mono text-sm">
                                    {i + 1}.
                                </div>
                                <input
                                    type="text"
                                    placeholder={`Step ${i + 1}`}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                    value={step}
                                    autoFocus={i === sop.steps.length - 1 && i > 0}
                                    onChange={(e) => updateStep(i, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && step) addStep()
                                        if (e.key === 'Backspace' && !step && sop.steps.length > 1) {
                                            e.preventDefault()
                                            removeStep(i)
                                        }
                                    }}
                                />
                                {sop.steps.length > 1 && (
                                    <button
                                        onClick={() => removeStep(i)}
                                        className="w-[46px] h-[46px] flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {sop.steps.length < MAX_STEPS && (
                            <button
                                onClick={addStep}
                                className="ml-10 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
                            >
                                <Plus className="w-3 h-3" /> Add Step
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">3. Definition of Done</label>
                        <input
                            type="text"
                            placeholder="It is finished when..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                            value={sop.definitionOfDone}
                            onChange={(e) => setSop({ ...sop, definitionOfDone: e.target.value })}
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={() => onComplete(sop)}
                            disabled={!canSubmit}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-blue-50 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Generate Protocol <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
