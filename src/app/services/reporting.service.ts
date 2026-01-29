import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
  }

  getProgressReportData(traineeId: string, taskId: number, threshholdMin: number, threshholdMax: number, startDate: Date, endDate: Date, subTaskId: number): Observable<IProgressReportRow[]> {
    return this.http.get<IProgressReportRow[]>('/api/ProgressReport/' + traineeId + '/' + taskId + '/' + threshholdMin + '/' + threshholdMax + '/' + subTaskId,
      {
        params: new HttpParams()
          .set('traineeId', traineeId)
          .set('taskId', taskId.toString())
          .set('taskId', threshholdMin.toString())
          .set('taskId', threshholdMax.toString())
          .set('startDate', startDate.toLocaleString())
          .set('endDate', endDate.toLocaleString())
          .set('subTaskId', subTaskId.toString())
      })
      .pipe(
        tap(_ => this.log('fetched ProgressReportData')),
        catchError(this.handleError<IProgressReportRow[]>('getProgressReportData', []))
      );
  }

  getProgressReportBData(traineeId: string, taskId: number, startDate: Date, endDate: Date, subTaskId: number): Observable<IProgressReportBData> {
    return this.http.get<any>('/api/ProgressReport/b/' + traineeId + '/' + taskId + '/' + subTaskId,
      {
        params: new HttpParams()
          .set('traineeId', traineeId)
          .set('taskId', taskId.toString())
          .set('startDate', startDate.toLocaleString())
          .set('endDate', endDate.toLocaleString())
          .set('subTaskId', subTaskId.toString())
      })
      .pipe(
        tap(_ => this.log('fetched ProgressReportBData')),
        catchError(this.handleError<IProgressReportBData>('getProgressReportBData', null))
      );
  }

  getProgressReportCData(traineeId: string, taskId: number, startDate: Date, endDate: Date, subTaskId: number, breakOutAllOverrideSets: boolean): Observable<IProgressReportBData> {
    return this.http.get<any>('/api/ProgressReport/c/' + traineeId + '/' + taskId + '/' + subTaskId,
      {
        params: new HttpParams()
          .set('traineeId', traineeId)
          .set('taskId', taskId.toString())
          .set('startDate', startDate.toLocaleString())
          .set('endDate', endDate.toLocaleString())
          .set('subTaskId', subTaskId.toString())
          .set('breakOutAllOverrideSets', breakOutAllOverrideSets.toString())
      })
      .pipe(
        tap(_ => this.log('fetched ProgressReportBData')),
        catchError(this.handleError<IProgressReportBData>('getProgressReportBData', null))
      );
  }

  getTrainingSessionSummary(trainingSessionId: number): Observable<ITrainingSessionSummary> {
    return this.http.get<any>('/api/TrainingSessions/summary/' + trainingSessionId, {
      params: new HttpParams()
        .set('trainingSessionId', trainingSessionId.toString())
      })
      .pipe(
        tap(_ => this.log('fetched TrainingSessionSummary')),
        catchError(this.handleError<ITrainingSessionSummary>('getTrainingSessionSummary', null))
      );
  }

  getUnitProgressReportData(traineeId: string, taskId: number, startDate: Date, endDate: Date): Observable<IProgressReportRow[]> {
    return this.http.get<IProgressReportRow[]>('/api/UnitProgressReport/' + traineeId + '/' + taskId,
    {
      params: new HttpParams()
        .set('traineeId', traineeId)
        .set('taskId', taskId.toString())
        .set('startDate', startDate.toLocaleString())
        .set('endDate', endDate.toLocaleString())
    })
    .pipe(
      tap(_ => this.log('fetched UnitProgressReportData')),
      catchError(this.handleError<IProgressReportRow[]>('getUnitProgressReportData', []))
    );
  }

  getTrainingExperienceReportData(traineeId: string): Observable<ITrainingExpereinceReportRow[]> {
    return this.http.get<ITrainingExpereinceReportRow[]>('/api/trainingExperience/' + traineeId)
      .pipe(
        tap(_ => this.log('fetched TrainingExperienceReportData')),
        catchError(this.handleError<ITrainingExpereinceReportRow[]>('getTrainingExperienceReportData', []))
      );
  }

  getTrainingExperienceReportDataWithStartandEndDates(traineeId: string, startDate: Date, endDate: Date): Observable<ITrainingExpereinceReportRow[]> {
    return this.http.get<ITrainingExpereinceReportRow[]>('/api/trainingExperience/' + traineeId,
      {
        params: new HttpParams()
          .set('traineeId', traineeId)
          .set('startDate', startDate.toLocaleString())
          .set('endDate', endDate.toLocaleString())
      }
    )
      .pipe(
        tap(_ => this.log('fetched TrainingExperienceReportDataWithDateRange')),
        catchError(this.handleError<ITrainingExpereinceReportRow[]>('getTrainingExperienceReportDataWithDateRange', []))
      );
  }

  getTaskErrorAnalysisReportData(taskId: number, trainerId: string, traineeId: string, startDate: Date, endDate: Date, minOpportunities: number): Observable<ITaskErrorAnalysisRow[]> {
    return this.http.get<ITaskErrorAnalysisRow[]>('/api/ErrorAnalysis/', {
      params: new HttpParams()
        .set('taskId', taskId.toString())
        .set('traineeId', traineeId)
        .set('trainerId', trainerId)
        .set('startDate', startDate.toLocaleString())
        .set('endDate', endDate.toLocaleString())
        .set('minOpportunities', minOpportunities.toString())
      })
      .pipe(
        tap(_ => this.log('fetched TaskErrorAnalysisData')),
        catchError(this.handleError<ITaskErrorAnalysisRow[]>('getTaskErrorAnalysisData', []))
      );
  }


  getMeasureSpeedReportData(traineeId: string, taskId: number, startDate: Date, endDate: Date): Observable<IMeasureSpeedReport> {
    return this.http.get<IMeasureSpeedReport>('/api/MeasureSpeedReport/',
    {
      params: new HttpParams()
        .set('traineeId', traineeId)
        .set('taskId', taskId.toString())
        .set('startDate', startDate.toLocaleString())
        .set('endDate', endDate.toLocaleString())
    })
    .pipe(
      tap(_ => this.log('fetched MeasuredSpeedReportData')),
      catchError(this.handleError<IMeasureSpeedReport>('getMeasureSpeedReportData'))
    );
  }


  getPromptLevelProgressReportData(traineeId: string, taskId: number, startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date): Observable<IPrompLEvelReportRow[]> {
    return this.http.get<IPrompLEvelReportRow[]>('/api/PromptLevelProgressReport/', {
        params: new HttpParams()
          .set('traineeId', traineeId)
          .set('taskId', taskId.toString())
          .set('startDate1', startDate1.toLocaleString())
          .set('endDate1', endDate1.toLocaleString())
          .set('startDate2', startDate2.toLocaleString())
          .set('endDate2', endDate2.toLocaleString())
      })
      .pipe(
        tap(_ => this.log('fetched PromprtLevelProgressReportData')),
        catchError(this.handleError<IPrompLEvelReportRow[]>('getPromptLevelProgressReportData', []))
      );
  }

  getTreatmentFidelityReportSummaryData(taskId: number, traineeId: string, startDate: Date, endDate: Date): Observable<ITreatmentFidelityReport> {
    return this.http.get<ITreatmentFidelityReport>('/api/TreatmentFidelityReport/', {
      params: new HttpParams()
        .set('taskId', taskId.toString())
        .set('traineeId', traineeId)
        .set('startDate', startDate.toLocaleString())
        .set('endDate', endDate.toLocaleString())
    })
    .pipe(
      tap(_ => this.log('Fetched getTreatmentFidelityReportSummaryData')),
      catchError(this.handleError<ITreatmentFidelityReport>('getTreatmentFidelityReportSummaryData'))
    );
  }

  GetTreatMentFidelityEvaluations(taskId: number, traineeId: string) {
    return this.http.get<ITreatmentFidelityEvaluationListItem[]>('/api/TreatmentFidelityReport/' + traineeId + '/' + taskId)
      .pipe(
        tap(_ => this.log('fetched TreatmentFidelityEvaluationListItemS')),
        catchError(this.handleError<ITreatmentFidelityEvaluationListItem[]>('GetTreatMentFidelityEvaluations', []))
      );
  }

  GetTreatMentFidelityEvaluationSingle(evalutaionId: number) {
    return this.http.get<ITreatmentFidelityReport>('/api/TreatmentFidelityReport/single/' + evalutaionId)
      .pipe(
        tap(_ => this.log('fetched TreatMentFidelityEvaluationSingle')),
        catchError(this.handleError<ITreatmentFidelityReport>('GetTreatMentFidelityEvaluationSingle'))
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
    //console.log(`ContentService: ${message}`);
  }
}

