
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { IDivision, IOrganization, ISubDivision } from './lookupService';
import { HelperService } from './helper.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import * as ContentServiceModels from '../_models/content-service-models'


@Injectable({
  providedIn: 'root'
})
export class ContentService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  public sizeLimit: number = 16;

  private showLog: boolean = false;

  constructor(private http: HttpClient, private helpers: HelperService) {
  }

  getMediaTypes(): Observable<IMediaType[]> {
    return this.http.get<IMediaType[]>('/api/MediaCues/MediaTypes')
      .pipe(
        tap(_ => this.log('fetched MediaTypes')),
        catchError(this.handleError<IMediaType[]>('getMediaTypes', []))
      );
  }
  
  getDefaultBackForwardAlternateStepImageIds(): Observable<IDefaultBackForwardAlternateStepImageIds> {
    return this.http.get<IDefaultBackForwardAlternateStepImageIds>('/api/MediaCues/DefaultBackForwardAlternateStepImageIds')
      .pipe(
        tap(_ => this.log('fetched Default Back, Forward and Alternate Next Step Image Ids')),
        catchError(this.handleError<IDefaultBackForwardAlternateStepImageIds>('getDefaultBackForwardAlternateStepImageIds'))
      );
  }

  getMediaCues(): Observable<IMediaCueRow[]> {
    return this.http.get<IMediaCueRow[]>('/api/MediaCues')
      .pipe(
        tap(_ => this.log('fetched MediaCues')),
        catchError(this.handleError<IMediaCueRow[]>('getMediaCues', []))
      );
  }

  getMediaCuesByOrganizationId(orgId: number): Observable<IMediaCueRow[]> {
    return this.http.get<IMediaCueRow[]>('/api/MediaCues/byOrganizationId/' + orgId)
      .pipe(
        map(response =>
          response.map(item => ({
            ...item,
            displayTagCount : this.helpers.getStringArrayDisplayLimit(item.mediaTags, this.sizeLimit)
            
          })
         )),
        tap(_ => this.log('fetched MediaCuesfor OrgId ' + orgId.toString())),
        catchError(this.handleError<IMediaCueRow[]>('getMediaCuesByOrganizationId', []))
      );
  }

  getMediaCuesByOrganizationIdIncludeNotShared(orgId: number): Observable<IMediaCueRow[]> {
    return this.http.get<IMediaCueRow[]>('/api/MediaCues/MediaCuesByOrganizationIdIncludeNotShared/' + orgId)
      .pipe(
        map(response =>
          response.map(item => ({
            ...item,
            displayTagCount: this.helpers.getStringArrayDisplayLimit(item.mediaTags, this.sizeLimit)

          })
          )),
        tap(_ => this.log('fetched AllMediaCuesfor OrgId ' + orgId.toString())),
        catchError(this.handleError<IMediaCueRow[]>('getMediaCuesByOrganizationIdIncludeNotShared', []))
      );
  }

  getSharedMediaCuesByOrganizationId(orgId: number): Observable<IMediaCueRow[]> {
    return this.http.get<IMediaCueRow[]>('/api/MediaCues/SharedMediaCuesbyOrganizationId/' + orgId)
      .pipe(
        map(response =>
          response.map(item => ({
            ...item,
            displayTagCount: this.helpers.getStringArrayDisplayLimit(item.mediaTags, this.sizeLimit)

          })
          )),
        tap(_ => this.log('fetched SharedMediaCues ' + orgId.toString())),
        catchError(this.handleError<IMediaCueRow[]>('getSharedMediaCuesByOrganizationId', []))
      );
  }
  mediaCueSharedChange(id: number, shared: boolean): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.put<IMediaCueShareRow>('/api/MediaCues/SharedMediaCuesUpdate/' + id + "/" + shared, { headers })
      .pipe(
        tap(_ => this.log(`SharedMediaCuesUpdate id=${id}`)),
        catchError(this.handleError<IMediaCueShareRow>(`mediaCueSharedChange id=${id}`))
      );
  }
 
  getMediaCuesByOptions(options: IMediaCueSearchOptions, orgId: number): Observable<IMediaCueRow[]> {
    if (!options.ModuleId)
    {
      options.ModuleId = 0;
    }
    const httpParams = new HttpParams({
      fromObject:
      {
        tag: options.tag,
        MediaTypeFilter: options.MediaCueTypeFilter,
        moduleId: options.ModuleId.toString()
      }
    });

    return this.http.get<IMediaCueRow[]>('/api/MediaCues/MediaCueSearchOptions/' + orgId, {
      params: httpParams
    })
      .pipe(
        tap(_ => this.log('fetched MediaCuesByOptions')),
        catchError(this.handleError<IMediaCueRow[]>('getMediaCuesByOptions', []))
      );
  }

  getMediaCuesByType(options: IMediaCueSearchOptions, orgId: number): Observable<IMediaCueRow[]> {
    const httpParams = new HttpParams({
      fromObject:
      {
        MediaTypeFilter: options.MediaCueTypeFilter
      }
    });

    return this.http.get<IMediaCueRow[]>('/api/MediaCues/MediaCuesByType/' + orgId, {
      params: httpParams
    })
      .pipe(
        tap(_ => this.log('fetched MediaCuesByOptions')),
        catchError(this.handleError<IMediaCueRow[]>('getMediaCuesByOptions', []))
      );
  }

  getMediaCue(id: number): Observable<IMediaCue> {
    return this.http.get<IMediaCue>('/api/MediaCues/' + id)
      .pipe(
        tap(_ => this.log(`fetched MediaCue id=${id}`)),
        catchError(this.handleError<IMediaCue>(`getMediaCue id=${id}`))
      );
  }

  getMediaCueDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/MediaCues/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for MediaCueId: ' + id)),
        catchError(this.handleError<any[]>('getMediaCueDependencies', []))
      );
  }


  deleteMediaCue(id: number): Observable<any> {
    return this.http.delete<IMediaCue>('/api/MediaCues/' + id)
      .pipe(
        tap(_ => this.log(`deleted MediaCue id=${id}`)),
        catchError(this.handleError<IMediaCue>(`deleteMediaCue id=${id}`))
      );
  }


  saveMediaCue(mediaCue: IMediaCue): Observable<IMediaCue> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (mediaCue.id > 0) {
      return this.http.put<IMediaCue>('/api/MediaCues/' + mediaCue.id, mediaCue, { headers })
        .pipe(
          tap(_ => this.log(`put MediaCue id=${mediaCue.id}`)),
          catchError(this.handleError<IMediaCue>(`saveMediaCue id=${mediaCue.id}`))
        );
    } else {
      return this.http.post<IMediaCue>('/api/MediaCues', mediaCue, { headers }).pipe(
        tap(
          _ => this.log(`posted MediaCue id=${mediaCue.id}`)
        ),
        catchError(this.handleError<IMediaCue>(`saveMediaCue id=${mediaCue.id}`))
      );
    }
  }

  setMediaCueContentType(mediaCue: IMediaCue, contentType: string, subType: string): Observable<IMediaCue> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    mediaCue.mediaType = null;

    return this.http.put<IMediaCue>('/api/MediaCues/setContentType/' + mediaCue.id + "/" + contentType + "/" + subType, mediaCue, { headers })
      .pipe(
        tap(_ => this.log(`put setMediaCueContentType id=${mediaCue.id}`)),
        catchError(this.handleError<IMediaCue>(`setMediaCueContentType id=${mediaCue.id}`))
      );
  }

  getLearningPrograms(): Observable<ILearningProgram[]> {
    return this.http.get<ILearningProgram[]>('/api/LearningPrograms')
      .pipe(
        tap(_ => this.log('fetched LearningPrograms')),
        catchError(this.handleError<ILearningProgram[]>('getLearningPrograms', []))
      );
  }

  getLearningProgramsByOrganizationId(orgId: number): Observable<ILearningProgram[]> {
    return this.http.get<ILearningProgram[]>('/api/LearningPrograms/byOrganizationId/' + orgId)
      .pipe(
        tap(_ => this.log('fetched LearningPrograms for OrgId ' + orgId.toString())),
        catchError(this.handleError<ILearningProgram[]>('getLearningProgramsByOrganizationId', []))
      );
  }

  getLearningProgramsWithModules(orgId: number): Observable<ILearningProgram[]> {
    return this.http.get<ILearningProgram[]>('/api/LearningPrograms/withModules')
      .pipe(
        tap(_ => this.log('fetched LearningPrograms with Modules for OrgId ' + orgId.toString())),
        catchError(this.handleError<ILearningProgram[]>('getLearningProgramsWithModules', []))
      );
  }

  getLearningProgram(id: number): Observable<ILearningProgram> {
    return this.http.get<ILearningProgram>('/api/LearningPrograms/' + id)
      .pipe(
        tap(_ => this.log(`fetched LearingProgram id=${id}`)),
        catchError(this.handleError<ILearningProgram>(`getLearningProgram id=${id}`))
    );
  }

  getProgramDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/LearningPrograms/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for ProgramId: ' + id)),
        catchError(this.handleError<any[]>('getProgramDependencies', []))
      );
  }

  deleteLearningProgram(id: number): Observable<any> {
    return this.http.delete<ILearningProgram>('/api/LearningPrograms/' + id)
      .pipe(
        tap(_ => this.log(`deleted LearingProgram id=${id}`)),
        catchError(this.handleError<ILearningProgram>(`deleteLearningProgram id=${id}`))
      );
  }

  saveLearningProgram(learningProgram: ILearningProgram): Observable<ILearningProgram> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (learningProgram.id > 0) {
      return this.http.put<ILearningProgram>('/api/LearningPrograms/' + learningProgram.id, learningProgram, { headers })
        .pipe(
          tap(_ => this.log(`put LearingProgram id=${learningProgram.id}`)),
          catchError(this.handleError<ILearningProgram>(`saveLearningProgram id=${learningProgram.id}`))
        );
    } else {
      return this.http.post<ILearningProgram>('/api/LearningPrograms', learningProgram, { headers }).pipe(
        tap(_ => this.log(`posted LearingProgram id=${learningProgram.id}`)),
        catchError(this.handleError<ILearningProgram>(`saveLearningProgram id=${learningProgram.id}`))
      );
    }
  }


  getModules(): Observable<IModule[]> {
    return this.http.get<IModule[]>('/api/Modules')
      .pipe(
        tap(_ => this.log('fetched Modules')),
        catchError(this.handleError<IModule[]>('getModules', []))
      );
  }

  getModulesByOrganizationId(orgId: number): Observable<IModule[]> {
    return this.http.get<IModule[]>('/api/Modules/byOrganizationId/' + orgId)
      .pipe(
        tap(_ => this.log('fetched Modules for OrgId: ' + orgId)),
        catchError(this.handleError<IModule[]>('getModulesByOrganizationId', []))
      );
  }

  getModulesByProgramId(id: number): Observable<IModule[]> {
    return this.http.get<IModule[]>('/api/Modules/byProgramId/' + id)
      .pipe(
        tap(_ => this.log('fetched Modules for ProgramId: ' + id)),
        catchError(this.handleError<IModule[]>('getModulesByProgramId', []))
      );
  }

  getModule(id: number): Observable<IModule> {
    return this.http.get<IModule>('/api/Modules/' + id)
      .pipe(
        tap(_ => this.log(`fetched Module id=${id}`)),
        catchError(this.handleError<IModule>(`getModule id=${id}`))
      );
  }

  getModuleByName(name: string): Observable<IModule> {
    return this.http.get<IModule>('/api/Modules/ByName/' + name)
      .pipe(
        tap(_ => this.log('fetched Module By Name: ${name}')),
        catchError(this.handleError<IModule>('getModuleByName name=${name}'))
      );
  }

  getModuleDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/Modules/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for ModuleId: ' + id)),
        catchError(this.handleError<any[]>('getModuleDependencies', []))
      );
  }

  deleteModule(id: number): Observable<any> {
    return this.http.delete<IModule>('/api/Modules/' + id)
      .pipe(
        tap(_ => this.log(`deleted Module id=${id}`)),
        catchError(this.handleError<IModule>(`deleteModule id=${id}`))
      );
  }

  saveModule(module: IModule): Observable<IModule> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (module.id > 0) {
      return this.http.put<IModule>('/api/Modules/' + module.id, module, { headers })
        .pipe(
          tap(_ => this.log(`put Module id=${module.id}`)),
          catchError(this.handleError<IModule>(`saveModule id=${module.id}`))
        );
    } else {
      return this.http.post<IModule>('/api/Modules', module, { headers }).pipe(
        tap(_ => this.log(`posted Module id=${module.id}`)),
        catchError(this.handleError<IModule>(`saveModule id=${module.id}`))
      );
    }
  }


  getRatingSystems(): Observable<IRatingSystem[]> {
    return this.http.get<IRatingSystem[]>('/api/RatingSystems')
      .pipe(
        tap(_ => this.log('fetched Rating Systems')),
        catchError(this.handleError<IRatingSystem[]>('getRatingSystems', []))
      );
  }

  getRatingSystem(id: number): Observable<IRatingSystem> {
    return this.http.get<IRatingSystem>('/api/RatingSystems/' + id)
      .pipe(
        tap(_ => this.log(`fetched Rating System id=${id}`)),
        catchError(this.handleError<IRatingSystem>(`getRatingSystem id=${id}`))
      );
  }

  getRatingSystemByOrganizationId(orgId: number): Observable<IRatingSystem[]> {
    return this.http.get<IRatingSystem[]>('/api/RatingSystems/byOrganizationId/' + orgId)
      .pipe(
        tap(_ => this.log(`fetched Rating Systems orgId=${orgId}`)),
        catchError(this.handleError<IRatingSystem[]>(`getRatingSystemByOrganizationId orgId=${orgId}`))
      );
  }

  getRatingSystemDependencies(id: number): Observable<IRatingSystemDependencies> {
    return this.http.get<IRatingSystemDependencies>('/api/RatingSystems/Dependencies/' + id)
      .pipe(
        tap(_ => this.log(`fetched rating system dependencies for id=${id}`)),
        catchError(this.handleError<IRatingSystemDependencies>(`getRatingSystemDependencies id=${id}`))
      );
}

  deleteRatingSystem(id: number): Observable<any> {
    return this.http.delete<IRatingSystem>('/api/RatingSystems/' + id)
      .pipe(
        tap(_ => this.log(`deleted Rating System id=${id}`)),
        catchError(this.handleError<IRatingSystem>(`deleteRatingSystem id=${id}`))
      );
  }

  saveRatingSystem(ratingSystem: IRatingSystem): Observable<IRatingSystem> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (ratingSystem.id > 0) {
      return this.http.put<IRatingSystem>('/api/RatingSystems/' + ratingSystem.id, ratingSystem, { headers })
        .pipe(
          tap(_ => this.log(`put RatingSystem id=${ratingSystem.id}`)),
          catchError(this.handleError<IRatingSystem>(`saveRatingSystem id=${ratingSystem.id}`))
        );
    } else {
      return this.http.post<IRatingSystem>('/api/RatingSystems', ratingSystem, { headers }).pipe(
        tap(_ => this.log(`posted RatingSystem id=${ratingSystem.id}`)),
        catchError(this.handleError<IRatingSystem>(`saveRatingSystem id=${ratingSystem.id}`))
      );
    }
  }

  getRatingSystemValues(): Observable<IRatingSystemValue[]> {
    return this.http.get<IRatingSystemValue[]>('/api/RatingSystemValues')
      .pipe(
        tap(_ => this.log('fetched RatingSystemValues')),
        catchError(this.handleError<IRatingSystemValue[]>('getRatingSystemValues', []))
      );
  }

  getRatingSystemValuesByRatingSystemId(id: number): Observable<IRatingSystemValue[]> {
    return this.http.get<IRatingSystemValue[]>('/api/RatingSystemValues/byRatingSystemId/' + id)
      .pipe(
        tap(_ => this.log('fetched RatingSystemValues for RatingSystemId: ' + id)),
        catchError(this.handleError<IRatingSystemValue[]>('getRatingSystemValuesByRatingSystemId', []))
      );
  }

  getRatingSystemValue(id: number): Observable<IRatingSystemValue> {
    return this.http.get<IRatingSystemValue>('/api/RatingSystemValues/' + id)
      .pipe(
        tap(_ => this.log(`fetched RatingSystemValue id=${id}`)),
        catchError(this.handleError<IRatingSystemValue>(`getRatingSystemValue id=${id}`))
      );
  }

  getRatingSystemValueDependencies(id: number): Observable<IRatingSystemValueDependencies> {
    return this.http.get<IRatingSystemValueDependencies>('/api/RatingSystemValues/Dependencies/' + id)
      .pipe(
        tap(_ => this.log(`fetched RatingSystemValueDependencies id=${id}`)),
        catchError(this.handleError<IRatingSystemValueDependencies>(`getRatingSystemValueDependencies id=${id}`))
      );
  }

  deleteRatingSystemValue(id: number): Observable<any> {
    return this.http.delete<IRatingSystemValue>('/api/RatingSystemValues/' + id)
      .pipe(
        tap(_ => this.log(`deleted RatingSystemValue id=${id}`)),
        catchError(this.handleError<IRatingSystemValue>(`deleteRatingSystemValue id=${id}`))
      );
  }

  saveRatingSystemValue(rsv: IRatingSystemValue): Observable<IRatingSystemValue> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (rsv.id > 0) {
      return this.http.put<IRatingSystemValue>('/api/RatingSystemValues/' + rsv.id, rsv, { headers })
        .pipe(
          tap(_ => this.log(`put RatingSystemValue id=${rsv.id}`)),
          catchError(this.handleError<IRatingSystemValue>(`saveRatingSystemValue id=${rsv.id}`))
        );
    } else {
      return this.http.post<IRatingSystemValue>('/api/RatingSystemValues', rsv, { headers }).pipe(
        tap(_ => this.log(`posted RatingSystemValue id=${rsv.id}`)),
        catchError(this.handleError<IRatingSystemValue>(`saveRatingSystemValue id=${rsv.id}`))
      );
    }
  }


  getTasks(): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks')
      .pipe(
        tap(_ => this.log('fetched Tasks')),
        catchError(this.handleError<ITaskRow[]>('getTasks', []))
      );
  }

  getTasksByOrganizationId(orgId: number): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/byOrganizationId/' + orgId)
      .pipe(
        tap(_ => this.log('fetched Tasks for OrgId: ' + orgId)),
        catchError(this.handleError<ITaskRow[]>('getTasksByOrganizationId', []))
      );
  }

  getTasksByOrganizationIdPublished(orgId: number): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/byOrganizationIdPublished/' + orgId)
      .pipe(
        tap(_ => this.log('fetched published Tasks for OrgId: ' + orgId)),
        catchError(this.handleError<ITaskRow[]>('getTasksByOrganizationIdPublished', []))
      );
  }

  getUnitCountTasksForTraineeId(traineeId: string): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/UnitCountTasksForTrainee/' + traineeId)
      .pipe(
        tap(_ => this.log('fetched Unit Count Tasks for traineeId: ' + traineeId)),
        catchError(this.handleError<ITaskRow[]>('getUnitCountTasksForTraineeId', []))
      );
  }

  getTasksByModuleId(id: number): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/byModuleId/' + id)
      .pipe(
        tap(_ => this.log('fetched Tasks for ModuleId: ' + id)),
        catchError(this.handleError<ITaskRow[]>('getTasksByModuleId', []))
      );
  }

  getTasksByModuleIPublished(id: number): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/byModuleIdPublished/' + id)
      .pipe(
        tap(_ => this.log('fetched published Tasks for ModuleId: ' + id)),
        catchError(this.handleError<ITaskRow[]>('getTasksByModuleIdPublished', []))
      );
  }

  getEvaluationTasksForTrainer(traineeId: string): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/EvaluationTasksForTrainerId/' + traineeId)
      .pipe(
        tap(_ => this.log('fetched Evaluation Tasks for trainerId: ' + traineeId)),
        catchError(this.handleError<ITaskRow[]>('getEvaluationTasksForTrainer', []))
      );
  }

  getSubTasksByOrgId(id: number): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/subTasks/' + id)
      .pipe(
        tap(_ => this.log('fetched SubTasks for OrgId: ' + id)),
        catchError(this.handleError<ITaskRow[]>('getSubTasksByOrgId', []))
      );
  }

  getSubTasksByTaskStepId(id: number): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/subTasksByTaskStepId/' + id)
      .pipe(
        tap(_ => this.log('fetched SubTasks for TaskStepId: ' + id)),
        catchError(this.handleError<ITaskRow[]>('GetSubTasksByTaskStepId', []))
      );
  }

  getTasksAssignedToUser(id: string): Observable<ITaskRow[]> {
    return this.http.get<ITaskRow[]>('/api/Tasks/assignedToUser/' + id)
      .pipe(
        tap(_ => this.log('fetched Tasks assigned to User: ' + id)),
        catchError(this.handleError<ITaskRow[]>('getTasksAssignedToUser', []))
      );
  }

  getTask(id: number): Observable<ITask> {
    return this.http.get<ITask>('/api/Tasks/' + id)
      .pipe(
        tap(_ => this.log(`fetched Task id=${id}`)),
        catchError(this.handleError<ITask>(`getTask id=${id}`))
      );
  }

  getTaskRow(id: number): Observable<ITaskRow> {
    return this.http.get<ITaskRow>('/api/Tasks/taskRow/' + id)
      .pipe(
        tap(_ => this.log(`fetched TaskRow id=${id}`)),
        catchError(this.handleError<ITaskRow>(`getTaskRow id=${id}`))
      );
  }

  getTaskStepsWithSubTasks(id: number): Observable<IIdName[]> {
    return this.http.get<IIdName[]>('/api/Tasks/' + id + '/stepsWithSubTasks')
      .pipe(
        tap(_ => this.log(`fetched Task Steps with SubTasks id=${id}`)),
        catchError(this.handleError<IIdName[]>(`getTaskStepsWithSubTasks id=${id}`))
      );
  }

  getTaskSubTasks(id: number): Observable<ITaskStepSubTaskRow[]> {
    return this.http.get<ITaskStepSubTaskRow[]>('/api/Tasks/' + id + '/subTasks')
      .pipe(
        tap(_ => this.log(`fetched Task SubTasks id=${id}`)),
        catchError(this.handleError<ITaskStepSubTaskRow[]>(`getTaskSubTasks id=${id}`))
      );
  }

  getTaskDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/Tasks/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for TaskId: ' + id)),
        catchError(this.handleError<any[]>('getTaskDependencies', []))
      );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete<ITask>('/api/Tasks/' + id)
      .pipe(
        tap(_ => this.log(`deleted Task id=${id}`)),
        catchError(this.handleError<ITask>(`deleteTask id=${id}`))
      );
  }

  saveTask(task: ITask): Observable<ITask> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (task.id > 0) {
      return this.http.put<ITask>('/api/Tasks/' + task.id, task, { headers })
        .pipe(
          tap(_ => this.log(`put Task id=${task.id}`)),
          catchError(this.handleError<ITask>(`saveTask id=${task.id}`))
        );
    } else {
      return this.http.post<ITask>('/api/Tasks', task, { headers }).pipe(
        tap(_ => this.log(`posted Task id=${task.id}`)),
        catchError(this.handleError<ITask>(`saveTask id=${task.id}`))
      );
    }
  }

  createNewTaskVersion(id: number, versionNumber: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.put<ITask>('/api/Tasks/newTaskVersion/' + id + '/' + versionNumber, 'createNewTaskVersion', { headers })
        .pipe(
          tap(_ => this.log(`createNewTaskVersion id=${id} version=${versionNumber}`)),
          catchError(this.handleError<ITask>(`createNewTaskVersion id=${id} version=${versionNumber}`))
        );
  }

  publishTaskVersion(id: number, versionNumber: number) {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.put<ITask>('/api/Tasks/publishTaskVersion/' + id + '/' + versionNumber, 'publishTaskVersion', { headers })
      .pipe(
        tap(_ => this.log(`publishTaskVersion id=${id} version=${versionNumber}`)),
        catchError(this.handleError<ITask>(`publishTaskVersion id=${id} version=${versionNumber}`))
      );
  }


  getTaskSteps(): Observable<ITaskStepRow[]> {
    return this.http.get<ITaskStepRow[]>('/api/TaskSteps')
      .pipe(
        tap(_ => this.log('fetched TaskSteps')),
        catchError(this.handleError<ITaskStepRow[]>('getTaskSteps', []))
      );
  }

  getTaskStepsByTaskId(id: number): Observable<ITaskStepRow[]> {
    return this.http.get<ITaskStepRow[]>('/api/TaskSteps/byTaskId/' + id)
      .pipe(
        tap(_ => this.log('fetched TaskSteps for TaskId: ' + id)),
        catchError(this.handleError<ITaskStepRow[]>('getTaskStepsByTaskId', []))
      );
  }

  getTaskStepsByTaskIdWithOverrides(taskId: number, userId: string, taskStepOverrides: ITaskStepSubTaskOverride[]): Observable<ITaskTrainingInformation> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const taskWithOverrides: ITaskWithOverrides = { taskId: taskId, userId: userId, overrides: taskStepOverrides };

    return this.http.post<ITaskTrainingInformation>('/api/TaskSteps/withOverrides', taskWithOverrides, { headers }).pipe(
      tap(_ => this.log(`posted TaskSteps/byTaskId id=${taskId}`)),
      catchError(this.handleError<ITaskTrainingInformation>(`getTaskStepsByTaskIdWithOverrides id=${taskId}`))
    );
  }

  getTaskStep(id: number): Observable<ITaskStep> {
    return this.http.get<ITaskStep>('/api/TaskSteps/' + id)
      .pipe(
        tap(_ => this.log(`fetched TaskStep id=${id}`)),
        catchError(this.handleError<ITaskStep>(`getTaskStep id=${id}`))
      );
  }

  getTaskStepRow(id: number): Observable<ITaskStepRow> {
    return this.http.get<ITaskStepRow>('/api/TaskSteps/taskRow/' + id)
      .pipe(
        tap(_ => this.log(`fetched TaskStepRow id=${id}`)),
        catchError(this.handleError<ITaskStepRow>(`getTaskStepRow id=${id}`))
      );
  }

  getTaskStepInfo(id: number): Observable<ITaskStepInfo> {
    return this.http.get<ITaskStepInfo>('/api/TaskSteps/taskStepInfo/' + id)
      .pipe(
        tap(_ => this.log(`fetched TaskStepInfo id=${id}`)),
        catchError(this.handleError<ITaskStepInfo>(`getTaskStepInfo id=${id}`))
      );
  }

  getTaskStepDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/TaskSteps/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for TaskStepId: ' + id)),
        catchError(this.handleError<any[]>('getTaskStepDependencies', []))
      );
  }

  deleteTaskStep(id: number): Observable<any> {
    return this.http.delete<ITaskStep>('/api/TaskSteps/' + id)
      .pipe(
        tap(_ => this.log(`deleted TaskStep id=${id}`)),
        catchError(this.handleError<ITaskStep>(`deleteTaskStep id=${id}`))
      );
  }

  deleteTaskStepSubTask(id: number, subTaskId: number): Observable<any> {
    return this.http.delete<ITaskStep>('/api/TaskSteps/' + id + '/subTask/' + subTaskId)
      .pipe(
        tap(_ => this.log(`deleted TaskStep SubTask id=${id}, subId=${subTaskId}`)),
        catchError(this.handleError<ITaskStep>(`deleteTaskStepSubTask id=${id}`))
      );
  }

  saveTaskStep(taskStep: ITaskStep): Observable<ITaskStep> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (taskStep.id > 0) {
      return this.http.put<ITaskStep>('/api/TaskSteps/' + taskStep.id, taskStep, { headers })
        .pipe(
          tap(_ => this.log(`put TaskStep id=${taskStep.id}`)),
          catchError(this.handleError<ITaskStep>(`saveTaskStep id=${taskStep.id}`))
        );
    } else {
      return this.http.post<ITaskStep>('/api/TaskSteps', taskStep, { headers }).pipe(
        tap(_ => this.log(`posted TaskStep id=${taskStep.id}`)),
        catchError(this.handleError<ITaskStep>(`saveTaskStep id=${taskStep.id}`))
      );
    }
  }

  saveTaskStepReorder(taskStepRows: ITaskStepRow[]): Observable<ITaskStepRow> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.put<ITaskStepRow>('/api/TaskSteps/TaskStepRows', taskStepRows, { headers })
      .pipe(
        tap(_ => this.log(`put TaskStepRows`)),
        catchError(this.handleError<ITaskStepRow>(`saveTaskStepReorder`))
      );
  }

  saveTaskStepSubTasks(assignment: ITaskStepSubTaskAssignment): Observable<ITaskStepSubTaskAssignment> {

    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.put<ITaskStepSubTaskAssignment>('/api/TaskSteps/' + assignment.taskStepId + '/assignSubTasks', assignment, { headers })
      .pipe(
        tap(_ => this.log(`put TaskStepSubTaskAssignment id=${assignment.taskStepId}`)),
        catchError(this.handleError<ITaskStepSubTaskAssignment>(`saveTaskStepSubTasks id=${assignment.taskStepId}`))
      );
  }

  getClassrooms(): Observable<IClassroom[]> {
    return this.http.get<IClassroom[]>('/api/Classrooms')
      .pipe(
        tap(_ => this.log('fetched Classrooms')),
        catchError(this.handleError<IClassroom[]>('getClassRooms', []))
      );
  }

  getClassroomsByOrganizationId(organizationId: number): Observable<IClassroom[]> {
    return this.http.get<IClassroom[]>('/api/Classrooms/ByOrganizationId/' + organizationId)
      .pipe(
        tap(_ => this.log(`fetched Classrooms by Organization  id=${organizationId}`)),
        catchError(this.handleError<IClassroom[]>('getClassRooms', []))
      );
  }

  getClassroom(id: number): Observable<IClassroom> {
    return this.http.get<IClassroom>('/api/Classrooms/' + id)
      .pipe(
        tap(_ => this.log(`fetched Classroom id=${id}`)),
        catchError(this.handleError<IClassroom>(`getClassroom id=${id}`))
      );
  }

  getClassroomDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/Classrooms/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for ProgramId: ' + id)),
        catchError(this.handleError<any[]>('getClassroomDependencies', []))
      );
  }

  deleteClassroom(id: number): Observable<any> {
    return this.http.delete<IClassroom>('/api/Classrooms/' + id)
      .pipe(
        tap(_ => this.log(`deleted Classroom id=${id}`)),
        catchError(this.handleError<IClassroom>(`deleteClassroom id=${id}`))
      );
  }

  saveClassroom(classroom: IClassroom): Observable<IClassroom> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (classroom.id > 0) {
      return this.http.put<IClassroom>('/api/Classrooms/' + classroom.id, classroom, { headers })
        .pipe(
          tap(_ => this.log(`put Classroom id=${classroom.id}`)),
          catchError(this.handleError<IClassroom>(`saveClassroom id=${classroom.id}`))
        );
    } else {
      return this.http.post<IClassroom>('/api/Classrooms', classroom, { headers }).pipe(
        tap(_ => this.log(`posted Classroom id=${classroom.id}`)),
        catchError(this.handleError<IClassroom>(`saveClassroom id=${classroom.id}`))
      );
    }
  }

  getTaskItems(): Observable<ITaskItem[]> {
    return this.http.get<ITaskItem[]>('/api/TaskItems')
      .pipe(
        tap(_ => this.log('fetched TaskItems')),
        catchError(this.handleError<ITaskItem[]>('getTaskITems', []))
      );
  }

  getTaskItemsByOrganizationId(organizationId: number): Observable<ITaskItem[]> {
    return this.http.get<ITaskItem[]>('/api/TaskItems/ByOrganizationId/' + organizationId)
      .pipe(
        tap(_ => this.log('fetched TaskItems')),
        catchError(this.handleError<ITaskItem[]>('getTaskITems', []))
      );
  }

  GetTaskItem(id: number): Observable<ITaskItem> {
    return this.http.get<ITaskItem>('/api/TaskItems/' + id)
      .pipe(
        tap(_ => this.log('fetched TaskItem id=${id}')),
        catchError(this.handleError<ITaskItem>('getTaskItem id=${id}')),
      );
  }

  getTaskItemDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/TaskItems/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for TaskItem id=${id}')),
        catchError(this.handleError<any[]>('getTaskItemDependencies id=${id}', []))
      );
  }

  deleteTaskItem(id: number): Observable<any> {
    return this.http.delete<ITaskItem>('/api/TaskItems/' + id)
      .pipe(
        tap(_ => this.log(`deleted TaskItem id=${id}`)),
        catchError(this.handleError<ITaskItem>(`deleteTaskItem id=${id}`))
      );
  }

  saveTaskItem(taskItem: ITaskItem): Observable<ITaskItem> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (taskItem.id > 0) {
      return this.http.put<ITaskItem>('/api/TaskItems/' + taskItem.id, taskItem, { headers })
        .pipe(
          tap(_ => this.log(`put TaskItem id=${taskItem.id}`)),
          catchError(this.handleError<ITaskItem>(`saveTaskItem id=${taskItem.id}`))
        );
    } else {
      return this.http.post<ITaskItem>('/api/TaskITems', taskItem, { headers }).pipe(
        tap(_ => this.log(`posted TaskItem id=${taskItem.id}`)),
        catchError(this.handleError<ITaskItem>(`saveTaskItem id=${taskItem.id}`))
      );
    }
  }

  getTaskUserOverrides(taskId: number, userId: string): Observable<ITaskUserOverrideSet> {
    return this.http.get<ITaskUserOverrideSet>('/api/Override/' + taskId + "/" + userId)
      .pipe(
        tap(_ => this.log(`get TaskUserOverrides taskId=${taskId} userId=${userId}`)),
        catchError(this.handleError<ITaskUserOverrideSet>(`error in TaskUserOverrides taskId=${taskId} userId=${userId}`))
      );
  }

  getTaskUserOverridesById(id: number): Observable<ITaskUserOverrideSet> {
    return this.http.get<ITaskUserOverrideSet>('/api/Override/byId/' + id)
      .pipe(
        tap(_ => this.log(`get TaskUserOverridesById id=${id}`)),
        catchError(this.handleError<ITaskUserOverrideSet>(`error in TaskUserOverridesById id=${id}`))
      );
  }

  saveTaskUserOverrideSet(os: ITaskUserOverrideSet): Observable<ITaskUserOverrideSet> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.post<ITaskUserOverrideSet>('/api/Override/overrideSet', os, { headers }).pipe(
      tap(_ => this.log(`posted OverrideSeet num=${os.taskUserOverrides.length}`)),
      catchError(this.handleError<ITaskUserOverrideSet>(`saveOverrideSet num=${os.taskUserOverrides.length}`))
    );
  }

  deleteOverridesForTaskUser(taskId: number, userId: string): Observable<IDeleteResult> {
    return this.http.delete<IDeleteResult>('/api/Override/' + taskId + "/" + userId)
      .pipe(
        tap(_ => this.log(`deleted Overrides taskId=${taskId} userId=${userId}`)),
        catchError(this.handleDeleteError(`deleteOverridesForTaskUser taskId=${taskId} userId=${userId}`))
      );
  }

  getProblemTypes(): Observable<IProblemType[]> {
    return this.http.get<IProblemType[]>('/api/ProblemTypes')
      .pipe(
        tap(_ => this.log('fetched ProblemTypes')),
        catchError(this.handleError<IProblemType[]>('getProblemTypes', []))
      );
  }

  GetProblemType(id: number): Observable<IProblemType> {
    return this.http.get<IProblemType>('/api/ProblemTypes/' + id)
      .pipe(
        tap(_ => this.log('fetched ProblemTypes id=${id}')),
        catchError(this.handleError<IProblemType>('getProblemTypes id=${id}')),
      );
  }

  getProblemTypeDependencies(id: number): Observable<any> {
    return this.http.get<any[]>('/api/ProblemTypes/Dependencies/' + id)
      .pipe(
        tap(_ => this.log('fetched Dependencies for ProblemType id=${id}')),
        catchError(this.handleError<any[]>('getProblemTypeDependencies id=${id}', []))
      );
  }

  getMediaProperties(): Observable<ContentServiceModels.IMediaProperties> {
    return this.http.get<ContentServiceModels.IMediaProperties>('/api/MediaCues/MediaProperties')
      .pipe(
        tap(_ => this.log('fetched Media Properties.')),
        catchError(this.handleError<ContentServiceModels.IMediaProperties>('GetMediaProperties'))
      );
  }

  deleteProblemType(id: number): Observable<any> {
    return this.http.delete<IProblemType>('/api/ProblemTypes/' + id)
      .pipe(
        tap(_ => this.log(`deleted ProblemType id=${id}`)),
        catchError(this.handleError<IProblemType>(`deleteProblemType id=${id}`))
      );
  }

  saveProblemType(problemType: IProblemType): Observable<IProblemType> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    if (problemType.id > 0) {
      return this.http.put<IProblemType>('/api/ProblemTypes/' + problemType.id, problemType, { headers })
        .pipe(
          tap(_ => this.log(`put ProblemType id=${problemType.id}`)),
          catchError(this.handleError<IProblemType>(`saveProblemType id=${problemType.id}`))
        );
    } else {
      return this.http.post<IProblemType>('/api/ProblemTypes', problemType, { headers }).pipe(
        tap(_ => this.log(`posted ProblemType id=${problemType.id}`)),
        catchError(this.handleError<IProblemType>(`saveProblemType id=${problemType.id}`))
      );
    }
  }

  saveShareChangeSet(changes: IShareChangeSet): Observable<IShareChangeSet> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    return this.http.put<IShareChangeSet>('/api/TaskSteps/ShareChangeSet/', changes, { headers })
      .pipe(
        tap(_ => this.log(`put ShareChangeSet`)),
        catchError(this.handleError<IShareChangeSet>(`saveShareChangeSet`))
      );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log('handling error!')

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private handleDeleteError(operation = 'operation', result?: IDeleteResult) {
    return (error: HttpErrorResponse): Observable<IDeleteResult> => {
      console.log('handling delete error!')
      console.log('HTTP Error Reponse Code: ' + error.status);

      var deleteResult: IDeleteResult = {
        success: false,
        errorCode: error.status,
        errorMessage: error.message
      }

      return of(deleteResult);
    };
  }

  private log(message: string) {
    if(this.showLog) {
      console.log(`ContentService: ${message}`);
    }
  }
}

