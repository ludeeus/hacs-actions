import * as core from '@actions/core';
import * as github from '@actions/github';
import { HacktoberFest } from "./packs/HacktoberFest"
import { Selector } from "./Selector"

async function run() {
  try {
    const client = new github.GitHub(core.getInput('github-token', {required: true}));

    await HacktoberFest(client)


    if (core.getInput('action') === "Test") {
      var issue_data = await client.issues.get(
        {"owner": "ludeeus", "repo": "hacs-actions", "issue_number": github.context.issue.number})
      console.log(issue_data.data.state)
    }

    await Selector(core.getInput('modules'), client)

  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
