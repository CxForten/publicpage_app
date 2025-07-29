import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map, take } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({providedIn: 'root'})
export class NoAuthGuard implements CanActivate { 
    constructor (private auth: AuthService, private router: Router) {}
    canActivate(){
        return this.auth.isLoggedIn$.pipe(
            take(1),
            map(loggedIn =>
                loggedIn
                ? this.router.createUrlTree(['/user'])
                : true
            )
        );
    }
}