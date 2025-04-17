import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeEmbedComponent } from './iframe-embed.component';

describe('IframeEmbedComponent', () => {
  let component: IframeEmbedComponent;
  let fixture: ComponentFixture<IframeEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IframeEmbedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframeEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
