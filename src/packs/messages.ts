import * as github from '@actions/github';

export const NewIssue: string = `
Hi ${github.context.payload.sender} 👋,
Make sure you have read the [issue guidelines](https://hacs.netlify.com/docs/issues) and that you filled out the **entire** template.
`;