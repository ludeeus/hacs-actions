import * as github from '@actions/github';
import * as core from '@actions/core';
import { Issue } from "../misc/contexts"

export async function ThemeCheck(owner: string, repo: string, client: github.GitHub) {

    try {
        await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: "themes"
        })
        core.info(`✅  Theme dir exist`);
    } catch (error) {
        core.setFailed(`❌  Theme dir exist`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `The [themes directory](https://hacs.xyz/docs/publish/theme#repository-structure) does not exist.`
          });
        return
    }
}