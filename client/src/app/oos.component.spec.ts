import { TestBed, async } from '@angular/core/testing';
import { OOSComponent } from './oos.component';
describe('OOSComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OOSComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(OOSComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'client'`, async(() => {
    const fixture = TestBed.createComponent(OOSComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('client');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(OOSComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to client!');
  }));
});