export interface IDeleteResult {
  success: boolean;
  errorCode: number;
  errorMessage: string;
}

export interface IMediaType {
  id: number;
  code: string;
  description: string;
  category: string;
}

export interface IMediaCue {
  id: number;
  name: string;
  mediaTypeId: number;
  mediaType: IMediaType;
  mimeType: string;
  mediaURL: string;
  displayURL: string;
  thumbnailURL: string;
  mediaGuid: any;
  thumbnailBlobId: any;
  organizationId: number;
  shared: boolean;
  mediaTags: string[];
}

export interface IMediaCueRow {
  mediaCueId: number;
  mediaCueName: string;
  mediaTypeId: number;
  mediaTypeCode: string;
  displayURL: string;
  thumbnailURL: string;
  organizationId: number;
  mediaTags: string[];
  displayTagCount: number;
  shared: boolean;
}

export interface IMediaCueShareRow {
  id: number;
  name: string;
  description: string;
  shared: boolean;
  readonly originalShared: boolean;
  parentTask?: ITaskShareRow;

}


export interface ILearningProgram {
  id: number;
  organizationId: number;
  organization: any;
  name: string;
  description: string;
  documentationURL: string;
  programImage: any;
  programImageId: number;
  shared: boolean;
  modules: IModule[];
}

