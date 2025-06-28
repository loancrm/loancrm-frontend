import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { LeadsService } from '../admin/leads/leads.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  showPassword: boolean = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private leadsService: LeadsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      businessName: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]]
    });
  }

  get name() {
    return this.registerForm.get('name')!;
  }

  get email() {
    return this.registerForm.get('emailId')!;
  }

  get mobile() {
    return this.registerForm.get('mobile')!;
  }

  get businessName() {
    return this.registerForm.get('businessName')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const formData = {
      name: this.name.value,
      emailId: this.email.value.toLowerCase(),
      mobile: this.mobile.value,
      businessName: this.businessName.value,
      password: this.password.value,
    };

    this.leadsService.createAccount(formData).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastService.showSuccess('Account created successfully');
        this.router.navigate(['/user/login']);
      },
      error: (error) => {
        this.loading = false;
        const message = error?.error || 'Error creating account';
        this.toastService.showError(error);
      }
    });
  }

}
