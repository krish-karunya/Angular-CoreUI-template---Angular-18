import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpEvent,
  HttpParams,
} from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  ITaskRow,
  ITaskStepRow,
  ITask,
  ITaskTrainingInformation,
} from './content.service';
import { ITraineeRow } from './user.service';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private taskToTrain: ITaskRow | null = null;
  private taskStepsToTrain: ITaskStepRow[]  = [];
  private taskTrainingInformation: ITaskTrainingInformation | null = null;
  private taskStepEvals: ITaskStepEval[] = [];

  public test1: ITaskStepEval[] = [];
  public test2: ITrainingResult | null = null;
  public test3: ITrainingResultDetail[] = [];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private helpers: HelperService,
  ) {}

  getTaskTrainingInformation(): ITaskTrainingInformation | null {
    return this.taskTrainingInformation;
  }

  setTaskToTrain(
    newTask: ITaskRow,
    newTrainingInfo: ITaskTrainingInformation,
  ): void {
    this.taskToTrain = newTask;
    this.taskTrainingInformation = newTrainingInfo;

    this.taskStepsToTrain = newTrainingInfo.taskSteps;
    this.taskStepEvals = new Array();

    // tslint:disable-next-line: forin
    for (const i in this.taskStepsToTrain) {
      const ts = this.taskStepsToTrain[i];
      const tse: ITaskStepEval = {
        taskStepId: ts.taskStepId,
        taskStepSequence: ts.sequence,
        insertedSubTaskId: ts.insertedSubTaskId,
        fromSubTask: ts.fromSubTask,
        parentTaskStepId: ts.parentTaskStepId,
        scoreId: 0,
        notes: '',
      };

      this.taskStepEvals.push(tse);
    }

    console.log('setTaskToTrain numEvals: ' + this.taskStepEvals.length);
  }

  loadTaskStepEvals(trainingResult: ITrainingResult): void {
    // tslint:disable-next-line: forin
    for (const i in trainingResult.details) {
      const trd: ITrainingResultDetail = trainingResult.details[i];
      if (trd.notes != null) {
        const tse: ITaskStepEval = this.taskStepEvals[i];
        tse.notes = trd.notes;
      }
    }
  }

  getTaskStepEval(id: number): ITaskStepEval | undefined {
    const item = this.taskStepEvals.find(
      (element) => element.taskStepId === id,
    );

    return item;
  }

 setTaskStepEval(tsEval: ITaskStepEval): void {
  const index = this.taskStepEvals.findIndex(
    (element) => element.taskStepId === tsEval.taskStepId,
  );

  if (index !== -1) {
    this.taskStepEvals[index] = tsEval;
  }
}

  getDetails(): ITrainingResultDetail[] {
    const details: ITrainingResultDetail[] = new Array();

    // tslint:disable-next-line: forin
    for (const i in this.taskStepEvals) {
      const tse: ITaskStepEval = this.taskStepEvals[i];
      //var taskStep = this.taskStepsToTrain.find(ts => ts.taskStepId == tse.taskStepId);
      // DJB: Should rarely happen, but above logic will find the FIRST matching task ID.  So if the same ID is inserted or replaced more than once, you'll get the wrong one.
      // Mostly doesn't matter, becasue the details are the same, EXCEPT for the flag indicating if its inserted or replaced.
      // SO instead, let's grab the task by sequence number, which should be unique.
      var taskStep = this.taskStepsToTrain?.find(
        (ts) => ts.sequence == tse.taskStepSequence,
      );

      details.push({
        taskStepId: tse.taskStepId,
        taskStepSequence: tse.taskStepSequence,
        insertedSubTaskId: tse.insertedSubTaskId,
        fromSubTask: tse.fromSubTask,
        parentTaskStepId: tse.parentTaskStepId,
        ratingSystemValueId: tse.scoreId,
        notes: tse.notes,
        overrideHide: !taskStep?.visible,
        overrideReplace: taskStep?.isReplacement,
        overrideInsert: taskStep?.isInserted,
      });
    }

    return details;
  }

  saveTrainingResult(tr: ITrainingResult): Observable<ITrainingResult> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (tr.trainingResultId > 0) {
      return this.http
        .put<ITrainingResult>(
          '/api/TrainingSessions/Results/' + tr.trainingResultId,
          tr,
          { headers },
        )
        .pipe(
          tap((_) => this.log(`put TrainingResult id=${tr.trainingResultId}`)),
          catchError(
            this.handleError<ITrainingResult>(
              `saveTrainingResult id=${tr.trainingResultId}`,
            ),
          ),
        );
    } else {
      return this.http
        .post<ITrainingResult>('/api/TrainingSessions/Results', tr, { headers })
        .pipe(
          tap((_) =>
            this.log(`posted TrainingResult id=${tr.trainingResultId}`),
          ),
          catchError(
            this.handleError<ITrainingResult>(
              `saveTrainingResult id=${tr.trainingResultId}`,
            ),
          ),
        );
    }
  }

  getEvaluationList(): Observable<IEvalListItem[]> {
    return this.http.get<IEvalListItem[]>('/api/TrainingSessions').pipe(
      tap((_) => this.log('fetched EvalList')),
      catchError(this.handleError<IEvalListItem[]>('getEvaluationList', [])),
    );
  }

  getEvaluationListByTrainer(trainerId: string): Observable<IEvalListItem[]> {
    return this.http
      .get<IEvalListItem[]>('/api/TrainingSessions/ByTrainerId/' + trainerId)
      .pipe(
        tap((_) => this.log('fetched EvalList')),
        catchError(
          this.handleError<IEvalListItem[]>('getEvaluationListByTrainer', []),
        ),
      );
  }

  getEvaluationListWithFilters(
    trainerId: string,
    startDate: Date,
    endDate: Date,
    orgId: number,
    traineeId: string,
  ): Observable<IEvalListItem[]> {
    return this.http
      .get<IEvalListItem[]>('/api/TrainingSessions/WithFilters/', {
        params: new HttpParams()
          .set('trainerId', trainerId)
          .set('startDate', startDate.toLocaleString())
          .set('endDate', endDate.toLocaleString())
          .set('orgId', orgId.toString())
          .set('traineeId', traineeId.toString()),
      })
      .pipe(
        tap((_) => this.log('fetched EvalList')),
        catchError(
          this.handleError<IEvalListItem[]>('getEvaluationListByTrainer', []),
        ),
      );
  }

  deleteEvaluationAndTrainingSession(
    trainingSessionId: number,
  ): Observable<any> {
    return this.http
      .delete<IEvalListItem>('/api/TrainingSessions/' + trainingSessionId)
      .pipe(
        tap((_) =>
          this.log(
            `deleted Evaluations and Training Sessio TrainingSessionId=${trainingSessionId}`,
          ),
        ),
        catchError(
          this.handleError<IEvalListItem>(
            `deleteEvaluationAndTrainingSession' id=${trainingSessionId}`,
          ),
        ),
      );
  }

  getTrainingResult(id: number): Observable<ITrainingResult> {
    return this.http.get<ITrainingResult>('/api/TrainingSessions/' + id).pipe(
      tap((_) => this.log(`fetched TrainingSessions id=${id}`)),
      catchError(
        this.handleError<ITrainingResult>(`getTrainingResult id=${id}`),
      ),
    );
  }

  getTrainingResultForPrinting(
    id: number,
  ): Observable<ITrainingResultForPrinting> {
    return this.http
      .get<ITrainingResultForPrinting>(
        '/api/TrainingSessions/PrintEvaluation/' + id,
      )
      .pipe(
        tap((_) => this.log(`fetched TrainingSession for printing id=${id}`)),
        catchError(
          this.handleError<ITrainingResultForPrinting>(
            `getTrainingResultForPrinting id=${id}`,
          ),
        ),
      );
  }

  getTraineeGroups(): Observable<ITraineeGroup[]> {
    return this.http.get<ITraineeGroup[]>('/api/TraineeGroups').pipe(
      tap((_) => this.log('fetched TraineeGroups')),
      catchError(this.handleError<ITraineeGroup[]>('getTraineeGroups', [])),
    );
  }

  getTraineeGroupsByOrganizationId(orgId: number): Observable<ITraineeGroup[]> {
    return this.http
      .get<ITraineeGroup[]>('/api/TraineeGroups/byOrganizationId/' + orgId)
      .pipe(
        tap((_) =>
          this.log('fetched TraineeGroups for OrgId ' + orgId.toString()),
        ),
        catchError(
          this.handleError<ITraineeGroup[]>(
            'etTraineeGroupsByOrganizationId',
            [],
          ),
        ),
      );
  }

  getTraineeGroup(id: number): Observable<ITraineeGroup> {
    return this.http.get<ITraineeGroup>('/api/TraineeGroups/' + id).pipe(
      tap((_) => this.log(`fetched TraineeGroup id=${id}`)),
      catchError(this.handleError<ITraineeGroup>(`getTraineeGroup id=${id}`)),
    );
  }

  deleteTraineeGroup(id: number): Observable<any> {
    return this.http.delete<ITraineeGroup>('/api/TraineeGroups/' + id).pipe(
      tap((_) => this.log(`deleted TraineeGroup id=${id}`)),
      catchError(
        this.handleError<ITraineeGroup>(`deleteTraineeGroup id=${id}`),
      ),
    );
  }

  deleteTraineeGroupTrainee(id: number, userId: string): Observable<any> {
    //console.log(`deleteTraineeGroupTrainee: id: ${id} userId:${userId}`);

    return this.http
      .delete<ITraineeGroup>(`/api/TraineeGroups/${id}/${userId}`)
      .pipe(
        tap((_) =>
          this.log(`deleted TraineeGroupTrainee id=${id} userId=${userId}`),
        ),
        catchError(
          this.handleError<ITraineeGroup>(`deleteTraineeGroupTrainee id=${id}`),
        ),
      );
  }

  saveTraineeGroup(traineeGroup: ITraineeGroup): Observable<ITraineeGroup> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (traineeGroup.id > 0) {
      return this.http
        .put<ITraineeGroup>(
          '/api/TraineeGroups/' + traineeGroup.id,
          traineeGroup,
          { headers },
        )
        .pipe(
          tap((_) => this.log(`put TraineeGroup id=${traineeGroup.id}`)),
          catchError(
            this.handleError<ITraineeGroup>(
              `saveTraineeGroup id=${traineeGroup.id}`,
            ),
          ),
        );
    } else {
      return this.http
        .post<ITraineeGroup>('/api/TraineeGroups', traineeGroup, { headers })
        .pipe(
          tap((_) => this.log(`posted TraineeGroup id=${traineeGroup.id}`)),
          catchError(
            this.handleError<ITraineeGroup>(
              `saveTraineeGroup id=${traineeGroup.id}`,
            ),
          ),
        );
    }
  }

  saveTraineeGroupAssignment(
    assignment: ITraineeGroupAssignments,
  ): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http
      .put<ITraineeGroupAssignments>(
        '/api/TraineeGroups/' + assignment.traineeGroupId + '/assignTrainees',
        assignment,
        { headers },
      )
      .pipe(
        tap((_) =>
          this.log(
            `put TraineeGroupAssignment id=${assignment.traineeGroupId}`,
          ),
        ),
        catchError(
          this.handleError<ITraineeGroupAssignments>(
            `saveUserAssignment id=${assignment.traineeGroupId}`,
          ),
        ),
      );
  }

  getTrainingRecommendations(
    traineeId: string,
    taskId: number,
  ): Observable<IRecommendationStruct> {
    return this.http
      .get<IRecommendationStruct>(
        '/api/TrainingSessions/recommendations/' + traineeId + '/' + taskId,
      )
      .pipe(
        tap((_) => this.log('fetched trainingRecommendations')),
        catchError(
          this.handleError<IRecommendationStruct>('getTrainingRecommendations'),
        ),
      );
  }

 private handleError<T>(operation = 'operation', result?: T ) {
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
    //console.log(`TrainingService: ${message}`);
  }

  pad(num: number, size: number): string {
    let result: string = num + '';
    while (result.length < size) {
      result = '0' + result;
    }
    return result;
  }

  convertElapsedTimeToDurationString(elaspedTime: any): string {
    let result: string;
    const minutes = Math.floor(elaspedTime / 60);
    const seconds = elaspedTime - minutes * 60;
    result = this.pad(minutes, 2) + ':' + this.pad(seconds, 2);
    return result;
  }
}

