# Agents and MCP in Mica

Mica for Mac includes a local Model Context Protocol (MCP) server. When you turn it on, AI agents such as Claude Code, Claude Desktop, Cursor, VS Code and Codex can read your boards and create or edit them through the same features you use: frames, shapes, text, images, effects, styles, variables, components, prototypes and exports. The server runs inside the Mica app on your Mac, listens only on your Mac, and follows the permissions you set in Settings.

## What you can do with it

An agent works with Mica the way you would, but it can do many steps in one go. Here are some things you can ask for:

- **Make a moodboard from a brief.** Describe the mood, and the agent places reference images from web addresses, arranges them in masonry columns, adds sticky notes and pulls a color palette from the images.
- **Build app screens.** The agent creates phone-sized frames with auto layout, cards, buttons and text, and can link them into a clickable prototype.
- **Design a poster or social post.** The agent sets up a frame at the right size, adds type, shapes and gradients, and adds Effect Studio effects such as lens flares or film grain.
- **Batch-rename layers.** The agent reads the page outline and gives every layer a meaningful name in one step, or runs Rename with AI.
- **Produce App Store screenshots.** The agent starts from the App Store Screenshots template, places device mockups and captions, and exports each frame as a PNG.
- **Audit a board.** The agent checks spacing, colors and type against the board's styles and variables, finds low-contrast or overflowing text and unnamed layers, and reports what to fix.
- **Set up a design system.** The agent creates color and text styles, variable collections with Light and Dark modes, and components with instances.

## How it works

Mica runs the server while the app is open and **Enable MCP Server** is on in Settings → Agents. Your agent connects to `http://127.0.0.1:3847/mcp` (3847 is the default port; you can change it). The server offers 45 tools, grouped like this:

| Group | Examples |
|---|---|
| Read | `list_boards`, `get_board`, `get_page_tree`, `get_items`, `find_items`, `get_selection`, `get_design_system`, `get_screenshot`, `get_docs` |
| Create | `create_board`, `create_page`, `create_layer`, `create_items`, `duplicate_board`, `duplicate_page`, `import_board` |
| Edit | `update_items`, `set_text`, `set_paint`, `set_vector`, `studio_effects`, `run_command`, `design_system`, `comments` |
| Delete | `delete_items`, `delete_layer`, `delete_page`, `trash_board` |
| Export | `export` (PNG, JPEG, SVG, PDF, .refboard, HTML prototype) |
| History | `history` (undo, redo, status) |
| App | `open_board`, `select_items`, `dock_menu`, `whats_new` |

`create_items` creates any number of items in one call: frames, sections, rectangles, ellipses, polygons, stars, lines, arrows, paths, text, stickies, palettes, images and files, links, SVG artwork, tables, component instances, mirrors, blobs, QR codes, charts, waves, text on an arc, SF Symbols and device mockups.

The server also publishes its own documentation, generated from the version of Mica you have installed. Agents read it with the `get_docs` tool, and you can open it in a browser from Settings → Agents → **Open Documentation**. See [Connect an agent](connect.md) for the addresses.

The server also offers two ready-made prompts that clients can show in their prompt menus: **Design something in Mica** (`design_in_mica`) and **Review a Mica board** (`review_board`).

## Every tool call is one undo step

Each tool call an agent makes is a single step in the board's history. The steps carry names such as **Agent: Create Items** or **Agent: Edit**, so you can tell them apart from your own. Agent edits and your edits share one history, so with the board open in Mica you can press Command-Z to undo what an agent did, or ask the agent to call `history` with `{"action": "undo"}`. A `create_items` call that builds a whole screen with dozens of nested items is still one step.

If any item in a `create_items` call fails, nothing from that call is kept. The agent gets an error that names the failing spec and can fix it and try again.

## How it relates to the rest of Mica

The agent goes through the same code paths as the app:

- `run_command` runs the canvas context-menu commands by id, such as `group`, `align.left`, `boolean.subtract`, `component.create`, `organize.masonry`, `image.removeBackground` and `palette.generate`. An agent's "group" is exactly your Group command.
- Locks, auto layout reflow, privacy and undo all behave as they do when you edit by hand.
- When an agent creates or opens a board, it appears in your Mica window. `select_items` and `open_board` show you what the agent made.
- The `export` tool uses the same PNG, SVG, PDF, .refboard and prototype exporters as the app.

## What agents can't do

- **See private content.** Private boards, pages and layers never appear to agents, and boards in the Trash are hidden.
- **Change their own permissions.** Only you can turn the server on, choose permissions and set the access token, in Settings → Agents.
- **Empty the Trash.** `trash_board` only moves a board to the Trash, where you can restore it.
- **Read files on your Mac.** Mica is sandboxed. Agents send images and files as base64 data, or as web addresses if you allow downloads.
- **Use actions that need you at the canvas.** Commands that open a dialog or depend on the pointer or clipboard, such as Crop, Erase, Copy, Share and Make 3D, are not available to agents.
- **Reach Mica from another device.** The server only accepts connections from the same Mac.

## Requirements

- **Mac only.** The MCP server is part of Mica for Mac. Changes an agent makes sync to your other devices like any other edit when iCloud sync is on.
- **Mica must be running and unlocked.** If App Lock is on, unlock Mica before the agent works.
- **Mica Pro.** Agents (MCP) is a Mica Pro feature. On the free plan, the **Enable MCP Server** switch opens the upgrade screen. If your subscription ends, the server stops and refuses tool calls until Mica Pro is active again.
- **A local MCP client.** Any client that supports the Streamable HTTP transport can connect. Web-based assistants that run in the cloud can't reach a server on your Mac.

## Next steps

- [Connect an agent](connect.md)
- [Permissions and privacy](permissions.md)
- [Workflows](workflows.md)
- [Best practices](best-practices.md)
- [Troubleshooting](troubleshooting.md)
