import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('Token');

  if (req.url.includes('/login') || req.url.includes('/register')) {
    return next(req);
  }

  const newReq = req.clone({
    setHeaders:{
      Authorization:`Bearer ${token}`
    }
  });

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('Token');
        router.navigate(['/'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    })
  );
};