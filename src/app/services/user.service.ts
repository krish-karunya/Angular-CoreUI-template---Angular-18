import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { filter, map, mergeMap, take, tap, catchError, publishReplay, refCount } from 'rxjs/operators';

import { IOrganization, IDivision, ISubDivision, IGrade, IGender, IRace, IEconomicStatus, ISpecialEducationCode } from './lookupService';
import { ITrainer } from './training.service';
import { HelperService } from './helper.service';
import { UserParams, UserRoles } from '../_models/user-service-models'
import { Role } from '../constants/_roles';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private currentUserSource = new BehaviorSubject({
    id: 'UnknownUserID',
    userName: 'Unknown User',
    organizationId: null,
    organization: null,
    firstName: 'Unknown FName',
    lastName: 'Unknown LName',
    active: false,
    isSuperAdmin: false,
    isOrgAdmin: false,
    isDivAdmin: false,
    isTrainer: false,
    isTrainee: false,
    isSupervisor: false,
    roles: []
  } as IApplicationUserRow);

  public CurrentUser$ = this.currentUserSource.asObservable();
  public userRoles: Observable<string[]>;
  public userParams: UserParams;
  private userAssignedRoles: UserRoles;

  private setCurrentUser(newUser: IApplicationUserRow): void {
    this.currentUserSource.next(newUser);
    this.userParams = new UserParams(newUser);
    this.userAssignedRoles = new UserRoles(newUser);
  }

  // Inject HTTP client here
  constructor(private http: HttpClient, private helpers: HelperService) {
  }

  //This should only get called in default-layout.component. Instead use getApplicationUserNonBinding.
  getApplicationUser(id: string) {
    return this.http.get<IApplicationUserRow>('/api/ApplicationUsers/' + id)
      .pipe(
        map(result => this.setCurrentUser(result)),
        tap(_ =>
            this.log(`fetched Application User id=${id}`
          )
        ),
        catchError(this.handleError<IApplicationUserRow>(`getApplicationUser id=${id}`))
      );
  }

  GetUserRoles() {
    if (!this.userRoles) {
      this.userRoles = this.http.get('/identity/account/manage?handler=roles').pipe(
        map((result: string[]) => result),
        publishReplay(1),
        refCount()
      );
    }
    return this.userRoles;
  }

  GetUserRolesById(id: string): Observable<IApplicationRole[]> {
    return this.http.get<IApplicationRole[]>('/api/ApplicationUsers/AssignedRoles/' + id)
      .pipe(
        tap(_ => this.log('Fetched Assigned Roles')),
        catchError(this.handleError<IApplicationRole[]>('GetRolesById', []))
      );
  }

  GetAvailableUserRoles(id: string): Observable<IApplicationRole[]> {
    return this.http.get<IApplicationRole[]>('/api/ApplicationUsers/AllRoles/' + id)
      .pipe(
        tap(_ => this.log('Fetched available Roles')),
        catchError(this.handleError<IApplicationRole[]>('AllRoles', []))
      );
  }

  getApplicationUsers(): Observable<IApplicationUserRow[]> {
    return this.http.get<IApplicationUserRow[]>('/api/ApplicationUsers')
      .pipe(
        tap(_ => this.log('fetched Application Users')),
        catchError(this.handleError<IApplicationUserRow[]>('GetApplicationUsers', []))
      );
  }

  getApplicationUsersByOrganizationId(orgId: number): Observable<IApplicationUserRow[]> {
    return this.http.get<IApplicationUserRow[]>('/api/ApplicationUsers/byOrganizationId/' + orgId)
      .pipe(
        tap(_ => this.log('fetched Application Users for OrgId ' + orgId.toString())),
        catchError(this.handleError<IApplicationUserRow[]>('GetApplicationUsersByOrganizationId', []))
      );
  }

  getTraineesByOrgId(orgId: number): Observable<ITraineeRow[]> {
    return this.http.get<ITraineeRow[]>('/api/ApplicationUsers/byOrgId/' + orgId)
      .pipe(
        tap(_ => this.log('fetched Application Users')),
        catchError(this.handleError<ITraineeRow[]>('getTraineesByOrgId', []))
      );
  }

  getApplicationUserNonBinding(id: string): Observable<IApplicationUserRow> {
    return this.http.get<IApplicationUserRow>('/api/ApplicationUsers/' + id)
      .pipe(
        tap(_ =>
          this.log(`fetched Application User id=${id}`
          )
        ),
        catchError(this.handleError<IApplicationUserRow>(`getApplicationUser id=${id}`))
      );
  }

  isUserInRole(role: Role) {
    let hasRole: boolean = false;

    if (!!this.userParams && !!this.userAssignedRoles) {
      if (this.userParams.userId === this.userAssignedRoles.userId) {
        return this.userAssignedRoles.roles.some(x => x.code == role);
      }
    }
    return hasRole;
  }

  deleteApplicationUser(id: string): Observable<any> {
    return this.http.delete<IApplicationUser>('/api/ApplicationUsers/' + id)
      .pipe(
        tap(_ => this.log(`deleted Application User id=${id}`)),
        catchError(this.handleError<IApplicationUser>(`deleteApplicationUser id=${id}`))
      );
  }

  getApplicationUserForEdit(id: string): Observable<IApplicationUserForEdit> {
    return this.http.get<IApplicationUserForEdit>('/api/ApplicationUsers/ForEdit/' + id)
      .pipe(
        tap(_ => this.log(`Fetched Application User for Edit id=${id}`)),
        catchError(this.handleError<IApplicationUserForEdit>(`getApplicationUserForEdit id=${id}`))
      );
  }

  getTrainersForOrg(id: number): Observable<ITrainer[]> {
    return this.http.get<ITrainer[]>('/api/ApplicationUsers/trainersByOrgId/' + id)
      .pipe(
        tap(_ => this.log('fetched Trainers for Org')),
        catchError(this.handleError<ITrainer[]>('getTrainersForOrg', []))
      );
  }

  getAdminsForOrg(id: number): Observable<IApplicationUserRow[]> {
    return this.http.get<IApplicationUserRow[]>('/api/ApplicationUsers/OrgAdminsByOrgId/' + id)
      .pipe(
        tap(_ => this.log('fetched admins for Org')),
        catchError(this.handleError<IApplicationUserRow[]>('getAdminsForOrg', []))
      );
  }


  getTraineeGroupTrainees(traineeGroupId: number): Observable<ITraineeRow[]> {
    return this.http.get<ITraineeRow[]>('/api/ApplicationUsers/byTraineeGroupId/' + traineeGroupId)
      .pipe(
        tap(_ => this.log('fetched Trainees for TraineeGroup')),
        catchError(this.handleError<ITraineeRow[]>('getTraineeGroupTrainees', []))
      );
  }

  getTraineesByTrainerClasses(trainerId: string): Observable<ITraineeRow[]> {
    return this.http.get<ITraineeRow[]>('/api/ApplicationUsers/byTrainerClasses/' + trainerId)
      .pipe(
        tap(_ => this.log('fetched Trainees by Trainer Classes')),
        catchError(this.handleError<ITraineeRow[]>('getTraineesByTrainerClasses', []))
      );
  }

  getApplicationUserByUserName(userName: string): Observable<IApplicationUserForEdit> {
        return this.http.get<IApplicationUserForEdit>('/api/ApplicationUsers/byUserName/' + userName)
            .pipe(
                tap(_ => this.log(`Fetched Application User by UserName, name = ${userName}`)),
                catchError(this.handleError<IApplicationUserForEdit>(`getApplicationUserbyUserName name=${userName}`))
            );
    }

  saveApplicationUser(applicationUser: IApplicationUserForEdit): Observable<IApplicationUserForEdit> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (applicationUser.id != null && applicationUser.id !== '') {
      return this.http.put<IApplicationUserForEdit>('/api/ApplicationUsers/' + applicationUser.id, applicationUser, { headers })
        .pipe(
          tap(_ => this.log(`put ApplicationUser id=${applicationUser.id}`)),
          catchError(this.handleError<IApplicationUserForEdit>(`saveApplicationUser id=${applicationUser.id}`))
        );
    } else {
      return this.http.post<IApplicationUserForEdit>('/api/ApplicationUsers', applicationUser, { headers }).pipe(
        tap(_ => this.log(`posted applicationUser id=${applicationUser.id}`)),
        catchError(this.handleError<IApplicationUserForEdit>(`saveApplicationUser id=${applicationUser.id}`))
      );
    }
  }

  saveUserRoleAssignment(assignment: IUserRoleAssignment): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.put<IUserRoleAssignment>('/api/ApplicationUsers/' + assignment.userId + '/AssignRoles', assignment, { headers })
      .pipe(
        tap(_ => this.log(`put UserRoleAssignment id=${assignment.userId}`)),
        catchError(this.handleError<IUserRoleAssignment>(`SaveUserRoleAssignment id=${assignment.userId}`))
      );
  }

  saveUserAssignment(assignment: IUserAssignment): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.put<IUserAssignment>('/api/ApplicationUsers/' + assignment.userId + '/assignTasks', assignment, { headers })
        .pipe(
          tap(_ => this.log(`put UserAssignment id=${assignment.userId}`)),
          catchError(this.handleError<IUserAssignment>(`saveUserAssignment id=${assignment.userId}`))
        );
  }

  getUserTaskProblemSolving(userId: string, taskId: number): Observable<IUserTaskProblemSolving> {
    return this.http.get<IUserTaskProblemSolving>(`/api/ApplicationUsers/${taskId}/userProblemSolving/${userId}`)
      .pipe(
        tap(_ => this.log('fetched User Task Problem Solving')),
        catchError(this.handleError<IUserTaskProblemSolving>('getUserTaskProblemSolving'))
    );
  }

  saveUserTaskProblemSolving(utps: IUserTaskProblemSolving): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    this.helpers.logObject('UTPS', utps);

    return this.http.put<IUserTaskProblemSolving>('/api/ApplicationUsers/' + utps.taskId + '/userProblemSolving', utps, { headers })
      .pipe(
        tap(_ => this.log(`put UserTaskProblemSolving id=${utps.taskId}`)),
        catchError(this.handleError<IUserTaskProblemSolving>(`saveUserTaskProblemSolving id=${utps.taskId}`))
      );
  }

  deleteUserTaskAssignment(id: string, taskId: number): Observable<any> {
    return this.http.delete<IApplicationUser>('/api/ApplicationUsers/' + id + '/unassignTask/' + taskId)
      .pipe(
        tap(_ => this.log(`deleted User Task Assignment id=${id}`)),
        catchError(this.handleError<IApplicationUser>(`deleteUserTaskAssignment id=${id}`))
      );
  }

  changePassword(id: string, oldPassword: string, newPassword: string): Observable<any> {
    const formData = new FormData();

    formData.append('id', id);
    formData.append('oldPassword', oldPassword);
    formData.append('newPassword', newPassword);

    return this.http.post<boolean>('/api/ApplicationUsers/ChangePassword', formData)
      .pipe(
        tap(_ => this.log(`Change password for user id=${id}`)),
        catchError(this.handleError<IApplicationUser>(`change user password id=${id}`))
      );
  }

  resetPassword(id: string, newPassword: string): Observable<any> {
    const formData = new FormData();

    formData.append('id', id);
    formData.append('newPassword', newPassword);

    return this.http.post<boolean>('/api/ApplicationUsers/ResetPassword', formData)
      .pipe(
        tap(_ => this.log(`Reset password for user id=${id}`)),
        catchError(this.handleError<IApplicationUser>(`Reset user password id=${id}`))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`UserService: ${message}`);
  }
}

