import * as github from '@actions/github';
import * as core from '@actions/core';
import { Issue } from "../misc/contexts"

export async function AppDaemonCheck(owner: string, repo: string, client: github.GitHub) {

    try {
        await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: "apps"
        })
        core.info(`✅  Apps dir exist`);
    } catch (error) {
        core.setFailed(`❌  Apps dir exist`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `The [apps directory](https://hacs.xyz/docs/publish/appdaemon#repository-structure) does not exist.`
          });
        return
    }
}