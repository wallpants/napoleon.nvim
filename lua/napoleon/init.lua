local Config = require("napoleon.config")
local Fns = require("napoleon.functions")

local M = {}

---@param partial_config napoleon_config
M.setup = function(partial_config)
   Config.value = vim.tbl_deep_extend("force", Config.value, partial_config)
   Config.validate()

   vim.api.nvim_create_user_command("NapoleonSend", Fns.send, {})
end

M.fns = Fns

return M
