const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  await prisma.$transaction(
    Object.keys(prisma).map((model) => {
      if (model[0] === '_' || model.includes('$')) {
        return prisma.user.findUnique({ where: { email: '' } });
      }
      return prisma[model].deleteMany();
    }),
  );
  console.log('Deleted all data');
};

main();
