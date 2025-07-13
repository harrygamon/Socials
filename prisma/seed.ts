import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.tier.createMany({
    data: [
      { name: 'Free', price: 0, description: 'Basic access', features: ['Basic features'] },
      { name: 'Silver', price: 1000, description: 'Silver subscription', features: ['Silver features'] },
      { name: 'Gold', price: 2000, description: 'Gold subscription', features: ['Gold features'] },
    ],
    skipDuplicates: true,
  })
  console.log('Seeded tiers!')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect()) 