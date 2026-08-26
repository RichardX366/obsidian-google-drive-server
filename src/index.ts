import express from 'express';

import accessRouter from './routes/access.js';

const app = express();

app.use(express.json());
app.use('/api/access', accessRouter);

app.listen(process.env.PORT || 3005, () =>
  console.log(
    `🚀 Server ready at: http://localhost:${process.env.PORT || 3005}`,
  ),
);
