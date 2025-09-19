import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApexChartsModule } from '../apex-charts/apex-charts.module';
import { PreloaderModule } from 'src/app/preloader/preloader.module';

const routes: Routes = [
  { path: '', component: WalletComponent },
];


@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    TableModule,
    InputTextModule,
    PreloaderModule,
    ButtonModule,
    ApexChartsModule,
    [RouterModule.forChild(routes)],
  ]
})
export class WalletModule { }
