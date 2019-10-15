import * as github from '@actions/github';
import { NewIssue }  from "./packs/messages"

export async function Issue(client: github.GitHub) {
    const issue: {owner: string; repo: string; number: number} = github.context.issue;

    if (github.context.payload.action == "opened") {
      await client.issues.createComment({
        owner: issue.owner,
        repo: issue.repo,
        issue_number: issue.number,
        body: NewIssue
      });
    }
}