import * as github from '@actions/github';
import { PullLabler }  from "./packs/PullLabler"
import { NewPull }  from "./packs/messages"

export async function pullRequest(client: github.GitHub) {
    const pull: {owner: string; repo: string; number: number} = github.context.issue;
    await PullLabler(client, pull.number)

    if (github.context.payload.action == "opened") {
      await client.issues.createComment({
        owner: pull.owner,
        repo: pull.repo,
        issue_number: pull.number,
        body: NewPull
      });
    }
}