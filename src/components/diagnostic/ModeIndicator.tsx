/**
 * ModeIndicator.tsx
 * 
 * Persistent indicator showing whether user is in Consulting Mode or Simulation Mode.
 * Must be visible on all screens after Phase 0 to maintain transparency.
 */

import { useBusinessStore } from '../../store/useBusinessStore';
import { Briefcase, FlaskConical } from 'lucide-react';
import { isSimulationModeActive } from '../../lib/physicsState';

export const ModeIndicator = () => {
    const operatingMode = useBusinessStore(state => state.context.operatingMode);
    const isSimulation = useBusinessStore(state => state.context.isSimulationMode);

    // Don't show if Phase 0 hasn't completed yet
    if (!operatingMode && isSimulation === undefined) return null;

    const isConsulting = operatingMode
        ? operatingMode.mode === 'consulting'
        : !isSimulation;

    return (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg ${isConsulting
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
            {isConsulting ? (
                <>
                    <Briefcase className="w-4 h-4" />
                    <span>Consulting Mode</span>
                </>
            ) : (
                <>
                    <FlaskConical className="w-4 h-4" />
                    <span>Simulation Mode</span>
                </>
            )}
        </div>
    );
};

/**
 * Inline mode badge for use within screens
 */
export const ModeBadge = ({ className = '' }: { className?: string }) => {
    const operatingMode = useBusinessStore(state => state.context.operatingMode);
    const isSimulation = useBusinessStore(state => state.context.isSimulationMode);

    if (!operatingMode && isSimulation === undefined) return null;

    const isConsulting = operatingMode
        ? operatingMode.mode === 'consulting'
        : !isSimulation;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isConsulting
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-blue-500/20 text-blue-400'
            } ${className}`}>
            {isConsulting ? (
                <>
                    <Briefcase className="w-3 h-3" />
                    Consulting
                </>
            ) : (
                <>
                    <FlaskConical className="w-3 h-3" />
                    Simulation
                </>
            )}
        </span>
    );
};

/**
 * Phase 2 blocked banner for Simulation Mode
 */
export const Phase2BlockedBanner = () => {
    const context = useBusinessStore(state => state.context);

    if (!isSimulationModeActive(context)) return null;

    return (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <FlaskConical className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-blue-200">Simulation Mode Active</p>
                    <p className="text-sm text-blue-300/80 mt-1">
                        Unit Economics (CAC Payback, LTV) are not calculated in Simulation Mode.
                        You'll see revenue math only.
                    </p>
                </div>
            </div>
        </div>
    );
};
