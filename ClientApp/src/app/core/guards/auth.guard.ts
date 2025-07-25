import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SigninService } from '../../views/sign-in/sign-in.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private signinService:SigninService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (this.signinService.decryptData(sessionStorage.getItem('UserName')) != null) {
      
      // authorised so return true
      return true;
    }
    else{
      window.alert("You don't have permission to view this page");
      return this.router.parseUrl('/login');
    }

    // not logged in so redirect to login page with the return url
   // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    //return false;
  }
}

