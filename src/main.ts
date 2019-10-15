import * as core from '@actions/core';
import * as github from '@actions/github';

import { PullLabler }  from "./packs/PullLabler"
import { getPrNumber }  from "./packs/getPrNumber"

async function run() {
  try {
    const token = core.getInput('github-token', {required: true});
    const prNumber = getPrNumber();
    const client = new github.GitHub(token);

    if (!prNumber) {
      console.log('Could not get pull request number from context, exiting');
      return;
    }

    await PullLabler(client, prNumber)


  } catch (error) {
    core.setFailed(error.message);
  }
}

run();



