import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnDestroy {
  @Input() appHasRole: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService
  ) {
    this.userService.CurrentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.updateView(user);
      });
  }

  private updateView(user: any) {
    this.viewContainerRef.clear();

    if (!user?.roles) return;

    const hasRole = user.roles.some((r: any) =>
      this.appHasRole.includes(r.code)
    );

    if (hasRole) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
