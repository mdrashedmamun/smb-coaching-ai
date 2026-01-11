import { ArrowRight, Trophy, TrendingUp, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { ChannelItem } from './LeadAudit'
import type { RhythmData } from './RhythmBuilder'

interface CadenceDashboardProps {
    rhythm: RhythmData
    avgDealValue: number
    onComplete: () => void
}

const CADENCE_LABELS: Record<string, string> = {
    'daily': 'Every weekday',
    'mwf': 'Mon / Wed / Fri',
    'twth': 'Tue / Thu',
    'weekly': 'Once per week',
}

export function CadenceDashboard({ rhythm, avgDealValue, onComplete }: CadenceDashboardProps) {
    // Calculate value unlocked by committing to rhythm
    // If they were at X/10 consistency, and now commit to 10/10, the delta is savings
    const currentConsistency = rhythm.channel.consistency
    const targetConsistency = 10
    const consistencyGain = (targetConsistency - currentConsistency) / 10
    const weeklyBeats = rhythm.channel.beatsPerWeek
    const annualBeatsGained = weeklyBeats * consistencyGain * 52
    // Assume 10 beats = 1 deal
    const dealsGained = annualBeatsGained * 0.1
    const revenueUnlocked = Math.round(dealsGained * avgDealValue)

    // Evidence level is Bronze for now (will escalate with time-based revalidation)
    const evidenceLevel = 'Bronze'

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Step 3: Your Rhythm is Live</h2>
                <p className="text-muted-foreground">
                    You've committed to a distribution rhythm. The system will now track whether it holds.
                </p>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-500/20 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Rhythm Committed</h3>
                        <p className="text-gray-400">First beat executed. You're in motion.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-xl">
                        <div className="text-sm text-gray-400">Channel</div>
                        <div className="text-lg font-semibold text-blue-300">{rhythm.channel.name}</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl">
                        <div className="text-sm text-gray-400">Your Beat</div>
                        <div className="text-lg font-semibold text-white">{rhythm.beat}</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl">
                        <div className="text-sm text-gray-400">Cadence</div>
                        <div className="text-lg font-semibold text-purple-300">{CADENCE_LABELS[rhythm.cadence] || rhythm.cadence}</div>
                    </div>
                </div>
            </div>

            {/* Value Unlocked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="p-3 bg-green-500/20 rounded-full">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <div className="text-sm text-green-300">Potential Revenue Unlocked</div>
                        <div className="text-2xl font-bold text-green-400">
                            ${revenueUnlocked.toLocaleString()}/year
                        </div>
                        <div className="text-xs text-gray-500">If rhythm holds for 12 months</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="p-3 bg-blue-500/20 rounded-full">
                        <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-sm text-blue-300">Consistency Target</div>
                        <div className="text-2xl font-bold text-blue-400">
                            {rhythm.channel.consistency}/10 → 10/10
                        </div>
                        <div className="text-xs text-gray-500">From current to committed</div>
                    </div>
                </div>
            </div>

            {/* Evidence Level Indicator */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <div>
                        <div className="text-sm font-semibold text-amber-300">
                            Evidence Level: {evidenceLevel}
                        </div>
                        <div className="text-xs text-gray-400">
                            This commitment is time-verified only. It will upgrade to Silver after 7 days of sustained rhythm,
                            and Gold after external confirmation (e.g., team member or system tracking).
                        </div>
                    </div>
                </div>
            </div>

            {/* First Beat Proof */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-sm text-gray-400 mb-2">Your First Beat (Proof)</div>
                <div className="text-white italic">"{rhythm.firstBeatProof}"</div>
            </div>

            {/* Daily Check-in Preview */}
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">
                <h4 className="font-semibold text-lg">Coming Soon: Daily Check-in</h4>
                <p className="text-sm text-gray-400">
                    Each day, the system will ask: <span className="text-blue-300">"Did your rhythm hold yesterday?"</span>
                </p>
                <div className="flex gap-3">
                    <button disabled className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 opacity-50">
                        ✓ Yes, I did it
                    </button>
                    <button disabled className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 opacity-50">
                        ✗ I missed it
                    </button>
                </div>
                <p className="text-xs text-gray-500">
                    This is how we detect broken rhythms early — before they cost you deals.
                </p>
            </div>

            {/* Complete Module */}
            <div className="pt-4 flex justify-end">
                <button
                    onClick={onComplete}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Complete & Return to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
