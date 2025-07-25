export interface User {
    userid: number;
    loginid: number;
    username: string;
    email: string;
    phone: string;
    role: string;
    accountId: string;
    account: string;
    location: string;
  }
  
  export interface firstuserInfo {
    userid: number;
    role: string;
  }
  
  export enum Role {
    SuperSuperAdmin = '100',
    SuperAdmin = '101',
    PrutechSupport = '102',
    AccountManager = '200',
    Supervisor = '201',
    Agent = '300'
  }
  
export interface LoginResp {
    idToken: string,
    expiresIn: number
  }

  