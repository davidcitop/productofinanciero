import { TestBed } from '@angular/core/testing';

import { ProductoService } from './producto.service';
import { ProductoListComponent } from '../components/producto-list/producto-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductoFormComponent } from '../components/producto-form/producto-form.component';

describe('ProductoService', () => {
  let service: ProductoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoListComponent, ProductoFormComponent],
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    }).compileComponents();
    
    service = TestBed.inject(ProductoService); 

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
