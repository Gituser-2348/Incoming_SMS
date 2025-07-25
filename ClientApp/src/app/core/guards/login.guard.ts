import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { SigninService } from './../../views/sign-in/sign-in.service';

@Injectable({
   providedIn: 'root'
})
export class LoginGuard implements CanActivate {

   constructor(private authService: AuthService, private router: Router,private signInService:SigninService) {}

   canActivate(
   next: ActivatedRouteSnapshot,
   state: RouterStateSnapshot): boolean | UrlTree {
       let url: string = state.url;
        let val: string = this.signInService.decryptData(sessionStorage.getItem('IsLoggedIn'));

        if(val != null && val == "true"&& this.signInService.decryptData(sessionStorage.getItem('UserName'))!=null){
            if(url!= "/login"){
               return true;
           }
            else {
               return this.router.parseUrl('/login');
           }
        } else {
         window.alert("You don't have permission to view this page");
         //console.log("You don't have permission to view this page");
         return this.router.parseUrl('/login');
        }
     }
}
