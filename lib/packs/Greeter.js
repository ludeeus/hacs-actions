"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
const messages_1 = require("./messages");
function IssueGreeter(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (github.context.payload.action == "opened") {
            console.log(`Adding greeter message to #${github.context.issue.number}`);
            yield client.issues.createComment({
                owner: github.context.issue.owner,
                repo: github.context.issue.repo,
                issue_number: github.context.issue.number,
                body: messages_1.NewIssue
            });
        }
    });
}
exports.IssueGreeter = IssueGreeter;
function PullGreeter(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (github.context.payload.action == "opened") {
            console.log(`Adding greeter message to #${github.context.issue.number}`);
            yield client.issues.createComment({
                owner: github.context.issue.owner,
                repo: github.context.issue.repo,
                issue_number: github.context.issue.number,
                body: messages_1.NewPull
            });
        }
    });
}
exports.PullGreeter = PullGreeter;