export interface IProgramShareRow {
  id: number;
  name: string;
  description: string;
  modules: IModuleShareRow[];
  modulesExpanded: boolean;
  readonly originalShared: boolean;
  shared: boolean;
}

export interface IModuleShareRow {
  id: number;
  name: string;
  description: string;
  tasks: ITaskShareRow[];
  tasksExpanded: boolean;
  shared: boolean;
  readonly originalShared: boolean;
  parentProgram: IProgramShareRow;
}

export interface ITaskShareRow {
  id: number;
  name: string;
  description: string;
  taskImageID: number;
  shared: boolean;
  readonly originalShared: boolean;
  parentModule: IModuleShareRow;
}



export interface IChangeTracking {
  shared: boolean;
  readonly originalShared: boolean;
}

export interface IChangedItem {
  id: number;
  shared: boolean;
  taskImageId?: number;
}

export interface IShareChangeSet {
  changedPrograms: IChangedItem[];
  changedModules: IChangedItem[];
  changedTasks: IChangedItem[];
  changedMediaCues: IChangedItem[];
}

export interface IModule {
  id: number;
  learningProgramId: number;
  learningProgram: ILearningProgram;
  name: string;
  description: string;
  documentationURL: string;
  organizationId: number;
  shared: boolean;
  tasks: ITask[];
}

