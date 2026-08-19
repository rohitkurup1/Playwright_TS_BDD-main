import type { ExtractedTraceData, TriageResult, FailureCategory } from './types';
import axios from 'axios';

function buildPrompt(data: ExtractedTraceData): string {
  const networkSummary =
    data.failedNetworkCalls.map((n) => `- ${n.method} ${n.url} -> ${n.status} ${n.statusText ?? ''}`).join('\n') ||
    'None';
  const consoleSummary = data.consoleErrors.map((c) => `- [${c.type}] ${c.text}`).join('\n') || 'None';
  const actionSummary =
    data.actionLog.map((a) => `- ${a.apiName}${a.error ? ` FAILED: ${a.error}` : ''}`).join('\n') || 'None';

  return `You are a CI failure triage assistant for a Cucumber/Playwright BDD test suite.
Classify this scenario failure into exactly one category:

- PRODUCT_BUG: the application itself is broken (e.g. API returned 500 on a
  valid request, a UI assertion failed despite a correct/valid user flow).
- AUTOMATION_BUG: the test script itself is wrong (e.g. a bad/stale locator,
  race condition not properly awaited, incorrect assertion, unhandled app state,
  or a step definition mismatch).
- ENVIRONMENT_FLAKE: infrastructure/environment noise unrelated to app logic
  (e.g. gateway timeout, rate limiting, DNS blip, CI runner resource exhaustion).

Scenario: ${data.testTitle}
File: ${data.testFile}

Error message:
${data.errorMessage}

Failed network calls (4xx/5xx):
${networkSummary}

Console errors:
${consoleSummary}

Last actions before failure:
${actionSummary}

Respond with ONLY valid JSON, no markdown fences, no preamble, matching this shape:
{
  "category": "PRODUCT_BUG" | "AUTOMATION_BUG" | "ENVIRONMENT_FLAKE",
  "confidence": <number 0 to 1>,
  "summary": "<1-2 sentence root cause summary>",
  "reasoning": "<why you picked this category, referencing specific evidence above>",
  "suggestedFix": "<concrete next step for the engineer>",
  "relevantEvidence": ["<short bullet>", "<short bullet>"]
}`;
}

export async function triageFailure(data: ExtractedTraceData): Promise<TriageResult> {
  const prompt = buildPrompt(data);

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3",
    prompt,
    stream: false 
  });

  if (!response.data || !response.data.response) {
    throw new Error("Ollama returned empty response");
  }

  const rawText: string = response.data.response || '{}';

  let parsed: any;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    console.error("Failed to parse Ollama response, falling back:", rawText);
    parsed = {
      category: "ENVIRONMENT_FLAKE",
      confidence: 0.5,
      summary: "Fallback classification",
      reasoning: rawText,
      suggestedFix: null,
      relevantEvidence: []
    };
  }

  const validCategories: FailureCategory[] = ['PRODUCT_BUG', 'AUTOMATION_BUG', 'ENVIRONMENT_FLAKE'];
  const category: FailureCategory = validCategories.includes(parsed.category) ? parsed.category : 'AUTOMATION_BUG';

  return {
    category,
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
    summary: parsed.summary ?? 'No summary produced.',
    reasoning: parsed.reasoning ?? '',
    suggestedFix: parsed.suggestedFix,
    relevantEvidence: Array.isArray(parsed.relevantEvidence) ? parsed.relevantEvidence : [],
  };
}