export interface IApplicationUser {
  id: string;
  userName: string;
  organizationId: number;
  organization: string;
  firstName: string;
  lastName: string;
  active: boolean;
}

export interface IApplicationUserRow {
  id: string;
  userName: string;
  organizationId: number;
  organization: string;
  firstName: string;
  lastName: string;
  active: boolean;
  isSuperAdmin: boolean;
  isOrgAdmin: boolean;
  isDivAdmin: boolean;
  isTrainer: boolean;
  isTrainee: boolean;
  isSupervisor: boolean;
  roles: IRoleRow[];
}

export interface IRoleRow {
  name: string;
  code: string;
}

export interface IApplicationRole {
  id: string;
  name: string;
  normalizedName: string;
}

export interface IUserRoleAssignment {
  userId: string;
  roleIds: string[];
}

export interface ITraineeRow {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  notes: string;
  active: boolean;
}

export interface IApplicationUserForEdit {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  organizationId: number;
  organization: IOrganization;
  diviionId: number;
  division: IDivision;
  subDivisionId: number;
  subDivision: ISubDivision;
  isTrainer: boolean;
  trainerPosition: string;
  trainerStartDate: Date;
  trainerLastInServiceTraining: Date;
  trainerTrainedById: string;
  trainerTrainedBy: IApplicationUser;
  isTrainee: boolean;
  traineeStartDate: Date;
  password: string;
  confirmPassword: string;
  gradeId: number;
  grade: IGrade;
  genderId: number;
  gender: IGender;
  birthDate: Date;
  raceId: number;
  race: IRace;
  economicStatusId: number;
  economicStatus: IEconomicStatus;
  specialEducationCodeId: number;
  specialEducationCode: ISpecialEducationCode;
  A504Accommodation: boolean;
  userImageId: number;
  notes: string;
  active: boolean;
  noText: boolean;
  noAudio: boolean;
  normalizedUserName: string;
  normalizedEmail: string;
  errorMessage?: string;
}

export interface IUserAssignment {
  userId: string;
  taskIds: number[];
}

export interface IUserTaskProblemSolving {
  userId: string;
  taskId: number;
  details: IUserTaskProblemSolvingDetail[];
}

export interface IUserTaskProblemSolvingDetail {
  taskStepId: number;
  taskId: number;
}



