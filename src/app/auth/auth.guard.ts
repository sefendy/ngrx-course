import { tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from './../reducers/index';
import { Observable } from 'rxjs';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { Injectable } from '@angular/core';
import { isLoggedIn } from './auth.selectors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    :Observable<boolean> {
      return this.store
        .pipe(
          select(isLoggedIn),
          tap(loggedIn => {
            if(!loggedIn) {
              this.router.navigateByUrl('/login');
            }
          })
        )
    }
}
