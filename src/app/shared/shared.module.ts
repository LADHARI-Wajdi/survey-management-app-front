// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { LoaderComponent } from './components/loader/loader.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ModalComponent } from './components/modal/modal.component';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { DebounceClickDirective } from './directives/debounce-click.directive';
import { PermissionDirective } from './directives/permission.directive';

// Pipes
import { DateFormatPipe } from './pipes/date-format.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
 

  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    // Modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    
  ],
})
export class SharedModule {}
