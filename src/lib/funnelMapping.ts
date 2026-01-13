export type CanonicalMetric =
    | 'cold_outreach'
    | 'reactive_leads'
    | 'inbound'
    | 'high_touch'
    | 'warm_outreach'
    | 'sales_calls'
    | 'clients_closed';

export const CANONICAL_LABELS: Record<CanonicalMetric, string> = {
    cold_outreach: 'Cold Outreach',
    reactive_leads: 'Reactive Opportunities',
    inbound: 'Inbound Leads',
    high_touch: 'High-Touch Follow-up',
    warm_outreach: 'Warm Outreach',
    sales_calls: 'Sales Calls',
    clients_closed: 'Clients Closed',
};

// Dropdown options grouped by category
export const FUNNEL_STEP_OPTIONS = [
    {
        label: 'Outbound',
        options: [
            { value: 'cold_email', label: 'Cold Email' },
            { value: 'cold_dm', label: 'Cold DM' },
            { value: 'cold_call', label: 'Cold Call' },
            { value: 'linkedin_connect', label: 'LinkedIn Connection Request' },
        ]
    },
    {
        label: 'High-Touch / Follow-Up',
        options: [
            { value: 'loom_video', label: 'Loom Video / Personal Video' },
            { value: 'voice_note', label: 'Voice Note' },
            { value: 'custom_proposal', label: 'Custom Proposal' },
            { value: 'personalized_followup', label: 'Personalized Follow-up' },
        ]
    },
    {
        label: 'Inbound',
        options: [
            { value: 'content_lead', label: 'Content Lead' },
            { value: 'paid_ad_lead', label: 'Paid Ad Lead' },
            { value: 'podcast_guest', label: 'Podcast/Event Guest' },
            { value: 'referral', label: 'Referral' },
        ]
    },
    {
        label: 'Reactive / Opportunities',
        options: [
            { value: 'rfp_response', label: 'RFP Response' },
            { value: 'proposal_request', label: 'Incoming Proposal Request' },
            { value: 'marketplace_lead', label: 'Marketplace Lead (Upwork, etc.)' },
        ]
    },
    {
        label: 'Warm Outreach',
        options: [
            { value: 'warm_email', label: 'Warm Email (Past Clients)' },
            { value: 'network_reachout', label: 'Network Reachout' },
            { value: 'client_reactivation', label: 'Client Reactivation' },
        ]
    },
    {
        label: 'Sales Conversations',
        options: [
            { value: 'discovery_call', label: 'Discovery Call' },
            { value: 'sales_call', label: 'Sales Call / Demo' },
            { value: 'strategy_session', label: 'Strategy Session' },
        ]
    },
    {
        label: 'Results',
        options: [
            { value: 'closed_deal', label: 'Closed Deal / Signed' },
            { value: 'deposit_paid', label: 'Deposit Paid' },
            { value: 'contract_signed', label: 'Contract Signed' },
        ]
    }
];

export function mapStepToCanonical(stepType: string): CanonicalMetric {
    switch (stepType) {
        // Outbound
        case 'cold_email':
        case 'cold_dm':
        case 'cold_call':
        case 'linkedin_connect':
            return 'cold_outreach';

        // High Touch
        case 'loom_video':
        case 'voice_note':
        case 'custom_proposal':
        case 'personalized_followup':
            return 'high_touch';

        // Inbound
        case 'content_lead':
        case 'paid_ad_lead':
        case 'podcast_guest':
        case 'referral':
            return 'inbound';

        // Reactive
        case 'rfp_response':
        case 'proposal_request':
        case 'marketplace_lead':
            return 'reactive_leads';

        // Warm
        case 'warm_email':
        case 'network_reachout':
        case 'client_reactivation':
            return 'warm_outreach';

        // Sales Calls
        case 'discovery_call':
        case 'sales_call':
        case 'strategy_session':
            return 'sales_calls';

        // Results
        case 'closed_deal':
        case 'deposit_paid':
        case 'contract_signed':
            return 'clients_closed';

        default:
            // Default fallback based on string matching if ID not found
            if (stepType.includes('call') || stepType.includes('session')) return 'sales_calls';
            if (stepType.includes('closed') || stepType.includes('signed')) return 'clients_closed';
            if (stepType.includes('lead') || stepType.includes('inbound')) return 'inbound';
            return 'cold_outreach';
    }
}

export function aggregateFunnelMetrics(steps: Array<{ stepType: string; quantity: number }>) {
    const aggregated = {
        totalOutreach: 0,
        totalResponses: 0, // Note: We don't have explicit "response" steps in the builder yet, this might need inference or a separate field
        totalCalls: 0,
        totalClosed: 0,
        byCanonical: {} as Record<CanonicalMetric, number>
    };

    // Initialize all canonicals to 0
    Object.keys(CANONICAL_LABELS).forEach(key => {
        aggregated.byCanonical[key as CanonicalMetric] = 0;
    });

    steps.forEach(step => {
        const canonical = mapStepToCanonical(step.stepType);
        aggregated.byCanonical[canonical] += step.quantity;
    });

    // Map to the simple 4-part model for legacy bottleneck detection
    aggregated.totalOutreach =
        aggregated.byCanonical.cold_outreach +
        aggregated.byCanonical.warm_outreach +
        aggregated.byCanonical.reactive_leads +
        aggregated.byCanonical.high_touch; // High touch counts as outreach effort

    aggregated.totalCalls = aggregated.byCanonical.sales_calls;
    aggregated.totalClosed = aggregated.byCanonical.clients_closed;

    // For responses, we currently estimate based on non-outreach, non-call, non-close steps if any, 
    // OR we rely on the user adding a "response" step if we add one.
    // For now, let's assume 'inbound' counts towards "opportunities" which is similar to responses in the flow.
    // This is a rough edge in the "Builder" model vs the "Grid" model (Grid asked for 'responses' explicitly).
    // Strategy: We might need to ask for "Responses" explicitly or derive it.
    // For v1, let's treat Inbound + Reactive as "Opportunities/Responses"
    aggregated.totalResponses =
        aggregated.byCanonical.inbound +
        aggregated.byCanonical.reactive_leads;

    return aggregated;
}
