import * as core from '@actions/core';
import * as github from '@actions/github';


import { getPrNumber, getIssueNumber }  from "./packs/getNumbers"

import { Issue } from "./issue"
import { pullRequest } from "./pullRequest"

async function run() {
  var actionType: string = "pull";
  try {
    const client = new github.GitHub(core.getInput('github-token', {required: true}));
    var actionNumber = getPrNumber();

    if (!actionNumber) {
      actionNumber = getIssueNumber();
      actionType = "issue";
      if (!actionNumber) {
        console.log('Could not get pull request/issue number from context, exiting');
        return;
      }
    }

    if (actionType === "pull") {
      await pullRequest(client)

    } else if (actionType === "issue") {
      await Issue(client)
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();



