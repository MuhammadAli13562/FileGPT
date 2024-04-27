export interface SignInCreds {
  email: string;
  password: string;
}

export interface SignUpCreds {
  email: string;
  password: string;
  name: string;
}

export interface SignInReturns {
  response: Response;
  token: string;
  status: number;
}

export interface SignUpReturns {
  response: Response;
  token: string;
  status: number;
}
