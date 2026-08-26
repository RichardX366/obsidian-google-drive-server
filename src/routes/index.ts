import { Router } from 'express';
import authRouter from './auth';

const baseRouter = Router();

baseRouter.get('/', (req, res) => {
  res.send('Everything works fine.');
});

baseRouter.use('/auth', authRouter);

export default baseRouter;
