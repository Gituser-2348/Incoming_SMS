export interface loginmodel
{
    username?:string;
    password?:string;
    appname?:string;
    appid?:number;
}
export interface firstTimeLoginModel{
    SecurityQuestion?:string;
    Answer?:string;
    newpassword?:string;
    confirmpassword?:string;
    appid?:number;
    userid?:number;
}
export class SecQuestionddl {  
    Value: string;  
    Text: string;  
} 
  export interface authusermodel{
    SecurityQuestion?:string;
    Answer?:string;
    oldpassword?:string;
    captcha?:string;
    appid?:number;
    appname?:string;
    userid?:number;
    username?:string;
    otp?:number;
    
}
export interface changepassmodel{
    
    newpassword?:string;
    confpassword?:string;
    appid?:number;
    otp?:number;
    appname?:string;
    userid?:number;
    username?:string;
    otpBehind?:number;
}
