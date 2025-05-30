import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoListComponent } from './producto-list.component';
import { ProductoService } from '../../services/producto.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchFilterPipe } from '../../search-filter.pipe';

describe('ProductoListComponent', () => {
  let component: ProductoListComponent;
  let fixture: ComponentFixture<ProductoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductoListComponent,SearchFilterPipe ],
      imports: [HttpClientTestingModule],
      providers: [ProductoService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
