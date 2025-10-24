// product-list.ts

// MODIFICADO: Añadimos 'computed' de @angular/core
import { Component, input, signal, ViewChild, computed } from "@angular/core";
import { Product } from "../../../interfaces/Product.interface";
import { ProductCardComponent } from "./product-card";
import { ProductSkeletonCard } from "./skeleton-product";
import { ProductDetailComponent } from "./product-detail";

@Component({
    selector: "product-list",
    standalone: true,
    template: `

<div class="flex gap-3 flex-wrap justify-center">
            <div class="mb-4 w-full flex justify-center items-center flex-col">
                <h1 class="text-xl font-bold">Buscar Productos</h1>
                <input 
                    type="text" 
                    placeholder="Buscar productos por nombre o descripción..." 
                    class="input input-bordered w-full md:w-1/2 lg:w-1/3" [value]="searchTerm()"
                    (input)="onSearch($event)" 
                />
            </div>
            
            @if(productList().length === 0) {
                @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track $index) {
                    <skeleton-card-demo></skeleton-card-demo>
                }
            } @else {
                @if(filteredProductList().length > 0) {
                    @for(product of filteredProductList(); track product.id) {
                        <product-card 
                            [descripcion]="product.descripcion!" 
                            [titulo]="product.nombre" 
                            [price]="product.precio"
                            [urlImage]="product.ImagenURL"
                            (click)="showDetails(product)">
                        </product-card>
                    }
                } @else {
                    <div class="w-full text-center py-10">
                        <p class="text-lg text-gray-500">
                            No se encontraron productos que coincidan con "{{ searchTerm() }}".
                        </p>
                    </div>
                }
            }
        </div>

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
    `,
    imports: [ProductCardComponent, ProductSkeletonCard, ProductDetailComponent], 
})
export class ProductListComponent {
    productList = input.required<Product[]>();
    
    selectedProduct = signal<Product | null>(null);

    @ViewChild('productDetailModal') productDetailComponent?: ProductDetailComponent;

    // --- NUEVO: Lógica del Buscador ---

    // 1. Señal para guardar el término de búsqueda
    searchTerm = signal<string>('');

    // 2. Señal computada que filtra la lista de productos
    filteredProductList = computed(() => {
        const term = this.searchTerm().toLowerCase();
        
        // Si no hay término de búsqueda, devuelve la lista completa
        if (!term) {
            return this.productList();
        }

        // Filtra por nombre O descripción
        return this.productList().filter(product => 
            product.nombre.toLowerCase().includes(term) ||
            (product.descripcion && product.descripcion.toLowerCase().includes(term))
        );
    });

    // 3. Método para actualizar el término de búsqueda desde el evento (input)
    onSearch(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        this.searchTerm.set(inputElement.value);
    }

    // --- Fin de la lógica del buscador ---

    showDetails(product: Product) {
        this.selectedProduct.set(product);

        setTimeout(() => {
            this.productDetailComponent?.open();
        }, 0);
    }
}