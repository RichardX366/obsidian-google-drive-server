import express from 'express';
import { PrismaClient } from '@prisma/client';
import attachMiddleware, { handleError } from 'rx-express-middleware';
import { initiatePagination } from 'rx-express-middleware/dist/prismaPagination';

export const app = express();
attachMiddleware(app);
export const prisma = new PrismaClient();
export const paginate = initiatePagination(10, prisma);

import baseRouter from './routes';

app.use(baseRouter);

app.use(handleError({ prisma: true }));

app.listen(process.env.PORT || 3005, () =>
  console.log(
    `🚀 Server ready at: http://localhost:${process.env.PORT || 3005}`,
  ),
);
