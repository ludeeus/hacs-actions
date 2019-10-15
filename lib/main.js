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
const github = __importStar(require("@actions/github"));
const PullLabler_1 = require("./packs/PullLabler");
const getNumbers_1 = require("./packs/getNumbers");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        var actionType = "pull";
        try {
            const token = core.getInput('github-token', { required: true });
            var actionNumber = getNumbers_1.getPrNumber();
            const client = new github.GitHub(token);
            if (!actionNumber) {
                actionNumber = getNumbers_1.getIssueNumber();
                actionType = "issue";
                if (!actionNumber) {
                    console.log('Could not get pull request/issue number from context, exiting');
                    return;
                }
            }
            if (actionType === "pull") {
                yield PullLabler_1.PullLabler(client, actionNumber);
            }
            else if (actionType === "issue") {
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
