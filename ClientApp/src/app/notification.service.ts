import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

export class NotificationService {
    baseUrl='/app'
    constructor(private http:HttpClient) { }
    subscribe(subscription:any){
    return this.http.post('subscribe',subscription).pipe(map(res=>res));
    }
    triggerMessage(message){
    return this.http.post('message',JSON.parse(message)).pipe(map(res=>res));
    }
    }