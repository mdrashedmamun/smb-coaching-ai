import { useState } from 'react'
import { Copy, Check, Filter, ShieldCheck } from 'lucide-react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { cn } from '../../../lib/utils'

interface QualityResultProps {
    onContinue: () => void
}

export function QualityResult({ onContinue }: QualityResultProps) {
    const { context } = useBusinessStore()
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Context Variables
    const price = context.pricePoint || 500


    // The Template Engine
    const TEMPLATES = [
        {
            id: 'bio',
            title: 'The Bio Anchor',
            desc: 'Place this in your Instagram/LinkedIn bio to scare away freebie seekers.',
            content: `helping ${context.targetAudience || 'clients'} get results. Plans start at $${price}.`
        },
        {
            id: 'dm',
            title: 'The "Budget Check" DM',
            desc: 'Send this immediately when someone asks "Details?".',
            content: `Hey! Thanks for asking. Just so I don't waste your time - our ${context.pricingModel} packages start at $${price}. Is that within your budget range?`
        },
        {
            id: 'email',
            title: 'The Application Filter',
            desc: 'Add this question to your Calendly or booking form.',
            content: `We work best with businesses ready to invest $${price}-${price * 2} / month. Are you currently in a position to make that investment?`
        }
    ]

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto animate-in fade-in duration-500">

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-4">
                <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
                <div>
                    <h3 className="font-semibold mb-1">The "Velvet Rope" Strategy</h3>
                    <p className="text-sm text-muted-foreground">
                        We generated these scripts using your price point (<strong>${price}</strong>).
                        Use them to filter out the noise automatically.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {TEMPLATES.map((tpl) => (
                    <div key={tpl.id} className="bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group">
                        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <span className="font-semibold text-sm">{tpl.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{tpl.desc}</span>
                        </div>

                        <div className="p-4 bg-muted/5 relative">
                            <pre className="font-mono text-sm whitespace-pre-wrap text-foreground/80 leading-relaxed">
                                {tpl.content}
                            </pre>

                            <button
                                onClick={() => copyToClipboard(tpl.content, tpl.id)}
                                className={cn(
                                    "absolute top-4 right-4 p-2 rounded-lg border transition-all",
                                    copiedId === tpl.id
                                        ? "bg-green-500 border-green-500 text-white"
                                        : "bg-background border-border hover:bg-muted"
                                )}
                            >
                                {copiedId === tpl.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onContinue}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
                I've Added These Filters
            </button>
        </div>
    )
}
