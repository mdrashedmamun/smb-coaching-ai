import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { ArrowRight, Trash2, Clock, DollarSign } from 'lucide-react'

interface QualityFormProps {
    onSubmit: (data: { hoursWasted: number }) => void
}

export function QualityForm({ onSubmit }: QualityFormProps) {
    const { context } = useBusinessStore()

    const [totalLeads] = useState(context.monthlyLeads || 50)
    const [goodLeads, setGoodLeads] = useState(Math.floor(totalLeads * 0.2)) // default 20%
    const [hoursWasted, setHoursWasted] = useState(5)

    // Real-time Calc
    const badLeads = Math.max(0, totalLeads - goodLeads)
    const hourlyRate = context.hourlyValue || 100 // default $100/hr
    const moneyBurned = hoursWasted * hourlyRate

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // We pass hoursWasted up so the result view can use it or store it
        onSubmit({ hoursWasted })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">

            <div className="bg-muted/10 border rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                    The Junk Audit
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Out of your {totalLeads} leads/mo, how many are actually "Good"?
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="0"
                                max={totalLeads}
                                value={goodLeads}
                                onChange={e => setGoodLeads(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <div className="w-20 text-right font-mono font-bold">
                                {goodLeads} Good
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-red-400 font-mono">
                            ({badLeads} Bad Leads detected)
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            How many hours/mo do you spend talking to "Bad Leads"?
                        </label>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="number"
                                min="0"
                                value={hoursWasted}
                                onChange={e => setHoursWasted(Number(e.target.value))}
                                className="w-24 px-3 py-2 bg-background border rounded-md focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <span className="text-sm text-muted-foreground">hours/month</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                <div className="p-3 bg-red-500/20 rounded-full">
                    <DollarSign className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <div className="text-sm font-medium text-red-500 uppercase tracking-wider">Opportunity Cost</div>
                    <div className="text-2xl font-black text-white">
                        ${moneyBurned.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
                Show Me The Filters <ArrowRight className="w-4 h-4" />
            </button>
        </form>
    )
}
