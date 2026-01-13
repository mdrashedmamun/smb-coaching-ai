import type { BottleneckType } from './BottleneckEngine';
import { BENCHMARKS } from './Benchmarks';

export type PlanBlocker = 'fear' | 'time' | 'clarity' | 'skill';
export type PlanArchetype = 'outbound' | 'inbound' | 'rfp' | 'referral';

export interface PlanContext {
    bottleneck: BottleneckType;
    archetype: PlanArchetype;
    blocker: PlanBlocker;
    metrics: {
        replyRate?: number;
        leadToCall?: number;
        closeRate?: number;
    };
}

export interface GeneratedPlan {
    headline: string;
    day1: string;
    day2: string;
    day3: string;
}

const EMPATHY_OPENERS: Record<PlanBlocker, string> = {
    fear: "You're scared of rejection. That's normal. Most founders freeze here.",
    time: "You're busy fighting fires. We get it. But this fire is burning your wallet.",
    clarity: "You're frozen because you don't know the first step. Let's make it simple.",
    skill: "It's frustrating to do the work and get no result. It's not you, it's the technique.",
};

const ARCHETYPE_ACTIONS: Record<PlanArchetype, { audit: string; action: string }> = {
    outbound: {
        audit: "Build a list of 25 qualified leads. Verify their emails.",
        action: "Send 25 personalized emails. Do not pitch. Ask for interest.",
    },
    inbound: {
        audit: "Audit your last 10 leads. How fast did you reply?",
        action: "Call your last 5 leads. If they don't answer, text them.",
    },
    rfp: {
        audit: "Identify 3 RFP portals you are ignoring.",
        action: "Reach out to 3 partners to ask about upcoming bids.",
    },
    referral: {
        audit: "List your top 5 happiest past clients.",
        action: "Email all 5. Ask: 'Who else do you know like you?'",
    },
};

export function generatePlan(ctx: PlanContext): GeneratedPlan {
    // 1. Reality Check (Benchmark Comparison)
    let realityCheck = "";

    if (ctx.bottleneck === 'skill_messaging' && ctx.metrics.replyRate !== undefined) {
        const userRate = (ctx.metrics.replyRate * 100).toFixed(1);
        const benchmark = (BENCHMARKS.OUTBOUND.AVG_REPLY_RATE * 100).toFixed(1);
        realityCheck = `Your reply rate is ${userRate}%. The industry average is ${benchmark}%. You don't need more volume, you need better words.`;
    } else if (ctx.bottleneck === 'volume_followup' && ctx.metrics.leadToCall !== undefined) {
        const userRate = (ctx.metrics.leadToCall * 100).toFixed(1);
        const benchmark = (BENCHMARKS.INBOUND.LEAD_TO_CALL_RATE * 100).toFixed(0);
        realityCheck = `You're booking ${userRate}% of leads. Top performers book ${benchmark}%. Speed is your enemy here.`;
    } else if (ctx.bottleneck === 'skill_sales' && ctx.metrics.closeRate !== undefined) {
        const userRate = (ctx.metrics.closeRate * 100).toFixed(0);
        const benchmark = (BENCHMARKS.INBOUND.CLOSE_RATE * 100).toFixed(0);
        realityCheck = `You're closing ${userRate}%. Services businesses usually close ${benchmark}%. You might be selling past the close.`;
    } else {
        // Default fallback if no specific metric match
        realityCheck = "The data shows a clear bottleneck here compared to healthy businesses.";
    }

    // 2. Assemble Headline
    const headline = `${EMPATHY_OPENERS[ctx.blocker]} ${realityCheck}`;

    // 3. Assemble Days (Mix of Archetype & Bottleneck logic)
    // For MVP, we stick to the Archetype's primary "Unlock" action
    // In V2, we would have a matrix of Archetype x Bottleneck actions

    const steps = ARCHETYPE_ACTIONS[ctx.archetype];

    return {
        headline,
        day1: `Step 1: ${steps.audit}`,
        day2: `Step 2: ${steps.action}`,
        day3: `Step 3: Analyze the result. Did you get a reply? If not, we tweak the script.`,
    };
}
