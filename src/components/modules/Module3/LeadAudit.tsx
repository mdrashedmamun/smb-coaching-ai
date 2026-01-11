import { useState } from 'react'
import { Plus, Trash2, ArrowRight, TrendingDown, AlertCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface ChannelItem {
    id: string
    name: string
    consistency: number // 1-10
    beatsPerWeek: number // How often they should engage
}

interface LeadAuditProps {
    onComplete: (selectedChannel: ChannelItem) => void
    avgDealValue: number
}

export function LeadAudit({ onComplete, avgDealValue }: LeadAuditProps) {
    const [channels, setChannels] = useState<ChannelItem[]>([])
    const [newChannel, setNewChannel] = useState({ name: '', consistency: '5', beatsPerWeek: '3' })
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)

    const addChannel = () => {
        if (!newChannel.name) return
        const consistency = parseInt(newChannel.consistency)
        const beatsPerWeek = parseInt(newChannel.beatsPerWeek)
        if (isNaN(consistency) || consistency < 1 || consistency > 10) return
        if (isNaN(beatsPerWeek) || beatsPerWeek < 1) return

        const channel: ChannelItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: newChannel.name,
            consistency,
            beatsPerWeek
        }

        setChannels([...channels, channel])
        setNewChannel({ name: '', consistency: '5', beatsPerWeek: '3' })
    }

    const removeChannel = (id: string) => {
        setChannels(channels.filter(c => c.id !== id))
        if (selectedChannelId === id) setSelectedChannelId(null)
    }

    // The Broken Rhythm Cost: Missed beats * deal value
    // If consistency is 5/10, they're missing 50% of their potential beats
    const calculateMissedDeals = (channel: ChannelItem) => {
        const missedRate = (10 - channel.consistency) / 10
        const weeklyMissedBeats = channel.beatsPerWeek * missedRate
        const annualMissedBeats = weeklyMissedBeats * 52
        // Assume 1 beat = 0.1 deals (10 beats to close 1 deal)
        const missedDeals = annualMissedBeats * 0.1
        return Math.round(missedDeals * avgDealValue)
    }

    const totalBrokenRhythmCost = channels.reduce((acc, c) => acc + calculateMissedDeals(c), 0)

    const handleContinue = () => {
        if (!selectedChannelId) return
        const channel = channels.find(c => c.id === selectedChannelId)
        if (channel) onComplete(channel)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Step 1: Let's Find Your Rhythm</h2>
                <p className="text-muted-foreground">
                    Where do you get customers? Be honest about your consistency (1-10).
                    We'll calculate exactly how much money you're losing to inconsistency.
                </p>
            </div>

            {/* Input Area */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400">Channel</label>
                    <select
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        value={newChannel.name}
                        onChange={e => setNewChannel({ ...newChannel, name: e.target.value })}
                    >
                        <option value="">Select Channel</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Email Outreach">Email Outreach</option>
                        <option value="Referrals">Referrals</option>
                        <option value="Content (Blog/SEO)">Content (Blog/SEO)</option>
                        <option value="Paid Ads">Paid Ads</option>
                        <option value="Networking Events">Networking Events</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400">Consistency (1-10)</label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="5"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        value={newChannel.consistency}
                        onChange={e => setNewChannel({ ...newChannel, consistency: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-gray-400">Beats/Week</label>
                    <input
                        type="number"
                        min="1"
                        max="7"
                        placeholder="3"
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        value={newChannel.beatsPerWeek}
                        onChange={e => setNewChannel({ ...newChannel, beatsPerWeek: e.target.value })}
                    />
                </div>
                <button
                    onClick={addChannel}
                    disabled={!newChannel.name}
                    className="h-[42px] flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {/* Channel List & Selection */}
            {channels.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/20 rounded-full">
                                <TrendingDown className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <div className="text-sm text-orange-300">Money Lost to Inconsistency</div>
                                <div className="text-2xl font-bold text-orange-400">
                                    ${totalBrokenRhythmCost.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                            Based on ${avgDealValue.toLocaleString()}/deal <br /> that you didn't close.
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Pick ONE channel to fix. You can only master one rhythm at a time.</span>
                        </div>

                        {channels.map(channel => (
                            <div
                                key={channel.id}
                                onClick={() => setSelectedChannelId(channel.id)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200",
                                    selectedChannelId === channel.id
                                        ? "bg-blue-500/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        : selectedChannelId
                                            ? "bg-white/5 border-white/5 opacity-40 hover:opacity-60"
                                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                )}
                            >
                                <div>
                                    <div className="font-medium text-lg">{channel.name}</div>
                                    <div className="text-sm text-gray-400">
                                        Consistency: {channel.consistency}/10 • {channel.beatsPerWeek} beats/week
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Money Left on Table</div>
                                        <div className="font-mono text-white">
                                            ${calculateMissedDeals(channel).toLocaleString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeChannel(channel.id) }}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    {selectedChannelId === channel.id && (
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
                            disabled={!selectedChannelId}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Build My Rhythm <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
