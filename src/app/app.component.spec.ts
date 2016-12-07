import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';

import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';

// Load the implementations that should be tested
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';

import { ENV_PROVIDERS } from './environment';

import { HostsService } from './hosts.service';

const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  HostsService
];

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [ // import Angular's modules
        MaterialModule.forRoot(),
        BrowserModule
      ],
      providers: [ // expose our Services and Providers into Angular's dependency injection
        AppComponent,
        ENV_PROVIDERS,
        APP_PROVIDERS
      ]
    }).compileComponents();
  }));

  it('app state should work', inject([AppComponent], (app: AppComponent) => {
    expect(app.appState.state).toBeDefined();
  }));
});
