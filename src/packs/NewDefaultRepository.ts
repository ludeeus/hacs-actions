import * as github from '@actions/github';
import { Issue } from "../misc/contexts"
import { CommonCheck } from "../checks/CommonCheck"
import { Base64 } from 'js-base64';

export async function NewDefaultRepository(client: github.GitHub) {
    // TODO: Enable the real check
    //if (github.context.repo.owner === "hacs" && github.context.repo.repo === "repositories") {
    if (github.context.repo.owner !== "hacs" && github.context.repo.repo !== "repositories") {
        console.log("Running NewDefaultRepository")

        // Get Changed files
        var changedFiles = await getChangedFiles(client, Issue.number)

        changedFiles.forEach(async element => {
            var changed = await getFileDiff(client, Issue.number, element)
            var owner = changed[0].split("/")[0]
            var repo = changed[0].split("/")[1]
            await CommonCheck(owner, repo, element, client)
        });
    }
}



async function getChangedFiles(client: github.GitHub, prNumber: number){
    const listFilesResponse = await client.pulls.listFiles({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: prNumber
    });
  
    const changedFiles = listFilesResponse.data.map(f => f.filename);
    return changedFiles;
  }

async function getFileDiff(client: github.GitHub, prNumber: number, file: string){

    const {data: Pull} = await client.pulls.get({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        pull_number: prNumber
    })

    const PullRef = Pull["head"]["sha"]

    const {data: ChangedContents} = await client.repos.getContents({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        path: file,
        ref: PullRef
    })

    var ChangedDecoded = JSON.parse(Base64.decode(ChangedContents["content"]));

    const {data: Contents} = await client.repos.getContents({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        path: file
    })

    var Decoded = JSON.parse(Base64.decode(Contents["content"]));

    var NewItems: string[] = []

    ChangedDecoded.forEach(element => {
        if (!Decoded.includes(element)) NewItems.push(element);
    });

    return NewItems
  }
