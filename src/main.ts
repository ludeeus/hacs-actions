import * as core from '@actions/core';
import * as github from '@actions/github';
import { HacktoberFest } from "./packs/HacktoberFest"
import { Selector } from "./Selector"

async function run() {
  try {
    const client = new github.GitHub(core.getInput('github-token', {required: true}));

    await HacktoberFest(client)

    await Selector(core.getInput('modules'), client)

  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
