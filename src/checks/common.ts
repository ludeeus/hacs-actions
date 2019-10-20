import * as core from '@actions/core';
import * as github from '@actions/github';
import { Issue, Sender } from "../misc/contexts"
import { IntegartionCheck } from "./IntegartionCheck"


export async function CommonCheck(owner: string, repo: string, category: string, client: github.GitHub) {

    // Check if repository exists
    try {
        var repository = await client.repos.get({owner: owner, repo: repo})
        core.info(`✅  Exist`)

    } catch (error) {
        core.setFailed(`❌  Exist`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `It does not look like ${owner}/${repo} exist.`
          });
        return
      }

    // Check if sender owns the repo.
    if (Sender !== undefined) {
        if (owner === Sender.login) {
            core.info(`✅  Owner`);
        } else {
            core.error(`❌  Owner`);
            await client.issues.createComment({
                owner: Issue.owner,
                repo: Issue.repo,
                issue_number: Issue.number,
                body: `It does not look like ${Sender!.login} is the owner of of ${owner}/${repo}
                This _can_ be OK, but this PR would need an extra controll by one of the reviewers.`
              });
        }
    }

    // Check if repository is a fork
    if (!repository.data["fork"]) {
        core.info(`✅  Not a fork.`);
    } else {
        core.error(`❌  Not a fork.`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `It does not look like ${owner}/${repo} exist.`
          });
    }

    // Check if repository has a description
    if (repository.data["description"].length !== 0) {
        core.info(`✅  Repository has a description.`);
    } else {
        core.error(`❌  Description.`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `The repository ${owner}/${repo} does not have a [description](https://hacs.xyz/docs/publish/start#description).`
          });
        return;
    }


    // Get 'README'
    try {
        var ReadmeExists = false;
        var BaseFiles = await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: ""
        });

        (BaseFiles.data as [any]).forEach(element => {
            if (String(element.name).toLowerCase() === "readme") ReadmeExists = true;
            if (String(element.name).toLowerCase() === "readme.md") ReadmeExists = true;
        });

        if (!ReadmeExists) throw "README does not exist";

        core.info(`✅  README`);

    } catch (error) {
        core.setFailed(`❌  README`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `It does not look a [README](https://hacs.xyz/docs/publish/start#readme) file exist in the repository.`
          });
        return
    }


    // Get 'hacs.json'
    try {
        var hacsManifest = await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: "hacs.json"
        })
        var decoded = JSON.parse(new Buffer(hacsManifest.data["content"], 'base64').toString('utf-8'));

        if (!decoded["name"]) throw "Data not correct";
        core.info(`✅  hacs.json`);
    } catch (error) {
        core.setFailed(`❌  hacs.json`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `[hacs.json](https://hacs.xyz/docs/publish/start#hacsjson) is missing from the repository.`
          });
        return
    }

    if (category == "integration") await IntegartionCheck(owner, repo, client);

} 
