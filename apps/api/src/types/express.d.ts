declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: IUser;
      token?: string;
    }
  }
}

export {};
