import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { ArrowRight, UserCircle2, ShieldAlert } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface SopFormProps {
    onSubmit: (ownerMap: Record<string, string>) => void
}

export function SopForm({ onSubmit }: SopFormProps) {
    const { context } = useBusinessStore()

    // Use saved channels or fallback
    const channels = context.keyChannels?.length > 0
        ? context.keyChannels
        : ['Instagram', 'Email Marketing'] // Fallback if Module 5 skipped or empty

    const [ownerMap, setOwnerMap] = useState<Record<string, string>>(
        channels.reduce((acc, ch) => ({ ...acc, [ch]: 'me' }), {})
    )

    const handleOwnerChange = (channel: string, owner: string) => {
        setOwnerMap(prev => ({ ...prev, [channel]: owner }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(ownerMap)
    }

    // Warning Logic: If user is "Solo" but assigns "VA", show alert? 
    // actually, this is where we ENABLE them to think about VAs.

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

            <div className="bg-card border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <UserCircle2 className="w-4 h-4 text-primary" /> Who Owns The Engine?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                    For each "Green" channel, define who sends the message. If it's "You", we need a checklist. If it's "VA", we need a Manual.
                </p>

                <div className="space-y-4">
                    {channels.map((channel) => (
                        <div key={channel} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                            <span className="font-medium">{channel}</span>

                            <div className="flex bg-muted rounded-lg p-1">
                                {['Me', 'Team/VA', 'Tool'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => handleOwnerChange(channel, role)}
                                        className={cn(
                                            "px-4 py-1.5 text-xs font-medium rounded-md transition-all",
                                            ownerMap[channel] === role
                                                ? "bg-white text-black shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
                <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-blue-500 mb-1">Bus Factor Check</h3>
                    <p className="text-sm text-blue-500/80">
                        If you select "Me" for everything, your business stops when you get sick.
                        Try to move at least one channel to "Team/VA" or "Tool".
                    </p>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
                Generate Standard Operating Procedures <ArrowRight className="w-4 h-4" />
            </button>
        </form>
    )
}
