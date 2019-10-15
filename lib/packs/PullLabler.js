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
const github = __importStar(require("@actions/github"));
const getChangedFiles_1 = require("./getChangedFiles");
function PullLabler(client, prNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        var labels = [];
        const ChangedFiles = yield getChangedFiles_1.getChangedFiles(client, prNumber);
        console.log("Changed files");
        console.log(String(ChangedFiles));
        ChangedFiles.forEach(function (file) {
            if (file.startsWith("documentation"))
                labels.push("Documentation");
            if (file.startsWith("custom_components"))
                labels.push("Backend");
            if (file.startsWith("frontend"))
                labels.push("Frontend");
        });
        console.log("Adding lables");
        console.log(String(labels));
        if (labels.length !== 0) {
            yield client.issues.addLabels({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                issue_number: prNumber,
                labels: labels
            });
        }
        ;
    });
}
exports.PullLabler = PullLabler;
