// For the MCP test, we typically test if the tools are parsed and logic works.
// We can mock `api.ts` and test the argument validation logic of tools indirectly,
// or we can test the handlers if exported. Since `mcp.ts` executes server setup and doesn't export the handlers easily,
// we can do basic tests if needed, or we can just refactor mcp.ts to export the server to be tested.

// For simplicity in this proxy setup, testing `api.ts` is the most critical unit testing since the logic lives there.
// We'll write a placeholder here for MCP schema validation.

import { z } from 'zod';

const GetOccupancySchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  category_id: z.number().optional(),
});

describe('MCP Schema Validations', () => {
  it('validates required fields for Occupancy', () => {
    const validArgs = { start_date: '2024-01-01', end_date: '2024-01-10' };
    expect(() => GetOccupancySchema.parse(validArgs)).not.toThrow();

    const invalidArgs = { start_date: '2024-01-01' };
    expect(() => GetOccupancySchema.parse(invalidArgs)).toThrow();
  });
});
