import { Calendar, CheckCircle2 } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'


interface SystemResultProps {
    onContinue: () => void
}

export function SystemResult({ onContinue }: SystemResultProps) {
    const { context } = useBusinessStore()

    // Mock Schedule Generator based on User Constraints
    const schedule = [
        { day: 'Monday', task: 'Admin & Planning', duration: '30m' },
        { day: 'Wednesday', task: 'Content Batching', duration: `${Math.max(1, context.timeBudgetHours / 2)}h` },
        { day: 'Friday', task: 'Outreach / Follow-up', duration: '1h' },
    ]

    // Anti-Burnout Rule
    const burnoutNote = context.timeBudgetHours < 5
        ? "Strict 'No Daily Posting' Rule Applied."
        : "Daily consistency enabled."

    return (
        <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in duration-500">

            <div className="bg-card border rounded-xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Calendar className="w-24 h-24 rotate-12" />
                </div>

                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Your Weekly Rhythm</h3>
                <h2 className="text-2xl font-bold mb-6">The "Sustainable" {context.timeBudgetHours}h Week</h2>

                <div className="space-y-3 text-left max-w-sm mx-auto">
                    {schedule.map((slot, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg border border-transparent hover:border-primary/20 transition-colors">
                            <div className="w-24 text-sm font-medium text-muted-foreground shrink-0">{slot.day}</div>
                            <div className="w-px h-8 bg-border" />
                            <div>
                                <div className="font-semibold">{slot.task}</div>
                                <div className="text-xs text-muted-foreground">{slot.duration}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex gap-4">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                <div>
                    <h3 className="font-semibold text-blue-500 mb-1">Guardrail Active</h3>
                    <p className="text-sm text-blue-500/80">{burnoutNote}</p>
                </div>
            </div>

            <button
                onClick={onContinue}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
                Lock In This Schedule
            </button>
        </div>
    )
}
