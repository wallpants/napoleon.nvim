local M = {}

M.value = {}

M.validate = function()
   vim.validate({
      model = { M.value.model, "string" },
      initial_message = {
         M.value.initial_message,
         function(var)
            local is_nil = type(var) == "nil"
            if is_nil then
               return true
            end
            local is_table = type(var) == "table"
            if not is_table then
               return false
            end
            local valid_role = (type(var.role) == "string") and ((var.role == "user") or (var.role == "assistant") or (var.role == "system"))
            local valid_message = (type(var.message) == "string")
            return is_nil or (valid_role and valid_message)
         end,
         "nil or { role: 'user' | 'assistant' | 'system', message: string }",
      },
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
