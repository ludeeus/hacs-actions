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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const rest_1 = __importDefault(require("@octokit/rest"));
//import { Sender } from "../misc/contexts"
const Sender = { login: "custom-components" };
const octokit = new rest_1.default({
//auth: `token ${core.getInput('github-token', {required: true})}`
});
function CommonCheck(owner = "custom-components", repo = "hacs") {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if repository exists
        try {
            var repository = yield octokit.repos.get({ owner: owner, repo: repo });
            core.info(`✅  Reporsitory exist at ${owner}/${repo}`);
        }
        catch (error) {
            core.setFailed(`❌  Reporsitory does not exist at ${owner}/${repo}`);
            return;
        }
        // Check if sender owns the repo.
        if (Sender !== undefined) {
            if (owner === Sender.login) {
                core.info(`✅  ${Sender.login} is the owner of ${owner}/${repo}`);
            }
            else {
                // TODO: Create a failed status check/"issue" message.
                core.error(`❌  ${Sender.login} is not the owner of ${owner}/${repo}`);
            }
        }
        // Check if repository is a fork
        if (!repository.data["fork"]) {
            core.info(`✅  Repository is not a fork.`);
        }
        else {
            // TODO: Create a failed status check/"issue" message.
            core.error(`❌  Repository is a fork.`);
        }
        // Check if repository has a description
        if (repository.data["description"].length !== 0) {
            core.info(`✅  Repository has a description.`);
        }
        else {
            core.error(`❌  Repository does not have a description (https://hacs.xyz/docs/publish/start#description).`);
            return;
        }
        // Get 'README'
        try {
            var ReadmeExists = false;
            var BaseFiles = yield octokit.repos.getContents({
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
            core.info(`✅  README exist.`);
        }
        catch (error) {
            core.setFailed(`❌  README does not exist (https://hacs.xyz/docs/publish/start#readme).`);
            return;
        }
        // Get 'hacs.json'
        try {
            var hacsManifest = yield octokit.repos.getContents({
                owner: owner,
                repo: repo,
                path: "hacs.json"
            });
            var decoded = JSON.parse(new Buffer(hacsManifest.data["content"], 'base64').toString('utf-8'));
            if (!decoded["name"])
                throw "Data not correct";
        }
        catch (error) {
            core.setFailed(`❌  hacs.json is missing data or does not exist (https://hacs.xyz/docs/publish/start#hacsjson).`);
            return;
        }
    });
}
exports.CommonCheck = CommonCheck;
CommonCheck();
