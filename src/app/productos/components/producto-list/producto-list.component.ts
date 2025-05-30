import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  isLoading = true;
  pageSize = 5;
  searchTerm = '';
  productoConError: Set<string> = new Set();

  constructor(
    private productoService: ProductoService,
    private router: Router) { }

  ngOnInit(): void {
    this.cargarProductos();
  }
  cargarProductos(): void {
    this.isLoading = true;
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = [...productos];
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'Ocurrió un error al procesar la solicitud', 'error');
        this.isLoading = false;
      }
    });
  }

 

  cambiarPagina(size: number): void {
    this.pageSize = size;
  }
  
  agregarProducto(): void {
    this.router.navigate(['/productos/agregar']);
  }

  editarProducto(id: string): void {
    this.router.navigate(['/productos/editar', id]);
  }

  confirmareliminarProducto(producto: Producto): void {
    this.showConfirm('', `¿Estás seguro de eliminar el producto ${producto.name}?`)
      .then(confirmed => {
        if (confirmed) {
          this.eliminarProducto(producto.id);
        }
      });
  }


  private eliminarProducto(id: string): void {
    this.productoService.delete(id).subscribe({
      next: () => {
        Swal.fire('Éxito', `Producto Eliminado`, 'success');
        this.cargarProductos();
      },
      error: () => Swal.fire('Error', ` Error al eliminar producto`, 'warning')
    });
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

  handleImgError(id: string) {
    this.productoConError.add(id);
  }
}


