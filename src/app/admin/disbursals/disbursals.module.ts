import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisbursalsComponent } from './disbursals.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { FilterModule } from 'src/app/filter/filter.module';
import { CapitalizeFirstPipe } from 'src/app/pipes/capitalize.pipe';

const routes: Routes = [
  { path: '', component: DisbursalsComponent },
  {
    path: 'disbursalDetails/:id',
    loadChildren: () =>
      import('./disbursal-details/disbursal-details.module').then(
        (m) => m.DisbursalDetailsModule
      ),
  },
  {
    path: 'revenue/:id',
    loadChildren: () =>
      import('./revenue/revenue.module').then((m) => m.RevenueModule),
  },
];

@NgModule({
  declarations: [DisbursalsComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    MenuModule,
    InputTextModule,
    CapitalizeFirstPipe,
    FilterModule,
    [RouterModule.forChild(routes)],
  ],
})
export class DisbursalsModule {}
