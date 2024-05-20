import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamelogComponent } from './gamelog.component';

describe('GamelogComponent', () => {
  let component: GamelogComponent;
  let fixture: ComponentFixture<GamelogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamelogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
