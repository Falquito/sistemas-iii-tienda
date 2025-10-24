import { Component, input, ViewChild, ElementRef, inject, signal, OnInit, OnDestroy } from "@angular/core";
import { ProductService } from "../../../services/product";
import { Product, ProductCart } from "../../../interfaces/Product.interface";
import { Toast } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
    selector: 'product-detail',
    standalone: true,
    template: `
        @if(added()){
            <p-toast position="top-right" />
        }
        
        <!-- Backdrop -->
        <div 
            class="modal-backdrop" 
            [class.show]="isOpen()"
            (click)="closeModal()"
        ></div>

        <!-- Modal Container -->
        <div 
            class="modal-container" 
            [class.show]="isOpen()"
            (click)="$event.stopPropagation()"
        >
            <!-- Close Button -->
            <button class="close-btn" (click)="closeModal()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <!-- Content -->
            <div class="modal-body">
                <!-- Image Section -->
                <div class="image-container">
                    <div class="image-wrapper">
                        <img [src]="imagen()" [alt]="titulo()" class="product-image">
                        <div class="availability-badge">
                            <div class="status-dot"></div>
                            <span>Disponible</span>
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="info-container">
                    <!-- Title -->
                    <div class="title-section">
                        <h1 class="product-title">{{ titulo() }}</h1>
                        <div class="product-status">
                            <span class="status-badge available">En Stock</span>
                        </div>
                    </div>

                    <!-- Price -->
                    <div class="price-section">
                        <div class="price-container">
                            <span class="currency">$</span>
                            <span class="price">{{ formatPrice(precio()) }}</span>
                        </div>
                        <div class="price-info">
                            <span class="price-label">Precio final</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="description-section">
                        <h3 class="section-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10,9 9,9 8,9"></polyline>
                            </svg>
                            Descripción
                        </h3>
                        <div class="description-content">
                            <p class="description-text">
                                {{ descripcion() || "Producto de alta calidad para tu mascota. Contactanos para más información sobre características específicas." }}
                            </p>
                        </div>
                    </div>

                    <!-- Features -->
                    <div class="features-section">
                        <div class="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>Envío gratis</span>
                        </div>
                        <div class="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 12l2 2 4-4"></path>
                                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                            </svg>
                            <span>Garantía incluida</span>
                        </div>
                        <div class="feature-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                            </svg>
                            <span>Calidad premium</span>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <div class="action-section">
                        <button 
                            class="add-to-cart-btn"
                            [class.loading]="isAdding()"
                            (click)="addToCart()"
                            [disabled]="isAdding()"
                        >
                            <div class="btn-content">
                                @if(isAdding()) {
                                    <div class="spinner"></div>
                                    <span>Agregando...</span>
                                } @else {
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                    </svg>
                                    <span>Añadir al carrito</span>
                                }
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
        }

        :host(.open) {
            pointer-events: all;
        }

        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            opacity: 0;
            transition: opacity 0.25s ease;
            pointer-events: none;
        }

        .modal-backdrop.show {
            opacity: 1;
            pointer-events: all;
        }

        .modal-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(0, 0, 0, 0.05);
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            pointer-events: none;
        }

        .modal-container.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            pointer-events: all;
        }

        .close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.95);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .close-btn:hover {
            background: white;
            transform: scale(1.05);
        }

        .close-btn svg {
            color: #374151;
        }

        .modal-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            height: 100%;
            min-height: 500px;
        }

        .image-container {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            position: relative;
        }

        .image-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .product-image {
            width: 280px;
            height: 280px;
            object-fit: cover;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .product-image:hover {
            transform: scale(1.02);
        }

        .availability-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
            padding: 6px 12px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 600;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-dot {
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .info-container {
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 28px;
            overflow-y: auto;
        }

        .title-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
        }

        .product-title {
            font-size: 26px;
            font-weight: 700;
            color: #111827;
            line-height: 1.2;
            margin: 0;
            flex: 1;
        }

        .product-status {
            flex-shrink: 0;
        }

        .status-badge {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid #bfdbfe;
        }

        .status-badge.available {
            background: #dcfce7;
            color: #166534;
            border-color: #bbf7d0;
        }

        .price-section {
            background: #f8fafc;
            padding: 24px;
            border-radius: 16px;
            border-left: 4px solid #2563eb;
        }

        .price-container {
            display: flex;
            align-items: baseline;
            gap: 4px;
            margin-bottom: 4px;
        }

        .currency {
            font-size: 20px;
            font-weight: 600;
            color: #2563eb;
        }

        .price {
            font-size: 32px;
            font-weight: 800;
            color: #2563eb;
            line-height: 1;
        }

        .price-info {
            display: flex;
            flex-direction: column;
        }

        .price-label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 500;
        }

        .description-section {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin: 0 0 12px 0;
        }

        .section-title svg {
            color: #6b7280;
        }

        .description-content {
            margin: 0;
        }

        .description-text {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
            margin: 0;
        }

        .features-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            transition: all 0.2s ease;
        }

        .feature-item:hover {
            border-color: #d1d5db;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .feature-item svg {
            color: #2563eb;
            flex-shrink: 0;
        }

        .action-section {
            margin-top: auto;
        }

        .add-to-cart-btn {
            width: 100%;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            border: none;
            padding: 18px 24px;
            border-radius: 14px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
            position: relative;
            overflow: hidden;
        }

        .add-to-cart-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .add-to-cart-btn:hover:not(:disabled)::before {
            left: 100%;
        }

        .add-to-cart-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
        }

        .add-to-cart-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        .add-to-cart-btn:disabled {
            opacity: 0.8;
            cursor: not-allowed;
        }

        .add-to-cart-btn.loading {
            pointer-events: none;
        }

        .btn-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .modal-container {
                width: 95%;
                max-height: 90vh;
            }

            .modal-body {
                grid-template-columns: 1fr;
                overflow-y: auto;
            }

            .image-container {
                padding: 30px 20px;
                min-height: auto;
            }

            .product-image {
                width: 220px;
                height: 220px;
            }

            .info-container {
                padding: 30px 20px;
                gap: 24px;
            }

            .product-title {
                font-size: 22px;
            }

            .price {
                font-size: 28px;
            }

            .title-section {
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;
            }

            .close-btn {
                top: 15px;
                right: 15px;
                width: 36px;
                height: 36px;
            }

            .close-btn svg {
                width: 20px;
                height: 20px;
            }
        }

        @media (max-width: 480px) {
            .modal-container {
                width: 98%;
            }

            .image-container {
                padding: 20px;
            }

            .product-image {
                width: 180px;
                height: 180px;
            }

            .info-container {
                padding: 20px;
                gap: 20px;
            }

            .product-title {
                font-size: 20px;
            }

            .price {
                font-size: 24px;
            }

            .price-section,
            .description-section {
                padding: 16px;
            }
        }
    `],
    imports: [Toast],
    providers: [MessageService]
})
export class ProductDetailComponent implements OnInit, OnDestroy {
    // Inputs para recibir la data del producto
    id = input.required<number>();
    titulo = input.required<string>();
    descripcion = input.required<string>();
    precio = input.required<number>();
    imagen = input.required<string>();
    
