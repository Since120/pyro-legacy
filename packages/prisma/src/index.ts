// Direkter require für Prisma v6
// @ts-ignore - Umgehen der Typprobleme mit Prisma v6
const { PrismaClient } = require('@prisma/client/default')

// Export a singleton instance of the PrismaClient
export const prisma = new PrismaClient()

// Re-export für Kompatibilität mit bestehendem Code
export { PrismaClient }

// Default export for convenience
export default prisma
