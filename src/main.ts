import * as core from '@actions/core';
import * as github from '@actions/github';

import { PullLabler }  from "./packs/PullLabler"
import { getPrNumber, getIssueNumber }  from "./packs/getNumbers"

async function run() {
  var actionType: string = "pull";
  try {
    const token = core.getInput('github-token', {required: true});
    var actionNumber = getPrNumber();
    
    const client = new github.GitHub(token);

    if (!actionNumber) {
      actionNumber = getIssueNumber();
      actionType = "issue";
      if (!actionNumber) {
        console.log('Could not get pull request/issue number from context, exiting');
        return;
      }
    }

    if (actionType === "pull") {
      await PullLabler(client, actionNumber)
    } else if (actionType === "issue") {

    }
    


  } catch (error) {
    core.setFailed(error.message);
  }
}

run();



