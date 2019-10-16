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
const core = __importStar(require("@actions/core"));
const CheckRepository_1 = require("./packs/CheckRepository");
const IssueGreeter_1 = require("./packs/IssueGreeter");
const PullGreeter_1 = require("./packs/PullGreeter");
const PullLabler_1 = require("./packs/PullLabler");
function Selector(select, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = core.getInput('repository');
        const categoty = core.getInput('repository');
        if (select.length === 0) {
            core.setFailed("You need to add an action.");
        }
        if (repository && categoty)
            CheckRepository_1.CheckRepository(repository, categoty);
        if (select === "IssueGreeter")
            yield IssueGreeter_1.IssueGreeter(client);
        if (select === "PullLabler")
            yield PullLabler_1.PullLabler(client);
        if (select === "PullGreeter")
            yield PullGreeter_1.PullGreeter(client);
    });
}
exports.Selector = Selector;
