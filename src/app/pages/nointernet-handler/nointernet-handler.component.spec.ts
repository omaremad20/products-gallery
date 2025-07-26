import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NointernetHandlerComponent } from './nointernet-handler.component';
describe('NointernetHandlerComponent', () => {
  let component: NointernetHandlerComponent;
  let fixture: ComponentFixture<NointernetHandlerComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NointernetHandlerComponent]
    })
      .compileComponents();
    fixture = TestBed.createComponent(NointernetHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
