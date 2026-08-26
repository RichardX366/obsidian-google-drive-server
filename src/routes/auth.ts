import { Router } from 'express';
import {
  logIn,
  refreshToken,
  signUp,
  updateAuthLevel,
  updatePassword,
  updateUser,
} from '../controllers/auth';

const authRouter = Router();

authRouter.post('/login', logIn);
authRouter.post('/signUp', signUp);
authRouter.post('/refresh', refreshToken);
authRouter.put('/updatePassword/:id', updatePassword);
authRouter.put('/authLevel/:id', updateAuthLevel);
authRouter.put('/:id', updateUser);

export default authRouter;
