import * as github from '@actions/github';
import { NewIssue, NewPull }  from "../misc/messages"
import { Issue, Payload } from "../misc/contexts"

export async function IssueGreeter(client: github.GitHub) {
    if (Payload.action == "opened") {
      console.log(`Adding greeter message to #${Issue.number}`)
      await client.issues.createComment({
        owner: Issue.owner,
        repo: Issue.repo,
        issue_number: Issue.number,
        body: NewIssue
      });
    }
}

export async function PullGreeter(client: github.GitHub) {
  if (Payload.action == "opened") {
    console.log(`Adding greeter message to #${Issue.number}`)
    await client.issues.createComment({
      owner: Issue.owner,
      repo: Issue.repo,
      issue_number: Issue.number,
      body: NewPull
    });
  }
}