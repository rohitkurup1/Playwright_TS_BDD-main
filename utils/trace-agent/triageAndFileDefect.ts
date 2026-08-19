import { parseTraceZip } from './traceParser';
import { triageFailure } from './triageEngine';
import type { TriageResult } from './types';
// Adjust this relative path to match where jiraHelper.ts actually lives
// relative to this file once you drop it into your repo.
import { createJiraIssue } from '../../utils/jiraHelper';

export interface TriageAndFileDefectParams {
  tracePath: string;
  scenarioName: string;
  testFile: string;
  errorMessage: string;
}

/**
 * Parses the trace.zip just written by the After hook, sends it to Gemini
 * for root-cause classification, and — unless it's environment flake —
 * files a Jira issue with the category and reasoning baked into the
 * description. Returns the triage result so the caller can attach it to
 * the Cucumber report even when no ticket is filed.
 *
 * Set LOG_JIRA=true to actually create tickets. Set
 * TRIAGE_SKIP_FLAKE=false to file tickets for flake too (defaults to
 * skipping — no point filing a ticket for a gateway timeout every run).
 */
export async function triageAndFileDefect(
  params: TriageAndFileDefectParams
): Promise<TriageResult | null> {
  let triage: TriageResult;

  try {
    const extracted = parseTraceZip({
      traceZipPath: params.tracePath,
      testTitle: params.scenarioName,
      testFile: params.testFile,
      errorMessage: params.errorMessage,
    });
    triage = await triageFailure(extracted);
  } catch (err) {
    console.error(`[trace-agent] Triage failed for "${params.scenarioName}":`, err);
    return null; // never let triage errors block the actual test run
  }

  console.log(
    `[trace-agent] "${params.scenarioName}" -> ${triage.category} (${(triage.confidence * 100).toFixed(0)}% confidence)`
  );

  const skipFlake = process.env.TRIAGE_SKIP_FLAKE !== 'false'; // default: true
  const shouldFile =
    process.env.LOG_JIRA === 'true' && !(skipFlake && triage.category === 'ENVIRONMENT_FLAKE');

  if (!shouldFile) {
    if (triage.category === 'ENVIRONMENT_FLAKE') {
      console.log(`[trace-agent] Skipping Jira ticket — classified as flake.`);
    }
    return triage;
  }

  const summary = `[${triage.category}] ${params.scenarioName}`;
  const description = [
    `*Root cause summary:* ${triage.summary}`,
    '',
    `*Category:* ${triage.category} (confidence ${(triage.confidence * 100).toFixed(0)}%)`,
    '',
    `*Reasoning:* ${triage.reasoning}`,
    ...(triage.suggestedFix ? ['', `*Suggested fix:* ${triage.suggestedFix}`] : []),
    ...(triage.relevantEvidence.length
      ? ['', '*Evidence:*', ...triage.relevantEvidence.map((e) => `- ${e}`)]
      : []),
    '',
    `*Scenario:* ${params.scenarioName}`,
    `*File:* ${params.testFile}`,
    `*Raw error:* ${params.errorMessage}`,
  ].join('\n');

  try {
    const issue = await createJiraIssue(summary, description);
    console.log('[trace-agent] Created Jira issue:', (issue as any)?.key || (issue as any)?.id || issue);
  } catch (err) {
    console.error('[trace-agent] Failed to create Jira issue:', err);
  }

  return triage;
}