export interface ITask {
  id: number;
  moduleId: number;
  module: IModule;
  name: string;
  description: string;
  documentationURL: string;
  ratingSystemId: number;
  taskImageId: number;
  unitCountTask: boolean;
  taskSteps: ITaskStep[];
  backImageId: number;
  forwardImageId: number;
  competativeRangeMin: number;
  competativeRangeMax: number;
  alternateStepImageId: number;
  isSubtask: boolean;
  versionNumber: number;
  versionOf: number;
  lastChangeBy: string;
  lastChangedDate: Date;
  published: boolean;
  publishDate: Date;
  shared: boolean;
}

export interface ITaskRow {
  programId: number;
  programName: string;
  moduleId: number;
  moduleName: string;
  taskId: number;
  taskName: string;
  taskDescription: string;
  ratingSystemId: number;
  unitCountTask: boolean;
  imageUrl: string;
  competativeRangeMin: number;
  competativeRangeMax: number;
  isSubtask: boolean;
  versionNumber: number;
  published: boolean;
  organizationId: number;
  organizationName: string;
  versionOf: number;
}

export interface ITaskRowWithDisable {
  programId: number;
  programName: string;
  moduleId: number;
  moduleName: string;
  taskId: number;
  taskName: string;
  taskDescription: string;
  ratingSystemId: number;
  unitCountTask: boolean;
  imageUrl: string;
  competativeRangeMin: number;
  competativeRangeMax: number;
  isSubtask: boolean;
  versionNumber: number;
  published: boolean;
  disable: boolean;
  versionOf: number;
}

