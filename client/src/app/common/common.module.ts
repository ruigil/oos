import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { FormatDatePipe } from '../pipes/format-date.pipe';
import { ShowdownPipe } from '../pipes/showdown.pipe';

@NgModule({
  imports: [
    CommonModule,    
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatGridListModule,
    ScrollingModule
  ],
  declarations: [
    FormatDatePipe, 
    ShowdownPipe

  ],
  exports: [
    FormatDatePipe, 
    ShowdownPipe,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatRadioModule,
    MatGridListModule,
    ScrollingModule
  ] 
})
export class OOSCommonModule { }
