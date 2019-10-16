import * as github from '@actions/github';
import { NewIssue, NewPull }  from "./messages"

export async function IssueGreeter(client: github.GitHub) {
    if (github.context.payload.action == "opened") {
      console.log(`Adding greeter message to #${github.context.issue.number}`)
      await client.issues.createComment({
        owner: github.context.issue.owner,
        repo: github.context.issue.repo,
        issue_number: github.context.issue.number,
        body: NewIssue
      });
    }
}

export async function PullGreeter(client: github.GitHub) {
  if (github.context.payload.action == "opened") {
    console.log(`Adding greeter message to #${github.context.issue.number}`)
    await client.issues.createComment({
      owner: github.context.issue.owner,
      repo: github.context.issue.repo,
      issue_number: github.context.issue.number,
      body: NewPull
    });
  }
}