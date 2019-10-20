import * as core from '@actions/core';
import * as github from '@actions/github';

import { IssueGreeter, PullGreeter } from "./packs/Greeter"
import { HacktoberFest } from "./packs/HacktoberFest"
import { Payload, PullPayload, IssuePayload } from "./misc/contexts"
import { CommonCheck } from "./checks/common"
import { NewDefaultRepository } from "./packs/NewDefaultRepository"


async function ExecuteAction() {
  try {
    const client = new github.GitHub(core.getInput('github-token', {required: true}));
    const repository: string = core.getInput('repository')
    const category: string = core.getInput('category')

    if (repository.length !== 0 
      && category.length !== 0 && Payload.action !== "closed") {
        var owner = repository.split("/")[0]
        var repo = repository.split("/")[1]
        await CommonCheck(owner, repo, category, client)
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
  await NewDefaultRepository(client)

}



ExecuteAction();
