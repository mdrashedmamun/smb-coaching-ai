
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- LOGIC MAP & STAGE CLASSIFIER ---

interface DiagnosticInput {
    businessName: string;
    offerHeadline: string;
    pricingModel: string;
    pricePoint: number;
    targetAudience: string;
    // Vitals & Goals for Stage Classification
    revenue: number;
    goals: {
        revenue90Day: number;
        revenue1Year: number;
        primaryConstraint: string;
    };
}

interface DiagnosticResult {
    score: number;
    stage: 'Improvise' | 'Monetize' | 'Scale';
    critique: string;
    improved_headline: string;
    improved_pitch: string;
}

// 1. STAGE CLASSIFIER
function classifyStage(input: DiagnosticInput): 'Improvise' | 'Monetize' | 'Scale' {
    if (input.revenue === 0) return 'Improvise'; // Stage 0
    if (input.revenue > 0 && input.revenue < 100000) return 'Monetize'; // Stage 1 (Arbitrary <100k for now, can refine)
    return 'Scale'; // Stage 2+
}

// 2. SCORING ENGINE (Universal Logic Map)
function calculateOfferScore(input: DiagnosticInput, stage: string): number {
    let score = 0;

    // -- BASE CHECKS (All Stages) --

    // Clarity (40pts)
    const clarityKeywords = ['days', 'weeks', 'months', 'lbs', 'kg', 'k', '$', '%'];
    const hasNumber = clarityKeywords.some(k => input.offerHeadline.toLowerCase().includes(k));
    if (hasNumber) score += 20;

    const jargonKeywords = ['holistic', 'synergy', 'comprehensive', 'solutions', 'empowering'];
    const hasJargon = jargonKeywords.some(k => input.offerHeadline.toLowerCase().includes(k));
    if (!hasJargon) score += 20;

    // Avatar (30pts)
    const isSpecific = input.targetAudience.length > 10 && !input.targetAudience.toLowerCase().includes('everyone');
    if (isSpecific) score += 30;

    // -- STAGE SPECIFIC MODIFIERS --

    if (stage === 'Improvise') {
        // Stage 0: Do NOT penalize low price. "Free" is good.
        // If price is 0, they get points for following Stage 0 rules.
        if (input.pricePoint === 0) score += 30;
        else if (input.pricePoint < 100) score += 10; // Low barrier entry is okay
    } else {
        // Stage 1+: MUST have Pricing Power
        if (input.pricePoint > 1000) score += 30;
        else if (input.pricePoint > 200) score += 15;
        else score += 0; // Commodity danger zone
    }

    return Math.min(score, 100);
}

// 3. SYSTEM PROMPT GENERATOR ( The "Advisory Brain" )
function generateSystemPrompt(input: DiagnosticInput, stage: string, score: number): string {
    const basePrompt = `You are an expert Business Investor and Advisor.`;

    let persona = "";
    if (stage === 'Improvise') {
        persona = `
    **PERSONA: The Harsh Mentor.**
    - Your User is in "Stage 0: Improvise" (Pre-Revenue).
    - Their ONLY goal is Engagement and Feedback. Profit is a distraction.
    - If they are trying to charge high prices or build complex tech, YELL AT THEM.
    - Advise them to: "Make something FREE. Get 5 people to use it. Prove they care."
    `;
    } else if (stage === 'Monetize') {
        persona = `
    **PERSONA: The Sales Director.**
    - Your User is in "Stage 1: Monetize" (Early Traction, <$100k).
    - Their ONLY goal is First Consistent Sales.
    - They likely have pricing shame. Push them to raise prices.
    - If their offer score is low (${score}/100), tell them their offer is boring/invisible.
    - Advise them to: "Fix the V1 product. Validate pricing power. Sell manually."
    `;
    } else {
        persona = `
    **PERSONA: The Private Equity Analyst.**
    - Your User is in "Stage 2: Scale" (Growing).
    - Focus on Margins, Unit Economics, and Systems.
    - Be ruthless about efficiency.
    `;
    }

    const context = `
  **USER DOSSIER:**
  - **Business**: ${input.businessName} (${input.businessType})
  - **Offer**: "${input.offerHeadline}" for ${input.targetAudience}
  - **Price**: $${input.pricePoint} (${input.pricingModel})
  - **Reality**: $${input.revenue}/yr Revenue.
  - **Ambition**: Wants $${input.goals.revenue1Year}/yr in 12 months.
  - **Constraint**: Thinks problem is "${input.goals.primaryConstraint}".
  
  **DIAGNOSTIC SCORE**: ${score}/100.
  `;

    return `${basePrompt}\n${persona}\n${context}\n
  **INSTRUCTIONS:**
  1.  **Critique**: Give a 2-sentence brutal truth about their offer based on their STAGE.
  2.  **Improvement**: Rewrite their headline to be "Unignorable".
  3.  **Pitch**: Write a 1-sentence "Elevator Pitch" they should use at a dinner party.
  4.  **Format**: Return strictly JSON. NO markdown.
  `;
}


serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { input } = await req.json(); // Expecting { input: DiagnosticInput }

        if (!input) throw new Error("Missing input data");

        // 1. Classify Stage
        const stage = classifyStage(input);

        // 2. Calculate Score (Deterministic)
        const score = calculateOfferScore(input, stage);

        // 3. Generate Analysis via LLM (Mock for now, replacing with real call structure)
        // NOTE: In production, we would call OpenAI/Anthropic here using the 'generateSystemPrompt'.
        // For this MVP step, we will simulate the "Persona" output using a smart template to ensure speed/reliability first.

        // Simulating LLM Output based on Logic Map to prove the wiring working
        let critique = "";
        if (stage === 'Improvise') {
            critique = "You are in Stage 0 (Pre-Revenue). Stop trying to complicate it. Your offer is currently imaginary. Go find 5 people to serve for FREE today to prove anyone actually wants this.";
        } else if (score < 60) {
            critique = "Your offer is invisible. You are selling a process/feature, not a result. In Stage 1, you need to be unignorable. No one wakes up wanting your service; they want the result.";
        } else {
            critique = "Good offer structure. You have pricing power. Now the risk is delivery - can you actually fulfill this promise at scale? Ensure your ops can handle the volume.";
        }

        const improved_headline = `Help ${input.targetAudience || 'Clients'} get [Specific Result] in 30 days without [Pain]`;
        const improved_pitch = `I help ${input.targetAudience} achieve [Result] by [Mechanism].`;

        const result: DiagnosticResult = {
            score,
            stage,
            critique,
            improved_headline,
            improved_pitch
        };

        // 4. Save Result to DB (Optional, for history)
        // const { error } = await supabase.from('module_results').insert(...)

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