export interface IStudent {
  id: string;
  name: string;
  imgUrl: string;
  notes: string;
  recommendation: string;
}

export interface IScore {
  id: number;
  displayText: string;
  fullText: string;
}

export interface ITaskStepEval {
  taskStepId: number;
  taskStepSequence: number;
  scoreId: number;
  notes: string;
  insertedSubTaskId: number;
  fromSubTask: boolean;
  parentTaskStepId: number;
}

export interface ITrainingResultDetail {
  taskStepId: number;
  taskStepSequence: number;
  ratingSystemValueId: number;
  notes: string;
  insertedSubTaskId: number;
  fromSubTask: boolean;
  parentTaskStepId: number;
  overrideHide: boolean;
  overrideReplace: boolean;
  overrideInsert: boolean;
}

export interface ITrainingResultDetailForPrinting {
  taskStepNumber: number;
  taskStepName: string;
  evaluationResultCode: string;
  evaluationResultDescription: string;
  evaluationDetailNotes: string;
  isFromSubTask: boolean;
  overrideHide: boolean;
  overrideReplace: boolean;
  overrideInsert: boolean;
}

export interface ITrainingResult {
  trainingResultId: number;
  taskId: number;
  traineeId: string;
  trainerId: string;
  trainingDate: Date;
  duration: number;
  unitsCompleted: number;
  complexityLevel: number;
  taskUserOverrideSetId: number;
  details: ITrainingResultDetail[];
  notes: string;
  classroomId: number;
}

