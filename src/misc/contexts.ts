import * as github from '@actions/github';

export const Repo = github.context.repo;
export const Issue = github.context.issue;
export const Payload = github.context.payload;
export const PullPayload = Payload.pull_request;
export const IssuePayload = Payload.issue;
export const Sender = Payload.sender;