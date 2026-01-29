import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WaitingService {

  //loading component subscribes to this change.
  public loadingChange: Subject<boolean> = new Subject<boolean>();

  waitingMessage: string;

  constructor(private spinnerService: NgxSpinnerService) 
  { 
    
  }

  busy(requestType: string) {

    switch (requestType) {
      case "GET":
        this.waitingMessage = "Loading. Please Wait...";
        break;
      case "POST":
        this.waitingMessage = "Saving. Please Wait...";
        break;
      default:
        this.waitingMessage = "Processing. Please Wait...";
        break;
    }

    this.loadingChange.next(true);
  }

  idle() {
    this.loadingChange.next(false);
  }
}
