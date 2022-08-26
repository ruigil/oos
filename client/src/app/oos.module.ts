import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
 
import { OOSRoutingModule } from './oos-routing.module';
import { OOSComponent } from './oos.component';

@NgModule({
  declarations: [
    OOSComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    OOSRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  bootstrap: [ OOSComponent ],
  schemas: [ ]
})
export class OOSModule { }
