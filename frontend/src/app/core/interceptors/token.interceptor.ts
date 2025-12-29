import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, ReplaySubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

let refreshTokenSubject = new ReplaySubject<string>(1);
let isRefreshing = false;

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Attach token
  if (
    !req.url.includes('/login') &&
    !req.url.includes('/register') &&
    !req.url.includes('/refresh')
  ) {
    const token = authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // If refresh fails → logout
      if (req.url.includes('/refresh')) {
        authService.logout();
        return throwError(() => error);
      }

      // If refresh already in progress → wait
      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          switchMap((token) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            });
            return next(retryReq);
          }),
        );
      }

      isRefreshing = true;
      refreshTokenSubject = new ReplaySubject<string>(1);

      return authService.refresh().pipe(
        switchMap((res) => {
          isRefreshing = false;
          authService.saveToken(res.token);
          refreshTokenSubject.next(res.token);
          refreshTokenSubject.complete();

          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${res.token}` },
          });

          return next(retryReq);
        }),
        catchError((refreshErr) => {
          isRefreshing = false;
          refreshTokenSubject.error(refreshErr);
          authService.logout();
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
