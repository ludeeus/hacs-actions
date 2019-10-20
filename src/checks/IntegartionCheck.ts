import * as github from '@actions/github';
import * as core from '@actions/core';
import { Issue } from "../misc/contexts"

export async function IntegartionCheck(owner: string, repo: string, client: github.GitHub) {

    // Get the integration
    try {
        var Integration = await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: "custom_components"
        })
        core.info(`✅  Integration exist`);
    } catch (error) {
        core.setFailed(`❌  Integration exist`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `Integration does not exist in the [custom_component](https://hacs.xyz/docs/publish/integration#repository-structure) directory`
          });
        return
    }

    // Get the integration manifest
    try {
        var IntegrationManifest = await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: Integration.data[0].path + "/manifest.json"
        })
        var decoded = JSON.parse(new Buffer(IntegrationManifest.data["content"], 'base64').toString('utf-8'));

        if (!decoded["domain"]) throw "wrong manifest"

        core.info(`✅  Integration manifest exist`);
    } catch (error) {
        core.setFailed(`❌  Integration manifest exist`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `Integration [manifest](https://hacs.xyz/docs/publish/integration#manifestjson) does not exist.`
          });
        return
    }
}