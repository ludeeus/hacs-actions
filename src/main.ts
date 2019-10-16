import * as core from '@actions/core';
import * as github from '@actions/github';
import { Selector } from "./Selector"

async function run() {
  try {
    const client = new github.GitHub(core.getInput('github-token', {required: true}));
    await Selector(core.getInput('action'), client)
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
