import * as github from '@actions/github';
import { NewPull }  from "./messages"

export async function PullGreeter(client: github.GitHub) {
    if (github.context.payload.action == "opened") {
      await client.issues.createComment({
        owner: github.context.issue.owner,
        repo: github.context.issue.repo,
        issue_number: github.context.issue.number,
        body: NewPull
      });
    }
}