export interface ITaskStepOverrideRow {
  taskStepId: number;
  taskStepName: string;
  sequence: number;
  overrideHide: boolean;
  overrideReplace: boolean;
  overrideInsert: boolean;
}

export interface ITrainingSessionSummary {
  trainingSessionId: number;
  trainingSessionDate: string;
  evaluationId: number;

  taskId: number;
  taskName: string;
  taskDescription: string;

  trainerId: string;
  trainerFirstName: string;
  trainerLastName: string;

  traineeId: string;
  traineeFirstName: string;
  traineeLastName: string;

  numberOfSteps: number;

  overrideSetId: number;
  overrideSetDate: string;
  hasHideOverrides: boolean;
  hasReplaceOverrides: boolean;
  hasInsertOverrides: boolean;

  taskStepOverrideRows: ITaskStepOverrideRow[];
}

export interface IProgressReportBDataRow {
  trainingSessionId: number;
  versionNumber: number;
  date: Date;
  duration: number;
  hasInsertedSubTasks: boolean;
  stepsCompletedAtRating: Array<number>;
  hasTraineeOverrides: boolean;
  overrideSetId: number;
}

export interface IPRBDataGroup {
  ratingSystemId: number;
  ratingSystemName: string;
  ratingSystemValues: Array<string>;

