import { areCoursesLoaded } from './courses.selectors';
import { tap, first, finalize, filter } from 'rxjs/operators';
import { loadAllCourses } from './course.actions';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from "@angular/core";
import { AppState } from 'app/reducers';

@Injectable()
export class CoursesResolver implements Resolve<any> {

  loading = false; //for flex, so not firing twice during navigation transition
  constructor(private store: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> {
    return this.store.pipe(
      select(areCoursesLoaded),
      tap(coursesLoaded => {
        if(!this.loading && !coursesLoaded) {
          this.loading = true;
          this.store.dispatch(loadAllCourses());
        }
      }),
      filter(coursesLoaded => coursesLoaded),
      first(), //first method for tell the store dispatch must be completed before to next step
      finalize(() => this.loading = false) // if this store/ob complete or error, the flex loading return back to initial value to false
    );
  }
}
