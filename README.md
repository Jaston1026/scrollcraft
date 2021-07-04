# ScrollCraft

This is a discord game bot with a rpg spellcrafting theme that is hosted on heroku

## Code Folder Structure

The [`commands folder`](https://github.com/Jaston1026/scrollcraft/tree/main/commands) is where all commands should be stored in a Javascript file.

---

In each `Command Name`.js file should have this snippet of code:
``` js
module.exports = {
  key: "<Command>",
  func: (message, args) => {
    //Command Functions
  }
}
```

---

Here are some illustrations for the above two explanations:

<sup>Command files' export code</sup>

![alt text](https://github.com/Jaston1026/Fake-Rhythm/blob/Development/md-resource/exportCode.png)

<sup>Command files naming</sup>

![alt text](https://github.com/Jaston1026/Fake-Rhythm/blob/Development/md-resource/commandsDir.png)

---
P.S. All `modules` to be used in certain commands are to be declared in its `respective .js file` instead of `index.js`
