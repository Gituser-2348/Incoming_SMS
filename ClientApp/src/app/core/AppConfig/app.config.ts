import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface IAppConfig {
  url: string;
  appName: string;
  api: {
    sms: string;
  }
}

@Injectable()
export class AppConfig {
  static Config: IAppConfig;
  constructor(private http: HttpClient) { }
  load() {
  //  console.log("appconfig.load()");
    const env = environment.production ? 'prod' : 'dev';
   // console.log('environment.production ?',env);
    const jsonFile = `config/config.${env}.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: IAppConfig) => {
        AppConfig.Config = <IAppConfig>response;
        
       // console.log(AppConfig.Config, 'appconfig.load()');
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }
}
