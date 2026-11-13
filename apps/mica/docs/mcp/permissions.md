# Permissions and privacy

You decide what agents can do in Mica. Settings → Agents lets you choose which kinds of tools are available, which boards agents can see, whether they can delete or touch locked content, and whether they can download from the web. Private content is never visible to agents, whatever you choose. This page explains each setting, its default, and what an agent sees when a setting stops it.

## Where to find the settings

Open **Mica → Settings** on your Mac and click the **Agents** tab. The **Permissions** section holds the main switches. The **Advanced** section lets you turn off individual tools, and the **Activity** section lists every call agents make. Changes apply to the next tool call; you don't need to restart the server. Some clients cache the tool list, so a tool you turn back on may only reappear after the agent reconnects or starts a new session.

## Tool categories

Each switch turns a whole group of tools on or off. When a category is off, its tools disappear from the agent's tool list, and a call to one of them fails with `Permission denied: “<category>” is off in Mica → Settings → Agents.`

| Setting | Default | Tools |
|---|---|---|
| **Read boards and content** | On | `get_docs`, `list_boards`, `get_board`, `get_page_tree`, `get_items`, `find_items`, `get_selection`, `get_design_system`, `list_commands`, `list_assets`, `list_templates`, `get_screenshot` |
| **Create boards, pages and items** | On | `create_board`, `duplicate_board`, `create_page`, `duplicate_page`, `create_layer`, `create_items`, `import_board` |
| **Edit existing content** | On | `update_items`, `set_text`, `set_vector`, `set_paint`, `studio_effects`, `run_command`, `reparent_items`, `reorder_items`, `update_group`, `update_board`, `update_page`, `update_layer`, `reorder_pages`, `set_tags`, `comments`, `design_system` |
| **Render and export** | On | `export` |
| **Undo and redo** | On | `history` |
| **Control the Mica window** | On | `open_board`, `select_items`, `dock_menu`, `whats_new` |

Most agents need **Read** to work well: without it they can't find ids or look at their results. If you only want an agent to look at your work, turn off everything except **Read boards and content**.

> `get_screenshot` is a read tool, not an export. An agent can check its work visually even when **Render and export** is off.

## Delete Content

**Delete Content** is a menu with three choices. It covers `delete_items`, `delete_layer`, `delete_page`, `trash_board`, and deleting a comment with the `comments` tool.

| Choice | What happens |
|---|---|
| **Never** | Delete tools are hidden from the agent and refused with `Permission denied: “Delete content” is off in Mica → Settings → Agents.` Deleting a comment is refused with `Deleting is turned off in Settings → Agents.` |
| **Ask Each Time** (default) | Mica comes to the front and shows **Allow an agent to delete content?** with a description of what the agent wants to delete. Click **Allow** or **Don’t Allow**. If you decline, the agent is told `The user declined` and not to retry. |
| **Allow** | Deletes happen without asking. |

Whatever you choose:

- Agents never empty the Trash. `trash_board` moves a board to the Trash, where you can restore it.
- Every deletion is one undo step. You can undo it in Mica or the agent can call `history`.

## Board Access

**Board Access** limits which boards agents can see and change.

| Choice | Boards agents can use |
|---|---|
| **All Boards** (default) | Every board that isn't private or in the Trash |
| **Boards Created by Agents** | Only boards an agent created with `create_board`, `duplicate_board` or `import_board` on this Mac |
| **Open Boards Only** | Only boards open in a Mica window right now |

A board outside the scope doesn't appear in `list_boards`, and naming it directly fails with `That board is outside the agent's access scope`. **Boards Created by Agents** is a good choice when you want an agent to experiment without touching your existing work.

## Locked content

**Allow Unlocking and Editing Locked Content** is off by default. While it's off, agents can't change locked items, layers, pages or boards, and they can't unlock them. Agents also can't edit a page whose interaction mode is Copy or Lock. They first have to switch it back to Edit with `update_page`, and that switch counts as unlocking, so it needs this setting too.

Turn it on when you want an agent to work on content you locked, then turn it off again. Without it, the agent receives a message that names the locked item, layer, page or board, so it can ask you to unlock it.

## Downloads from web addresses

**Allow Downloads from Web Addresses** is on by default. It lets agents create images and files from an `http` or `https` address, for example `{"type": "image", "url": "https://example.com/photo.jpg"}` in `create_items`. Mica downloads the file itself.

When it's off, agents must send files as base64 data, and a `url` fails with `Fetching from web URLs is off in Settings → Agents.` Agents can never read files from your Mac's disk directly, whatever this setting says.

## Individual tools

In **Advanced → Individual Tools**, you can turn off single tools, for example `trash_board` or `import_board`, while leaving the rest of their category on. A turned-off tool disappears from the agent's tool list, and calling it fails with `The tool <name> is turned off in Mica → Settings → Agents → Advanced.` Tools in a category that is off stay unavailable even if their own switch is on.

## Activity

The **Activity** section lists recent agent calls, newest first: a short summary of what changed, the tool name, the client name and the time. Failed or refused calls show a warning icon with the reason. Click **Clear Activity** to empty the list. The list is kept in memory while Mica runs and is not saved to your boards.

## Access token

**Require Access Token** is off by default. Because the server only listens on 127.0.0.1, other devices can't reach it either way. The token protects you from other apps and scripts on the same Mac.

- Turn it on when you run software on your Mac that you don't fully trust, or when several people use the same Mac account.
- With it on, Mica creates a token and stores it in the Keychain. It stays the same across restarts.
- **Regenerate…** creates a new token and asks you to confirm. Every connected agent stops working until you update its configuration with the new token.
- With it off, Mica ignores any `Authorization` header an agent still sends, so older configurations keep working.

Treat the token like a password. See [Best practices](best-practices.md) for keeping it out of repositories.

## Privacy

- **Private boards** never appear to agents. This includes boards inside a private folder. Asking for one by id fails with `That board is private. Private boards are never available to agents.`
- **Private pages and private layers** are hidden too. Their items don't appear in outlines, searches, screenshots or exports, and agents can't change them.
- **Boards in the Trash** are hidden.
- **App Lock**: while Mica is locked, every call fails with `Mica is locked. Ask the user to unlock Mica, then retry.`
- The server is local. Board content goes only to the agent you connected. What the agent does with it, such as sending it to an AI model provider, depends on that agent.

## Mica Pro and plan limits

Agents (MCP) is a Mica Pro feature. Every tool needs an active Mica Pro subscription: without it the server doesn't run, and a call that still arrives fails with `Agents (MCP) is a Mica Pro feature.` If your subscription ends, the server stops on its own. Nothing on your boards is deleted.

The agent path also applies the same plan checks as the app, so an agent can never do more than you could. With Mica Pro these checks always pass. For reference, the free plan limits are:

- One board, one page per board, and a limited number of items per board.
- Editing existing canvas content, including running canvas commands, requires Pro.
- Page settings require Pro.
- Every `export` format (PNG, JPEG, SVG, PDF, .refboard and HTML) requires Pro.
- Rename with AI and the on-device assists (`ai.*` and `assist.*` commands) require Pro.
- Only the three oldest boards open without Pro. Other boards report `That board is locked: without Mica Pro only the first 3 boards (oldest first) can be opened.`

Agents never see the upgrade screen. They get a message instead and should pass it on to you.
