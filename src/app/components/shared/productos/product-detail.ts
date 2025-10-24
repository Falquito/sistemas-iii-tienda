// product-detail.ts

import { Component, input, ViewChild, ElementRef, inject, signal } from "@angular/core";
import { ProductService } from "../../../services/product";
import { Product, ProductCart } from "../../../interfaces/Product.interface";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
    selector:'product-detail',
    standalone: true, // No te olvides del standalone
    template:`
        @if(added()){
            <p-toast />
        }
        <dialog #dialogElement class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">{{ titulo() }}</h3>
                <div class="flex gap-5 w-full" >
                    <div class="flex flex-col items-center w-1/2" >
                        <img [src]="imagen()" [alt]="titulo()" class="w-full h-48 object-cover rounded-md my-4">
                    </div>
                    <div class="flex flex-col w-1/2">
                        <p class="text-xl font-semibold">Descripcion:</p>
                        <p class="py-2">{{ descripcion()!=""?descripcion():" - No tiene descripcion" }}</p>
                        <span class="text-xl font-semibold">Precio $ {{ precio()}}</span>
                        <div class="h-full flex flex-col items-center justify-end"> 

                            <button (click)="addProductCart({
                               id:id(),
                                    nombre:titulo(),
                                    precio:precio(),
                                    imagenURL:imagen(),
                            })" class="btn btn-outline btn-success">Añadir al carrito</button>
                        </div>
                        <div class="modal-action fixed right-1 top-0">
    
                            <form method="dialog">
                                <button class="btn rounded-4xl text-gray-500">x</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    `,
    imports: [Toast] // No necesitas PrimeNG si usas <dialog> nativo
 // No necesitas PrimeNG si usas <dialog> nativo,
 ,
 providers: [MessageService]
})
export class ProductDetailComponent {
    // Inputs para recibir la data del producto
    id = input.required<number>()
    titulo = input.required<string>();
    descripcion = input.required<string>();
    precio = input.required<number>();
    imagen = input.required<string>();
    added = signal<boolean>(false)

    productoService = inject(ProductService)
    messageService = inject(MessageService)

    // Obtenemos una referencia al elemento <dialog> del template
    @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;

    // Método público que el componente padre podrá llamar
    open() {
        this.dialog.nativeElement.showModal();
    }


    addProductCart(newProduct:ProductCart){
        this.added.set(this.productoService.addProductCart(newProduct))
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' })
    }



}