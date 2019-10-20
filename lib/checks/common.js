"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const contexts_1 = require("../misc/contexts");
const IntegartionCheck_1 = require("./IntegartionCheck");
function CommonCheck(owner, repo, category, client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`testing ${owner}/${repo} with category ${category}`);
        // Check if repository exists
        try {
            var repository = yield client.repos.get({ owner: owner, repo: repo });
            core.info(`✅  Exist`);
        }
        catch (error) {
            core.setFailed(`❌  Exist`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `It does not look like ${owner}/${repo} exist.`
            });
            return;
        }
        // Check if sender owns the repo.
        if (contexts_1.Sender !== undefined) {
            if (owner === contexts_1.Sender.login) {
                core.info(`✅  Owner`);
            }
            else {
                core.error(`❌  Owner`);
                yield client.issues.createComment({
                    owner: contexts_1.Issue.owner,
                    repo: contexts_1.Issue.repo,
                    issue_number: contexts_1.Issue.number,
                    body: `It does not look like ${contexts_1.Sender.login} is the owner of of ${owner}/${repo}
                This _can_ be OK, but this PR would need an extra controll by one of the reviewers.`
                });
            }
        }
        // Check if repository is a fork
        if (!repository.data["fork"]) {
            core.info(`✅  Not a fork.`);
        }
        else {
            core.error(`❌  Not a fork.`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `It does not look like ${owner}/${repo} exist.`
            });
        }
        // Check if repository has a description
        if (repository.data["description"].length !== 0) {
            core.info(`✅  Repository has a description.`);
        }
        else {
            core.error(`❌  Description.`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `The repository ${owner}/${repo} does not have a [description](https://hacs.xyz/docs/publish/start#description).`
            });
            return;
        }
        // Get 'README'
        try {
            var ReadmeExists = false;
            var BaseFiles = yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: ""
            });
            BaseFiles.data.forEach(element => {
                if (String(element.name).toLowerCase() === "readme")
                    ReadmeExists = true;
                if (String(element.name).toLowerCase() === "readme.md")
                    ReadmeExists = true;
            });
            if (!ReadmeExists)
                throw "README does not exist";
            core.info(`✅  README`);
        }
        catch (error) {
            core.setFailed(`❌  README`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `It does not look a [README](https://hacs.xyz/docs/publish/start#readme) file exist in the repository.`
            });
            return;
        }
        // Get 'hacs.json'
        try {
            var hacsManifest = yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: "hacs.json"
            });
            var decoded = JSON.parse(new Buffer(hacsManifest.data["content"], 'base64').toString('utf-8'));
            if (!decoded["name"])
                throw "Data not correct";
            core.info(`✅  hacs.json`);
        }
        catch (error) {
            core.setFailed(`❌  hacs.json`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `[hacs.json](https://hacs.xyz/docs/publish/start#hacsjson) is missing from the repository.`
            });
            return;
        }
        if (category == "integration")
            yield IntegartionCheck_1.IntegartionCheck(owner, repo, client);
    });
}
exports.CommonCheck = CommonCheck;
