---@class env
---@field LOG_LEVEL string?
---@field IS_DEV boolean?

---@class napoleon_config
---@field model string
---@field temperature number
---@field initial_message nil | initial_message
---@field log_level nil | "verbose" | "debug"

---@class napoleon_props
---@field config napoleon_config

---@class initial_message
---@field role "user" | "assitant" | "system"
---@field message string[]