export interface ITaskStep {
  id: number;
  taskId: number;
  task: ITask;
  name: string;
  sequence: number;
  contentText: string;
  audioCue: IMediaCue;
  audioCueId: number;
  visualCue: IMediaCue;
  visualCueId: number;
  nextSequence: number;
  nextText: string;
  showAlternateNext: boolean;
  alternateNextSequence: number;
  alternateNextText: string;
  displayBackURL: string;
  displayForwardURL: string;
  displayAlternateStepURL: string;
  alternateForwardImageId: number;
}

export interface ITaskStepInfo {
  learningProgramId: number;
  moduleId: number;
  taskId: number;
  taskStepId: number;
  taskStepName: string;
}

export interface ITaskStepRow {
  taskStepId: number;
  taskId: number;
  taskName: string;
  taskStepName: string;
  sequence: number;
  contentText: string;
  audioCue: IMediaCue;
  visualCue: IMediaCue;
  nextSequence: number;
  nextText: string;
  showAlternateNext: boolean;
  alternateNextSequence: number;
  alternateNextText: string;
  visualCueURL: string;
  audioCueURL: string;
  displayBackURL: string;
  displayForwardURL: string;
  displayAlternateStepURL: string;
  thumbnailURL: string;
  organizationId: number;
  insertedSubTaskId: number;
  fromSubTask: boolean;
  parentTaskStepId: number;
  originalSequence: number;
  alternateForwardImageId: number;
  numberOfSubTasks: number;
  visible,
  isReplacement,
  originalTaskStepId,
  isInserted,
  audioMimeType: string
}