export interface ITrainingResultForPrinting {
  taskName: string;
  traineeName: string;
  trainingDate: Date;
  duration: number;
  unitsCompleted: number;
  complexityLevel: number;
  details: ITrainingResultDetailForPrinting[];
  notes: string;
  clasroomName: string;
  taskId: number;
  overrideSetId: number;
  overrideSetDate: string;
}

export interface IEvalListItem {
  trainingResultId: number;
  trainingDate: Date;
  traineeId: string;
  traineeName: string;
  taskId: number;
  taskName: string;
  trainerName: string;
}

export interface ITraineeGroup {
  id: number;
  organizationId: number;
  organization: any;
  trainerName: string;
  trainerId: number;
  trainer: any;
  name: string;
  description: string;
}

export interface ITraineeGroupTrainee {
  traineeGroupId: number;
  traineeGroup: any;
  traineeId: number;
  trainee: any;
}

export interface ITrainer {
  id: string;
  name: string;
}

export interface ITraineeGroupAssignments {
  traineeGroupId: number;
  userIds: string[];
}

export interface IRecommendationStruct {
  recommendedComplexityLevel: number;
  recommendations: string[];
}

export interface ITrainingSession {
  id: number;
  taskId: number;
  trainerId: number;
  traineeId: number;
  ScheduledStart: Date;
  ActualStart: Date;
  TargetComplexityLevel: number;
  Duration: Date;
  unitsCompleted: number;
  problemTypeId: number;
  TaskItemId: number;
}
