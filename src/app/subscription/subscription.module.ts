import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';



@NgModule({
  declarations: [
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule
  ],
    exports: [
    SubscriptionComponent
  ]
})
export class SubscriptionModule { }
