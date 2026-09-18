import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp-server';

async function run() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LobbyPMS MCP server running on stdio');
}

run().catch((error) => {
  console.error('Fatal error in MCP server:', error);
  process.exit(1);
});
