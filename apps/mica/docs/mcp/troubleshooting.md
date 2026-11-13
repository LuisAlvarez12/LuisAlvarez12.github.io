# Troubleshooting agents and MCP

When an agent can't connect to Mica or a tool call fails, the error message usually says exactly which setting or item is involved. This page lists the common messages and problems, what causes them, and how to fix them. You can see recent calls and their errors in the **Activity** list at the bottom of Settings → Agents.

## The agent can't connect

Symptoms: "connection refused", "can't reach the server", or the `mica` entry shows as failed in `claude mcp list`.

1. Make sure Mica is open on your Mac. The server only runs while the app is running.
2. Open Settings → Agents and check that **Enable MCP Server** is on and **Status** reads **Running on port** followed by a number.
3. Check that the port in your client's configuration matches that number. The default is 3847.
4. Run `curl -s http://127.0.0.1:3847/` in Terminal, using your port. If you see `Mica MCP server`, the server is up and the problem is in the client configuration.

If **Enable MCP Server** won't stay on, check that Mica Pro is active. The switch requires Mica Pro, and the server stops when a subscription ends.

The server only accepts connections from the same Mac. An agent running on another computer, in a virtual machine with its own network, or in the cloud can't reach it.

## Port already in use

**Status** shows `Port 3847 is already in use. Choose another port.`

Another app is using that port. Type a different port from 1024 to 65535 in **Port**, click **Apply**, and update the address in every client. In Settings, copy the setup snippet again; it uses the new port.

## 401 Unauthorized

The client gets HTTP 401 with one of these messages:

- `Unauthorized: no access token.` **Require Access Token** is on and the client didn't send a token. Copy the setup snippet for your client again from Settings → Agents; it includes the `Authorization` header while the switch is on.
- `Unauthorized: the access token doesn't match.` The client sends an old or mistyped token. The token only changes when someone presses **Regenerate…**. Copy the current token and update the client. In Claude Code, run `claude mcp remove mica` and add the server again.

If you only use trusted apps on your Mac, you can also turn off **Require Access Token**. Clients that still send a token keep working.

## 403 Forbidden origin

The request came from a web page on another site. Mica blocks requests from non-local web pages so websites you visit can't control the app. Use a desktop or command-line MCP client instead.

## Mica Pro errors

- `Agents (MCP) is a Mica Pro feature.` Every tool needs an active Mica Pro subscription. Upgrade or restore your purchase in Mica, then try again.
- `… requires Mica Pro (same as in the app).` A specific feature, such as exporting or Rename with AI, needs Mica Pro.
- `That board is locked: without Mica Pro only the first 3 boards (oldest first) can be opened.` Your subscription ended. Nothing was deleted; Mica Pro reopens the board.

Agents never see the upgrade screen, so they should pass these messages on to you instead of retrying.

## Mica is locked

`Mica is locked. Ask the user to unlock Mica, then retry.`

App Lock is on and Mica is locked. Unlock Mica, then ask the agent to try again.

## Permission denied

- `Permission denied: “Edit existing content” is off in Mica → Settings → Agents.` or another category name. That category is off in Settings → Agents → Permissions. Turn it on if you want the agent to do this. When **Delete Content** is set to **Never**, delete tools report `Permission denied: “Delete content” is off …` in the same way.
- `The tool <name> is turned off in Mica → Settings → Agents → Advanced.` You turned off that one tool under **Advanced → Individual Tools**.
- `Deleting is turned off in Settings → Agents.` The agent tried to delete a comment while **Delete Content** is set to **Never**.
- `The user declined: …` You clicked **Don’t Allow** on the delete confirmation. The agent is told not to retry unless you ask.
- `Fetching from web URLs is off in Settings → Agents.` Turn on **Allow Downloads from Web Addresses**, or ask the agent to send the file as base64 data.

## Board not found, private or out of scope

- `That board is private. Private boards are never available to agents.` The board, or the folder it's in, is private. Agents can't see it. Move the work to a board that isn't private if you want the agent's help.
- `That board is outside the agent's access scope (…).` **Board Access** is set to **Boards Created by Agents** or **Open Boards Only**. Widen it, or open the board in Mica if you use Open Boards Only.
- `That board is in the Trash.` Restore it from the Trash first.
- `No board with id …` The id is wrong or the board isn't visible. Ask the agent to call `list_boards`.
- `That page is private and unavailable to agents.` or `That layer is private.` Private pages and layers stay hidden.
- If the agent can't find a board you can see, it's probably private, in the Trash or outside the Board Access scope.

## Item, layer, page or board is locked

Messages include `Item “…” is locked. The user can allow locked edits in Settings → Agents.`, `Layer “…” is locked.`, `Page “…” is locked.`, `Board “…” is locked.` and `Unlocking items requires “Allow locked edits” in Settings → Agents.`

Either unlock the content yourself in Mica, or turn on **Allow Unlocking and Editing Locked Content** for the duration of the task.

`Page “…” is in copy mode.` or `… is in lock mode.` means the page's interaction mode isn't Edit. The agent can switch it with `update_page {"set": {"interactionMode": "edit"}}`, which also needs the locked-content setting, or you can switch the page back to Edit in Mica.

`Item … can't be edited (its layer, page or an enclosing frame is locked or hidden, or it is inside a component instance).` The item itself may be fine, but something around it blocks edits. Unlock or show the containing layer or frame, or edit the main component instead of the instance.

## The board is presenting

`The board is presenting in Mica. Ask the user to exit presentation, then retry.` End the presentation in Mica, then ask the agent to continue.

## The client doesn't show Mica's tools

- **New session needed.** Many clients, including Claude Code, load MCP tools when a session starts. After adding the server, start a new session or restart the client.
- **Claude Desktop** needs Node.js for the `mcp-remote` bridge, and a full quit and reopen after you edit `claude_desktop_config.json`. Check that the JSON is valid and that the `"mica"` entry sits inside `"mcpServers"`.
- **Category off.** Tools in a category that's off, and tools you turned off individually, don't appear in the list at all. Check Settings → Agents.
- **Wrong scope in Claude Code.** A server added without `-s user` is only available in the project where you added it.
- **Transport.** Mica uses Streamable HTTP. Clients that only support stdio need a bridge such as `mcp-remote`.

## Tool errors about the request

These mean the agent sent something Mica can't use. A capable agent reads the message and fixes its call:

- `Unknown property …` The message lists the writable properties. The `properties` documentation topic has them all.
- `Note: these keys are not part of the setting and were ignored: …` The call succeeded, but some settings keys were misspelled. The `types` topic has the exact names.
- A message naming `items[i]` from `create_items` means that spec failed, and nothing from the call was created.
- `… isn't available for this selection` from `run_command` means the command needs a different selection. Boolean commands need two or more closed shapes on one layer. `list_commands` with `item_ids` shows what's available.
- A message that `url` must be http(s) means the agent passed a file path. Mica is sandboxed and can't read files on your Mac by path, so the agent must send the file as base64 `data`.

## The result looks wrong

If the screenshot doesn't match what the agent intended, the cause is usually one of these:

- Children in `create_items` use coordinates relative to their parent frame; top-level items use absolute canvas coordinates.
- Auto layout adds 16 points of padding and gap by default.
- A frame with a fixed height clips children that don't fit. Frames clip by default.
- A frame created with an explicit width and height doesn't hug its content.

Ask the agent to inspect the items with `get_items` and compare them with a fresh `get_screenshot`. If a step made things worse, undo it with Command-Z on the open board or `history {"action": "undo"}`.
