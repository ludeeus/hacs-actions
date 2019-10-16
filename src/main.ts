import * as core from '@actions/core';
import * as github from '@actions/github';
import { Selector } from "./Selector"

async function run() {
  try {
    const client = new github.GitHub(core.getInput('github-token', {required: true}));
    await Selector(core.getInput('action'), client)


    var issue_data = await client.issues.get({"owner": "ludeeus", "repo": "hacs-actions", "issue_number": 3})
    console.log(issue_data)


  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
