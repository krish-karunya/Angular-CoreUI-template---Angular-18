import { ITaskStepSubTaskOverride } from '../services/content.service';

interface ITrainingBaseModel {
    trainerId: string;
    traineeId: string;
    taskStepId: number;
}

export interface ITrainingSetupModel extends ITrainingBaseModel {
    
    taskId: number;
    overrides: ITaskStepSubTaskOverride[];
}

export interface ISyncTrainingModel extends ITrainingBaseModel {
    backSequence?: number[];
}

export enum TrainingHubEvents
{
    SetupRequested = 0,
    TraineeDisconnected = 1
}

export interface ITrainingHubEventModel
{
    toUserId: string;
    fromUserId: string;
    eventType: TrainingHubEvents
}