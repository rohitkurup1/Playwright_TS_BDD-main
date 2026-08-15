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
