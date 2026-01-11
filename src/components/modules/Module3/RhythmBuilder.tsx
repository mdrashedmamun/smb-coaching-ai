import { useState } from 'react'
import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { ChannelItem } from './LeadAudit'

export interface RhythmData {
    channel: ChannelItem
    beat: string // e.g., "Post on LinkedIn"
    cadence: string // e.g., "Mon/Wed/Fri"
    firstBeatExecuted: boolean
    firstBeatProof: string // Simple text proof
}

interface RhythmBuilderProps {
    channel: ChannelItem
    onComplete: (rhythm: RhythmData) => void
}

const CADENCE_OPTIONS = [
    { value: 'daily', label: 'Daily', description: '5x per week' },
    { value: 'mwf', label: 'Mon/Wed/Fri', description: '3x per week' },
    { value: 'twth', label: 'Tue/Thu', description: '2x per week' },
    { value: 'weekly', label: 'Weekly', description: '1x per week' },
]

const BEAT_TEMPLATES: Record<string, string[]> = {
    'LinkedIn': ['Post insight', 'Comment on 5 posts', 'Send 3 connection requests', 'Publish article'],
    'Email Outreach': ['Send 10 cold emails', 'Follow up on opens', 'Add to sequence'],
    'Referrals': ['Ask 1 client for referral', 'Send thank you note', 'Check in with past referrer'],
    'Content (Blog/SEO)': ['Publish blog post', 'Update old content', 'Research keywords'],
    'Paid Ads': ['Review ad performance', 'Test new creative', 'Adjust targeting'],
    'Networking Events': ['Attend 1 event', 'Follow up with contacts', 'Schedule coffee chat'],
}

export function RhythmBuilder({ channel, onComplete }: RhythmBuilderProps) {
    const [beat, setBeat] = useState('')
    const [cadence, setCadence] = useState('')
    const [firstBeatExecuted, setFirstBeatExecuted] = useState(false)
    const [firstBeatProof, setFirstBeatProof] = useState('')

    const beatSuggestions = BEAT_TEMPLATES[channel.name] || ['Define your action']

    const canCommit = beat && cadence && firstBeatExecuted && firstBeatProof

    const handleCommit = () => {
        if (!canCommit) return
        onComplete({
            channel,
            beat,
            cadence,
            firstBeatExecuted,
            firstBeatProof
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Step 2: Start Your Rhythm</h2>
                <p className="text-muted-foreground">
                    Pick ONE thing you'll do consistently on <span className="text-blue-400 font-semibold">{channel.name}</span>.
                    Then do it once right now to prove you're serious.
                </p>
            </div>

            {/* Beat Selection */}
            <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
                <label className="text-sm uppercase tracking-wider text-gray-400">What will you do?</label>
                <div className="flex flex-wrap gap-2">
                    {beatSuggestions.map(suggestion => (
                        <button
                            key={suggestion}
                            onClick={() => setBeat(suggestion)}
                            className={cn(
                                "px-4 py-2 rounded-lg border transition-all",
                                beat === suggestion
                                    ? "bg-blue-500/20 border-blue-500 text-blue-300"
                                    : "bg-black/20 border-white/10 hover:border-white/30"
                            )}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Or type your own..."
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                    value={beat}
                    onChange={e => setBeat(e.target.value)}
                />
            </div>

            {/* Cadence Selection */}
            <div className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
                <label className="text-sm uppercase tracking-wider text-gray-400">How often?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CADENCE_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setCadence(option.value)}
                            className={cn(
                                "p-4 rounded-xl border text-center transition-all",
                                cadence === option.value
                                    ? "bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                    : "bg-black/20 border-white/10 hover:border-white/30"
                            )}
                        >
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-xs text-gray-400">{option.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* First Beat Execution - IRREVERSIBILITY GATE */}
            {beat && cadence && (
                <div className={cn(
                    "space-y-4 p-6 rounded-xl border transition-all",
                    firstBeatExecuted
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-amber-500/10 border-amber-500/30"
                )}>
                    <div className="flex items-center gap-3">
                        {firstBeatExecuted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                            <Calendar className="w-6 h-6 text-amber-400" />
                        )}
                        <div>
                            <h3 className="font-bold text-lg">
                                {firstBeatExecuted ? "You Started! ✅" : "Prove It"}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {firstBeatExecuted
                                    ? "Great job. You're officially in motion."
                                    : "We don't accept promises. Do it once, right now."
                                }
                            </p>
                        </div>
                    </div>

                    {!firstBeatExecuted && (
                        <div className="space-y-3">
                            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                                <div className="text-sm text-gray-400">Your action:</div>
                                <div className="text-lg font-semibold text-blue-300">{beat}</div>
                            </div>
                            <textarea
                                placeholder="Paste a link or say what you did..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors min-h-[80px]"
                                value={firstBeatProof}
                                onChange={e => setFirstBeatProof(e.target.value)}
                            />
                            <button
                                onClick={() => setFirstBeatExecuted(true)}
                                disabled={!firstBeatProof}
                                className="w-full py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                I Did It
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Commit Button */}
            <div className="pt-4 flex justify-end">
                <button
                    onClick={handleCommit}
                    disabled={!canCommit}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Lock It In <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
