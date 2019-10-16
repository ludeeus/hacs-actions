import * as core from '@actions/core';
import * as github from '@actions/github';

import { CheckRepository } from "./packs/CheckRepository"
import { IssueGreeter } from "./packs/IssueGreeter"
import { PullGreeter } from "./packs/PullGreeter"
import { PullLabler } from "./packs/PullLabler"


export async function Selector(select: string, client: github.GitHub) {
    const repository: string = core.getInput('repository')
    const categoty: string = core.getInput('repository')

    if (select.length === 0) {
        core.setFailed("You need to add an action.");
    }

    if (repository && categoty) CheckRepository(repository, categoty);

    if (select === "IssueGreeter") await IssueGreeter(client);

    if (select === "PullLabler") await PullLabler(client);
    if (select === "PullGreeter") await PullGreeter(client);

}