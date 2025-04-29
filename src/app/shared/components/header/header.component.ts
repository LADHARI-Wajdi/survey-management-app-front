import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [ CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
toggleMenu() {
throw new Error('Method not implemented.');
}
pageTitle: any;
notificationsCount: any;
authService: any;
logout() {
throw new Error('Method not implemented.');
}

}