  overrideSetId: number;
  overrideSetCreationDate: Date;
  overrideSetLabel: string;

  overrideSetChangeDates: Array<Date>;

  trainingSessions: Array<IProgressReportBDataRow>
}

export interface IProgressReportBData {
  taskId: number;
  taskName: string;
  traineeName: string;
  reportData: Array<IPRBDataGroup>;
}

export interface IProgressReportRow {
  traineeId: string;
  taskId: number;
  versionNumber: number;
  trainingSessionId: number;
  date: Date;
  duration: number;
  stepsCompletedAtThreshold: number;
  hasInsertedSubTasks: boolean;
}

export interface ITrainingExpereinceReportRow {
  traineeId: string;
  taskId: number;
  taskName: string;
  trainingSessionId: number;
  date: Date;
}

export interface IMeasureSpeedReport {
  competativeRangeMin: number;
  competativeRangeMax: number;
  measureSpeedReportRows: IMeasureSpeedReportRow[];
}

export interface IMeasureSpeedReportRow {
  traineeId: string;
  taskId: number;
  trainingSessionId: number;
  date: Date;
  duration: number;
}

export interface ITaskErrorAnalysisRow {
  stepSequence: number;
  stepName: string;
  errors: number;
  opportunities: number;
  percent: number;
}

export interface IPrompLEvelReportRow {
  promptLevel: string;
  range1Percent: number;
  range2Percent: number;
}

export interface ITreatmentFidelityReportRow {
  reportStepSequence: number;
  stepSequence: number;
  stepText: string;
  reportYes: string;
  reportNo: string;
  reportNA: string;
}

export interface ITreatmentFidelityReport {
  evaluationCount: number;
  detailCount: number;
  yesCount: number;
  noCount: number;
  naCount: number;
  yesPercent: number;
  noPercent: number;
  naPercent: number;
  treatmentFidelityReportRows: ITreatmentFidelityReportRow[];
}

export interface ITreatmentFidelityEvaluationListItem {
  evaluationId: number;
  evaluationDate: string;
}



