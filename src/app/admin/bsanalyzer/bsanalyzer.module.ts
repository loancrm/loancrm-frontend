import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsanalyzerComponent } from './bsanalyzer.component';
import { FileUploadModule } from 'primeng/fileupload';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  { path: '', component: BsanalyzerComponent },
  {
    path: 'bank-report/:id',
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
    [RouterModule.forChild(routes)],
  ]
})
export class BsanalyzerModule { }
