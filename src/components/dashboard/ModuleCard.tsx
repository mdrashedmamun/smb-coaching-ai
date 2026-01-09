import { Lock, CheckCircle2, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

interface ModuleCardProps {
    title: string
    description: string
    isLocked: boolean
    isCompleted: boolean
    onClick: () => void
}

export function ModuleCard({ title: moduleTitle, description, isLocked, isCompleted, onClick }: ModuleCardProps) {
    return (
        <button
            onClick={onClick}
            disabled={isLocked}
            className={cn(
                "relative flex flex-col items-start w-full p-6 text-left transition-all duration-300 border rounded-2xl group overflow-hidden min-h-[160px]",
                // Glassmorphism Base Styles
                "backdrop-blur-sm",

                isLocked
                    ? "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed opacity-70"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]",

                isCompleted && "border-green-500/30 bg-green-500/5 hover:bg-green-500/10"
            )}
        >
            {/* Hover Glow Effect for Unlocked Cards */}
            {!isLocked && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            <div className="relative z-10 flex items-center justify-between w-full mb-4">
                {/* Status Indicator (Dot) */}
                <div className={cn(
                    "flex items-center gap-2 text-xs font-mono tracking-wider uppercase",
                    isCompleted ? "text-green-400" : isLocked ? "text-gray-600" : "text-blue-400"
                )}>
                    <div className={cn(
                        "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                        isCompleted ? "bg-green-400" : isLocked ? "bg-gray-600" : "bg-blue-400"
                    )} />
                    {isCompleted ? "Optimized" : isLocked ? "Locked" : "Ready"}
                </div>

                {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : isLocked ? (
                    <Lock className="w-4 h-4 text-gray-700" />
                ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                )}
            </div>

            <h3 className={cn("relative z-10 text-lg font-bold mb-2 transition-colors",
                isLocked ? "text-gray-600" : "text-white group-hover:text-blue-100"
            )}>
                {moduleTitle}
            </h3>

            <p className={cn("relative z-10 text-sm leading-relaxed",
                isLocked ? "text-gray-700" : "text-gray-400 group-hover:text-gray-300"
            )}>
                {description}
            </p>
        </button>
    )
}
