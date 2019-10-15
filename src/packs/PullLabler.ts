import * as core from '@actions/core';
import * as github from '@actions/github';

import { getChangedFiles }  from "./getChangedFiles"

export async function PullLabler(client: github.GitHub, prNumber: number) {

    var labels: string[] = []

    const ChangedFiles: string[] = await getChangedFiles(client, prNumber);

    core.debug("Changed files");
    core.debug(String(ChangedFiles));

    core.debug("Adding lables");
    core.debug(String(labels));

    if (labels) {
      await client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: prNumber,
        labels: labels
      })};
  }