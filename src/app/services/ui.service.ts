import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UiService  {
  
  private teachingManualSection: string = 'Teaching Manual';

  private breadcrumbShow = new BehaviorSubject<boolean>(true);
  private sidebarMinimize = new BehaviorSubject<boolean>(false);

  breadcrumbShow$ = this.breadcrumbShow.asObservable();
  sidebarMinimize$ = this.sidebarMinimize.asObservable();


  showBreadcrumbs(show: boolean) {
    this.breadcrumbShow.next(show);
  }

  minimizeSidebar(minimize: boolean) {
    this.sidebarMinimize.next(minimize);
  }

  setTeachingManualSection(section: string) {
    this.teachingManualSection = section;
  }

  getTeachingManualPage(): number {
    if (this.router.url === '/training/train-task') {
      if (this.teachingManualSection === 'Travelling Italy') {
        return 5;
      } else if (this.teachingManualSection === 'E-Commerce') {
        return 6;
      } else if (this.teachingManualSection === 'Daily Living') {
        return 7;
      }
      return 1;
    } else {
      return 1;
    }
  }

  getTeachingManualSection(): string {
    if (this.router.url === '/training/train-task') {
      return this.teachingManualSection;
    } else {
      return 'Teaching Manual';
    }
  }

  getHelpURL(getBackup: boolean): Observable<string> {
    return this.httpClient.get<string>('/api/Documents/GetHelpURL',
      {
        params: new HttpParams().set('getBackup', getBackup.toString())
      })
      .pipe(
        tap(_ => this.log('fetched Teaching Manual URL')),
        catchError(this.handleError<string>('Teaching Manual', ''))
      );
  }

  getHelpPage(): number {
    return 2;
  }
  
private handleError<T>(operation = 'operation', result: T) {
  return (error: any): Observable<T> => {
    console.error(error);
    this.log(`${operation} failed: ${error.message}`);
    return of(result);
  };
}

  constructor(private httpClient: HttpClient, private router: Router) {
  }

 

  private log(message: string) {
    console.log(`UiService: ${message}`);
  }

}
