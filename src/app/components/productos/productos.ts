import { Component, inject, OnInit, signal, computed } from '@angular/core'; // Importamos signal y computed
import { ProductService } from '../../services/product';
import { ProductListComponent } from "../shared/productos/list-products";
import { FormsModule } from '@angular/forms';
import { CascadeSelect } from 'primeng/cascadeselect';

@Component({
  selector: 'app-productos',
  imports: [ProductListComponent, FormsModule, CascadeSelect],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  productsService = inject(ProductService);

  filters: any[] | undefined;

  // MODIFICADO: Convertimos 'selectedFilter' en una señal para la reactividad.
  selectedFilter = signal<any | null>(null);

  // NUEVO: Creamos una señal computada que ordena la lista de productos.
  sortedProductList = computed(() => {
    // 1. Obtenemos los valores de las señales
    const products = this.productsService.productList();
    const filter = this.selectedFilter();

    // 2. Si no hay filtro o no hay productos, devolvemos la lista original
    // MODIFICADO: Añadimos la condición para 'All'
    if (!filter || !filter.code || filter.code === 'All' || !products) {
      return products;
    }

    // 3. Creamos una copia para no mutar la lista original del servicio
    const sortedProducts = [...products];

    // 4. Aplicamos la lógica de ordenamiento
    if (filter.code === 'MinP') {
      // Ordenar por menor precio
      sortedProducts.sort((a, b) => a.precio - b.precio);
    } else if (filter.code === 'MaxP') {
      // Ordenar por mayor precio
      sortedProducts.sort((a, b) => b.precio - a.precio);
    }

    // 5. Devolvemos la lista ordenada
    return sortedProducts;
  });

  ngOnInit() {
    this.filters = [
      // NUEVO: Opción para mostrar todos sin ordenar
      {
        name: 'Todos (por defecto)',
        code: 'All'
      },
      {
        name: 'Ordenar por Menor Precio',
        code: 'MinP'
      },
      {
        name: 'Ordenar por Mayor Precio',
        code: 'MaxP'
      }
    ];

    // NUEVO: Establecer "Todos" como valor inicial
    this.selectedFilter.set(this.filters[0]);
  }
}

