import { ArrowLeft } from 'lucide-react'

interface ModuleViewProps {
    moduleId: number
    onBack: () => void
}

export function ModuleView({ moduleId, onBack }: ModuleViewProps) {
    const MODULE_TITLES: Record<number, string> = {
        1: "The Offer Diagnostic",
        2: "The Funnel Inspector",
        3: "The Lead Rhythm",
        4: "The Quality Filter",
        5: "The Expense Auditor",
        6: "The Reliability Protocol",
        7: "The Pitch Deck"
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </button>

            <div className="flex-1 p-8 border rounded-xl bg-card border-border">
                <h1 className="text-2xl font-bold mb-4">{MODULE_TITLES[moduleId] || `System ${moduleId}`}</h1>
                <p className="text-muted-foreground">
                    Interactive diagnostic tool for {MODULE_TITLES[moduleId]}.
                </p>
            </div>
        </div>
    )
}
