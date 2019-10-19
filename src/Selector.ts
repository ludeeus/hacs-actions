import * as core from '@actions/core';
import * as github from '@actions/github';

import { CheckRepository } from "./packs/CheckRepository"
import { IssueGreeter, PullGreeter } from "./packs/Greeter"
import { PullLabler } from "./packs/PullLabler"
import { HacktoberFest } from "./packs/HacktoberFest"


export async function Selector(client: github.GitHub) {
    const repository: string = core.getInput('repository')
    const categoty: string = core.getInput('categoty')

    if (repository && categoty) {
        CheckRepository(repository, categoty);
        return
    }

    if (github.context.payload.issue !== undefined) await IssueActions(client);
    if (github.context.payload.pull_request !== undefined) await PullRequestActions(client);
}


async function IssueActions(client: github.GitHub) {
    const issue = github.context.payload.issue;

    await IssueGreeter(client);
    await HacktoberFest(client);

}

async function PullRequestActions(client: github.GitHub) {
    const pull = github.context.payload.pull_request;

    await PullLabler(client);
    await PullGreeter(client);
    await HacktoberFest(client);

}