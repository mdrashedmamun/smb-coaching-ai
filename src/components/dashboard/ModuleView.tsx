import { ArrowLeft } from 'lucide-react'

interface ModuleViewProps {
    moduleId: number
    onBack: () => void
}

export function ModuleView({ moduleId, onBack }: ModuleViewProps) {
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
                <h1 className="text-2xl font-bold mb-4">Module 0{moduleId} Active</h1>
                <p className="text-muted-foreground">
                    This is where the interactive tool for Module {moduleId} will live.
                </p>
            </div>
        </div>
    )
}
