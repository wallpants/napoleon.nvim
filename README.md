# napoleon.nvim

[<img src="/docs/ollama.png" height="50px" align="right" />](https://ollama.com/)
[<img src="/docs/nvim.svg" height="50px" align="right" />](https://neovim.io/)

**_Short_** conversations with [ollama](https://ollama.com/).

Powered by [Bunvim](https://github.com/wallpants/bunvim).

Conversation is lost when the buffer is deleted.

The purpose of this plugin is to have short conversations to
resolve a doubt and get back to work.

<!-- https://github.com/wallpants/ghost-text.nvim/assets/47203170/6976a5e3-3ac4-44bb-a45b-8b5dc5bd894f -->

## ✅ Requirements

1. [Bun](https://bun.sh)
2. [Neovim](https://neovim.io)

## 📦 Installation

Using <a href="https://github.com/folke/lazy.nvim">lazy.nvim</a>

```lua
{
   "wallpants/napoleon.nvim",
   opts = {
      model = "llama3:latest",
      temperature = 0.3,
   },
   config = function(_, opts)
      local napoleon = require("napoleon")
      napoleon.setup(opts)

      local fns = napoleon.fns
      vim.keymap.set("n", "<leader>ns", fns.send)
   end,
}
```

## 💻 Usage

### `:NapoleonSend` or `<leader>ns`

Creates conversation buffer if it doesn't exist **_or_** sends messages
to ollama if buffer already exists.

The format for conversations is:

```
USER:
##############################
user message

ASSISTANT:
##############################
assistant response
```

You can edit previously sent _user_ and _assistant_ messages as long as you don't mess
with the aforementioned format, all messages are parsed and sent everytime you call
`:NapoleonSend` or `<leader>ns`.

If you mess with the format, be ready for unexpected behaviour.
