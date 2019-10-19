"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
exports.Repo = github.context.repo;
exports.Issue = github.context.issue;
exports.Payload = github.context.payload;
exports.PullPayload = exports.Payload.pull_request;
exports.IssuePayload = exports.Payload.issue;
