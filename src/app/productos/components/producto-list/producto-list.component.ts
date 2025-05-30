import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificacionService } from '../../services/notificacion.service';

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
    private notificacionService: NotificacionService,
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
    this.notificacionService.showConfirm('', `¿Estás seguro de eliminar el producto ${producto.name}?`)
      .then(confirmed => {
        if (confirmed) {
          this.eliminarProducto(producto.id);
        }
      });
  }

  private eliminarProducto(id: string): void {
    this.productoService.delete(id).subscribe({
      next: () => {
        this.notificacionService.showOk('Éxito', `Producto Eliminado`);
        this.cargarProductos();
      },
      error: () => this.notificacionService.showError('Error', ` Error al eliminar producto`)
    });
  }

 
  handleImgError(id: string) {
    this.productoConError.add(id);
  }
}


