import * as github from '@actions/github';

export function getPrNumber(): number | undefined {
  const pullRequest = github.context.payload.pull_request;
  if (!pullRequest) {
    return undefined;
  }

  return pullRequest.number;
}

export function getIssueNumber(): number | undefined {
  const issue = github.context.payload.issue;
  if (!issue) {
    return undefined;
  }

  return issue.number;
}