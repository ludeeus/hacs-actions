import { Sender } from "./contexts"

const FunItems: string[] = [
    "[this cute kitten 😺](https://www.youtube.com/watch?v=0Bmhjf0rKe8)",
    "this awesome picture\n\n![image](https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Sunset_2007-1.jpg/1280px-Sunset_2007-1.jpg)"
]



export const NewIssue: string = `
Hi @${Sender!.login} 👋

Make sure you have read the [issue guidelines](https://hacs.netlify.com/docs/issues) and that you filled out the **entire** template.
`;

export const NewPull: string = `
Hi @${Sender!.login} 👋

Automatic tasks are now running some initial checks before this can be merged.
When those are done, someone will manually ensure that that it's OK. 💃

While you wait, you can have a look at ${FunItems[Math.floor(Math.random()*FunItems.length)]}
`;

export const HacktoberFestMessage: string = `
## It's Hacktoberfest 🎉

Make sure that you have signed up at https://hacktoberfest.digitalocean.com/
`;