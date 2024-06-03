local Config = require("napoleon.config")
local Fns = require("napoleon.functions")

local M = {}

---@param config napoleon_config
M.setup = function(config)
   Config.value = config
   Config.validate()

   vim.api.nvim_create_user_command("NapoleonSend", Fns.send, {})
end

M.fns = Fns

return M
