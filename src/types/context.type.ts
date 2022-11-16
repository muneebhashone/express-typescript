import { Request, Response } from 'express';
import { User } from '../user/user.schema';

type Ctx = {
  req: Request & { user?: Omit<User, 'password'> };
  res: Response;
};

export default Ctx;
