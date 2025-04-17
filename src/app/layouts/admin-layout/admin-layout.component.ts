// layouts/admin-layout/admin-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event, RouterModule } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../core/authentication/services/auth.service';
import { User } from '../../core/models/user.model';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { NotificationComponent } from "../../shared/components/notification/notification.component";
Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    LoaderComponent,
    NotificationComponent
]
})

export class  implements OnInit {
  currentUser: User | null = null;
  isMenuCollapsed = false;
  activeRoute = '';
  pageTitle = 'Administration';
  currentYear = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
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
          this.titleService.setTitle(`SurveyApp Admin - ${data['title']}`);
        } else {
          this.pageTitle = 'Administration';
          this.titleService.setTitle('SurveyApp Admin - Tableau de bord');
        }

        // Update active route for menu highlighting
        this.activeRoute = this.router.url;
      });
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      // If user is not admin, redirect to home
      if (user && !user.roles.includes('admin')) {
        this.router.navigate(['/']);
      }
    });
  }

  toggleMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
