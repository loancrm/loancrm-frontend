import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluateCreditComponent } from './evaluate-credit.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PreloaderModule } from 'src/app/preloader/preloader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [{ path: '', component: EvaluateCreditComponent }];

@NgModule({
  declarations: [EvaluateCreditComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    PreloaderModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    ReactiveFormsModule,
    CapitalizeFirstPipe,
    [RouterModule.forChild(routes)],
  ],
})
export class EvaluateCreditModule {}
