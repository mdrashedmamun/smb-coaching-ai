import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { FUNNEL_STEP_OPTIONS } from '../../lib/funnelMapping';

interface FunnelStepInputProps {
    id: string;
    stepType: string;
    quantity: number;
    onUpdate: (id: string, updates: { stepType?: string; quantity?: number }) => void;
    onRemove: (id: string) => void;
    isFirst?: boolean;
}

export const FunnelStepInput: React.FC<FunnelStepInputProps> = ({
    id,
    stepType,
    quantity,
    onUpdate,
    onRemove,
    isFirst = false,
}) => {
    return (
        <div className="group flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* Search / Select Step Type */}
            <div className="flex-1">
                <select
                    value={stepType}
                    onChange={(e) => onUpdate(id, { stepType: e.target.value })}
                    className="w-full bg-transparent text-slate-200 text-sm focus:outline-none focus:ring-0 border-none p-0 cursor-pointer [&>optgroup]:bg-slate-800 [&>optgroup]:text-slate-400 [&>optgroup]:font-semibold [&>option]:text-slate-200 [&>option]:pl-4"
                >
                    <option value="" disabled>Select a step...</option>
                    {FUNNEL_STEP_OPTIONS.map((group) => (
                        <group.options.length > 0 && (
                            <optgroup key={group.label} label={group.label}>
                                {group.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </optgroup>
                            )
          ))}
                        </select>
      </div>

            <div className="w-px h-6 bg-slate-700 shrink-0" />

            {/* Quantity Input */}
            <div className="flex items-center gap-2 w-32">
                <span className="text-slate-500 text-xs font-medium">QTY</span>
                <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => onUpdate(id, { quantity: Math.max(0, parseInt(e.target.value) || 0) })}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-1 text-right text-emerald-400 font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                    placeholder="0"
                />
            </div>

            {/* Remove Button */}
            <button
                onClick={() => onRemove(id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                title="Remove step"
            >
                <X size={14} />
            </button>
        </div>
    );
};
