import { useState } from 'react'
import { useBusinessStore } from '../../../store/useBusinessStore'
import { Layers, Baby, ChevronRight, ChevronLeft, Award } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface PitchResultProps {
    mode: 'investor' | 'customer'
    onContinue: () => void
}

export function PitchResult({ mode, onContinue }: PitchResultProps) {
    const { context } = useBusinessStore()
    const [slide, setSlide] = useState(0)
    const [grandmotherMode, setGrandmotherMode] = useState(false)

    // DATA INJECTION
    const offer = context.offerHeadline || "a service"
    const price = context.pricePoint || 100
    const channel = context.keyChannels?.[0] || "referrals"
    const audience = context.targetAudience || "people"

    // SCRIPT GENERATOR
    const getScripts = (isSimple: boolean) => {
        if (mode === 'customer') {
            return [
                {
                    title: "The Problem",
                    text: isSimple
                        ? `You know how ${audience} hate wasting time?`
                        : `For ${audience}, the biggest bottleneck is inefficiency. It costs them hours every week.`
                },
                {
                    title: "The Solution",
                    text: isSimple
                        ? `We fix that instantly.`
                        : `Our unique mechanism, ${offer}, solves this by removing the friction points entirely.`
                },
                {
                    title: "The Offer",
                    text: isSimple
                        ? `Pay $${price}, and we do it for you.`
                        : `For an investment of $${price}, we implement the full system. No hidden costs.`
                }
            ]
        } else {
            return [
                {
                    title: "The Market Hook",
                    text: isSimple
                        ? `${audience} are spending way too much money on bad solutions.`
                        : `${audience} represents a massive underserved market, currently bleeding capital on inefficiency.`
                },
                {
                    title: "The Secret Sauce",
                    text: isSimple
                        ? `We get customers from ${channel} for cheap.`
                        : `We have validated a scalable acquisition channel via ${channel}, giving us a predictable CAC.`
                },
                {
                    title: "The Economics",
                    text: isSimple
                        ? `We charge $${price} and keep most of it.`
                        : `With a price point of $${price} and optimized delivery, our unit economics are primed for scale.`
                }
            ]
        }
    }

    const slides = getScripts(grandmotherMode)
    const currentSlide = slides[slide]

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">

            {/* HEADER CONTROLS */}
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border">
                <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-primary" />
                    <span className="font-bold uppercase tracking-wider text-sm">{mode} Deck</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium transition-colors", grandmotherMode ? "text-muted-foreground" : "text-primary")}>Pro</span>
                    <button
                        onClick={() => setGrandmotherMode(!grandmotherMode)}
                        className={cn(
                            "w-12 h-6 rounded-full relative transition-colors",
                            grandmotherMode ? "bg-pink-500" : "bg-muted"
                        )}
                    >
                        <div className={cn(
                            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                            grandmotherMode ? "translate-x-6" : "translate-x-0"
                        )} />
                    </button>
                    <span className={cn("text-xs font-medium transition-colors", grandmotherMode ? "text-pink-500" : "text-muted-foreground flex items-center gap-1")}>
                        <Baby className="w-3 h-3" /> Grandma
                    </span>
                </div>
            </div>

            {/* SLIDE VIEW */}
            <div className="aspect-video bg-black rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-12 text-center shadow-2xl">
                <div className="absolute top-4 left-0 w-full text-center">
                    <span className="text-zinc-500 text-xs uppercase tracking-[0.2em]">{currentSlide.title}</span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight animate-in fade-in zoom-in duration-300 key={slide}">
                    "{currentSlide.text}"
                </h1>

                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                    {slides.map((_, i) => (
                        <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i === slide ? "bg-white" : "bg-zinc-800")} />
                    ))}
                </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setSlide(Math.max(0, slide - 1))}
                    disabled={slide === 0}
                    className="p-4 rounded-full hover:bg-muted disabled:opacity-0 transition-all"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {slide === slides.length - 1 ? (
                    <button
                        onClick={onContinue}
                        className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Award className="w-5 h-5" /> Finish Course
                    </button>
                ) : (
                    <span className="text-muted-foreground text-sm">Tap arrow to advance</span>
                )}

                <button
                    onClick={() => setSlide(Math.min(slides.length - 1, slide + 1))}
                    disabled={slide === slides.length - 1}
                    className="p-4 rounded-full hover:bg-muted disabled:opacity-0 transition-all"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

        </div>
    )
}
