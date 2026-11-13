# Connect an agent to Mica

To connect an agent, you turn on the MCP server in Mica for Mac, then add Mica to your agent's MCP configuration. Mica shows a ready-to-copy setup snippet for each popular client, so in most cases you pick your client, click **Copy** and paste. This page shows the same snippets, explains each setting, and shows how to check that the connection works.

## Turn on the server

1. Open Mica on your Mac and choose **Mica → Settings** (Command-comma).
2. Click the **Agents** tab.
3. Turn on **Enable MCP Server**. This needs Mica Pro; on the free plan the switch opens the upgrade screen.
4. Check that **Status** reads **Running on port 3847**.

The **Connect an Agent** section below the switch shows:

- **Endpoint**: the address agents connect to, `http://127.0.0.1:3847/mcp` by default, with a **Copy** button.
- **Require Access Token**: off by default. See the next section.
- **Port**: the port the server listens on. Type a number from 1024 to 65535 and click **Apply**. If you change it, update the address in every client.
- **Set Up**: a menu of clients (Claude Code, Claude Desktop, Cursor, VS Code, Codex CLI, Other Clients). Pick yours to see its snippet, with a hint that says where to paste it, and a **Copy** button.

Once an agent connects, a **Recent Clients** row appears under Status with the names of the latest clients.

## Access token

With **Require Access Token** off, any app on your Mac can connect without a token. The server still never accepts connections from other devices.

With **Require Access Token** on, every request must carry the header `Authorization: Bearer YOUR_TOKEN`. Mica creates the token the first time you turn the switch on and shows it as **Access Token**, with **Show**, **Copy** and **Regenerate…** buttons. The token stays the same across restarts until you press **Regenerate…**.

The snippets in Settings include the header automatically while the switch is on. The examples on this page show both forms: use the shorter one when the switch is off, and replace `YOUR_TOKEN` with your token when it's on. If you turn the switch on after adding a client, copy the snippet again and update the client.

## Claude Code

Run this in Terminal:

```bash
claude mcp add --transport http mica http://127.0.0.1:3847/mcp
```

With Require Access Token on:

```bash
claude mcp add --transport http mica http://127.0.0.1:3847/mcp --header "Authorization: Bearer YOUR_TOKEN"
```

By default Claude Code adds the server for the current project only. Add `-s user` to use Mica from every project. Start a new Claude Code session after adding the server so the tools load.

To change the address or token later, remove the server and add it again:

```bash
claude mcp remove mica
```

## Claude Desktop

Claude Desktop connects through the `mcp-remote` bridge, which needs Node.js. Add this to `claude_desktop_config.json`, then quit and reopen Claude:

```json
{
  "mcpServers": {
    "mica": {
      "command": "npx",
      "args": ["mcp-remote", "http://127.0.0.1:3847/mcp", "--transport", "http-only"]
    }
  }
}
```

With Require Access Token on, pass the header through an environment variable:

```json
{
  "mcpServers": {
    "mica": {
      "command": "npx",
      "args": ["mcp-remote", "http://127.0.0.1:3847/mcp", "--transport", "http-only", "--header", "Authorization:${MICA_AUTH}"],
      "env": { "MICA_AUTH": "Bearer YOUR_TOKEN" }
    }
  }
}
```

> Keep `Authorization:${MICA_AUTH}` exactly as shown, with no space after the colon.

If your configuration file already has other servers, add the `"mica"` entry inside the existing `"mcpServers"` object.

## Cursor

Add this to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mica": {
      "url": "http://127.0.0.1:3847/mcp"
    }
  }
}
```

With Require Access Token on:

```json
{
  "mcpServers": {
    "mica": {
      "url": "http://127.0.0.1:3847/mcp",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}
```

## VS Code

Add this to `.vscode/mcp.json` in your workspace, or to your user MCP configuration:

```json
{
  "servers": {
    "mica": {
      "type": "http",
      "url": "http://127.0.0.1:3847/mcp"
    }
  }
}
```

With Require Access Token on:

```json
{
  "servers": {
    "mica": {
      "type": "http",
      "url": "http://127.0.0.1:3847/mcp",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}
```

> A workspace `.vscode/mcp.json` is often committed to a repository. If you use a token, put the entry in your user configuration instead.

## Codex CLI

Add this to `~/.codex/config.toml`:

```toml
[mcp_servers.mica]
url = "http://127.0.0.1:3847/mcp"
```

With Require Access Token on:

```toml
[mcp_servers.mica]
url = "http://127.0.0.1:3847/mcp"
http_headers = { "Authorization" = "Bearer YOUR_TOKEN" }
```

## Other clients

Any MCP client that supports the Streamable HTTP transport can connect:

| Setting | Value |
|---|---|
| URL | `http://127.0.0.1:3847/mcp` |
| Transport | Streamable HTTP (POST JSON-RPC) |
| Authentication | None, or the header `Authorization: Bearer YOUR_TOKEN` when Require Access Token is on |

Technical details for client authors:

- Responses are plain JSON. The server doesn't open a server-sent events stream, so `GET /mcp` returns 405.
- Notifications receive an empty 202 response. Batched JSON-RPC requests are supported.
- The server accepts the `initialize` handshake for protocol versions 2024-11-05, 2025-03-26, 2025-06-18 and 2025-11-25, and `server/discover` for 2026-07-28.
- Requests that carry an `Origin` header from a non-local web page are refused with 403.
- Request bodies are limited to 96 MB and must use `Content-Length` (no chunked uploads).

## Check that it works

Check that the server is running. This needs no token:

```bash
curl -s http://127.0.0.1:3847/
```

You should see a line that starts with `Mica MCP server`, followed by the app version.

List the tools. Leave out the `Authorization` header if Require Access Token is off:

```bash
curl -s http://127.0.0.1:3847/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

The response lists the tools your permissions allow.

In Claude Code, run:

```bash
claude mcp list
```

The `mica` entry should show as connected. Then ask your agent something simple, such as "List my Mica boards". The call appears in the **Activity** list at the bottom of Settings → Agents.

## Documentation endpoints

Mica serves its agent documentation in three ways. All three are generated from the installed version of Mica, so they always match the tools you have.

- **Over HTTP**: `http://127.0.0.1:3847/docs` (the overview) and `http://127.0.0.1:3847/docs/<topic>.md`. These pages need no token.
- **With the `get_docs` tool**: for example `get_docs {"topic": "guide"}`.
- **As MCP resources**: `mica://docs/<topic>.md`, for clients that browse resources.

| Topic | Contents |
|---|---|
| `index` | Endpoint, authentication, your current permissions and a quick start |
| `guide` | Concepts, coordinates, the `create_items` spec for every item type, workflow and recipes |
| `tools` | Every tool with its parameters |
| `properties` | Every item, page, layer and board property that the `update_*` tools accept |
| `types` | Complete JSON for each settings object: effects, paints, auto layout, prototype, variables, text |
| `commands` | Command ids for `run_command` |
| `enums` | Allowed values: blend modes, constraints, transitions, device mockups, Effect Studio kinds and parameters |

In Settings → Agents → **Documentation**, **Open Documentation** opens the overview in your browser, **Save as Markdown…** saves every topic in one file, and **Copy Docs URL** copies the address.
