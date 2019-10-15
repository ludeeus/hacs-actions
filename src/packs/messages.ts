import * as github from '@actions/github';

const FunItems: string[] = [
    "[this cute kitten 😺](https://www.youtube.com/watch?v=0Bmhjf0rKe8)"
]



export const NewIssue: string = `
Hi @${github.context.payload.sender!.login} 👋

Make sure you have read the [issue guidelines](https://hacs.netlify.com/docs/issues) and that you filled out the **entire** template.
`;

export const NewPull: string = `
Hi @${github.context.payload.sender!.login} 👋

Automatic tasks are now running some initial checks before this can be merged.
When those are done, someone will manually ensure that that it's OK. 💃

While you wait, you can have a look at ${FunItems[Math.floor(Math.random()*FunItems.length)]}
`;
