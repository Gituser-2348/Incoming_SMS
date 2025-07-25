import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncdeccryptoService {
  encrypted: any = "";
  decrypted: string;
  constructor() { }
encrypt(encrypted){
  // var encrypt =  CryptoJS.AES.encrypt(JSON.stringify(model), '1234567890qwerty');
  let encJson = CryptoJS.AES.encrypt(encrypted, 'aes').toString();
  // base64 processing of encrypted data, the principle: is to first convert the string to an array of utf8 characters, and then converted to base64 data
  let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
  return encData;
}


  
}
