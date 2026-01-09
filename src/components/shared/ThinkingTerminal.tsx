import { useState, useEffect } from 'react'
import { Terminal } from 'lucide-react'

interface ThinkingTerminalProps {
    steps?: string[]
}

const DEFAULT_STEPS = [
    "Initializing connection...",
    "Reading context...",
    "Analyzing inputs...",
    "Checking against benchmarks...",
    "Finalizing strategy..."
]

export function ThinkingTerminal({ steps = DEFAULT_STEPS }: ThinkingTerminalProps) {
    const [currentStep, setCurrentStep] = useState(0)

    useEffect(() => {
        if (currentStep < steps.length - 1) {
            const timeout = Math.random() * 800 + 500 // Random delay between 0.5s and 1.3s
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1)
            }, timeout)
            return () => clearTimeout(timer)
        }
    }, [currentStep, steps.length])

    return (
        <div className="w-full max-w-md mx-auto bg-black text-green-500 font-mono text-sm rounded-lg p-4 border border-green-500/30 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 mb-3 border-b border-green-500/20 pb-2">
                <Terminal className="w-4 h-4" />
                <span className="text-xs uppercase opacity-70">Antigravity OS v1.0</span>
            </div>

            <div className="space-y-1">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-2 transition-opacity duration-300 ${index > currentStep ? 'opacity-0' : index === currentStep ? 'opacity-100' : 'opacity-50'
                            }`}
                    >
                        <span className="text-green-500/50">{index === currentStep ? '>' : '$'}</span>
                        <span>{step}</span>
                        {index === currentStep && (
                            <span className="animate-pulse inline-block w-2 h-4 bg-green-500 ml-1 align-middle"></span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
