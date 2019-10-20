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
const js_base64_1 = require("js-base64");
const contexts_1 = require("../misc/contexts");
function PluginCheck(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        yield CheckImportType(owner, repo, client);
        yield CheckPluginLocation(owner, repo, client);
    });
}
exports.PluginCheck = PluginCheck;
function CheckImportType(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var BaseFiles = yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: ""
            });
            var readme = "";
            BaseFiles.data.forEach(element => {
                if (String(element.name).toLowerCase() === "readme")
                    readme = js_base64_1.Base64.decode(element.content);
                if (String(element.name).toLowerCase() === "readme.md")
                    readme = js_base64_1.Base64.decode(element.content);
            });
            if (readme.length > 0) {
                if (readme.includes("type: module") || readme.includes("type: js")) {
                    core.info(`✅  JS import type defined`);
                }
                else {
                    throw "error";
                }
            }
        }
        catch (error) {
            core.setFailed(`❌  JS import type defined`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `The repository README does not have info about how the plugin should be defined.\nhttps://hacs.xyz/docs/publish/plugin#import-type`
            });
            return;
        }
    });
}
function CheckPluginLocation(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        var pluginExist = false;
        try {
            if (!pluginExist)
                pluginExist = yield CheckDist(owner, repo, client);
            if (!pluginExist)
                pluginExist = yield CheckRelease(owner, repo, client);
            if (!pluginExist)
                pluginExist = yield CheckRoot(owner, repo, client);
            if (!pluginExist)
                throw "error";
            core.info(`✅  Plugin exist`);
        }
        catch (error) {
            console.log(error);
            core.setFailed(`❌  Plugin exist`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `The location of the plugin is in one of the expected locations\nhttps://hacs.xyz/docs/publish/plugin#repository-structure`
            });
            return;
        }
    });
}
function CheckDist(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        var pluginExist = false;
        const valid_names = [
            `${repo.replace("lovelace-", "")}.js`,
            `${repo}.js`,
            `${repo}.umd.js`,
            `${repo}-bundle.js`,
        ];
        try {
            var DistContents = yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: "disc"
            });
            DistContents.data.forEach(element => {
                if (element.name.endswith(".js")) {
                    if (valid_names.includes(element.name))
                        pluginExist = true;
                }
            });
            if (pluginExist)
                return true;
        }
        catch (error) {
            core.debug(error);
        }
        return false;
    });
}
function CheckRelease(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        var pluginExist = false;
        const valid_names = [
            `${repo.replace("lovelace-", "")}.js`,
            `${repo}.js`,
            `${repo}.umd.js`,
            `${repo}-bundle.js`,
        ];
        try {
            var ReleaseContents = yield client.repos.getLatestRelease({
                owner: owner,
                repo: repo
            });
            ReleaseContents.data.assets.forEach(element => {
                if (element.name.endswith(".js")) {
                    if (valid_names.includes(element.name))
                        pluginExist = true;
                }
            });
            if (pluginExist)
                return true;
        }
        catch (error) {
            core.debug(error);
        }
        return false;
    });
}
function CheckRoot(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        var pluginExist = false;
        const valid_names = [
            `${repo.replace("lovelace-", "")}.js`,
            `${repo}.js`,
            `${repo}.umd.js`,
            `${repo}-bundle.js`,
        ];
        console.log(valid_names);
        try {
            var DistContents = yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: "disc"
            });
            DistContents.data.forEach(element => {
                console.log(element.name);
                if (element.name.endswith(".js")) {
                    if (valid_names.includes(element.name))
                        pluginExist = true;
                }
            });
            if (pluginExist)
                return true;
        }
        catch (error) {
            core.debug(error);
        }
        return false;
    });
}
