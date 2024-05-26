local Config = require("napoleon.config")
local Utils = require("napoleon.utils")
local M = {}

local job_id = nil

M.send = function()
   if job_id == nil then
      vim.notify("napoleon: init", vim.log.levels.INFO)

      -- vim.g.napoleon_props is read by bunvim
      ---@type napoleon_props
      vim.g.napoleon_props = {
         config = Config.value,
      }

      local __filename = debug.getinfo(1, "S").source:sub(2)
      local plugin_root = vim.fn.fnamemodify(__filename, ":p:h:h:h") .. "/"

      local command = "bun run start"

      ---@type env
      local env = { IS_DEV = false }

      if Config.value.log_level then
         command = "bun --hot run start"
         env.IS_DEV = true
         env.LOG_LEVEL = Config.value.log_level
      end

      job_id = vim.fn.jobstart(command, {
         cwd = plugin_root,
         stdin = "null",
         on_exit = function(jobid, exit_code)
            local log = Utils.log_exit(env.LOG_LEVEL)
            if log then
               log(jobid, exit_code)
            end
            job_id = nil
         end,
         on_stdout = Utils.log_job(env.LOG_LEVEL),
         on_stderr = Utils.log_job(env.LOG_LEVEL),
         env = env,
      })
   else
      local channel_id = Utils.get_client_channel()
      vim.rpcnotify(channel_id, "send")
   end
end

return M
