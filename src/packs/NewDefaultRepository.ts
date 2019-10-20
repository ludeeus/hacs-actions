import * as core from '@actions/core';
import * as github from '@actions/github';
import { Issue } from "../misc/contexts"

export async function NewDefaultRepository(client: github.GitHub) {
    if (github.context.repo.owner !== "hacs" && github.context.repo.repo !== "repositories") {
        console.log("Running NewDefaultRepository")

        // Get Changed files
        var changedFiles = await getChangedFiles(client, Issue.number)
    }
}




async function getChangedFiles(client: github.GitHub, prNumber: number){
    const listFilesResponse = await client.pulls.listFiles({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber
    });
  
    console.log(listFilesResponse)
    const changedFiles = listFilesResponse.data.map(f => f.filename);
    console.log(changedFiles)
  
    return changedFiles;
  }