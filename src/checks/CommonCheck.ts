import * as core from '@actions/core';
import * as github from '@actions/github';
import { Base64 } from 'js-base64';
import { Issue, Sender } from "../misc/contexts"
import { IntegartionCheck } from "./IntegartionCheck"
import { ThemeCheck } from "./ThemeCheck"
import { PluginCheck } from "./PluginCheck"
import { AppDaemonCheck } from "./AppDaemonCheck"
import { PythonScriptCheck } from "./PythonScriptCheck"


export async function CommonCheck(owner: string, repo: string, category: string, client: github.GitHub) {

    console.log(`testing ${owner}/${repo} with category ${category}`)

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
        var hacsManifestDecoded = JSON.parse(Base64.decode(hacsManifest.data["content"]));

        if (!hacsManifestDecoded["name"]) throw "Data not correct";
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

    // Get INFO.md
    if (!hacsManifestDecoded["render_readme"]) {
        try {
            var InfoExists = false;
            var BaseFiles = await client.repos.getContents({
                owner: owner,
                repo: repo,
                path: ""
            });
    
            (BaseFiles.data as [any]).forEach(element => {
                if (String(element.name).toLowerCase() === "info") InfoExists = true;
                if (String(element.name).toLowerCase() === "info.md") InfoExists = true;
            });
    
            if (!InfoExists) throw "README does not exist";
    
            core.info(`✅  INFO`);
    
        } catch (error) {
            core.setFailed(`❌  INFO`);
            await client.issues.createComment({
                owner: Issue.owner,
                repo: Issue.repo,
                issue_number: Issue.number,
                body: `It does not look a [INFO](https://hacs.xyz/docs/publish/start#infomd) file exist in the repository.`
              });
            return
        }
    }


    // Category spesific checks.
    await CategoryChecks(category, owner, repo, client)

} 

async function CategoryChecks(category, owner, repo, client) {
    const validCategories = ["integration", "plugin", "theme", "appdaemon", "python_script", "list"]
    if (!validCategories.includes(category)) core.setFailed(`${category} is not valid. (${validCategories})`);

    
    if (category == "integration") await IntegartionCheck(owner, repo, client);
    if (category == "plugin") await PluginCheck(owner, repo, client);
    if (category == "theme") await ThemeCheck(owner, repo, client);
    if (category == "appdaemon") await AppDaemonCheck(owner, repo, client);
    if (category == "python_script") await PythonScriptCheck(owner, repo, client);
    if (category == "list") await IntegartionCheck(owner, repo, client);
}