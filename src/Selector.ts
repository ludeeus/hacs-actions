import * as core from '@actions/core';
import * as github from '@actions/github';

import { CheckRepository } from "./packs/CheckRepository"
import { IssueGreeter, PullGreeter } from "./packs/Greeter"
import { PullLabler } from "./packs/PullLabler"


export async function Selector(select: string, client: github.GitHub) {
    const repository: string = core.getInput('repository')
    const categoty: string = core.getInput('categoty')

    if (repository && categoty) {
        CheckRepository(repository, categoty);
        return
    }

    if (select.length === 0) {
        core.setFailed("You need to add an action.");
    }

    if (select === "IssueGreeter") await IssueGreeter(client);

    if (select === "PullLabler") await PullLabler(client);
    if (select === "PullGreeter") await PullGreeter(client);

}