export interface SignUpDB_Type {
  email: string;
  name: string;
  passwordHash: string;
}

export interface SignInDB_Type {
  email: string;
  passwordHash: string;
}

export interface SignUpRequestType {
  email: string;
  name: string;
  password: string;
}
export interface SignInRequestType {
  email: string;
  password: string;
}

export interface VerifyType {
  token: string;
}

export interface JwtPayloadType {
  email: string;
  passwordHash: string;
}
