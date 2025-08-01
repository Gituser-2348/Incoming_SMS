import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log("Isadmin");
    if (this.authenticationService.IsAdmin) {
      // console.log("Isadmin true");
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    //   this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
