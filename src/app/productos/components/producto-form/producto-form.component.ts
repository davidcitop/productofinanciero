import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { Producto } from '../../models/producto';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-producto-form2',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {

  productForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  idExists = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private notificacionService: NotificacionService,
    private router: Router
  ) {
    this.productForm = this.createForm()
   }

   ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.cargarProducto(id);
      this.productForm.get('id')?.disable();
    } else {
      this.setupIdValidation();
      // Configuramos el listener para cambios en la fecha de liberación
      this.productForm.get('date_release')?.valueChanges.subscribe(() => {
        this.updateRevisionDate();
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]],
      logo: [''],
      date_release: ['', [
        Validators.required,
        this.futureDateValidator()
      ]],
      date_revision: ['', Validators.required]
    }, { validator: this.dateRevisionValidator() });
  }

  futureDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today ? null : { pastDate: true };
    };
  }

  dateRevisionValidator() {
    return (group: FormGroup) => {
      const releaseDate = group.get('date_release')?.value;
      const revisionDate = group.get('date_revision')?.value;
      
      if (!releaseDate || !revisionDate) {
        return null;
      }
      const release = new Date(releaseDate);
      const revision = new Date(revisionDate);
      const expectedRevision = new Date(release);
      expectedRevision.setFullYear(release.getFullYear() + 1);
      // Limpiamos las horas para comparar solo las fechas
      release.setHours(0, 0, 0, 0);
      revision.setHours(0, 0, 0, 0);
      expectedRevision.setHours(0, 0, 0, 0);
  
      return expectedRevision.getTime() === revision.getTime() ? null : { invalidRevisionDate: true };
    };
  }

  updateRevisionDate(): void {
    const releaseDate = this.productForm.get('date_release')?.value;
    
    if (releaseDate) {
      const release = new Date(releaseDate);
      release.setFullYear(release.getFullYear() + 1);
      
      // Formateamos la fecha a YYYY-MM-DD que es el formato que espera input type="date"
      const revisionDate = release.toISOString().split('T')[0];
      
      this.productForm.get('date_revision')?.setValue(revisionDate);
      this.productForm.updateValueAndValidity(); // Esto disparará las validaciones
    }
  }

  setupIdValidation(): void {
    this.productForm.get('id')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(id => this.productoService.verifyId(id))
    ).subscribe(exists => {
      this.idExists = exists;
      if (exists) {
        this.productForm.get('id')?.setErrors({ idExists: true });
      }
    });
  }

  cargarProducto(id: string): void {
    this.isLoading = true;
    this.productoService.getProducto(id).subscribe({
      next: (product) => {
        // Convertimos las fechas al formato correcto para los inputs
        const formattedProduct = {
          ...product,
          date_release: this.formatDateForInput(product.date_release),
          date_revision: this.formatDateForInput(product.date_revision)
        };
        this.productForm.patchValue(formattedProduct);
        this.isLoading = false;
      },
      error: () => {
        this.notificacionService.showError('Error', ` Error al cargar productos`)
        this.router.navigate(['/']);
      }
    });
  }

  private formatDateForInput(date: any): string {
    if (!date) return '';
    
    // Si es string, lo convertimos a Date
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Formateamos a YYYY-MM-DD
    return dateObj.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const productData = this.productForm.getRawValue();
    this.isLoading = true;

    if (this.isEditMode) {
      this.productoService.update(productData).subscribe({
        next: () => {
          this.notificacionService.showOk('', 'Producto Actualizado');
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.productoService.create(productData).subscribe({
        next: () => {
          this.notificacionService.showOk('', 'Producto enviado');
          this.router.navigate(['/']);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onReset(): void {
    if (this.isEditMode) {
      this.productForm.reset(this.productForm.getRawValue());
    } else {
      this.productForm.reset();
    }
  }

}
