// shared/directives/permission.directive.ts
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/authentication/services/auth.service';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective implements OnInit {
  private hasView = false;
  private requiredRoles: string[] = [];

  @Input() set appPermission(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.updateView();
    
    // Subscribe to user changes to update the view when user/roles change
    this.authService.currentUser$.subscribe(() => {
      this.updateView();
    });
  }

  private updateView(): void {
    // Check if user has at least one of the required roles
    const hasRole = this.requiredRoles.some(role => this.authService.hasRole(role));
    
    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}