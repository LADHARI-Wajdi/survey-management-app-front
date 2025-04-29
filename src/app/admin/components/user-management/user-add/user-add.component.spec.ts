import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('UserAddComponent', () => {
  let component: UserAddComponent;
  let fixture: ComponentFixture<UserAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
