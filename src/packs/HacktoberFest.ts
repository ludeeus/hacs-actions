/* eslint-disable TS2339 */
import * as github from '@actions/github';
import { HacktoberFestMessage }  from "../misc/messages"
import { Issue, Payload, PullPayload } from "../misc/contexts"

const isHacktoberfestLive = () => new Date().getMonth() == 9;

export async function HacktoberFest(client: github.GitHub) {
    if (isHacktoberfestLive) {

        // Make sure we have a Hacktoberfest label

        var currentLabels = await client.issues.listLabelsForRepo({
          owner: Issue.owner,
          repo: Issue.repo
        })

        var hacktoberfestExsist = false
        currentLabels.data.forEach(element => {
          if (element.name.toLocaleLowerCase() === "hacktoberfest" ) hacktoberfestExsist = true;
        });

        if (hacktoberfestExsist) {
          await client.issues.updateLabel({
            owner: Issue.owner,
            repo: Issue.repo,
            current_name: "hacktoberfest",
            name: "Hacktoberfest",
            color: "ff5500"
          })
        } else {
          await client.issues.createLabel({
            owner: Issue.owner,
            repo: Issue.repo,
            name: "Hacktoberfest",
            color: "ff5500"
          })
        }

        if (Payload.action == "opened" || Payload.action == "reopened") {
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
          // Get current labels
          var activeLabels = await client.issues.get({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number
          })

          activeLabels.data["labels"].forEach(async element => {
            if (element.name === "Hacktoberfest" )
              await client.issues.removeLabel({
                owner: Issue.owner,
                repo: Issue.repo,
                issue_number: Issue.number,
                name: "Hacktoberfest"
                })
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