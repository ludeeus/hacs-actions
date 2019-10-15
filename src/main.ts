import * as core from '@actions/core';
import * as github from '@actions/github';

import { PullLabler }  from "./packs/PullLabler"
import { getPrNumber, getIssueNumber }  from "./packs/getNumbers"
import { NewIssue }  from "./packs/messages"

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
      await PullLabler(client, actionNumber)
    } else if (actionType === "issue") {
      const issue: {owner: string; repo: string; number: number} = github.context.issue;

      if (github.context.payload.action == "opened") {
        await client.issues.createComment({
          owner: issue.owner,
          repo: issue.repo,
          issue_number: actionNumber,
          body: NewIssue
        });
      }
    }
    


  } catch (error) {
    core.setFailed(error.message);
  }
}

run();



