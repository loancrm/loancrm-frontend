import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsanalyzerComponent } from './bsanalyzer.component';
import { FileUploadModule } from 'primeng/fileupload';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';


const routes: Routes = [
  { path: '', component: BsanalyzerComponent },
  {
    path: 'bank-report/:reportId',
    loadChildren: () =>
      import('./analyzed-bank-report/analyzed-bank-report.module').then((m) => m.AnalyzedBankReportModule),
  },
];
@NgModule({
  declarations: [
    BsanalyzerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    FormsModule,
    DialogModule,
    [RouterModule.forChild(routes)],
  ]
})
export class BsanalyzerModule { }
