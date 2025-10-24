import { Component, input, signal, ViewChild, computed } from "@angular/core";
import { Product } from "../../../interfaces/Product.interface";
import { ProductCardComponent } from "./product-card";
import { ProductSkeletonCard } from "./skeleton-product";
import { ProductDetailComponent } from "./product-detail";
import { CommonModule } from '@angular/common';

@Component({
    selector: "product-list",
    standalone: true,
    template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <!-- Header mejorado con búsqueda -->
        <div class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <!-- Título principal -->
                <div class="text-center mb-6">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">
                        Nuestros Productos
                    </h1>
                    <p class="text-gray-600 text-lg">
                        Descubre nuestra selección de productos de calidad
                    </p>
                </div>

                <!-- Barra de búsqueda mejorada -->
                <div class="relative max-w-2xl mx-auto">
                    <div class="relative group">
                        <!-- Ícono de búsqueda -->
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        
                        <!-- Input de búsqueda -->
                        <input 
                            type="text" 
                            placeholder="Buscar productos por nombre o descripción..." 
                            class="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 focus:outline-none transition-all duration-200 bg-white/90 placeholder-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                            [value]="searchTerm()"
                            (input)="onSearch($event)" 
                        />
                        
                        <!-- Botón limpiar búsqueda -->
                        @if(searchTerm()) {
                            <button 
                                (click)="clearSearch()"
                                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        }
                    </div>
                    
                    <!-- Indicador de resultados -->
                    @if(searchTerm()) {
                        <div class="mt-3 text-center">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {{ filteredProductList().length }} resultados para "{{ searchTerm() }}"
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="max-w-7xl mx-auto px-4 py-8">
            
            <!-- Loading State -->
            @if(productList().length === 0) {
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track $index) {
                        <skeleton-card-demo></skeleton-card-demo>
                    }
                </div>
            } 
            
            <!-- Productos encontrados -->
            @else if(filteredProductList().length > 0) {
                <!-- Información adicional sobre la búsqueda -->
                @if(!searchTerm()) {
                    <div class="mb-8 text-center">
                        <p class="text-gray-600">
                            Mostrando <span class="font-semibold text-gray-900">{{ productList().length }}</span> productos disponibles
                        </p>
                    </div>
                }
                
                <!-- Grid de productos responsive mejorado -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                    @for(product of filteredProductList(); track product.id) {
                        <div class="transform transition-all duration-200 hover:scale-[1.02]">
                            <product-card 
                                [descripcion]="product.descripcion!" 
                                [titulo]="product.nombre" 
                                [price]="product.precio"
                                [urlImage]="product.ImagenURL"
                                (eventEmit)="showDetails(product)">
                            </product-card>
                        </div>
                    }
                </div>
            } 
            
            <!-- Estado sin resultados -->
            @else {
                <div class="flex flex-col items-center justify-center py-16 px-4">
                    <!-- Ilustración de búsqueda vacía -->
                    <div class="w-32 h-32 mb-6 text-gray-300">
                        <svg fill="currentColor" viewBox="0 0 24 24" class="w-full h-full">
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </div>
                    
                    <h3 class="text-2xl font-semibold text-gray-900 mb-2">
                        No se encontraron productos
                    </h3>
                    
                    <p class="text-gray-600 text-center mb-6 max-w-md">
                        No pudimos encontrar productos que coincidan con 
                        <span class="font-medium text-gray-900">"{{ searchTerm() }}"</span>. 
                        Intenta con otros términos de búsqueda.
                    </p>
                    
                    <!-- Botones de acción -->
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button 
                            (click)="clearSearch()"
                            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            <span>Ver todos los productos</span>
                        </button>
                        
                        <button 
                            (click)="suggestSearch()"
                            class="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                        >
                            Buscar "perro"
                        </button>
                    </div>
                </div>
            }
        </div>

        <!-- Modal de detalles -->
        @if(selectedProduct(); as product) {
            <product-detail 
                #productDetailModal
                [id]='product.id'
                [descripcion]="product.descripcion!" 
                [titulo]="product.nombre" 
                [imagen]="product.ImagenURL" 
                [precio]="product.precio">
            </product-detail>
        }
    </div>
    `,
    styles: [`
        /* Animación suave para el grid */
        .grid > div {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .grid > div:nth-child(odd) {
            animation-delay: 0.1s;
        }
        
        .grid > div:nth-child(even) {
            animation-delay: 0.2s;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Mejora del backdrop blur para navegadores que no lo soporten */
        @supports not (backdrop-filter: blur(12px)) {
            .backdrop-blur-md {
                background-color: rgba(255, 255, 255, 0.95);
            }
        }
    `],
    imports: [ProductCardComponent, ProductSkeletonCard, ProductDetailComponent, CommonModule], 
})
export class ProductListComponent {
    productList = input.required<Product[]>();
    
    selectedProduct = signal<Product | null>(null);

    @ViewChild('productDetailModal') productDetailComponent?: ProductDetailComponent;

    // Señal para guardar el término de búsqueda
    searchTerm = signal<string>('');

    // Señal computada que filtra la lista de productos
    filteredProductList = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        
        if (!term) {
            return this.productList();
        }

        return this.productList().filter(product => 
            product.nombre.toLowerCase().includes(term) ||
            (product.descripcion && product.descripcion.toLowerCase().includes(term))
        );
    });

    // Método para actualizar el término de búsqueda
    onSearch(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.searchTerm.set(inputElement.value);
    }

    // Método para limpiar la búsqueda
    clearSearch() {
        this.searchTerm.set('');
    }

    // Método para sugerir una búsqueda común
    suggestSearch() {
        this.searchTerm.set('perro');
    }

    // Mostrar detalles del producto
    showDetails(product: Product) {
        this.selectedProduct.set(product);

        setTimeout(() => {
            this.productDetailComponent?.open();
        }, 0);
    }
}