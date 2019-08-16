import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';

import { OOSRoutingModule } from './oos-routing.module';
 
import { OOSComponent } from './oos.component';
import { TagFilterComponent } from './tag-filter/tag-filter.component';

import { SearchTagPipe } from './pipes/search-tag.pipe';
import { SortTagPipe } from './pipes/sort-tag.pipe';
import { LoginComponent } from './login/login.component';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

/*
*/

@NgModule({
  declarations: [
    OOSComponent,
    TagFilterComponent,
    SearchTagPipe,
    SortTagPipe,
    LoginComponent
  ],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatChipsModule,
    MatBadgeModule,
    MatDividerModule,
    BrowserModule,
    BrowserAnimationsModule,
    OOSRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
    AngularFireAuthModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    NgxAuthFirebaseUIModule.forRoot(environment.firebase)
  ],
  providers: [
  ],
  bootstrap: [OOSComponent],
  schemas: [ ]
})
export class OOSModule { }
