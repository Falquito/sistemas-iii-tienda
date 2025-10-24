import { Component, inject, OnInit, signal } from "@angular/core";
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ProductService } from "../../services/product";
import { ProductCart } from "../../interfaces/Product.interface";
import { RouterLink } from "@angular/router";

@Component({
    selector:"app-cart",
    template:`
        <div class="mx-4 rounded-4xl drop-shadow-2xl">
            <div class="card">
    <p-dataview #dv [value]="productsCart()">
        <ng-template #list let-items>
            <div class="grid grid-cols-12 gap-4 grid-nogutter">
                <div class="col-span-12" *ngFor="let item of items; let first = first">
                    <div
                        class="flex flex-col sm:flex-row sm:items-center p-6 gap-4"
                        [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !first }"
                    >
                        <div class="md:w-40 relative">
                            <img
                                class="block xl:block mx-auto rounded-border w-full"
                                [src]="item.imagenURL"
                                [alt]="item.nombre"
                            />
                            <!-- <p-tag
                                [value]="item.inventoryStatus"
                                [severity]="getSeverity(item)"
                                class="absolute dark:!bg-surface-900"
                                [style.left.px]="4"
                                [style.top.px]="4"
                            /> -->
                        </div>
                        <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                            <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                <div>
                                    <div class="text-lg font-medium text-black mt-2">{{ item.nombre }}</div>
                                    <!-- <span class="font-medium text-gray-400 text-sm">Descripcion: {{item.descripcion}}</span> -->
                                </div>
                               
                            </div>
                            <div class="flex flex-col md:items-end gap-8">
                                <span class="text-xl font-semibold text-black">{{
                                    '$' + item.precio
                                }} c/u</span>
                                <div class="flex flex-row-reverse md:flex-row gap-2">
                                    <p-button 
                                        (onClick)="decrementQuantity(item.id)" 
                                        icon="pi pi-minus" 
                                        [outlined]="true"
                                        [disabled]="item.cantidad <= 1" />
                                    
                                    <span class="font-semibold text-lg w-12 text-center">
                                        {{ item.cantidad }}
                                    </span>

                                    <p-button 
                                        (onClick)="incrementQuantity(item.id)" 
                                        icon="pi pi-plus" 
                                        [outlined]="true" 
                                    />
                                </div>
                                <div class=" w-full text-center">
                                    <button  (click)="removeProducut(item.id)" class="btn btn-error text-white">Borrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ng-template>
    </p-dataview>
</div>

        </div>
        <div class="mx-4 flex flex-col justify-end items-center gap-5 my-4">
            <p class="mt-4 font-extrabold text-4xl">Total: $ {{productsService.totalCarrito()}}</p>
            <button routerLink="/checkout" class="btn btn-info text-white">Iniciar compra</button>

        </div>
    `,
    imports: [DataView, ButtonModule, Tag, CommonModule, RouterLink],

})
export class CartComponent{

    
    productsService = inject(ProductService);
    
    // --- CAMBIO CLAVE 1 ---
    // Ya no creamos una nueva signal. 
    // Apuntamos directamente a la signal del servicio.
    productsCart = this.productsService.carrito;
    
    // --- CAMBIO CLAVE 2 ---
    // Renombramos tu método para más claridad y llamamos AL SERVICIO.
    incrementQuantity(idProduct: number) {
        // Al llamar al servicio, el servicio actualiza SU signal 'carrito'
        // y eso dispara el 'effect' que guarda en localStorage.
        this.productsService.incrementCartQuantity(idProduct);
    }
    
    // Método nuevo para el botón de restar
    decrementQuantity(idProduct: number) {
        this.productsService.decrementCartQuantity(idProduct);
    }

    removeProducut(id:number){
        this.productsService.removeProduct(id)

    }
    
 
}