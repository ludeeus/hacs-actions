import * as core from '@actions/core';
import * as github from '@actions/github';

import { IssueGreeter, PullGreeter } from "./packs/Greeter"
import { HacktoberFest } from "./packs/HacktoberFest"
import { PullPayload, IssuePayload } from "./misc/contexts"
import { CommonCheck } from "./checks/common"


async function ExecuteAction() {
  try {
    const client = new github.GitHub(core.getInput('github-token', {required: true}));
    const repository: string = core.getInput('repository')
    const categoty: string = core.getInput('categoty')

    if (repository && categoty) {
        await CommonCheck()
        return
    }

    if (IssuePayload !== undefined) await IssueActions(client);
    if (PullPayload !== undefined) await PullRequestActions(client);

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function IssueActions(client: github.GitHub) {
  console.log("Running IssueActions")
  await IssueGreeter(client);
}

async function PullRequestActions(client: github.GitHub) {
  console.log("Running PullRequestActions")
  await PullGreeter(client);
  await HacktoberFest(client);

}



ExecuteAction();
