import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProductService } from '../../../services/product';
import { Product } from '../../../interfaces/Product.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo y navegación principal -->
          <div class="flex items-center space-x-8">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center space-x-3 group">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <span class="text-white font-bold text-sm">PS</span>
              </div>
              <span class="font-semibold text-gray-900 text-lg hidden sm:block">PetShop</span>
            </a>
            
            <!-- Navegación principal -->
            <div class="hidden md:flex items-center space-x-1">
              <a 
                routerLink="/" 
                routerLinkActive="bg-blue-50 text-blue-600"
                [routerLinkActiveOptions]="{exact: true}"
                class="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
              >
                Inicio
              </a>
              <a 
                routerLink="/productos" 
                routerLinkActive="bg-blue-50 text-blue-600"
                class="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
              >
                Productos
              </a>
            </div>
          </div>

          <!-- Búsqueda central -->
          <div class="flex-1 max-w-md mx-8 hidden lg:block">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                [(ngModel)]="searchTerm"
                (input)="onSearchInput()"
                (focus)="showSearchResults.set(true)"
                class="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 placeholder-gray-400"
              />
              
              <!-- Resultados de búsqueda -->
              @if(showSearchResults() && searchTerm && filteredProducts().length > 0) {
                <div class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  @for(product of filteredProducts(); track product.id) {
                    <div 
                      (click)="selectProduct(product)"
                      class="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <img 
                        [src]="product.ImagenURL" 
                        [alt]="product.nombre" 
                        class="w-10 h-10 object-cover rounded-lg bg-gray-100"
                      />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ product.nombre }}</p>
                        <p class="text-sm text-blue-600 font-semibold">\${{ product.precio | number }}</p>
                      </div>
                    </div>
                  }
                </div>
              }
              
              <!-- Sin resultados -->
              @if(showSearchResults() && searchTerm && filteredProducts().length === 0) {
                <div class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                  <p class="text-sm text-gray-500 text-center">No se encontraron productos</p>
                </div>
              }
            </div>
          </div>

          <!-- Acciones del usuario -->
          <div class="flex items-center space-x-2">
            
            <!-- Búsqueda móvil -->
            <button 
              (click)="toggleMobileSearch()"
              class="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

            <!-- Carrito -->
            <a 
              routerLink="/cart" 
              class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8H19M7 13l-1.5-8"></path>
              </svg>
            </a>

            <!-- Avatar con menú -->
            <div class="relative">
              <button 
                (click)="toggleUserMenu()"
                class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <div class="w-7 h-7 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg>
                </div>
                <svg class="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Menú desplegable -->
              @if(showUserMenu()) {
                <div class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <a 
                    routerLink="/cart" 
                    (click)="showUserMenu.set(false)"
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 8H19M7 13l-1.5-8"></path>
                    </svg>
                    <span class="text-sm font-medium">Mi Carrito</span>
                  </a>
                  <a 
                    href="#" 
                    (click)="showUserMenu.set(false)"
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="text-sm font-medium">Mi Perfil</span>
                  </a>
                  <hr class="my-2 border-gray-200">
                  <a 
                    href="#" 
                    (click)="showUserMenu.set(false)"
                    class="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span class="text-sm font-medium">Cerrar Sesión</span>
                  </a>
                </div>
              }
            </div>

            <!-- Menú móvil -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Búsqueda móvil -->
      @if(showMobileSearch()) {
        <div class="lg:hidden border-t border-gray-200 bg-white px-4 py-3">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              [(ngModel)]="searchTerm"
              (input)="onSearchInput()"
              class="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 placeholder-gray-400"
            />
          </div>
        </div>
      }

      <!-- Menú móvil -->
      @if(showMobileMenu()) {
        <div class="md:hidden border-t border-gray-200 bg-white">
          <div class="px-4 py-3 space-y-1">
            <a 
              routerLink="/" 
              routerLinkActive="bg-blue-50 text-blue-600"
              [routerLinkActiveOptions]="{exact: true}"
              (click)="showMobileMenu.set(false)"
              class="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              Inicio
            </a>
            <a 
              routerLink="/productos" 
              routerLinkActive="bg-blue-50 text-blue-600"
              (click)="showMobileMenu.set(false)"
              class="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              Productos
            </a>
          </div>
        </div>
      }
    </nav>

    <!-- Overlay para cerrar menús -->
    @if(showSearchResults() || showUserMenu() || showMobileMenu()) {
      <div 
        class="fixed inset-0 z-40 bg-transparent"
        (click)="closeAllMenus()"
      ></div>
    }

    <!-- Espaciador para contenido -->
    <div class="h-16"></div>
  `,
  styles: [`
    /* Tipografía refinada */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Backdrop blur para navegadores que no lo soporten */
    @supports not (backdrop-filter: blur(12px)) {
      .backdrop-blur-md {
        background-color: rgba(255, 255, 255, 0.95);
      }
    }

    /* Transiciones suaves */
    .transition-all {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Scrollbar personalizado para resultados */
    .overflow-y-auto::-webkit-scrollbar {
      width: 4px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `]
})
export class NavbarComponent {
  // Servicios
  private productService = inject(ProductService);
  private router = inject(Router);

  // Estado del componente
  searchTerm = '';
  showSearchResults = signal(false);
  showUserMenu = signal(false);
  showMobileMenu = signal(false);
  showMobileSearch = signal(false);

  // Productos filtrados computados
  filteredProducts = computed(() => {
    if (!this.searchTerm || this.searchTerm.length < 2) {
      return [];
    }

    const term = this.searchTerm.toLowerCase();
    return this.productService.productList().filter(product =>
      product.nombre.toLowerCase().includes(term) ||
      (product.descripcion && product.descripcion.toLowerCase().includes(term))
    ).slice(0, 5); // Limitar a 5 resultados
  });

  // Métodos
  onSearchInput() {
    if (this.searchTerm.length >= 2) {
      this.showSearchResults.set(true);
    } else {
      this.showSearchResults.set(false);
    }
  }

  selectProduct(product: Product) {
    this.router.navigate(['/productos'], { 
      queryParams: { id: product.id } 
    });
    this.searchTerm = '';
    this.showSearchResults.set(false);
    this.showMobileSearch.set(false);
  }

  toggleUserMenu() {
    this.showUserMenu.update(value => !value);
    this.showMobileMenu.set(false);
    this.showMobileSearch.set(false);
  }

  toggleMobileMenu() {
    this.showMobileMenu.update(value => !value);
    this.showUserMenu.set(false);
    this.showMobileSearch.set(false);
  }

  toggleMobileSearch() {
    this.showMobileSearch.update(value => !value);
    this.showUserMenu.set(false);
    this.showMobileMenu.set(false);
  }

  closeAllMenus() {
    this.showSearchResults.set(false);
    this.showUserMenu.set(false);
    this.showMobileMenu.set(false);
    this.showMobileSearch.set(false);
  }
}