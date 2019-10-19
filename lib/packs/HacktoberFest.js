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
/* eslint-disable TS2339 */
const github = __importStar(require("@actions/github"));
const messages_1 = require("./messages");
const isHacktoberfestLive = () => new Date().getMonth() == 9;
function HacktoberFest(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const PR = github.context.payload.pull_request;
        if (isHacktoberfestLive) {
            if (github.context.payload.action == "opened") {
                console.log(`Adding HacktoberFest message to #${github.context.issue.number}`);
                yield client.issues.createComment({
                    owner: github.context.issue.owner,
                    repo: github.context.issue.repo,
                    issue_number: github.context.issue.number,
                    body: messages_1.HacktoberFestMessage
                });
                console.log("Adding Hacktoberfest label");
                yield client.issues.addLabels({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    issue_number: github.context.issue.number,
                    labels: ["Hacktoberfest"]
                });
            }
            else if (github.context.payload.action == "closed" && !PR.merged) {
                console.log("Removing Hactoberfest label");
                yield client.issues.removeLabel({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    issue_number: github.context.issue.number,
                    name: "Hacktoberfest"
                });
                yield client.issues.addLabels({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    issue_number: github.context.issue.number,
                    labels: ["invalid"]
                });
            }
        }
    });
}
exports.HacktoberFest = HacktoberFest;
