import * as github from '@actions/github';
import * as core from '@actions/core';
import { Base64 } from 'js-base64';
import { Issue } from "../misc/contexts"

export async function PluginCheck(owner: string, repo: string, client: github.GitHub) {
    await CheckImportType(owner, repo, client)
    await CheckPluginLocation(owner, repo, client)
}


async function CheckImportType(owner: string, repo: string, client: github.GitHub) {
    try {
        var BaseFiles = await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: ""
        });

        var readme: string = "";
        (BaseFiles.data as [any]).forEach(element => {
            if (String(element.name).toLowerCase() === "readme") readme = Base64.decode(element.content);
            if (String(element.name).toLowerCase() === "readme.md") readme = Base64.decode(element.content);
        });

        console.log(readme)
        if (readme.includes("type: module") || readme.includes("type: js")) {
            core.info(`✅  JS import type defined`);
        } else {
            throw "error"
        }

    } catch (error) {
        core.setFailed(`❌  JS import type defined`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `The repository README does not have info about how the plugin should be defined.\nhttps://hacs.xyz/docs/publish/plugin#import-type`
          });
        return
    }
}

async function CheckPluginLocation(owner: string, repo: string, client: github.GitHub) {
    var pluginExist = false
    try {
        if (!pluginExist) pluginExist = await CheckDist(owner, repo, client)
        if (!pluginExist) pluginExist = await CheckRelease(owner, repo, client)
        if (!pluginExist) pluginExist = await CheckRoot(owner, repo, client)

        if (!pluginExist) throw "error"
        core.info(`✅  Plugin exist`);
    } catch (error) {
        console.log(error)
        core.setFailed(`❌  Plugin exist`);
        await client.issues.createComment({
            owner: Issue.owner,
            repo: Issue.repo,
            issue_number: Issue.number,
            body: `The location of the plugin is in one of the expected locations\nhttps://hacs.xyz/docs/publish/plugin#repository-structure`
          });
        return
    }
}

async function CheckDist(owner: string, repo: string, client: github.GitHub) {
    var pluginExist = false
    const valid_names = [
        `${repo.replace("lovelace-", "")}.js`,
        `${repo}.js`,
        `${repo}.umd.js`,
        `${repo}-bundle.js`,
    ]
    try {
        var DistContents = await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: "dist"
        });

        (DistContents.data as [any]).forEach(element => {
            if (valid_names.includes(element.name)) pluginExist = true
        });
        if (pluginExist) return true;
    } catch (error) {
        core.debug(error)
    }
    return false
}

async function CheckRelease(owner: string, repo: string, client: github.GitHub) {
    var pluginExist = false
    const valid_names = [
        `${repo.replace("lovelace-", "")}.js`,
        `${repo}.js`,
        `${repo}.umd.js`,
        `${repo}-bundle.js`,
    ]
    try {
        var ReleaseContents = await client.repos.getLatestRelease({
            owner: owner,
            repo: repo
        });

        (ReleaseContents.data.assets as [any]).forEach(element => {
            if (valid_names.includes(element.name)) pluginExist = true
        });
        if (pluginExist) return true;
    } catch (error) {
        core.debug(error)
    }
    return false
}

async function CheckRoot(owner: string, repo: string, client: github.GitHub) {
    var pluginExist = false
    const valid_names = [
        `${repo.replace("lovelace-", "")}.js`,
        `${repo}.js`,
        `${repo}.umd.js`,
        `${repo}-bundle.js`,
    ]
    try {
        var RootContents = await client.repos.getContents({
            owner: owner,
            repo: repo,
            path: ""
        });

        (RootContents.data as [any]).forEach(element => {
            if (valid_names.includes(element.name)) pluginExist = true
        });
        if (pluginExist) return true;
    } catch (error) {
        core.debug(error)
    }
    return false
}