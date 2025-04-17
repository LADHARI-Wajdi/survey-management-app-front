import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSharingComponent } from './link-sharing.component';

describe('LinkSharingComponent', () => {
  let component: LinkSharingComponent;
  let fixture: ComponentFixture<LinkSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkSharingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
