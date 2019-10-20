import * as github from '@actions/github';
import * as core from '@actions/core';
import { Issue } from "../misc/contexts"

export async function PythonScriptCheck(owner: string, repo: string, client: github.GitHub) {

    try {
        await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: "python_script"
        })
        core.info(`✅  python_script dir exist`);
    } catch (error) {
        core.setFailed(`❌  python_script dir exist`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `The [python_script directory](https://hacs.xyz/docs/publish/python_script#repository-structure) does not exist.`
          });
        return
    }
}