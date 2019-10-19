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

    const ComputedModules: string[] = modules.split(", ")

    ComputedModules.forEach(async function(module: string) {
        if (module === "IssueGreeter") await IssueGreeter(client);
        if (module === "PullLabler") await PullLabler(client);
        if (module === "PullGreeter") await PullGreeter(client);
        if (module === "HacktoberFest") await HacktoberFest(client);
    })



}