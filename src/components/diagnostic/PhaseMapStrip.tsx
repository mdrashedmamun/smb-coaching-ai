interface PhaseMapStripProps {
    title?: string;
}

export const PhaseMapStrip = ({ title = 'Phase 1: Revenue Physics' }: PhaseMapStripProps) => {
    return (
        <div
            className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs uppercase tracking-wider text-slate-400"
            style={{
                backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.2) 1px, transparent 0)',
                backgroundSize: '18px 18px'
            }}
        >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-slate-300">{title}</span>
                <span>Growth Physics Brief: gap + deals needed</span>
            </div>
            <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span>5 mins - 2-6 fields</span>
                <span>No assumptions unless you toggle them</span>
            </div>
        </div>
    );
};
