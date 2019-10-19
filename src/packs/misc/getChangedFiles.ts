import * as core from '@actions/core';
import * as github from '@actions/github';

export async function getChangedFiles(client: github.GitHub, prNumber: number) {
    console.log("Running misc/getChangedFiles")
    const listFilesResponse = await client.pulls.listFiles({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber
    });
  
    const changedFiles = listFilesResponse.data.map(item => item.filename);
  
    core.debug('found changed files:');
    for (const file of changedFiles) {
      core.debug('  ' + file);
    }
  
    return changedFiles;
  }