export enum LogOptions
{
    LogSteps,
    LogPreviousTaskSteps,
    LogCurrentStep
}

/*
Example of how this could be used:

  //Only used for debugging
  private logInformation(logOption: LogOptions[]) {

    if(logOption.includes(LogOptions.LogSteps)) {
      this.TaskSteps.forEach((value, index) => {
        console.log(`Row ${index}: Name(${value.taskStepName}) Sequence(${value.sequence}) Next(${value.nextSequence}) Alternate Next(${value.alternateNextSequence})`);
      });
    }

    if(logOption.includes(LogOptions.LogPreviousTaskSteps)) {
      console.log("PreviousTaskSteps:", this.previousTaskSteps);
    }
    
  }

*/