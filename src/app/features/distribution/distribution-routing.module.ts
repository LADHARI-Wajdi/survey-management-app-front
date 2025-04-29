// features/distribution/distribution-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { DistributionMethodsComponent } from './components/distribution-methods/distribution-methods.component';
import { LinkSharingComponent } from './components/link-sharing/link-sharing.component';
import { QrCodeGeneratorComponent } from './components/qr-code-generator/qr-code-generator.component';
import { IframeEmbedComponent } from './components/iframe-embed/iframe-embed.component';
import { InvitationListComponent } from './components/invitation-management/invitation-list/invitation-list.component';
import { InvitationCreateComponent } from './components/invitation-management/invitation-create/invitation-create.component';
import { InvitationTemplateComponent } from './components/invitation-management/invitation-template/invitation-template.component';
import { InvitationTrackingComponent } from './components/invitation-management/invitation-tracking/invitation-tracking.component';
import { authGuard } from '../../core/guards/auth.guard';

// Guards

const routes: Routes = [
  {
    path: '',
    redirectTo: 'methods',
    pathMatch: 'full',
  },
  {
    path: ':id',
    component: DistributionMethodsComponent,
    canActivate: [authGuard],
    data: { title: "Distribution de l'enquête" },
  },
  {
    path: ':id/link',
    component: LinkSharingComponent,
    canActivate: [authGuard],
    data: { title: 'Partage par lien' },
  },
  {
    path: ':id/qrcode',
    component: QrCodeGeneratorComponent,
    canActivate: [authGuard],
    data: { title: 'Générateur de QR Code' },
  },
  {
    path: ':id/iframe',
    component: IframeEmbedComponent,
    canActivate: [authGuard],
    data: { title: 'Intégration iframe' },
  },
  {
    path: ':id/invitations',
    component: InvitationListComponent,
    canActivate: [authGuard],
    data: { title: 'Gestion des invitations' },
  },
  {
    path: ':id/invitations/create',
    component: InvitationCreateComponent,
    canActivate: [authGuard],
    data: { title: 'Créer des invitations' },
  },
  {
    path: ':id/invitations/templates',
    component: InvitationTemplateComponent,
    canActivate: [authGuard],
    data: { title: "Modèles d'invitation" },
  },
  {
    path: ':id/invitations/tracking',
    component: InvitationTrackingComponent,
    canActivate: [authGuard],
    data: { title: 'Suivi des invitations' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistributionRoutingModule {}
