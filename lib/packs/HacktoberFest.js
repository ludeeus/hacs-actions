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
const isHacktoberfestLive = () => new Date().getMonth() == 9;
function HacktoberFest(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (isHacktoberfestLive) {
            if (contexts_1.Payload.action == "opened") {
                console.log(`Adding HacktoberFest message to #${contexts_1.Issue.number}`);
                yield client.issues.createComment({
                    owner: contexts_1.Issue.owner,
                    repo: contexts_1.Issue.repo,
                    issue_number: contexts_1.Issue.number,
                    body: messages_1.HacktoberFestMessage
                });
                console.log("Adding Hacktoberfest label");
                yield client.issues.addLabels({
                    owner: contexts_1.Issue.owner,
                    repo: contexts_1.Issue.repo,
                    issue_number: contexts_1.Issue.number,
                    labels: ["Hacktoberfest"]
                });
            }
            if (contexts_1.Payload.action == "closed" && !contexts_1.PullPayload.merged) {
                console.log("Removing Hactoberfest label");
                // Get current labels
                var currentLabels = yield client.issues.get({
                    owner: contexts_1.Issue.owner,
                    repo: contexts_1.Issue.repo,
                    issue_number: contexts_1.Issue.number
                });
                currentLabels.data["labels"].forEach((element) => __awaiter(this, void 0, void 0, function* () {
                    if (element.name === "Hacktoberfest")
                        yield client.issues.removeLabel({
                            owner: contexts_1.Issue.owner,
                            repo: contexts_1.Issue.repo,
                            issue_number: contexts_1.Issue.number,
                            name: "Hacktoberfest"
                        });
                }));
                yield client.issues.addLabels({
                    owner: contexts_1.Issue.owner,
                    repo: contexts_1.Issue.repo,
                    issue_number: contexts_1.Issue.number,
                    labels: ["invalid"]
                });
            }
        }
    });
}
exports.HacktoberFest = HacktoberFest;