    // Signals para el estado del modal
    isOpen = signal<boolean>(false);
    added = signal<boolean>(false);
    isAdding = signal<boolean>(false);

    productoService = inject(ProductService);
    messageService = inject(MessageService);

    @ViewChild('dialogElement') dialog!: ElementRef<HTMLDialogElement>;

    ngOnInit() {
        // Listener para cerrar con Escape
        document.addEventListener('keydown', this.handleEscape.bind(this));
    }

    ngOnDestroy() {
        document.removeEventListener('keydown', this.handleEscape.bind(this));
    }

    // Método público que el componente padre podrá llamar
    open() {
        this.isOpen.set(true);
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    closeModal() {
        this.isOpen.set(false);
        document.body.style.overflow = ''; // Restaurar scroll del body
    }

    private handleEscape(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.isOpen()) {
            this.closeModal();
        }
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    async addToCart() {
        if (this.isAdding()) return;

        this.isAdding.set(true);

        try {
            // Simular delay para UX
            await new Promise(resolve => setTimeout(resolve, 800));

            const newProduct: ProductCart = {
                id: this.id(),
                nombre: this.titulo(),
                precio: this.precio(),
                imagenURL: this.imagen()
            };

            const success = this.productoService.addProductCart(newProduct);
            
            if (success) {
                this.added.set(true);
                this.messageService.add({ 
                    severity: 'success', 
                    summary: '¡Éxito!', 
                    detail: `${this.titulo()} ha sido añadido al carrito`,
                    life: 4000
                });
                
                // Cerrar modal después de un breve delay
                setTimeout(() => {
                    this.closeModal();
                }, 1500);
            } else {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'No se pudo añadir el producto al carrito',
                    life: 4000
                });
            }
        } catch (error) {
            this.messageService.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Ocurrió un error inesperado',
                life: 4000
            });
        } finally {
            this.isAdding.set(false);
        }
    }
}