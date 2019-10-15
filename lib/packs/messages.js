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
exports.NewIssue = `
Hi ${github.context.payload.sender} 👋,
Make sure you have read the [issue guidelines](https://hacs.netlify.com/docs/issues) and that you filled out the **entire** template.
`;
