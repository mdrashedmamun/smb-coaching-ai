

interface Module1AIResult {
    score: number
    critique: string
    improved_headline: string
    improved_pitch: string
}

interface OfferResultProps {
    data?: Module1AIResult
    onContinue: () => void
}

export function OfferResult({ data, onContinue }: OfferResultProps) {
    if (!data) return null;

    const scoreLetter = data.score >= 90 ? 'A' : data.score >= 80 ? 'B' : data.score >= 70 ? 'C' : data.score >= 60 ? 'D' : 'F';
    const scoreColor = data.score >= 80 ? 'text-green-500' : data.score >= 60 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="bg-card border rounded-xl p-6 text-center">
                <h2 className="text-muted-foreground uppercase text-xs font-bold tracking-widest mb-2">Offer Health Score</h2>
                <div className={`text-6xl font-black mb-2 ${scoreColor}`}>{scoreLetter}</div>
                <p className="text-sm text-muted-foreground">{data.critique}</p>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold">AI Recommended Rewrite</h3>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                    <div>
                        <span className="text-xs uppercase text-muted-foreground font-bold">Headline</span>
                        <p className="font-mono text-sm mt-1">{data.improved_headline}</p>
                    </div>
                    <div>
                        <span className="text-xs uppercase text-muted-foreground font-bold">Pitch</span>
                        <p className="font-mono text-sm mt-1">{data.improved_pitch}</p>
                    </div>
                </div>
            </div>

            {/* Grading Legend */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs text-muted-foreground border-t border-border pt-6">
                <div className={scoreLetter === 'A' ? 'font-bold text-green-500' : ''}>A: Unignorable (90+)</div>
                <div className={scoreLetter === 'B' ? 'font-bold text-green-600' : ''}>B: Clear (80-89)</div>
                <div className={scoreLetter === 'C' ? 'font-bold text-yellow-500' : ''}>C: Boring (70-79)</div>
                <div className={scoreLetter === 'D' ? 'font-bold text-orange-500' : ''}>D: Confusing (60-69)</div>
                <div className={scoreLetter === 'F' ? 'font-bold text-red-500' : ''}>F: Invisible (&lt;60)</div>
            </div>

            {/* Expert Quote */}
            <div className="bg-muted/30 border-l-4 border-primary p-4 rounded-r-lg italic text-sm text-muted-foreground">
                <p className="mb-2">"You could set up your ad campaign completely incorrectly... but if the offer is good enough, it will still work... but the inverse is not true."</p>
                <div className="flex items-center gap-2 not-italic">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                        <img src="https://yt3.googleusercontent.com/ytc/AIdro_k6yYJc_1N5v_R6jK6tF6xX_5r8v_xX_xX=s176-c-k-c0x00ffffff-no-rj" alt="Ben Heath" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">Ben Heath</span>
                        <span className="text-[10px] opacity-70">Generated $700M+ for Clients</span>
                    </div>
                </div>
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
