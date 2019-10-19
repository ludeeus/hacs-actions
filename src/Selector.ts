import * as core from '@actions/core';
import * as github from '@actions/github';

import { CheckRepository } from "./misc/CheckRepository"
import { IssueGreeter, PullGreeter } from "./packs/Greeter"
import { HacktoberFest } from "./packs/HacktoberFest"
import { PullPayload, IssuePayload } from "./misc/contexts"


export async function Selector(client: github.GitHub) {
    console.log("Running Selector")
    const repository: string = core.getInput('repository')
    const categoty: string = core.getInput('categoty')

    if (repository && categoty) {
        CheckRepository(repository, categoty);
        return
    }

    if (IssuePayload !== undefined) await IssueActions(client);
    if (PullPayload !== undefined) await PullRequestActions(client);
}


async function IssueActions(client: github.GitHub) {
    console.log("Running IssueActions")
    const issue = IssuePayload;

    await IssueGreeter(client);
}

async function PullRequestActions(client: github.GitHub) {
    console.log("Running PullRequestActions")
    const pull = PullPayload;

    await PullGreeter(client);
    await HacktoberFest(client);

}