
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- TYPES & TAXONOMY (Sync with funnel_taxonomy.ts) ---

interface FunnelStep {
    name: string;
    trafficSource?: string;
    action: string;
}

interface DiagnosticInput {
    businessName: string;
    revenue: number;
    monthlyLeads: number;
    pricePoint: number;
    followUpIntensity: number;
    funnelSteps: FunnelStep[];
}

interface DiagnosticResult {
    isValid: boolean;
    stage: 'Improvise' | 'Monetize' | 'Scale';
    score: number;
    critique: string;
    tacticalFix: string;
    leakAmount: number;
}

// --- HELPER LOGIC ---

function getBusinessStage(revenue: number): 'Improvise' | 'Monetize' | 'Scale' {
    if (revenue === 0) return 'Improvise';
    if (revenue < 100000) return 'Monetize';
    return 'Scale';
}

function calculateLeak(isValid: boolean, revenue: number): number {
    // Mock monthly revenue estimation
    const monthlyRevenue = (revenue / 12) || 10000;
    return isValid ? (monthlyRevenue * 0.1) : (monthlyRevenue * 0.4);
}

// --- MAIN FUNCTION ---

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

        const stage = getBusinessStage(input.revenue);

        // --- SIMPLE VALIDATION (The "Deterministic Truth") ---
        const firstStep = input.funnelSteps[0];
        const isStage0Ads = stage === 'Improvise' && firstStep?.trafficSource === 'paid_ads';

        // Check for "Marriage on First Date"
        const isColdTraffic = ['paid_ads', 'cold_outreach'].includes(firstStep?.trafficSource || '');
        const isHighFriction = ['discovery_call', 'proposal_review', 'contract_signing'].includes(firstStep?.action || '');
        const isMarriageWarning = isColdTraffic && isHighFriction;

        const isValid = !isStage0Ads; // This is a hard fail

        // --- AI ADVISOR LOGIC (Strategic-Coach Persona) ---
        let critique = "";
        let tacticalFix = "";

        if (stage === 'Improvise') {
            critique = "You are in Stage 0: Improvise. Stop building complex tech. You are playing business, not doing it.";
            tacticalFix = isStage0Ads
                ? "Turn off the ads. You don't have a product yet. DM 5 people and offer it for free."
                : "Directly outreach to 5 prospects manually today. Do not wait for a website.";
        } else if (isMarriageWarning) {
            critique = "You are committing 'Marriage on First Date'. You are asking a total stranger for an hour of their time without giving them a treat first.";
            tacticalFix = "Add a 2-minute video or a Lead Magnet step before the Discovery Call to lower the friction.";
        } else if (input.followUpIntensity < 3) {
            critique = "Your funnel structure is fine, but you are a lazy closer. 60% of sales happen on the 4th touch.";
            tacticalFix = "Implement an automated 3-day email sequence that triggers the moment they book the first step.";
        } else {
            critique = "Your funnel unit economics look solid. You have a scalable asset.";
            tacticalFix = "Double your lead volume input. The system can handle it.";
        }

        const result: DiagnosticResult = {
            isValid,
            stage,
            score: isValid ? 85 : 40,
            critique,
            tacticalFix,
            leakAmount: calculateLeak(isValid, input.revenue)
        };

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
