import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { WaitingService } from '../services/waiting.service';
import { delay, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  defaultType: string = 'UNKNOWN';
  requestType: string = '';
  requestCount: number = 0;

  constructor(private waitingService: WaitingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    //Remove console log before this goes to Production.
    //Logging this information to determine if further code should be added to ignore certain end points.
    //console.log("Loading Interceptor: " + (request.url ?? 'null'));

    this.requestType = this.defaultType;
    if (!!request) {
      this.requestType = request.method.toUpperCase();
    }

    if (this.requestCount === 0) {
      this.waitingService.busy(this.requestType);
    }

    this.requestCount++;
    return next.handle(request).pipe(
      delay(0),
      finalize(() => {
        this.requestCount--;
        if (this.requestCount === 0) {
          this.waitingService.idle();
        }
      }),
    );
  }
}
