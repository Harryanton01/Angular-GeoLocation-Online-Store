import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatfeedComponent } from './chatfeed.component';

describe('ChatfeedComponent', () => {
  let component: ChatfeedComponent;
  let fixture: ComponentFixture<ChatfeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatfeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
