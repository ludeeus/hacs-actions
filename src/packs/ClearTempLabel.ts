import * as github from '@actions/github';
import { Issue } from "../misc/contexts"

export async function ClearTempLabel(client: github.GitHub) {
          // Get current labels
          var activeLabels = await client.issues.get({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number
          })

          activeLabels.data["labels"].forEach(async element => {
            if (element.name === "recheck" ) {
              await client.issues.removeLabel({
                owner: Issue.owner,
                repo: Issue.repo,
                issue_number: Issue.number,
                name: "recheck"
                })
            }
          })
}