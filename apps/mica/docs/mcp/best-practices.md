# Best practices for working with agents

Agents do their best work in Mica when they read before they write, build in small sections, and look at what they made. This page covers how to phrase requests, what a good agent session looks like, and how to keep your library and your access token safe.

## Write a clear request

- **Name the board.** Say "on my board Spring Campaign" or "in a new board called Spring Campaign". Agents work on the board in the frontmost Mica window when you don't say, which may not be the one you mean.
- **Give sizes and formats.** "A 1080 × 1350 Instagram post", "three iPhone screens at 393 × 852", "a 1920 × 1080 slide". The agent's built-in guide lists common sizes, but your numbers win.
- **Point at things.** Select items in Mica and say "this" or "the selected card". Agents read your selection with `get_selection`.
- **Share the brand.** Give colors as hex values, font family names that are installed on your Mac, and the tone you want.
- **Say what not to touch.** "Don't change the Hero frame" or "only edit the Drafts page" saves cleanup later.

The server also offers two prompts, **Design something in Mica** and **Review a Mica board**, that clients can show in their prompt menus. They give the agent a proven plan to follow.

## Let the agent orient itself

A good session starts with reading, not writing:

1. `get_docs {"topic": "guide"}` once per task. It explains coordinates, every item type and common recipes for the installed version of Mica. The `types` and `enums` topics have the exact JSON and allowed values.
2. `list_boards`, then `get_board` for pages and layers.
3. `get_page_tree` for a cheap outline of the page with item ids. On big pages, pass `root_id` to outline one frame or `max_depth` to limit nesting.
4. `get_items` for full detail on the few items it's about to change.

If you notice an agent guessing property names or ids, ask it to read the guide and the page tree first.

## Build in sections

- **One section per call.** The agent should build each screen, card or slide with one `create_items` call that nests `children`, not one call per item. Each call is one undo step, so this also keeps your history clean.
- **Keep calls moderate.** About 200 items per call is a good upper limit. If any spec in a call fails, nothing from the call is kept, and the agent fixes the reported item and sends the batch again.
- **Use frames and auto layout.** Frames with `autoLayout` keep stacks, lists, buttons and cards aligned when text changes. Absolute positions are fine for posters and illustrations.
- **Use styles and variables for repeated values.** If the design repeats colors or type sizes, ask the agent to create styles or variables with `design_system` first, then apply or bind them. Later changes become one edit.
- **Use SVG for icons and logos.** A `create_items` spec with `"type": "svg"` turns SVG markup into editable vector layers, which is faster and cleaner than drawing paths by hand. For system icons, `"type": "symbol"` places an SF Symbol.

## Check the result visually

Ask the agent to call `get_screenshot` on each frame after building it, and to fix what it sees: overflowing or clipped text, uneven spacing, low contrast, items outside their frame. Screenshots are part of the Read permission and don't count as exports.

When the agent is done, it should call `select_items` or `open_board` so the result is in front of you.

## Name layers

Ask for meaningful `name` values on every frame and important item, such as "Header", "Primary button" or "Price label". Named layers make the Layers panel readable, help the agent find items later with `find_items`, and make prototypes and exports easier to follow. To clean up an existing board, ask the agent to rename layers from the page outline in one `update_items` call.

## Use undo instead of delete

Every agent call is one undo step, shared with your own edits. If a step went wrong, press Command-Z with the board open in Mica, or ask the agent to call `history {"action": "undo"}`; it can undo up to 50 steps in one call. This is safer than letting the agent delete and rebuild, and it works even when deleting is set to **Never**.

## Scope permissions to the task

- Use **Boards Created by Agents** when an agent is exploring, so it can't change your existing boards.
- Use **Open Boards Only** when you want to control exactly which board it can touch: open just that board.
- Leave **Delete Content** on **Ask Each Time** unless you're running a long unattended task on a throwaway board.
- Keep **Allow Unlocking and Editing Locked Content** off, and lock frames you want to protect. Turn it on only for the task that needs it.
- Turn off **Allow Downloads from Web Addresses** if you don't want the agent pulling in images from the web.
- Check the **Activity** list in Settings → Agents to see what an agent did and which calls failed.

## Keep your token out of repositories

If you turn on **Require Access Token**, treat the token like a password:

- Don't put it in files you commit, such as a project-level `.mcp.json` or `.vscode/mcp.json`. Use your client's user-level configuration instead, for example `claude mcp add` without a project scope or the user MCP settings in VS Code.
- For Claude Desktop, keep the token in the `env` block as the setup snippet does.
- Don't paste the token into chat with the agent. It doesn't need to see it; the client sends it.
- If the token was shared or committed by mistake, press **Regenerate…** in Settings → Agents and update your clients.

## Large boards

Mica handles boards with thousands of items, but tool results that describe them can get large and slow.

- Prefer `get_page_tree` with `root_id` or `max_depth`, and `get_items` with `fields`, over reading everything.
- Use `find_items` to search by name, text, type, tag or color instead of scanning whole pages.
- Ask for screenshots of single frames instead of whole pages, and use `max_size` to keep images small.
- Export frames or pages, not entire boards, so files stay within your client's limits.
- Split very large builds across several calls and pages.
