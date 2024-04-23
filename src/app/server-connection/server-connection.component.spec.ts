import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerConnectionComponent } from './server-connection.component';

describe('ServerConnectionComponent', () => {
  let component: ServerConnectionComponent;
  let fixture: ComponentFixture<ServerConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerConnectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServerConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
