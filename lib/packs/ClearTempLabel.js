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
const contexts_1 = require("../misc/contexts");
function ClearTempLabel(client) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get current labels
        var activeLabels = yield client.issues.get({
            owner: contexts_1.Issue.owner,
            repo: contexts_1.Issue.repo,
            issue_number: contexts_1.Issue.number
        });
        activeLabels.data["labels"].forEach((element) => __awaiter(this, void 0, void 0, function* () {
            if (element.name === "recheck") {
                yield client.issues.removeLabel({
                    owner: contexts_1.Issue.owner,
                    repo: contexts_1.Issue.repo,
                    issue_number: contexts_1.Issue.number,
                    name: "recheck"
                });
            }
        }));
    });
}
exports.ClearTempLabel = ClearTempLabel;
