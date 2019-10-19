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
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../misc/messages");
const contexts_1 = require("../misc/contexts");
function IssueGreeter(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (contexts_1.Payload.action == "opened") {
            console.log(`Adding greeter message to #${contexts_1.Issue.number}`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: messages_1.NewIssue
            });
        }
    });
}
exports.IssueGreeter = IssueGreeter;
function PullGreeter(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (contexts_1.Payload.action == "opened") {
            console.log(`Adding greeter message to #${contexts_1.Issue.number}`);
            yield client.issues.createComment({
                owner: contexts_1.Issue.owner,
                repo: contexts_1.Issue.repo,
                issue_number: contexts_1.Issue.number,
                body: messages_1.NewPull
            });
        }
    });
}
exports.PullGreeter = PullGreeter;
