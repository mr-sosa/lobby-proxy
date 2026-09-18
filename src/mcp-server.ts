import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { makeLobbyApiRequest } from './api';

// Define tool schemas with Zod
const GetRoomsSchema = z.object({
  page: z.number().optional(),
});

const GetRoomStatusSchema = z.object({
  page: z.number().optional(),
});

const GetAvailableRoomsV2Schema = z.object({
  start_date: z.string().describe('YYYY-MM-DD format'),
  end_date: z.string().describe('YYYY-MM-DD format'),
  category_id: z.number().optional(),
  page: z.number().optional(),
  paginate: z.number().optional(),
});

const GetProductsSchema = z.object({
  page: z.number().optional(),
  paginate: z.number().optional(),
});

const GetRatePlansSchema = z.object({
  paginate: z.number().optional(),
});

const EmptySchema = z.object({});

const CreateCustomerSchema = z.object({
  type: z.number().describe('Customer type'),
  customer_document: z.string().optional(),
  customer_nationality: z.string().optional(),
  name: z.string().optional(),
  surname: z.string().optional(),
  document_id: z.number().optional(),
  birthdate: z.string().optional(),
  second_surname: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  activities: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
});

const GetBookingsSchema = z.object({
  creation_date_from: z.string().optional(),
  creation_date_to: z.string().optional(),
  check_in_from: z.string().optional(),
  check_in_to: z.string().optional(),
  check_out_from: z.string().optional(),
  check_out_to: z.string().optional(),
  channel_id: z.number().optional(),
  category_id: z.number().optional(),
  room_id: z.number().optional(),
  customer_document: z.string().optional(),
  customer_nationality: z.string().optional(),
});

const CreateBookingSchema = z.object({
  category_id: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  total_adults: z.number().optional(),
  total_children: z.number().optional(),
  holder_name: z.string().optional(),
  customer_document: z.string().optional(),
  customer_nationality: z.string().optional(),
  rates_per_day: z.array(z.any()).optional(),
  note: z.string().optional(),
  payment: z.number().optional(),
  channel: z.number().optional(),
});

const GetBookingDetailsSchema = z.object({
  booking_id: z.number(),
});

const CancelBookingSchema = z.object({
  booking_id: z.number(),
  cancellation_reason: z.string().optional(),
  description: z.string().optional(),
});

const CreateBlockSchema = z.object({
  category_id: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  number_rooms: z.number().optional(),
  time: z.number().optional(),
  note: z.string().optional(),
});

const DeleteBlockSchema = z.object({
  block_id: z.number(),
});

const GetOccupancySchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  category_id: z.number().optional(),
});

const AddProductSchema = z.object({
  booking_id: z.number().optional(),
  items: z.array(
    z.object({
      product_id: z.number().optional(),
      cant: z.number().optional(),
      inventory_center_id: z.number().optional(),
    })
  ).optional(),
});

const UpdateSeasonsSchema = z.object({
  category_id: z.number().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  min_stay: z.number().optional(),
  max_stay: z.number().optional(),
  lead_day: z.number().optional(),
  children: z.number().optional(),
  fri: z.number().optional(),
  sat: z.number().optional(),
  sun: z.number().optional(),
  prices: z.array(
    z.object({
      people: z.number().optional(),
      price: z.number().optional(),
    })
  ).optional(),
});

const toJson = (schema: any) => zodToJsonSchema(schema);

