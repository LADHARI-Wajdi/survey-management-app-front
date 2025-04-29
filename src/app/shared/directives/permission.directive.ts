import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/authentication/services/auth.service';
import { UserRole } from '../../core/authentication/models/user.model';

@Directive({
  selector: '[appPermission]',
  standalone: true,
})
export class PermissionDirective implements OnInit, OnDestroy {
  private hasView = false;
  private requiredRoles: UserRole[] = [];
  private destroy$ = new Subject<void>();

  // Gestion du template alternatif avec la syntaxe else
  @Input() set appPermissionElse(templateRef: TemplateRef<any>) {
    this.elseTemplateRef = templateRef;
    this.updateView();
  }
  private elseTemplateRef: TemplateRef<any> | null = null;

  @Input() set appPermission(roles: UserRole | UserRole[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements d'utilisateur pour mettre à jour la vue
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    const hasPermission = this.checkPermission();

    if (hasPermission && !this.hasView) {
      // L'utilisateur a les permissions - afficher le contenu
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      // L'utilisateur n'a pas les permissions - cacher le contenu
      this.viewContainer.clear();

      // Afficher le template alternatif si fourni
      if (this.elseTemplateRef) {
        this.viewContainer.createEmbeddedView(this.elseTemplateRef);
      }

      this.hasView = false;
    } else if (!hasPermission && !this.hasView && this.elseTemplateRef) {
      // Si le contenu est déjà caché mais qu'on a un template alternatif à afficher
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.elseTemplateRef);
    }
  }

  private checkPermission(): boolean {
    // Si aucun rôle requis, autoriser l'accès
    if (!this.requiredRoles || this.requiredRoles.length === 0) {
      return true;
    }

    // Vérifier que l'utilisateur est connecté
    const user = this.authService.currentUserValue;
    if (!user) {
      return false;
    }

    // Vérifier si l'utilisateur a au moins un des rôles requis
    return this.requiredRoles.some((role) => user.roles.includes(role));
  }
}
