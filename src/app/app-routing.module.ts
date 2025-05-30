import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductoFormComponent } from './productos/components/producto-form/producto-form.component';
import { ProductoListComponent } from './productos/components/producto-list/producto-list.component';

const routes: Routes = [
  { path: '',  component: ProductoListComponent},
  { path: 'productos/agregar', component: ProductoFormComponent},
  { path: 'productos/editar/:id', component: ProductoFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