export interface ITaskUserOverride {
  isHiding: boolean;
  isReplacing: boolean;
  insertAfterStepId: number;
  sequenceAfterStepId: number;
  insertedTaskStepId: number;
}

export interface ITaskTrainingInformation {
  taskId: number,
  traineeId: string,
  taskUserOverrideSet: ITaskUserOverrideSet,
  taskSteps: ITaskStepRow[]
}

export interface ITaskUserOverrideSet {
  id: number;
  taskId: number;
  userId: string;
  taskUserOverrides: ITaskUserOverride[];
  creationDate: Date;
  hasHideOverrides: boolean;
  hasReplaceOverrides: boolean;
  hasInsertOverrides: boolean;
}

export interface ITaskStepSubTaskAssignment {
  taskStepId: number;
  taskIds: number[];
}

export interface ITaskStepSubTaskOverride {
  taskStepId: number;
  taskId: number;
}

export interface ITaskWithOverrides {
  taskId: number;
  userId: string;
  overrides: ITaskStepSubTaskOverride[];
}

export interface IRatingSystem {
  id: number;
  organizationId: number;
  name: string;
  description: string;
}

export interface IRatingSystemValue {
  id: number;
  ratingSystemId: number;
  score: number;
  code: string;
  description: string;
  organizationId: number;
  abbreviation: string;
}

