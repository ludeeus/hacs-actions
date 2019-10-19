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
const CheckRepository_1 = require("./packs/CheckRepository");
const Greeter_1 = require("./packs/Greeter");
const PullLabler_1 = require("./packs/PullLabler");
const HacktoberFest_1 = require("./packs/HacktoberFest");
function Selector(modules, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = core.getInput('repository');
        const categoty = core.getInput('categoty');
        if (repository && categoty) {
            CheckRepository_1.CheckRepository(repository, categoty);
            return;
        }
        if (modules.length === 0) {
            core.setFailed("You need to add an action.");
        }
        const ComputedModules = modules.split(",");
        if (github.context.payload.issue !== undefined)
            yield IssueActions(ComputedModules, client);
        if (github.context.payload.pull_request !== undefined)
            yield PullRequestActions(ComputedModules, client);
    });
}
exports.Selector = Selector;
function IssueActions(modules, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const issue = github.context.payload.issue;
        modules.forEach(function (module) {
            return __awaiter(this, void 0, void 0, function* () {
                if (module.length !== 0) {
                    if (module.trim() === "IssueGreeter")
                        yield Greeter_1.IssueGreeter(client);
                    if (module.trim() === "HacktoberFest")
                        yield HacktoberFest_1.HacktoberFest(client);
                }
            });
        });
    });
}
function PullRequestActions(modules, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const pull = github.context.payload.pull_request;
        modules.forEach(function (module) {
            return __awaiter(this, void 0, void 0, function* () {
                if (module.length !== 0) {
                    if (module.trim() === "PullLabler")
                        yield PullLabler_1.PullLabler(client);
                    if (module.trim() === "PullGreeter")
                        yield Greeter_1.PullGreeter(client);
                    if (module.trim() === "HacktoberFest")
                        yield HacktoberFest_1.HacktoberFest(client);
                }
            });
        });
    });
}
