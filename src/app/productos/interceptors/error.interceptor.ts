import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificacionService } from '../services/notificacion.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificacionService,
    private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejo de errores específicos
        if (error.status === 404) {
          const errorMessage = error.error?.message || 'Ocurrió un error inesperado';
          this.notificationService.showError('Error', errorMessage);
        }
        if (error.status === 400) {
          const errorMessage = error.error?.message || 'Ocurrió un error inesperado';
          this.notificationService.showError('Error', errorMessage);

        }
        // Propagar el error para manejo específico en componentes si es necesario
        return throwError(() => error);
      })
    );
  }
}
