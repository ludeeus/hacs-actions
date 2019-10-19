import * as github from '@actions/github';
import { HacktoberFestMessage }  from "./messages"

const isHacktoberfestLive = () => new Date().getMonth() == 9;

export async function HacktoberFest(client: github.GitHub) {
    const PR = github.context.payload.pull_request || undefined;
    if (isHacktoberfestLive && PR !== undefined ) {
        if (github.context.payload.action == "opened") {
            console.log(`Adding HacktoberFest message to #${github.context.issue.number}`)
            await client.issues.createComment({
              owner: github.context.issue.owner,
              repo: github.context.issue.repo,
              issue_number: github.context.issue.number,
              body: HacktoberFestMessage
            });
            await client.issues.addLabels({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: github.context.issue.number,
                labels: ["Hacktoberfest"]
              })
        } else if (github.context.payload.action == "closed" && !PR.merged) {
            await client.issues.removeLabel({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: github.context.issue.number,
                name: "Hacktoberfest"
              })
              await client.issues.addLabels({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: github.context.issue.number,
                labels: ["invalid"]
              })
        }
    }
}