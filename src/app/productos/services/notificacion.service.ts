import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  showOk(title: string, message: string): void {
    Swal.fire(title, message, 'success');
  }

  showError(title: string, message: string): void {
    Swal.fire(title, message, 'error');
  }

  showConfirm(title: string, message: string): Promise<boolean> {
    return Swal.fire({
      title,
      html: `<p style="color: black;">${message}</p>`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      reverseButtons: false,
      padding:30,
      background: '#fff url(//bit.ly/3ZauZxU)',
      customClass: {
        confirmButton: 'custom-swal-confirm-button',
        cancelButton: 'custom-swal-cancel-button',
      },
      buttonsStyling: false, 
      focusCancel: true
    }).then(result => result.isConfirmed);
  }
}
