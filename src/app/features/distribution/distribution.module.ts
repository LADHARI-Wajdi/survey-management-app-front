// features/distribution/distribution.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DistributionRoutingModule } from './distribution-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { DistributionMethodsComponent } from './components/distribution-methods/distribution-methods.component';
import { LinkSharingComponent } from './components/link-sharing/link-sharing.component';
import { QrCodeGeneratorComponent } from './components/qr-code-generator/qr-code-generator.component';
import { IframeEmbedComponent } from './components/iframe-embed/iframe-embed.component';
import { InvitationListComponent } from './components/invitation-management/invitation-list/invitation-list.component';
import { InvitationCreateComponent } from './components/invitation-management/invitation-create/invitation-create.component';
import { InvitationTemplateComponent } from './components/invitation-management/invitation-template/invitation-template.component';
import { InvitationTrackingComponent } from './components/invitation-management/invitation-tracking/invitation-tracking.component';

// Services
import { DistributionService } from './services/distribution.service';
import { InvitationService } from './services/invitation.service';
import { share } from 'rxjs';

@NgModule({
  declarations: [
    // Non-standalone components would be declared here
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DistributionRoutingModule,
    

    // Import standalone components
    DistributionMethodsComponent,
    LinkSharingComponent,
    QrCodeGeneratorComponent,
    IframeEmbedComponent,
    InvitationListComponent,
    InvitationCreateComponent,
    InvitationTemplateComponent,
    InvitationTrackingComponent,
  ],
  providers: [DistributionService, InvitationService,],
})
export class DistributionModule {}
