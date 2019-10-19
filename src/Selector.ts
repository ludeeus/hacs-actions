import * as core from '@actions/core';
import * as github from '@actions/github';

import { CheckRepository } from "./packs/CheckRepository"
import { IssueGreeter, PullGreeter } from "./packs/Greeter"
import { PullLabler } from "./packs/PullLabler"
import { HacktoberFest } from "./packs/HacktoberFest"


export async function Selector(modules: string, client: github.GitHub) {
    const repository: string = core.getInput('repository')
    const categoty: string = core.getInput('categoty')

    if (repository && categoty) {
        CheckRepository(repository, categoty);
        return
    }

    if (modules.length === 0) {
        core.setFailed("You need to add an action.");
    }

    const ComputedModules: string[] = modules.split(",")
    await IssueActions(ComputedModules, client)

    ComputedModules.forEach(async function(module: string) {
        if (module.length !== 0) {
            if (module.trim() === "IssueGreeter") await IssueGreeter(client);
            if (module.trim() === "PullLabler") await PullLabler(client);
            if (module.trim() === "PullGreeter") await PullGreeter(client);
            if (module.trim() === "HacktoberFest") await HacktoberFest(client);
        }
    })
}


async function IssueActions(modules: string[], client: github.GitHub) {
    console.log(`Type?: ${github.context.payload.issue}`)
    console.log(`Type?: ${github.context.payload.pull_request}`)
}

async function PullRequestActions(modules: string[], client: github.GitHub) {

}