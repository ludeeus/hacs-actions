import * as github from '@actions/github';

import { getChangedFiles }  from "./misc/getChangedFiles"

export async function PullLabler(client: github.GitHub) {
    console.log("Running PullLabler")

    var labels: string[] = []

    const ChangedFiles: string[] = await getChangedFiles(client, github.context.issue.number);

    console.log("Changed files");
    console.log(String(ChangedFiles));

    ChangedFiles.forEach(function(file) {
      if (file.startsWith("documentation")) labels.push("Documentation");
      if (file.endsWith(".py")) labels.push("Backend");
      if (file.startsWith("frontend")) labels.push("Frontend");
      if (file.startsWith("custom_components/hacs/frontend/")) labels.push("Frontend");
    })

    console.log("Adding lables");
    console.log(String(labels));

    if (labels.length !== 0) {
      await client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.issue.number,
        labels: labels
      })};
  }