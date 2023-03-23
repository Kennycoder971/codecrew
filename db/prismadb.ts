import { PrismaClient } from "@prisma/client";

const client: PrismaClient = global.prismadb || new PrismaClient();

if (process.env.NODE_ENV === "production") global.prismadb = client;

export default client;
