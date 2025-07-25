import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class EncDeccryptoServiceService {
  encrypted: any = "";
  decrypted: string;
  constructor() {}

  encryptUsingAES256(text) {
    let _key = CryptoJS.enc.Utf8.parse("bf3c199c2470cb477d907b1e0917c17b");
    let _iv = CryptoJS.enc.Utf8.parse("5183666c72eec9e4");
    let encrypted = CryptoJS.AES.encrypt(text, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    this.encrypted = encrypted.toString();
    return this.encrypted;
  }

  encryptData(data) {

    if (data != null && data != undefined) {
      // return(CryptoJS.AES.encrypt(data.toString(),'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString())
      return CryptoJS.AES.encrypt(
        JSON.stringify({ data }),
        "U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw="
      ).toString();
    } else {
      return "";
    }
  }

  decryptUsingAES256(encrypted) {
    let _key = CryptoJS.enc.Utf8.parse("bf3c199c2470cb477d907b1e0917c17b");
    let _iv = CryptoJS.enc.Utf8.parse("4c12a804dd5c017400346b2c686cc7d4");

    this.decrypted = CryptoJS.AES.decrypt(encrypted, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    // console.log(this.decrypted);
    return this.decrypted;
  }

  encdec(text) {
    var key = CryptoJS.enc.Utf8.parse("ds8am3wys3pd75nf0ggtvajw2k3uny92"); // Use Utf8-Encoder.
    var iv = CryptoJS.enc.Utf8.parse("jm8lgqa3j1d0ajus"); // Use Utf8-Encoder

    var encryptedCP = CryptoJS.AES.encrypt("2730007809303", key, { iv: iv });
    var decryptedWA = CryptoJS.AES.decrypt(encryptedCP, key, { iv: iv });

    var encryptedBase64 = encryptedCP.toString(); // Short for: encryptedCP.ciphertext.toString(CryptoJS.enc.Base64);
    var decryptedUtf8 = decryptedWA.toString(CryptoJS.enc.Utf8); // Avoid the Base64 detour.
  }

  decryptDataWithKey(encryptedData) {
    try {

      // console.log(encryptedData,"Data Encription")
      if (encryptedData != null && encryptedData != undefined) {
        // return (CryptoJS.AES.decrypt(encryptedData, 'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString(CryptoJS.enc.Utf8))
        let decrypted = CryptoJS.AES.decrypt(
          encryptedData,
          "U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw="
        ).toString(CryptoJS.enc.Utf8);
        // console.log(decrypted,"Data")
        return JSON.parse(decrypted).data;
      } else {
        return "";
      }
    } catch (err) {
      console.log(err, "Error");
      return "";
    }
  }
  decryptAES(cipherText) {
    var bytes  = CryptoJS.AES.decrypt(cipherText, "aes-secret-key-for-sso");
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return decryptedData;
  }
  encrypt() {}
}