export interface ITaskStepPreviewDialogData {
  HeightPercent: number;
  TrainerId: string;
  TaskStepRow: ITaskStepRow;
  TaskSteps: ITaskStepRow[];
  BackSequence?: number[];
}

export interface IMediaCueSearchOptions {
  tag: string;
  MediaCueTypeFilter: string[];
  ModuleId: number;
}

export interface IDefaultBackForwardAlternateStepImageIds {
  defaultBackImageId: number;
  defaultForwardImageId: number;
  defaultAlternateStepImageId: number;
}

export interface IMediaCuePreview {
  previewURL: string;
  mediaCueType: ContentServiceModels.MediaCueTypeEnum;
  safeVideoURL: SafeResourceUrl;
  previewWidth: number;
  previewHeight: number;
}

export interface ITaskStepDependencies {
  hasEvaluationDetails: boolean;
  hasTaskStepSubTasks: boolean;
  hasTaskUserOverrides: boolean;
}

export interface ITaskDependencies {
  hasEvaluations: boolean;
  hasEvaluationDetails: boolean;
  hasTrainingSessions: boolean;
  hasTaskSteps: boolean;
  hasTaskUserOverrideSet: boolean;
}

export interface IMediaCueDependencies {
  hasUsers: boolean;
  hasClassrooms: boolean;
  hasLearningPrograms: boolean;
  hasTaskSteps: boolean;
  hasTaskImages: boolean;
}

