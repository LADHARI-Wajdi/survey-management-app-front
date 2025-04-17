// layouts/main-layout/main-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event, RouterModule } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../core/authentication/services/auth.service';
import { User } from '../../core/models/user.model';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { NotificationComponent } from "../../shared/components/notification/notification.component";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    LoaderComponent,
    NotificationComponent
]
})
export class MainLayoutComponent implements OnInit {
  currentUser: User | null = null;
  isMenuCollapsed = false;
  activeRoute = '';
  pageTitle = '';
  notificationsCount = 0;
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private notificationService: NotificationService
  ) {
    // Set up route change detection for updating page title and active route
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        // Update page title from route data
        if (data['title']) {
          this.pageTitle = data['title'];
          this.titleService.setTitle(`SurveyApp - ${data['title']}`);
        } else {
          this.pageTitle = 'Tableau de bord';
          this.titleService.setTitle('SurveyApp - Tableau de bord');
        }

        // Update active route for menu highlighting
        this.activeRoute = this.router.url;
      });
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    // Sample notifications count - in a real app this would come from a service
    this.notificationsCount = 3;
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  // Check if the user has the specified role
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
