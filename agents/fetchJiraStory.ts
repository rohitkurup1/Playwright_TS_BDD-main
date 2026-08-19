/**
 * fetchJiraStory.ts
 *
 * Fetches a Jira story using the project's existing jiraHelper (utils/jiraHelper.ts)
 * and writes a structured markdown context file. This .md file is the "spec" that
 * the Planner agent reads to generate the test plan, which the Generator agent
 * then converts into feature files + step definitions.
 *
 * Usage:
 *   npx ts-node agents/fetchJiraStory.ts SCRUM-22
 *
 * Output:
 *   agents/context/<ISSUE_KEY>.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { getJiraIssue, getIssueDescriptionText } from '../utils/jiraHelper';

function buildMarkdown(issue: any): string {
  const f = issue.fields;
  const descriptionMd = getIssueDescriptionText(f.description);

  const subtasksMd =
    f.subtasks && f.subtasks.length > 0
      ? f.subtasks
          .map((st: any) => `- [${st.key}] ${st.fields.summary} _(${st.fields.status?.name ?? 'Unknown'})_`)
          .join('\n')
      : '_None_';

  return `# ${issue.key}: ${f.summary}

## Metadata
- **Type**: ${f.issuetype?.name ?? 'Unknown'}
- **Status**: ${f.status?.name ?? 'Unknown'}
- **Priority**: ${f.priority?.name ?? 'Not set'}
- **Assignee**: ${f.assignee?.displayName ?? 'Unassigned'}
- **Reporter**: ${f.reporter?.displayName ?? 'Unknown'}
- **Labels**: ${f.labels && f.labels.length > 0 ? f.labels.join(', ') : 'None'}
- **Jira URL**: https://${process.env.JIRA_HOST}/browse/${issue.key}

## Description (includes Acceptance Criteria, if written inline)
${descriptionMd}

## Subtasks
${subtasksMd}

---
_Fetched automatically for use as Planner-agent input. Re-run this script if the
Jira story changes - do not hand-edit this file, your changes will be overwritten._
`;
}

async function main() {
  const issueKey = process.argv[2];

  if (!issueKey) {
    console.error('Usage: npx ts-node agents/fetchJiraStory.ts <ISSUE_KEY>');
    console.error('Example: npx ts-node agents/fetchJiraStory.ts SCRUM-22');
    process.exit(1);
  }

  console.log(`Fetching ${issueKey} from Jira...`);

  try {
    const issue = await getJiraIssue(issueKey);
    const markdown = buildMarkdown(issue);

    const outDir = path.resolve(process.cwd(), 'agents', 'context');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outPath = path.join(outDir, `${issue.key}.md`);
    fs.writeFileSync(outPath, markdown, 'utf-8');

    console.log(`✅ Wrote context file: ${outPath}`);
  } catch (err: any) {
    console.error(`❌ Failed to fetch/process ${issueKey}:`);
    console.error(err.message ?? err);
    process.exit(1);
  }
}

main();