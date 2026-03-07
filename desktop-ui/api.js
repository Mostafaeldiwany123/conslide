// ── Supabase Config ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://wnytxrsysosztkhjkmdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndueXR4cnN5c29zenRraGprbWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2Mjg3NzgsImV4cCI6MjA4ODIwNDc3OH0.beDqFJs4Mys6qn98IFJR6kW9COhaMa6PVULsCh8-vyg";

const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/api-proxy`;

/**
 * Fetches the user's latest tier and credits directly from Supabase.
 * This ensures the palette always has fresh data.
 */
async function fetchLivelyTier(session) {
    if (!session || !session.user_id || !session.access_token) return null;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${session.user_id}&select=tier,token_usage,token_limit`, {
            method: "GET",
            headers: {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": `Bearer ${session.access_token}`,
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                const tier = data[0].tier || 'free';
                let limit = data[0].token_limit;

                // If limit is missing or 0 but they are Pro/Team, give them the standard amount
                // this acts as a safety fallback if the DB trigger hasn't fired yet
                if (!limit || limit === 0) {
                    if (tier === 'pro') limit = 100;
                    else if (tier === 'team') limit = 500;
                    else limit = 10;
                }

                return {
                    tier: tier,
                    token_usage: data[0].token_usage || 0,
                    token_limit: limit
                };
            }

        }
    } catch (e) {
        console.error('[api.js] Failed to fetch tier:', e);
    }
    return null;
}
window.fetchLivelyTier = fetchLivelyTier;

/**
 * Calls the Supabase Edge Function (ai-proxy) which securely proxies AI requests.
 * API key, model name, and system prompts are stored server-side.
 */
async function callEdgeFunction(payload) {
    // Attach user_id so the edge function can track usage
    const session = window._lastSessionData;
    if (session && session.user_id) {
        payload.user_id = session.user_id;
    }

    const response = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(payload),
    });
    const responseText = await response.text();
    let data;
    try {
        data = JSON.parse(responseText);
    } catch (e) {
        throw new Error(`Server returned error ${response.status}: ${responseText.substring(0, 100)}`);
    }

    if (!response.ok) {
        // Handle credit exhaustion error
        if (response.status === 402 || data.error === "Credits exhausted") {
            const error = new Error(data.message || "AI credits exhausted");
            error.creditsExhausted = true;
            error.tier = data.tier;
            error.creditsUsed = data.credits_used;
            error.creditsLimit = data.credits_limit;
            throw error;
        }

        // Handle authentication error
        if (response.status === 401) {
            throw new Error("Authentication required. Please sign in again.");
        }

        throw new Error(data.message || data.error || `Request failed: ${response.status}`);
    }

    // Update local credits info if returned
    if (data.credits_used !== undefined) {
        window.userCreditsUsed = data.credits_used;
        window.userCreditsLimit = data.credits_limit;
    }

    // Return the result along with credits charged info
    return {
        result: data.result,
        creditsCharged: data.credits_charged || 1
    };
}

/**
 * Sends slide text to the AI model to translate it to the target language.
 * @param {string} jsonText The extracted JSON string of shape texts.
 * @param {string} targetLanguage The language to translate to (e.g., "Arabic").
 * @returns {Promise<string>} The translated JSON string.
 */
async function fetchAITranslation(jsonText, targetLanguage) {
    const response = await callEdgeFunction({
        action: "translate",
        content: jsonText,
        targetLanguage: targetLanguage,
    });

    let content = response.result.replace(/```json/g, '').replace(/```/g, '').trim();
    return content;
}

/**
 * Sends slide text to generate 5 lead sentence options.
 * @param {string} jsonText The extracted JSON string of shape texts.
 * @returns {Promise<string[]>} Array of 5 string options.
 */
async function fetchAILeadSentence(jsonText) {
    const response = await callEdgeFunction({
        action: "lead",
        content: jsonText,
    });

    let content = response.result.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(content);
}

/**
 * Sends selected text to rewrite it professionally or format as bullets.
 * @param {string} text The user's selected text.
 * @param {string} mode 'rewrite' or 'bullets'
 * @returns {Promise<string>} The rewritten string.
 */
async function fetchAIRewrite(text, mode) {
    const response = await callEdgeFunction({
        action: mode === 'bullets' ? 'bullets' : 'rewrite',
        content: text,
    });

    let content = response.result.trim();
    // Remove markdown code blocks
    content = content.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim();
    return content;
}

/**
 * Sends a prompt to the AI model to generate a slide using McKinsey / ADL / BCG style.
 * @param {string} prompt The user's command or prompt.
 * @param {string} slideContext Optional context from PPT if editing.
 * @returns {Promise<{slideJson: string, explanation: string}>} The generated JSON and explanation.
 */
async function fetchAIGenerateSlide(prompt, slideContext) {
    const response = await callEdgeFunction({
        action: "generate-slide",
        content: prompt,
        slideContext: slideContext,
    });

    let content = response.result.trim();

    // Check for JSON slide block
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
        const slideJson = jsonMatch[1].trim();
        const explanation = content.replace(/```json[\s\S]*?```/g, '').trim();
        return { slideJson, explanation };
    }

    // If no block found but it's pure json
    if (content.startsWith('{') && content.endsWith('}')) {
        return { slideJson: content, explanation: "Slide generated successfully." };
    }
    throw new Error('No JSON payload found in the response.');
}