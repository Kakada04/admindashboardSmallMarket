import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('Token');
  const isAdmin = localStorage.getItem('isAdmin');

  if (token && isAdmin === '1') {
    return true; // Allow access if token exists
  } else {
    router.navigate(['/'], { queryParams: { returnUrl: state.url } }); // Redirect to login
    return false; // Block access
  }
};