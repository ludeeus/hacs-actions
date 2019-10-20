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
const github = __importStar(require("@actions/github"));
const Greeter_1 = require("./packs/Greeter");
const HacktoberFest_1 = require("./packs/HacktoberFest");
const contexts_1 = require("./misc/contexts");
const common_1 = require("./checks/common");
function ExecuteAction() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new github.GitHub(core.getInput('github-token', { required: true }));
            const repository = core.getInput('repository');
            const category = core.getInput('category');
            if (repository.length !== 0
                && category.length !== 0 && contexts_1.Payload.action !== "closed") {
                var owner = repository.split("/")[0];
                var repo = repository.split("/")[1];
                yield common_1.CommonCheck(owner, repo, category, client);
                return;
            }
            if (contexts_1.IssuePayload !== undefined)
                yield IssueActions(client);
            if (contexts_1.PullPayload !== undefined)
                yield PullRequestActions(client);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
function IssueActions(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running IssueActions");
        yield Greeter_1.IssueGreeter(client);
    });
}
function PullRequestActions(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running PullRequestActions");
        yield Greeter_1.PullGreeter(client);
        yield HacktoberFest_1.HacktoberFest(client);
    });
}
ExecuteAction();
