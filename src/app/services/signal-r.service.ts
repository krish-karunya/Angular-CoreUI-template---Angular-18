// import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr';
// import { AuthorizeService } from '../../api-authorization/authorize.service';
// import { of as observableOf, BehaviorSubject } from 'rxjs';
// import { HelperService } from './helper.service';
// import { firstValueFrom } from 'rxjs';
// import {
//   ISyncTrainingModel,
//   ITrainingSetupModel,
//   ITrainingHubEventModel,
//   TrainingHubEvents,
// } from '../_models/signal-r-service-models';

// @Injectable({
//   providedIn: 'root',
// })
// export class SignalRService {
//   public hubConnection!: signalR.HubConnection;

//   private TrainingInitSource = new BehaviorSubject<ITrainingSetupModel | null>(
//     null,
//   );
//   public InitTraining$ = this.TrainingInitSource.asObservable();

//   private SyncTrainingSource = new BehaviorSubject<ISyncTrainingModel | null>(
//     null,
//   );
//   public SyncTraining$ = this.SyncTrainingSource.asObservable();

//   private TraineeUpdateSource = new BehaviorSubject<ISyncTrainingModel | null>(
//     null,
//   );
//   public TraineeUpdate$ = this.TraineeUpdateSource.asObservable();

//   private TrainingHubEventSource =
//     new BehaviorSubject<ITrainingHubEventModel | null>(null);
//   public TrainingHubEvent$ = this.TrainingHubEventSource.asObservable();

//   constructor(
//     private authorizeService: AuthorizeService,
//     private helperService: HelperService,
//   ) {}

//   public startConnection = (): Promise<boolean> => {
//     const options: signalR.IHttpConnectionOptions = {
//       skipNegotiation: true,
//       transport: signalR.HttpTransportType.WebSockets,
//       accessTokenFactory: () =>
//         firstValueFrom(this.authorizeService.getAccessToken()),
//     };

//     const syncUrl = this.helperService.getOrigin() + '/Sync';

//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(syncUrl, options)
//       .withAutomaticReconnect()
//       .build();

//     return this.hubConnection
//       .start()
//       .then(() => {
//         this.hubConnection.on('inittraining', (data:any) => {
//           this.TrainingInitSource.next(data);
//         });

//         this.hubConnection.on('synctraining', (stm:any) => {
//           this.SyncTrainingSource.next(stm);
//         });

//         this.hubConnection.on('traineeupdate', (data:any) => {
//           this.TraineeUpdateSource.next(data);
//         });

//         this.hubConnection.on('trainingstatusevent', (data:any) => {
//           this.TrainingHubEventSource.next(data);
//         });

//         return true;
//       })
//       .catch((err:any) => {
//         console.log('Error while starting connection: ' + err);
//         return false;
//       });
//   };

//   public getAccessToken() {
//     return this.authorizeService.getAccessToken();
//   }

//   public getLatestSync() {
//     return this.SyncTrainingSource.getValue();
//   }

//   public getLatestTraineeUpdate() {
//     return this.TraineeUpdateSource.getValue();
//   }

//   public broadcastStartTraining = (data: ITrainingSetupModel) => {
//     this.hubConnection
//       .invoke('inittraining', data)
//       .catch((err:any) => console.error(err));
//   };

//   public broadcastSyncTraining = (data: ISyncTrainingModel) => {
//     this.hubConnection
//       .invoke('synctraining', data)
//       .catch((err:any) => console.error(err));
//   };

//   public broadcastTraineeUpdate = (data: ISyncTrainingModel) => {
//     this.hubConnection
//       .invoke('traineeupdate', data)
//       .catch((err:any) => console.error(err));
//   };

//   public broadcastStatusUpdate = (data: ITrainingHubEventModel) => {
//     this.hubConnection
//       .invoke('trainingstatusevent', data)
//       .catch((err:any) => console.error(err));
//   };

//   public onTraineeDisconnect = () => {
//     this.SyncTrainingSource.next(null);
//     this.TrainingInitSource.next(null);
//   };
// }
