import { PrismaClient } from "@prisma/client"
// prismaclient is the main component used to interect with your database

declare global{
  var cachedPrisma: PrismaClient // in non-production environment only a single instance of prismaClient is stored globally so it can be used across different part of your application
}

let prisma: PrismaClient // This holds the instance of 'PrismaClient' that you will use to interect with db

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient() // in production every time new instance of prismaClient is created and used
} else{
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient() // in non-production environment only a single instance of prismaClient is stored globally so it can be used across different part of your application
    }
    prisma = global.cachedPrisma
}

export const db = prisma
