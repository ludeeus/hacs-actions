import * as github from '@actions/github';
import { Issue } from "../misc/contexts"

export async function NewDefaultRepository(client: github.GitHub) {
    console.log("Running NewDefaultRepository")
    if (github.context.repo.owner !== "hacs" && github.context.repo.repo !== "repositories") {

        // Get diff
        const { data: Diff } = await client.pulls.get({
            owner: Issue.owner,
            repo: Issue.repo,
            pull_number: Issue.number,
            mediaType: {
              format: "diff"
            }
          });
          console.log(Diff)
    }
}