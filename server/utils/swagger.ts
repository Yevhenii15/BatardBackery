import swaggerJSDoc from "swagger-jsdoc";
import { join } from "path";

const apisGlob = join(process.cwd(), "server/api/**/*.ts");

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Batard Bakery API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        Admin: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true },
            email: { type: "string", example: "admin@batard.dk" },
            passwordHash: { type: "string", readOnly: true },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "admin@batard.dk" },
            password: { type: "string", example: "StrongPass123" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
            user: { $ref: "#/components/schemas/Admin" },
          },
        },
        HeroSection: {
          type: "object",
          required: ["title"],
          additionalProperties: false,
          properties: {
            title: { type: "string", example: "Bageri i Vejers Strand" },
            subTitle: {
              type: "string",
              example:
                "Batard Bakery er det bedste surdejsbageri i Vejers Strand",
            },
            heroImg1: { type: "string", example: "/images/hero1.jpg" },
            heroImg2: { type: "string", example: "/images/hero2.jpg" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        Company: {
          type: "object",
          required: ["shortDescription", "description"],
          properties: {
            shortDescription: {
              type: "string",
              example: "Ideen til Batard Bakery startede for mange år siden!",
            },
            description: {
              type: "string",
              example:
                "Batard Bakery er en passioneret og innovativ bagerivirksomhed med dybe rødder i fødevarebranchen, især inden for bageribranchen. Grundlagt af en erfaren gruppe fagfolk, der har arbejdet inden for fødevareindustrien i mange år, bringer vi ekspertise og kærlighed til håndværket til hver eneste brød og kage, vi bager.",
            },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        ContactInfo: {
          type: "object",
          required: ["email", "phone", "address"],
          properties: {
            email: { type: "string", example: "hello@batardbakery.dk" },
            phone: { type: "string", example: "+45 29 25 03 80" },
            openingHours: {
              type: "string",
              example: "Mon–Fri 08:00–17:00, Sat 09:00–13:00",
            },
            address: {
              type: "string",
              example: "Vejers Havvej 81B 6853 Vejers Strand",
            },
            logo: { type: "string", example: "/images/logo.svg" },
            cvr: { type: "string", example: "43368532" },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        ContactMessage: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true },
            firstName: { type: "string", example: "Yevhenii" },
            lastName: { type: "string", example: "Motov" },
            email: { type: "string", example: "you@example.com" },
            subject: { type: "string", example: "Order question" },
            message: { type: "string", example: "Can I change pickup time?" },
            closedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              readOnly: true,
              description:
                "Date when message was closed; automatically deleted 30 days after this",
            },
            status: {
              type: "string",
              enum: ["open", "closed"],
              example: "open",
            },

            adminNote: { type: "string", readOnly: true },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        Category: {
          type: "object",
          required: [
            "categoryName",
            "weekdayTime",
            "weekendsTime",
            "slotSizeMinutes",
            "leadTimeMinutes",
          ],
          properties: {
            _id: { type: "string", readOnly: true },
            categoryName: { type: "string", example: "Pizza" },
            weekdayTime: {
              type: "object",
              properties: {
                from: { type: "string", example: "12:00" },
                to: { type: "string", example: "14:00" },
              },
            },
            weekendsTime: {
              type: "object",
              properties: {
                from: { type: "string", example: "12:00" },
                to: { type: "string", example: "16:00" },
              },
            },
            slotSizeMinutes: { type: "integer", example: 15 },
            leadTimeMinutes: { type: "integer", example: 120 },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        Product: {
          type: "object",
          required: ["name", "price", "categoryId"],
          properties: {
            _id: { type: "string", readOnly: true },
            name: { type: "string", example: "Sourdough Bread" },
            description: {
              type: "string",
              example: "Classic 24h fermented sourdough.",
            },
            photo: {
              type: "string",
              example: "/images/products/sourdough.jpg",
            },
            price: { type: "number", example: 45 },
            categoryId: { type: "string", example: "6735b3d210d6b9ca96e4a123" },
            stock: { type: "integer", example: 60 },
            dailyCapacity: { type: "integer", example: 8 },
            active: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time", readOnly: true },
            updatedAt: { type: "string", format: "date-time", readOnly: true },
          },
        },
        BookingItem: {
          type: "object",
          properties: {
            productId: { type: "string" },
            name: { type: "string" },
            photo: { type: "string" },
            quantity: { type: "integer" },
            price: { type: "number" },
            subtotalPrice: { type: "number" },
          },
        },
        BookingCustomer: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            phone: { type: "string" },
            email: { type: "string" },
          },
        },
        BookingPickup: {
          type: "object",
          properties: {
            categoryId: { type: "string" },
            categoryName: { type: "string" },
            date: { type: "string", example: "2025-05-21" },
            timeSlot: { type: "string", example: "16:30" },
            orderNotes: { type: "string" },
          },
        },
        Booking: {
          type: "object",
          properties: {
            _id: { type: "string" },
            bookingNumber: { type: "string" },
            customer: { $ref: "#/components/schemas/BookingCustomer" },
            pickup: { $ref: "#/components/schemas/BookingPickup" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/BookingItem" },
            },
            totalPrice: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "completed"],
            },
            archived: { type: "boolean" },
            archivedAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BookingCreateRequest: {
          type: "object",
          properties: {
            bookingNumber: { type: "string" },
            customer: { $ref: "#/components/schemas/BookingCustomer" },
            pickup: {
              type: "object",
              properties: {
                categoryId: { type: "string" },
                date: { type: "string", example: "2025-05-21" },
                timeSlot: { type: "string", example: "16:30" },
                orderNotes: { type: "string" },
              },
            },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/BookingItem" },
            },
            totalPrice: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "completed"],
            },
          },
        },
      },
      responses: {
        NotFound: { description: "Not found" },
      },
    },
    servers: [{ url: "/" }],
  },
  apis: [apisGlob],
});
