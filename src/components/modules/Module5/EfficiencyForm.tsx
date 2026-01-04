import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { ArrowRight, Plus, DollarSign, Clock, Trash2 } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface ChannelData {
    id: string
    name: string
    spend: number
    hours: number
    leads: number
}

interface EfficiencyFormProps {
    onSubmit: (data: ChannelData[]) => void
}

export function EfficiencyForm({ onSubmit }: EfficiencyFormProps) {
    const { context } = useBusinessStore()

    const [channels, setChannels] = useState<ChannelData[]>([
        { id: '1', name: 'Instagram', spend: 0, hours: 0, leads: 0 },
        { id: '2', name: 'Referrals', spend: 0, hours: 0, leads: 0 }
    ])

    const addChannel = () => {
        setChannels([
            ...channels,
            { id: Math.random().toString(), name: '', spend: 0, hours: 0, leads: 0 }
        ])
    }

    const removeChannel = (id: string) => {
        setChannels(channels.filter(c => c.id !== id))
    }

    const updateChannel = (id: string, field: keyof ChannelData, value: string | number) => {
        setChannels(channels.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Validation: Ensure at least one channel has data
        if (channels.length === 0) return
        onSubmit(channels)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">

            <div className="bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" /> Channel Audit
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        Your Time Value: ${context.hourlyValue || 100}/hr
                    </span>
                </div>

                <div className="space-y-4">
                    {/* Headers */}
                    <div className="grid grid-cols-12 gap-4 text-xs font-mono text-muted-foreground uppercase tracking-wider px-2">
                        <div className="col-span-3">Channel Name</div>
                        <div className="col-span-2 text-center">Ad Spend ($)</div>
                        <div className="col-span-2 text-center">Time (Hrs)</div>
                        <div className="col-span-2 text-center">Leads (#)</div>
                        <div className="col-span-1"></div>
                    </div>

                    {/* Rows */}
                    {channels.map((channel) => (
                        <div key={channel.id} className="grid grid-cols-12 gap-4 items-center p-2 rounded-lg hover:bg-muted/20 transition-colors group">
                            <div className="col-span-3">
                                <input
                                    type="text"
                                    placeholder="e.g. LinkedIn"
                                    value={channel.name}
                                    onChange={e => updateChannel(channel.id, 'name', e.target.value)}
                                    className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none px-1 py-1"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={channel.spend || ''}
                                    onChange={e => updateChannel(channel.id, 'spend', Number(e.target.value))}
                                    className="w-full text-center bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none px-1 py-1"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={channel.hours || ''}
                                    onChange={e => updateChannel(channel.id, 'hours', Number(e.target.value))}
                                    className="w-full text-center bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none px-1 py-1"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={channel.leads || ''}
                                    onChange={e => updateChannel(channel.id, 'leads', Number(e.target.value))}
                                    className="w-full text-center bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none px-1 py-1"
                                />
                            </div>
                            <div className="col-span-3 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => removeChannel(channel.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addChannel}
                    className="mt-6 w-full py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Another Channel
                </button>
            </div>

            <div className="pt-4 text-center">
                <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                    Calculate "True CPL" <ArrowRight className="w-4 h-4 inline ml-2" />
                </button>
            </div>
        </form>
    )
}
