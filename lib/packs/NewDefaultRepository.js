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
const github = __importStar(require("@actions/github"));
const contexts_1 = require("../misc/contexts");
const CommonCheck_1 = require("../checks/CommonCheck");
const js_base64_1 = require("js-base64");
function NewDefaultRepository(client) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Enable the real check
        //if (github.context.repo.owner === "hacs" && github.context.repo.repo === "repositories") {
        if (github.context.repo.owner !== "hacs" && github.context.repo.repo !== "repositories") {
            console.log("Running NewDefaultRepository");
            // Get Changed files
            var changedFiles = yield getChangedFiles(client, contexts_1.Issue.number);
            changedFiles.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                var changed = yield getFileDiff(client, contexts_1.Issue.number, element);
                var owner = changed[0].split("/")[0];
                var repo = changed[0].split("/")[1];
                yield CommonCheck_1.CommonCheck(owner, repo, element, client);
            }));
        }
    });
}
exports.NewDefaultRepository = NewDefaultRepository;
function getChangedFiles(client, prNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const listFilesResponse = yield client.pulls.listFiles({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: prNumber
        });
        const changedFiles = listFilesResponse.data.map(f => f.filename);
        return changedFiles;
    });
}
function getFileDiff(client, prNumber, file) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: Pull } = yield client.pulls.get({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            pull_number: prNumber
        });
        const PullRef = Pull["head"]["sha"];
        const { data: ChangedContents } = yield client.repos.getContents({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: file,
            ref: PullRef
        });
        var ChangedDecoded = JSON.parse(js_base64_1.Base64.decode(ChangedContents["content"]));
        const { data: Contents } = yield client.repos.getContents({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            path: file
        });
        var Decoded = JSON.parse(js_base64_1.Base64.decode(Contents["content"]));
        var NewItems = [];
        ChangedDecoded.forEach(element => {
            if (!Decoded.includes(element))
                NewItems.push(element);
        });
        return NewItems;
    });
}
