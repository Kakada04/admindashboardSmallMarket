import { Component, inject } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Adminservice } from '../../security/service/adminservice';
import { Router } from '@angular/router';

interface LoginData {
  gmail: string;
  password: string;
}

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login-signup.html',
  styleUrls: ['./login-signup.css']
})
export class LoginSignup {
  login: boolean = true;
  loginData: LoginData = { gmail: '', password: '' };
  signupForm: FormGroup;
  locations: { id: number; location: string }[] = [];
  loginStatus: boolean = false;
  private router = inject(Router);
  private adminService = inject(Adminservice);
  private fb = inject(FormBuilder);

  constructor() {
    // Initialize signup form with validators
    this.signupForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['Male', Validators.required],
      gmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('[0-9]{8,10}')]],
      location_id: [null, Validators.required],
      is_admin: [false]
    }, { validators: this.passwordMatchValidator });

    // Fetch locations on component initialization
    this.adminService.getLocations().subscribe({
      next: (res) => {
        this.locations = res.data;
        if (res.length > 0) {
          this.signupForm.patchValue({ location_id: res[0].id }); // Set default location
        }
      },
      error: (error) => {
        console.error('Failed to fetch locations:', error);
        alert('Could not load locations. Please try again.');
      }
    });
  }

  // Custom validator for password matching
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onLoginSubmit() {
    this.adminService.login(this.loginData).subscribe({
      next: (res: any) => {
        if (res.status) {
          localStorage.setItem('Token', res.token);
          localStorage.setItem('isAdmin', res.is_admin);
          this.loginStatus = true;
          const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'] || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        } else {
          alert(res.message);
        }
      },
      error: (error) => {
        console.error('Login failed: ', error);
        alert(error.error.message || 'An error occurred during login. Please try again.');
      }
    });
  }

  onSignupSubmit() {
    if (this.signupForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
    const payload = {
      first_name: this.signupForm.get('first_name')?.value,
      last_name: this.signupForm.get('last_name')?.value,
      gender: this.signupForm.get('gender')?.value,
      gmail: this.signupForm.get('gmail')?.value,
      password: this.signupForm.get('password')?.value,
      phone_number: this.signupForm.get('phone_number')?.value,
      location_id: this.signupForm.get('location_id')?.value,
      is_admin: this.signupForm.get('is_admin')?.value
    };
    this.adminService.signup(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          alert('Signup Successful! Please log in.');
          this.login = true;
          this.signupForm.reset({
            first_name: '',
            last_name: '',
            gender: 'Male',
            gmail: '',
            password: '',
            confirmPassword: '',
            phone_number : '',
            location_id: this.locations.length > 0 ? this.locations[0].id : null,
            is_admin: false
          });
        } else {
          alert(res.message);
        }
      },
      error: (error) => {
        console.error('Signup failed: ', error);
        alert(error.error.message || 'An error occurred during signup. Please try again.');
      }
    });
  }
}