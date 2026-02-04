import { Injectable } from '@angular/core';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  IHttpConnectionOptions,
} from '@microsoft/signalr';
import { HelperService } from './helper.service';
import { AuthorizeService } from '../../api-authorization/authorize.service';
import { IJobStatus } from '../_models/event-grid-service-models';
import { Observable, Subject } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventGridService {
  private hubConnection: HubConnection;

  private JobStatusSource = new Subject<IJobStatus>();
  public JobStatus$ = this.JobStatusSource.asObservable();
  public isConnected: boolean = false;

  constructor(
    private authorizeService: AuthorizeService,
    private helperService: HelperService,
  ) {}

  public startConnection = (): Promise<boolean> => {
    const options: IHttpConnectionOptions = {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
     accessTokenFactory: () =>
  firstValueFrom(this.authorizeService.getAccessToken()),
    };

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.helperService.getOrigin() + '/EventGrid', options)
      .withAutomaticReconnect()
      .build();

    return this.hubConnection
      .start()
      .then(() => {
        this.isConnected = true;
        return this.isConnected;
      })
      .catch((err) => {
        console.log('Error while starting event grid connection:' + err);
        return this.isConnected;
      });
  };

  public addJobCompleteDataListener = (id: string) => {
    this.hubConnection.on(id, (data) => {
      this.JobStatusSource.next(data);
    });
  };

  public stopConnection() {
    this.hubConnection
      .stop()
      .then(() => {
        this.JobStatusSource.next(null);
        this.isConnected = false;
      })
      .catch((err) => {
        console.log('Error while stopping event grid connection:' + err);
      });
  }
}
