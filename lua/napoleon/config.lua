local M = {}

---@type napoleon_config
M.value = {
   model = "llama3",
   temperature = 0.3,

   -- for debugging
   -- nil | "debug" | "verbose"
   log_level = nil,
}

M.validate = function()
   vim.validate({
      model = { M.value.model, "string" },
      temperature = {
         M.value.temperature,
         function(var)
            return (type(var) == "number") and (var >= 0) and (var <= 1)
         end,
         "number between 0 and 1",
      },
      log_level = {
         M.value.log_level,
         function(var)
            local is_nil = type(var) == "nil"
            local is_valid = (type(var) == "string") and ((var == "debug") or (var == "verbose"))
            return is_nil or is_valid
         end,
         'nil, "debug" or "verbose"',
      },
   })
end

return M