export interface IModuleDependencies {
  hasEvaluations: boolean;
  hasEvaluationDetails: boolean;
  hasTrainingSessions: boolean;
  hasTaskSteps: boolean;
  hasTasks: boolean;
}

export interface IProgramDependencies {
  hasEvaluations: boolean;
  hasEvaluationDetails: boolean;
  hasTrainingSessions: boolean;
  hasTaskSteps: boolean;
  hasTasks: boolean;
  hasModules: boolean;
}

export interface IRatingSystemDependencies {
  hasTasks: boolean;
  hasRatingSystemValues: boolean;
}

export interface IRatingSystemValueDependencies {
  hasEvaluationDetails: boolean;
}

export interface IClassroom {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  organization: IOrganization;
  divisionId: number;
  division: IDivision;
  subDivisionId: number;
  subDivision: ISubDivision;
  classroomImageId: number;
  classroomImage: IMediaCue;
}

export interface IClassroomDependencies {
  hasEvaluations: boolean;
}

export interface ITaskItem {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  organization: IOrganization;
  taskItemImageId: number;
  taskItemImage: IMediaCue;
}

export interface ITaskItemDependencies {
  hasTrainingSessions: boolean;
}

export interface IProblemType {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  organization: IOrganization;
}

export interface IProblemTypeDependencies {
  hasTrainingSessions: boolean;
}

export interface IIdName {
  id: number;
  name: string;
}

export interface ITaskStepSubTaskRow {
  taskId: number;
  taskName: string;
  taskStepid: number;
  taskStepName: string;
  subTaskId: number;
  subTaskName: string;
}
