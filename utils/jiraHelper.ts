import JiraClient from 'jira-client';
import dotenv from 'dotenv';

dotenv.config();

const jiraHost = process.env.JIRA_HOST;
const jiraUser = process.env.JIRA_USER || process.env.JIRA_EMAIL;
const jiraPassword = process.env.JIRA_TOKEN || process.env.JIRA_API_TOKEN;

console.log('[JIRA_CONFIG] JIRA_HOST =', jiraHost || 'MISSING');
console.log('[JIRA_CONFIG] JIRA_USER =', jiraUser || 'MISSING');
console.log('[JIRA_CONFIG] JIRA_TOKEN =', jiraPassword ? 'SET' : 'MISSING');

export const jira = new JiraClient({
  protocol: 'https',
  host: jiraHost || 'ignore',
  username: jiraUser,
  password: jiraPassword,
  apiVersion: '2',
  strictSSL: true,
});

export async function createJiraIssue(summary: string, description: string) {
  const projectKey = process.env.JIRA_PROJECT_KEY || 'SCRUM';

  return jira.addNewIssue({
    fields: {
      project: { key: projectKey },
      summary,
      description,
      issuetype: { name: 'Story' },
    },
  });
}

/**
 * Fetches a single Jira issue (story, bug, task, etc.) by key.
 * Returns the raw jira-client response - shape depends on your Jira
 * instance's API version/config (apiVersion '2' above), which usually
 * means `description` comes back as a plain string, but on some Jira
 * Cloud instances it can still come back as an ADF object even under
 * the v2 API path. `getIssueDescriptionText` below handles both cases.
 */
export async function getJiraIssue(issueKey: string) {
  if (!issueKey) {
    throw new Error('getJiraIssue: issueKey is required, e.g. "SCRUM-22"');
  }

  try {
    const issue = await (jira as any).findIssue(issueKey);
    return issue;
  } catch (err: any) {
    const message = err?.message || err;
    throw new Error(`Failed to fetch Jira issue "${issueKey}": ${message}`);
  }
}

/**
 * Normalizes the description field to plain-ish text/markdown regardless
 * of whether Jira returned a plain string or an ADF (Atlassian Document
 * Format) object.
 */
export function getIssueDescriptionText(description: any): string {
  if (!description) return '_No description provided._';

  // Plain string (typical for API v2 on older/classic Jira instances)
  if (typeof description === 'string') {
    return description.trim() || '_No description provided._';
  }

  // ADF object (ADF sometimes still returned even via v2 on newer Cloud sites)
  if (typeof description === 'object' && Array.isArray(description.content)) {
    return adfToPlainText(description);
  }

  return '_Description format not recognized._';
}

/**
 * Very small ADF -> text fallback, just enough to render paragraphs,
 * headings, and bullet lists readably in the markdown context file.
 * Not exhaustive - extend if your stories use tables/panels/etc.
 */
function adfToPlainText(node: any, depth = 0): string {
  if (!node) return '';

  if (node.type === 'text') {
    return node.text ?? '';
  }

  if (node.type === 'paragraph') {
    return (node.content || []).map((n: any) => adfToPlainText(n)).join('') + '\n\n';
  }

  if (node.type === 'heading') {
    const level = node.attrs?.level ?? 1;
    return '#'.repeat(level) + ' ' + (node.content || []).map((n: any) => adfToPlainText(n)).join('') + '\n\n';
  }

  if (node.type === 'bulletList' || node.type === 'orderedList') {
    return (node.content || [])
      .map((item: any) => '- ' + adfToPlainText(item, depth + 1).trim())
      .join('\n') + '\n\n';
  }

  if (node.type === 'listItem') {
    return (node.content || []).map((n: any) => adfToPlainText(n, depth)).join('').trim();
  }

  if (node.content) {
    return node.content.map((n: any) => adfToPlainText(n, depth)).join('');
  }

  return '';
}

