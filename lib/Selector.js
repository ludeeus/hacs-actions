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
const CheckRepository_1 = require("./misc/CheckRepository");
const Greeter_1 = require("./packs/Greeter");
const HacktoberFest_1 = require("./packs/HacktoberFest");
const contexts_1 = require("./misc/contexts");
function Selector(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running Selector");
        const repository = core.getInput('repository');
        const categoty = core.getInput('categoty');
        if (repository && categoty) {
            CheckRepository_1.CheckRepository(repository, categoty);
            return;
        }
        if (contexts_1.IssuePayload !== undefined)
            yield IssueActions(client);
        if (contexts_1.PullPayload !== undefined)
            yield PullRequestActions(client);
    });
}
exports.Selector = Selector;
function IssueActions(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running IssueActions");
        const issue = contexts_1.IssuePayload;
        yield Greeter_1.IssueGreeter(client);
    });
}
function PullRequestActions(client) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running PullRequestActions");
        const pull = contexts_1.PullPayload;
        yield Greeter_1.PullGreeter(client);
        yield HacktoberFest_1.HacktoberFest(client);
    });
}
