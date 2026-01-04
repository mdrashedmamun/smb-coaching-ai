import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface OfferResultProps {
    onContinue: () => void
}

export function OfferResult({ onContinue }: OfferResultProps) {
    // Mock Data (will be replaced by AI)
    const score = 'B-'
    const analysis = [
        { type: 'good', text: 'Clear target audience (Dentists).' },
        { type: 'bad', text: 'Headline is generic ("get more patients").' },
        { type: 'warning', text: 'Price point ($500) feels low for the promised value.' },
    ]

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="bg-card border rounded-xl p-6 text-center">
                <h2 className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-2">Offer Health Score</h2>
                <div className="text-6xl font-black text-yellow-500 mb-2">{score}</div>
                <p className="text-sm text-muted-foreground">Passed the "Grandmother Test" but failed on Specificity.</p>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold">Analysis</h3>
                <div className="space-y-2">
                    {analysis.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                            {item.type === 'good' && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                            {item.type === 'bad' && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                            {item.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />}
                            <span className="text-sm">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <h3 className="font-semibold mb-2">Recommended Rewrite</h3>
                <p className="font-mono text-sm">
                    "We help Dental Practices add $50k/month in revenue by reactivating old patient lists."
                </p>
            </div>

            <button
                onClick={onContinue}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
                Accept & Commit (Unlock Module 2)
            </button>
        </div>
    )
}
