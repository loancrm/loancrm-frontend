import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessLoanCalculatorComponent } from './business-loan-calculator.component';
import { FormsModule } from '@angular/forms';
import { ApexChartsModule } from 'src/app/admin/apex-charts/apex-charts.module';
import { RouterModule, Routes } from '@angular/router';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabPanel, TabViewModule } from 'primeng/tabview';


const routes: Routes = [{ path: '', component: BusinessLoanCalculatorComponent }];

@NgModule({
  declarations: [
    BusinessLoanCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ApexChartsModule,
    RouterModule.forChild(routes),
    SliderModule,
    TabViewModule,
    TableModule,
    TabMenuModule,
    ButtonModule
  ],
  exports: [
    BusinessLoanCalculatorComponent
  ]
})
export class BusinessLoanCalculatorModule { }
