import { FileText, CheckSquare, Download } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { cn } from '../../../lib/utils'

interface SopResultProps {
    ownerMap: Record<string, string>
    onContinue: () => void
}

export function SopResult({ ownerMap, onContinue }: SopResultProps) {
    const { context } = useBusinessStore()

    // Generating "SOPs" based on key channels
    const sops = Object.entries(ownerMap).map(([channel, owner]) => {
        // Logic: Different SOPs for different roles
        const isDelegated = owner !== 'Me'

        return {
            channel,
            owner,
            title: isDelegated ? `${channel} Delegation Protocol` : `${channel} Founder Routine`,
            steps: isDelegated
                ? ['Draft content on Monday', 'Approve by Tuesday', 'VA schedules on Wednesday', 'Review analytics Friday']
                : ['Timeblock 30mins', 'Open saved templates', 'Post immediately', 'Close app (Do not scroll)']
        }
    })

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">The Engine Manual</h2>
                <p className="text-muted-foreground">
                    Here is your fail-safe protocol. Whether it's you or a VA, this is how the work gets done.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sops.map((sop, i) => (
                    <div key={i} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-muted/30 p-4 border-b flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="font-semibold">{sop.title}</span>
                            </div>
                            <span className={cn(
                                "text-[10px] uppercase font-bold px-2 py-1 rounded",
                                sop.owner === 'Me' ? "bg-yellow-500/10 text-yellow-600" : "bg-green-500/10 text-green-600"
                            )}>
                                Owner: {sop.owner}
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            {sop.steps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckSquare className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <span className="text-sm">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
                <button
                    onClick={onContinue}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mx-auto"
                >
                    <Download className="w-4 h-4" /> Save Standard Operating Procedures
                </button>
            </div>
        </div>
    )
}
