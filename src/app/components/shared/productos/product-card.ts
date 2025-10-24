import { Component, input, output } from "@angular/core";
import { CommonModule } from '@angular/common';

@Component({
    selector: "product-card",
    template: `
    <div class="p-4 flex justify-center">
        <div class="w-80 h-[500px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-out border border-gray-100 flex flex-col overflow-hidden group">
            
            <!-- Contenedor de imagen con altura fija -->
            <div class="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img 
                    [src]="urlImage()" 
                    [alt]="titulo()"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                <!-- Overlay sutil en hover -->
                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </div>
            
            <!-- Contenido de la tarjeta con flex-grow para ocupar espacio restante -->
            <div class="flex-1 p-6 flex flex-col justify-between">
                
                <!-- Sección superior: precio y título -->
                <div class="space-y-3">
                    <!-- Precio destacado -->
                    <div class="flex items-baseline space-x-1">
                        <span class="text-blue-600 text-sm font-medium opacity-80">$</span>
                        <span class="text-blue-600 text-2xl font-bold tracking-tight">{{ formatPrice(price()) }}</span>
                    </div>
                    
                    <!-- Título del producto con altura fija -->
                    <h3 class="text-gray-900 text-lg font-semibold leading-tight h-14 flex items-start">
                        <span class="line-clamp-2">{{ titulo() }}</span>
                    </h3>
                    
                    <!-- Descripción con altura fija -->
                    <div class="h-16 overflow-hidden">
                        <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">{{ descripcion() }}</p>
                    </div>
                </div>
                
                <!-- Botón en la parte inferior -->
                <div class="mt-6">
                    <button 
                        (click)="showDialog()"
                        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 flex items-center justify-center space-x-2 group/btn"
                        type="button"
                    >
                        <span>Ver Detalles</span>
                        <svg class="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
                
            </div>
        </div>
    </div>
    `,
    styles: [`
        /* Solo usamos CSS custom para line-clamp ya que no todos los navegadores soportan las clases de Tailwind para esto */
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* Mejora de accesibilidad */
        button:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
        }
    `],
    imports: [CommonModule]
})
export class ProductCardComponent {
    titulo = input.required<string>();
    price = input.required<number>();
    descripcion = input.required<string>();
    urlImage = input.required<string>();

    eventEmit = output();

    showDialog() {
        this.eventEmit.emit();
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(price);
    }
}