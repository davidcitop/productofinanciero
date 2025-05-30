import { Injectable } from '@angular/core';
import { Urlconstante } from '../urlconstante';
import { Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Producto } from '../models/producto';
import Swal from 'sweetalert2';
import { NotificacionService } from './notificacion.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlEndPoint:string = Urlconstante.URL+'bp/products'


  constructor(
    private http:HttpClient, 
    private notificacionService: NotificacionService,
    private router: Router) { }

  getAllProductos(): Observable<Producto[]> {
    return this.http.get<any>(this.urlEndPoint).pipe(
      map(response => {
        const productos = response.data as Producto[];
        return productos.map(producto => {
          return producto;
        });
      })
    );
  }

  create(producto: Producto): Observable<any>{
    return this.http.post<any>(this.urlEndPoint, producto)
  }

  getProducto(id): Observable<Producto>{
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`)
  }

  update(producto: Producto): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${producto.id}`, producto)
  }

  delete(id: string): Observable<Producto>{
    return this.http.delete<Producto>(`${this.urlEndPoint}/${id}`)
  }

  verifyId(id: string): Observable<boolean>{
    return this.http.get<boolean>(`${this.urlEndPoint}/verification/${id}`)
  }

}
