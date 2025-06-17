import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Event, RouterModule } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../core/authentication/services/auth.service';
import { User, UserRole } from '../../core/models/user.model';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { NotificationComponent } from "../../shared/components/notification/notification.component";

@Component({
  selector: 'app-investigator-layout',
  templateUrl: './investigator-layout.component.html',
  styleUrls: ['./investigator-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoaderComponent,
    SharedModule,
    NotificationComponent
  ]
})
export class InvestigatorLayoutComponent implements OnInit {
  currentUser: User | null = null;
  isMenuCollapsed = false;
  activeRoute = '';
  pageTitle = 'Tableau de bord';
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private authService: AuthService
  ) {
    // Subscribe to route changes to update active route and page title
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.route),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    ).subscribe(data => {
      this.activeRoute = this.router.url;
      if (data['title']) {
        this.pageTitle = data['title'];
        this.titleService.setTitle(`${data['title']} - SurveyApp`);
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      // If user is not investigator or admin, redirect to home
      if (user && !user.roles.includes(UserRole.INVESTIGATOR) && !user.roles.includes(UserRole.ADMIN)) {
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