import { Lock, Check, Play, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ModuleCardProps {
    id: number
    title: string
    description: string
    isLocked: boolean
    isCompleted: boolean
    onClick: () => void
}

export function ModuleCard({ id, title, description, isLocked, isCompleted, onClick }: ModuleCardProps) {
    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={cn(
                "relative flex flex-col items-start w-full p-6 text-left transition-all border rounded-xl group",
                isLocked
                    ? "bg-muted/10 border-muted text-muted-foreground cursor-not-allowed"
                    : "bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
                isCompleted && "border-green-500/30 bg-green-500/5"
            )}
        >
            <div className="flex items-center justify-between w-full mb-4">
                <span className={cn(
                    "text-xs font-mono px-2 py-1 rounded-full border",
                    isLocked ? "border-muted bg-muted/20" : "border-primary/20 bg-primary/10 text-primary",
                    isCompleted && "border-green-500/20 bg-green-500/10 text-green-500"
                )}>
                    MODULE 0{id}
                </span>
                {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground/50" />
                ) : (
                    <Play className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>

            <h3 className={cn("text-lg font-semibold mb-2", isLocked && "opacity-50")}>
                {title}
            </h3>
            <p className={cn("text-sm text-muted-foreground line-clamp-2", isLocked && "opacity-40")}>
                {description}
            </p>

            {!isLocked && !isCompleted && (
                <div className="absolute inset-0 border-2 border-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            )}
        </button>
    )
}
