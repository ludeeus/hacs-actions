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
function IntegartionCheck(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the integration
        try {
            var Integration = yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: "custom_components"
            });
            core.info(`✅  Integration exist`);
        }
        catch (error) {
            core.setFailed(`❌  Integration exist`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `Integration does not exist in the [custom_component](https://hacs.xyz/docs/publish/integration#repository-structure) directory`
            });
            return;
        }
        // Get the integration manifest
        try {
            var IntegrationManifest = yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: Integration.data[0].path + "/manifest.json"
            });
            var decoded = JSON.parse(new Buffer(IntegrationManifest.data["content"], 'base64').toString('utf-8'));
            if (!decoded["domain"])
                throw "wrong manifest";
            core.info(`✅  Integration manifest exist`);
        }
        catch (error) {
            core.setFailed(`❌  Integration manifest exist`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `Integration [manifest](https://hacs.xyz/docs/publish/integration#manifestjson) does not exist.`
            });
            return;
        }
    });
}
exports.IntegartionCheck = IntegartionCheck;
