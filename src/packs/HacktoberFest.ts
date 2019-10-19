/* eslint-disable TS2339 */
import * as github from '@actions/github';
import { HacktoberFestMessage }  from "../misc/messages"
import { Issue, Payload, PullPayload } from "../misc/contexts"

const isHacktoberfestLive = () => new Date().getMonth() == 9;

export async function HacktoberFest(client: github.GitHub) {
    if (isHacktoberfestLive) {
        if (Payload.action == "opened") {
            console.log(`Adding HacktoberFest message to #${Issue.number}`)
            await client.issues.createComment({
              owner: Issue.owner,
              repo: Issue.repo,
              issue_number: Issue.number,
              body: HacktoberFestMessage
            });

            console.log("Adding Hacktoberfest label")
            await client.issues.addLabels({
              owner: Issue.owner,
              repo: Issue.repo,
                issue_number: Issue.number,
                labels: ["Hacktoberfest"]
              })
        }

        if (Payload.action == "closed" && !PullPayload!.merged) {
          console.log("Removing Hactoberfest label")
            await client.issues.removeLabel({
              owner: Issue.owner,
              repo: Issue.repo,
                issue_number: Issue.number,
                name: "Hacktoberfest"
              })

            await client.issues.addLabels({
              owner: Issue.owner,
              repo: Issue.repo,
              issue_number: Issue.number,
              labels: ["invalid"]
            })
        }
    }
}