import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean> | boolean;
}

@Injectable()
export class ChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  constructor() {
  }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    if (!!component) {
      return component.canDeactivate() ? true : confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
    }
    return true;
        
  }
}

