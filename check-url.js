const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: { images: true }
  });
  console.log(JSON.stringify(products[0].images, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
