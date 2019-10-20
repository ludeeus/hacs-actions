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
function PythonScriptCheck(owner, repo, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.repos.getContents({
                owner: owner,
                repo: repo,
                path: "python_script"
            });
            core.info(`✅  python_script dir exist`);
        }
        catch (error) {
            core.setFailed(`❌  python_script dir exist`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: `The [python_script directory](https://hacs.xyz/docs/publish/python_script#repository-structure) does not exist.`
            });
            return;
        }
    });
}
exports.PythonScriptCheck = PythonScriptCheck;