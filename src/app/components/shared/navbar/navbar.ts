import { Component, OnInit, inject, signal } from '@angular/core'; // Import 'inject'
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { MegaMenuModule } from 'primeng/megamenu'; // CORREGIDO: Importar el Módulo
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu'; // CORREGIDO: Importar el Módulo
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete'; // CORREGIDO: Importar el Módulo
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Import Router
import { ProductService } from '../../../services/product';
import { Product } from '../../../interfaces/Product.interface';
import { ProductDetailComponent } from "../productos/product-detail";

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Component({
  selector: 'app-navbar',
  // standalone: true (Asegúrate de que esto esté si usas imports directos)
  // imports: [..., MegaMenu, ... ] (Tus imports están en el decorador)
  // CORREGIDO: Usar los Módulos en el array de imports
  imports: [
    MegaMenuModule,
    ButtonModule,
    CommonModule,
    AvatarModule,
    MenuModule,
    ToastModule,
    FormsModule,
    AutoCompleteModule,
    RouterLink,
    ProductDetailComponent
],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit{
  
  // --- 3. Inyecta los servicios ---
  productsService = inject(ProductService);
  router = inject(Router);
  productSelected =signal<Product | null>(null);
  searchActive = signal(false)

  items: MegaMenuItem[] | undefined;
  itemsMenu: MenuItem[] | undefined;
  menuVisible=false;
  
  // --- 4. Define los tipos para el producto ---
  selectedItem: Product | undefined; // Ahora es de tipo Product
  filteredItems: Product[] | undefined; // Es un array de Product

  // itemsSearch: any[] | undefined; // <-- 5. Ya no necesitamos esto


  constructor() { // <-- 6. Mantenemos el constructor si es necesario, o lo quitamos
    // (Tuve que mover 'inject' fuera del constructor para que sea una propiedad de clase)
  }

  changeVisibility(){
    this.menuVisible=!this.menuVisible
  }
  
  // --- 7. Modificamos filterItems para usar el Servicio ---
  filterItems(event: AutoCompleteCompleteEvent) {
      let query = event.query.toLowerCase();
      
      // Obtenemos la lista de productos desde la signal del servicio
      const allProducts = this.productsService.productList(); 

      if (!query) {
          this.filteredItems = [];
      } else {
          // Filtramos los productos reales por nombre
          this.filteredItems = allProducts.filter(product =>
              product.nombre.toLowerCase().includes(query)
          );
      }
  }

  // --- 8. Creamos un método para la navegación ---
  onProductSelect(event: any) {
    // event.value es el objeto Product completo seleccionado
    const product: Product = event.value;

    if (product && product.id) {
      // Navegamos a la ruta del producto (ej: /productos/123)
      // Asegúrate de que esta ruta exista en tu app-routing.module.ts
      this.productSelected.set(product)
      this.searchActive.set(!this.searchActive())
    }
    
    // Limpiamos el buscador después de seleccionar
    this.selectedItem = undefined; 
  }

  ngOnInit() {
    // this.itemsSearch = []; // <-- 9. Ya no inicializamos esto
    
    this.itemsMenu = [
            
            {
                label: 'Yo',
                items: [
                  
                    {
                        label: 'Carrito',
                        icon: 'pi pi-cart-plus',
                        routerLink:'/cart'
                    }
                ]
            }
        ];

        this.items = [
          {
                label: 'Inicio',
                root: true,
                routerLink:"/"
                
            },
            
            {
                label: 'Productos',
                root: true,
                routerLink:"/productos"
                
            }
        ];
    }
}

