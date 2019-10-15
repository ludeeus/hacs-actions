import * as github from '@actions/github';

import { getChangedFiles }  from "./getChangedFiles"

export async function PullLabler(client: github.GitHub, prNumber: number) {

    var labels: string[] = []

    const ChangedFiles: string[] = await getChangedFiles(client, prNumber);

    console.log("Changed files");
    console.log(String(ChangedFiles));

    console.log("Adding lables");
    console.log(String(labels));

    if (labels.length !== 0) {
      await client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        labels: labels
      })};
  }