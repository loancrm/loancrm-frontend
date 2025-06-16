import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { LeadsService } from '../admin/leads/leads.service';
import { RoutingService } from '../services/routing-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isPasswordVisible = false;
  loading: any = false;
  isConfirmPasswordVisible = false;

  constructor(private fb: FormBuilder,
    private toastService: ToastService,
    private leadsService: LeadsService,
    private router: Router,
    private routingService: RoutingService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      businessName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(formValues): void {
    if (this.registerForm.invalid) {
      this.toastService.showError('Please fill all required fields correctly.');
      return;
    }

    this.loading = true;
    const formData = {
      name: formValues.name,
      emailId: formValues.emailId.toLowerCase(),
      mobile: formValues.mobile,
      businessName: formValues.businessName,
      password: formValues.password,
    };

    // Optional image handling (if using image upload UI)

    this.loading = true;
    console.log(formData)
    this.leadsService.createAccount(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Account created successfully');
        this.router.navigate(['/user/login']);
        // this.routingService.handleRoute('user/login', null); // Replace 'accounts' with your desired route
      },
      error: (error) => {
        this.loading = false;
        const message = error?.error || 'Error creating account';
        this.toastService.showError(error);
      }
    });
  }


  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