export function createMcpServer(): Server {
  const server = new Server(
    {
      name: 'lobby-pms-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Setup tool list
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'getRoomTypes',
          description: 'Obtener habitaciones',
          inputSchema: toJson(GetRoomsSchema),
        },
        {
          name: 'getRoomStatus',
          description: 'Obtener estado de habitaciones',
          inputSchema: toJson(GetRoomStatusSchema),
        },
        {
          name: 'getAvailableRoomsV2',
          description: 'Obtener disponibilidad y tarifas V2',
          inputSchema: toJson(GetAvailableRoomsV2Schema),
        },
        {
          name: 'getProducts',
          description: 'Obtener productos y servicios configurados para venta online',
          inputSchema: toJson(GetProductsSchema),
        },
        {
          name: 'getRatePlans',
          description: 'Obtener planes de tarifas configurados',
          inputSchema: toJson(GetRatePlansSchema),
        },
        {
          name: 'getSalesChannels',
          description: 'Obtener canales de venta habilitados',
          inputSchema: toJson(EmptySchema),
        },
        {
          name: 'getDocumentTypes',
          description: 'Obtener tipos de documentos válidos',
          inputSchema: toJson(EmptySchema),
        },
        {
          name: 'createCustomer',
          description: 'Crear cliente nuevo',
          inputSchema: toJson(CreateCustomerSchema),
        },
        {
          name: 'getBookings',
          description: 'Obtener reservas',
          inputSchema: toJson(GetBookingsSchema),
        },
        {
          name: 'createBooking',
          description: 'Crear reserva',
          inputSchema: toJson(CreateBookingSchema),
        },
        {
          name: 'getBookingDetails',
          description: 'Detalle de una reserva',
          inputSchema: toJson(GetBookingDetailsSchema),
        },
        {
          name: 'cancelBooking',
          description: 'Cancelar reserva',
          inputSchema: toJson(CancelBookingSchema),
        },
        {
          name: 'createBlock',
          description: 'Crear bloqueo de habitación',
          inputSchema: toJson(CreateBlockSchema),
        },
        {
          name: 'deleteBlock',
          description: 'Eliminar bloqueo',
          inputSchema: toJson(DeleteBlockSchema),
        },
        {
          name: 'getOccupancy',
          description: 'Obtener ocupación hotelera',
          inputSchema: toJson(GetOccupancySchema),
        },
        {
          name: 'getDailyOccupancy',
          description: 'Obtener ocupación diaria',
          inputSchema: toJson(GetOccupancySchema),
        },
        {
          name: 'addProductToBooking',
          description: 'Agregar consumo a una reserva',
          inputSchema: toJson(AddProductSchema),
        },
        {
          name: 'updateRatesAndRestrictions',
          description: 'Actualizar tarifas y restricciones',
          inputSchema: toJson(UpdateSeasonsSchema),
        },
      ],
    };
  });

  // Implement handlers
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: any;
      switch (name) {
        case 'getRoomTypes': {
          const parsed = GetRoomsSchema.parse(args);
          result = await makeLobbyApiRequest('GET', '/rooms', undefined, parsed);
          break;
        }
        case 'getRoomStatus': {
          const parsed = GetRoomStatusSchema.parse(args);
          result = await makeLobbyApiRequest('GET', '/rooms/status', undefined, parsed);
          break;
        }
        case 'getAvailableRoomsV2': {
          const parsed = GetAvailableRoomsV2Schema.parse(args);
          result = await makeLobbyApiRequest('GET', '/available-rooms', undefined, parsed);
          break;
        }
        case 'getProducts': {
          const parsed = GetProductsSchema.parse(args);
          result = await makeLobbyApiRequest('GET', '/products', undefined, parsed);
          break;
        }
        case 'getRatePlans': {
          const parsed = GetRatePlansSchema.parse(args);
          result = await makeLobbyApiRequest('GET', '/rate-plans', undefined, parsed);
          break;
        }
        case 'getSalesChannels': {
          result = await makeLobbyApiRequest('GET', '/channels');
          break;
        }
        case 'getDocumentTypes': {
          result = await makeLobbyApiRequest('GET', '/documents');
          break;
        }
        case 'createCustomer': {
          const parsed = CreateCustomerSchema.parse(args);
          const { type, ...data } = parsed;
          result = await makeLobbyApiRequest('POST', `/customer/${type}`, data);
          break;
        }
        case 'getBookings': {
          const parsed = GetBookingsSchema.parse(args);
          result = await makeLobbyApiRequest('GET', '/bookings', undefined, parsed);
          break;
        }
        case 'createBooking': {
          const parsed = CreateBookingSchema.parse(args);
          result = await makeLobbyApiRequest('POST', '/bookings', parsed);
          break;
        }
        case 'getBookingDetails': {
          const parsed = GetBookingDetailsSchema.parse(args);
          result = await makeLobbyApiRequest('GET', `/bookings/${parsed.booking_id}`);
          break;
        }
        case 'cancelBooking': {
          const parsed = CancelBookingSchema.parse(args);
          const { booking_id, ...data } = parsed;
          result = await makeLobbyApiRequest('POST', `/cancel-booking/${booking_id}`, data);
          break;
        }
        case 'createBlock': {
          const parsed = CreateBlockSchema.parse(args);
          result = await makeLobbyApiRequest('POST', '/block', parsed);
          break;
        }
        case 'deleteBlock': {
          const parsed = DeleteBlockSchema.parse(args);
          result = await makeLobbyApiRequest('DELETE', `/block/${parsed.block_id}`);
          break;
        }
        case 'getOccupancy': {
          const parsed = GetOccupancySchema.parse(args);
          result = await makeLobbyApiRequest('GET', '/occupancy', undefined, parsed);
          break;
        }
        case 'getDailyOccupancy': {
          const parsed = GetOccupancySchema.parse(args);
          result = await makeLobbyApiRequest('GET', '/daily-occupancy', undefined, parsed);
          break;
        }
        case 'addProductToBooking': {
          const parsed = AddProductSchema.parse(args);
          result = await makeLobbyApiRequest('POST', '/booking/add-product-service', parsed);
          break;
        }
        case 'updateRatesAndRestrictions': {
          const parsed = UpdateSeasonsSchema.parse(args);
          result = await makeLobbyApiRequest('POST', '/seasons', parsed);
          break;
        }
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error executing tool ${name}: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
