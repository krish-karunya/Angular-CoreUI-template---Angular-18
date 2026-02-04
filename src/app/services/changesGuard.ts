import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class ChangesGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate,
  ): boolean | Observable<boolean> {
    if (component?.canDeactivate) {
      return component.canDeactivate()
        ? true
        : confirm(
            'WARNING: You have unsaved changes. Do you really want to leave?',
          );
    }

    return true;
  }
}
