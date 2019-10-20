import * as core from '@actions/core';
import * as github from '@actions/github';
import Octokit from "@octokit/rest";
//import { Sender } from "../misc/contexts"

const Sender = {login: "custom-components"};

const octokit = new Octokit({
    //auth: `token ${core.getInput('github-token', {required: true})}`
})


export async function CommonCheck(owner: string = "custom-components", repo: string = "hacs") {

    // Check if repository exists
    try {
        var repository = await octokit.repos.get({owner: owner, repo: repo})
        core.info(`✅  Reporsitory exist at ${owner}/${repo}`)

    } catch (error) {
        core.setFailed(`❌  Reporsitory does not exist at ${owner}/${repo}`);
        return
      }

    // Check if sender owns the repo.
    if (Sender !== undefined) {
        if (owner !== Sender.login) {
            core.info(`✅  ${Sender.login} is the owner of ${owner}/${repo}`);
        } else {
            // TODO: Create a failed status check/"issue" message.
            await octokit.checks.create({
                owner: owner,
                repo: repo,
                name: "Submitter is owner, this can fail but will require a manual review.",
                head_sha: github.context.sha,
                conclusion: "action_required",
                details_url: ""
                
            })
            core.error(`❌  ${Sender.login} is not the owner of ${owner}/${repo}`);
        }
    }

    // Check if repository is a fork
    if (!repository.data["fork"]) {
        core.info(`✅  Repository is not a fork.`);
    } else {
        // TODO: Create a failed status check/"issue" message.
        core.error(`❌  Repository is a fork.`);
    }

    // Check if repository has a description
    if (repository.data["description"].length !== 0) {
        core.info(`✅  Repository has a description.`);
    } else {
        core.error(`❌  Repository does not have a description (https://hacs.xyz/docs/publish/start#description).`);
        return;
    }


    // Get 'README'
    try {
        var ReadmeExists = false;
        var BaseFiles = await octokit.repos.getContents({
            owner: owner,
            repo: repo,
            path: ""
        });

        (BaseFiles.data as [any]).forEach(element => {
            if (String(element.name).toLowerCase() === "readme") ReadmeExists = true;
            if (String(element.name).toLowerCase() === "readme.md") ReadmeExists = true;
        });

        if (!ReadmeExists) throw "README does not exist";

        core.info(`✅  README exist.`);

    } catch (error) {
        core.setFailed(`❌  README does not exist (https://hacs.xyz/docs/publish/start#readme).`);
        return
    }


    // Get 'hacs.json'
    try {
        var hacsManifest = await octokit.repos.getContents({
            owner: owner,
            repo: repo,
            path: "hacs.json"
        })
        var decoded = JSON.parse(new Buffer(hacsManifest.data["content"], 'base64').toString('utf-8'));

        if (!decoded["name"]) throw "Data not correct";
    } catch (error) {
        core.setFailed(`❌  hacs.json is missing data or does not exist (https://hacs.xyz/docs/publish/start#hacsjson).`);
        return
    }

} 


CommonCheck()