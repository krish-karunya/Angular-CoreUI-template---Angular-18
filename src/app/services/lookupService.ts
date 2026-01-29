import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap, take, tap, catchError, publishReplay, refCount } from 'rxjs/operators';
import { IMediaCue } from './content.service';
import { IApplicationUserForEdit } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
  }

  getOrganizations(): Observable<IOrganization[]> {
    return this.http.get<IOrganization[]>('/api/Organizations')
      .pipe(
        tap(_ => this.log('fetched Organizations')),
        catchError(this.handleError<IOrganization[]>('getOrganizations', []))
      );
  }

  getOrganization(id: number): Observable<IOrganization> {
    return this.http.get<IOrganization>('/api/Organizations/' + id)
      .pipe(
        tap(_ => this.log(`fetched Organization id=${id}`)),
        catchError(this.handleError<IOrganization>(`getOrganization id = ${id}`))
      );
  }

  deleteOrganization(id: number): Observable<any> {
    return this.http.delete<IOrganization>('/api/Organizations/' + id)
      .pipe(
        tap(_ => this.log(`Deleted Organization id = ${id}`)),
        catchError(this.handleError<IOrganization>(`Deleted Organization id = ${id}`))
      );
  }

  saveOrganization(organization: IOrganization): Observable<IOrganization> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (organization.id != null && organization.id !== 0) {
      return this.http.put<IOrganization>('/api/Organizations/' + organization.id, organization, { headers })
        .pipe(
          tap(_ => this.log(`put Organization id=${organization.id}`)),
          catchError(this.handleError<IOrganization>(`put Organization id=${organization.id}`))
        );
    } else {
      return this.http.post<IOrganization>('/api/Organizations', organization, { headers })
        .pipe(
          tap(_ => this.log(`posted Organization id=${organization.id}`)),
          catchError(this.handleError<IOrganization>(`posted Organization id=${organization.id}`))
        );
    }

  }

  getDivisions(): Observable<IDivision[]> {
    return this.http.get<IDivision[]>('/api/Divisions')
      .pipe(
        tap(_ => this.log('fetched Divisions')),
        catchError(this.handleError<IDivision[]>('getDivisions', []))
      );
  }

  getDivisionsByOrganizationId(orgId: number): Observable<IDivision[]> {
    return this.http.get<IDivision[]>('/api/Divisions/byOrganizationId/' + orgId)
      .pipe(
        tap(_ => this.log('fetched Divisions for OrgId ' + orgId.toString())),
        catchError(this.handleError<IDivision[]>('getDivisionsByOrganizationId', []))
      );
  }

  getDivision(id: number): Observable<IDivision> {
    return this.http.get<IDivision>('/api/Divisions/' + id)
      .pipe(
        tap(_ => this.log(`fetched Organization id=${id}`)),
        catchError(this.handleError<IDivision>(`getDivision id = ${id}`))
      );
  }

  saveDivision(division: IDivision): Observable<IDivision> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (division.id > 0) {
      return this.http.put<IDivision>('/api/Divisions/' + division.id, division, { headers })
        .pipe(
          tap(_ => this.log(`put Division id=${division.id}`)),
          catchError(this.handleError<IDivision>(`saveDivision id=${division.id}`))
        );
    } else {
      return this.http.post<IDivision>('/api/Divisions', division, { headers }).pipe(
        tap(_ => this.log(`posted Division id=${division.id}`)),
        catchError(this.handleError<IDivision>(`saveDivision id=${division.id}`))
      );
    }
  }

  deleteDivision(id: number): Observable<any> {
    return this.http.delete<IDivision>('/api/Divisions/' + id)
      .pipe(
        tap(_ => this.log(`Deleted Division id = ${id}`)),
        catchError(this.handleError<IDivision>(`Deleted Division id = ${id}`))
      );
  }

  getDivisionDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/Divisions/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for DivisionId: ' + id)),
        catchError(this.handleError<any[]>('getDivisionDependencies', []))
      );
  }


  getSubDivisions(): Observable<ISubDivision[]> {
    return this.http.get<ISubDivision[]>('/api/SubDivisions')
      .pipe(
        tap(_ => this.log('fetched Sub Divisions')),
        catchError(this.handleError<ISubDivision[]>('getSubdivisions', []))
      );
  }

  getSubDivision(id: number): Observable<ISubDivision> {
    return this.http.get<ISubDivision>('/api/SubDivisions/' + id)
      .pipe(
        tap(_ => this.log(`fetched SubDivision id=${id}`)),
        catchError(this.handleError<ISubDivision>(`getSubDivision id = ${id}`))
      );
  }

  getSubDivisionsByOrganizationId(orgId: number): Observable<ISubDivision[]> {
    return this.http.get<ISubDivision[]>('/api/SubDivisions/byOrganizationId/' + orgId)
      .pipe(
        tap(_ => this.log('fetched Subdivisions for OrgId ' + orgId.toString())),
        catchError(this.handleError<ISubDivision[]>('getSubDivisionsByOrganizationId', []))
      );
  }

  saveSubDivision(subDivision: ISubDivision): Observable<ISubDivision> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (subDivision.id > 0) {
      return this.http.put<ISubDivision>('/api/SubDivisions/' + subDivision.id, subDivision, { headers })
        .pipe(
          tap(_ => this.log(`put SubDivision id=${subDivision.id}`)),
          catchError(this.handleError<ISubDivision>(`saveSubDivision id=${subDivision.id}`))
        );
    } else {
      return this.http.post<ISubDivision>('/api/SubDivisions', subDivision, { headers }).pipe(
        tap(_ => this.log(`posted Sbudivision id=${subDivision.id}`)),
        catchError(this.handleError<ISubDivision>(`saveDivision id=${subDivision.id}`))
      );
    }
  }

  getSubDivisionsByDivisionId(id: number): Observable<ISubDivision[]> {
    return this.http.get<ISubDivision[]>('/api/SubDivisions/byDivisionId/' + id)
      .pipe(
        tap(_ => this.log('fetched Subdivisions for DivisionId: ' + id)),
        catchError(this.handleError<ISubDivision[]>('getSubdivisionsByDivisionId', []))
      );
  }

  deleteSubdivision(id: number): Observable<any> {
    return this.http.delete<ISubDivision>('/api/SubDivisions/' + id)
      .pipe(
        tap(_ => this.log(`Deleted Subdivision id = ${id}`)),
        catchError(this.handleError<ISubDivision>(`Deleted Subdivision id = ${id}`))
      );
  }

  getSubdivisionDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/SubDivisions/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for SubddvisionId: ' + id)),
        catchError(this.handleError<any[]>('getSubdivisionDependencies', []))
      );
  }

  getGrades(): Observable<IGrade[]> {
    return this.http.get<IGrade[]>('/api/Grades')
      .pipe(
        tap(_ => this.log('fetched Grades')),
        catchError(this.handleError<IGrade[]>('getGrades', []))
      );
  }

  getGade(id: number): Observable<IGrade> {
    return this.http.get<IGrade>('/api/Grades/' + id)
      .pipe(
        tap(_ => this.log(`fetched Grade id=${id}`)),
        catchError(this.handleError<IGrade>(`getGrade id = ${id}`))
      );
  }

  getGenders(): Observable<IGender[]> {
    return this.http.get<IGender[]>('/api/Genders')
      .pipe(
        tap(_ => this.log('fetched Gender')),
        catchError(this.handleError<IGender[]>('getGenders', []))
      );
  }

  getGender(id: number): Observable<IGender> {
    return this.http.get<IGender>('/api/Genders/' + id)
      .pipe(
        tap(_ => this.log(`fetched Gender id=${id}`)),
        catchError(this.handleError<IGender>(`getGender id = ${id}`))
      );
  }

  getRaces(): Observable<IRace[]> {
    return this.http.get<IRace[]>('/api/Races')
      .pipe(
        tap(_ => this.log('fetched Races')),
        catchError(this.handleError<IRace[]>('getRaces', []))
      );
  }

  getRace(id: number): Observable<IRace> {
    return this.http.get<IRace>('/api/Races/' + id)
      .pipe(
        tap(_ => this.log(`fetched Race id=${id}`)),
        catchError(this.handleError<IRace>(`getRace id = ${id}`))
      );
  }

  getEconomicStatuses(): Observable<IEconomicStatus[]> {
    return this.http.get<IEconomicStatus[]>('/api/EconomicStatus')
      .pipe(
        tap(_ => this.log('fetched Econimic STatus')),
        catchError(this.handleError<IEconomicStatus[]>('getEconomicStatus', []))
      );
  }

  getEconomicStatus(id: number): Observable<IEconomicStatus> {
    return this.http.get<IEconomicStatus>('/api/EconomicStatus/' + id)
      .pipe(
        tap(_ => this.log(`fetched Economic Status id=${id}`)),
        catchError(this.handleError<IEconomicStatus>(`getEconomicStatus id = ${id}`))
      );
  }

  getSpecialEducationCodes(): Observable<ISpecialEducationCode[]> {
    return this.http.get<ISpecialEducationCode[]>('/api/SpecialEducationCodes')
      .pipe(
        tap(_ => this.log('fetched Special Education Codes')),
        catchError(this.handleError<ISpecialEducationCode[]>('getSpecialEducationCodes', []))
      );
  }

  getSpecialEducationCode(id: number): Observable<ISpecialEducationCode> {
    return this.http.get<ISpecialEducationCode>('/api/SpecialEducationCodes/' + id)
      .pipe(
        tap(_ => this.log(`fetched Special Education Code id=${id}`)),
        catchError(this.handleError<ISpecialEducationCode>(`getSpecialEducationCode id = ${id}`))
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
    //console.log(`LookupService: ${message}`);
  }

}

export interface IOrganization {
  id: number;
  name: string;
  description: string;
  organizationImage: IMediaCue;
  organizationImageId: number;
  organizationAdmin: IApplicationUserForEdit;
  organizationAdminId: string;
  errorMessage?: string;
}

export interface IDivision {
  id: number;
  code: string;
  description: string;
  organization: IOrganization;
  organizationId: number;
}

export interface ISubDivision {
  id: number;
  code: string;
  description: string;
  division: IDivision;
  divisionId: number;
}

export interface IGrade {
  id: number;
  code: string;
  description: string;
}

export interface IGender {
  id: number;
  code: string;
  description: string;
}

export interface IRace {
  id: number;
  code: string;
  description: string;
}

export interface IEconomicStatus {
  id: number;
  code: string;
  description: string;
}

export interface ISpecialEducationCode {
  id: number;
  code: string;
  description: string;
}

export interface IDivisionDependencies {
  hasSubdivisions: boolean;
  hasClassrooms: boolean;
  hasUsers: boolean;
}

export interface ISubdivisionDependencies {
  hasClassrooms: boolean;
  hasUsers: boolean;
}
