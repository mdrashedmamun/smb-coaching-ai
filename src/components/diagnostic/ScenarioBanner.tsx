import { AlertTriangle, FlaskConical } from 'lucide-react';
import { useBusinessStore } from '../../store/useBusinessStore';
import { getScenarioState, getAdvisoryBlockState } from '../../lib/physicsState';

const formatValue = (value: number | string) => {
    if (typeof value === 'number') {
        return value.toLocaleString();
    }
    return value;
};

export const ScenarioBanner = () => {
    const context = useBusinessStore((state) => state.context);
    const { isSimulationMode, hasAssumptions, hasFailures, assumptions, failureReasons } = getScenarioState(context);
    const advisoryBlock = getAdvisoryBlockState(context);

    if (!isSimulationMode && !hasAssumptions && !hasFailures) return null;

    const headline = isSimulationMode ? 'Simulation Mode Active' : 'Scenario Mode Active';
    const subhead = isSimulationMode
        ? 'Scenario Mode. Advisory is locked. Outputs are estimates only.'
        : 'Scenario Mode. Outputs are estimates only.';

    return (
        <div className="fixed top-4 left-4 z-50 max-w-md bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    {isSimulationMode ? (
                        <FlaskConical className="w-5 h-5 text-amber-400" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                </div>
                <div className="space-y-2">
                    <div>
                        <h4 className="font-bold text-amber-300 text-sm">{headline}</h4>
                        <p className="text-xs text-amber-200/80">{subhead}</p>
                        {advisoryBlock.blocked && (
                            <p className="text-xs text-amber-200/80 mt-1">{advisoryBlock.message}</p>
                        )}
                    </div>

                    {assumptions.length > 0 && (
                        <div className="text-xs text-amber-200/90">
                            <div className="font-semibold text-amber-300">Assumptions</div>
                            <div className="space-y-0.5">
                                {assumptions.map((assumption) => (
                                    <div key={assumption.field}>
                                        {assumption.label}: {formatValue(assumption.value)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasFailures && failureReasons.length > 0 && (
                        <div className="text-xs text-amber-200/90">
                            <div className="font-semibold text-amber-300">Physics Failures</div>
                            <div>{failureReasons.join(' · ')}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
