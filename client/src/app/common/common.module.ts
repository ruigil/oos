import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';


import { FormatDatePipe } from '../pipes/format-date.pipe';
import { MarkdownPipe } from '../pipes/markdown.pipe';

@NgModule({
  providers: [
    //{provide: MAT_DATE_LOCALE, useValue: 'fr-CH'},
  ],
  imports: [
    CommonModule,    
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatGridListModule,
    ScrollingModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatDialogModule,
  ],
  declarations: [
    FormatDatePipe,  
    MarkdownPipe
  ],
  exports: [
    FormatDatePipe, 
    MarkdownPipe,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatListModule,
    MatDividerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatGridListModule,
    ScrollingModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatDialogModule  
  ] 
})
export class OOSCommonModule { }
