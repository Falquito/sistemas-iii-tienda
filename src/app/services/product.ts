import { Injectable, signal, effect, computed } from '@angular/core';
import { OrderPayload, Product, ProductCart } from '../interfaces/Product.interface';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient
import { Observable } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class ProductService {
  
  // La signal se inicializa vacía
  productList = signal<Product[]>([]);
  carrito = signal<ProductCart[]>([])
  totalCarrito = computed(() => {
    let total = 0;
    // 'computed' "escucha" a 'this.carrito()'
    for (const product of this.carrito()) {
      total += product.precio * product.cantidad!; // (Usar += es un poco más limpio)
    }
    console.log('Recalculando el total:', total);
    return total;
  });

  constructor(private http: HttpClient) {

     // --- LÓGICA PARA CARGAR EL CARRITO GUARDADO ---
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      // Si encontramos un carrito guardado, lo parseamos y lo cargamos en la signal.
      this.carrito.set(JSON.parse(savedCart));
    }
    
    // --- OBJETIVO 1: Cargar datos iniciales ---
    // Llamamos al método que trae los datos de la API
    this.fetchProductsFromApi();

    // --- OBJETIVO 2: Guardar en localStorage al cambiar ---
    // Creamos un efecto que se ejecutará cada vez que 'productList' cambie
    effect(() => {
      // Leemos la signal para que el efecto la "escuche"
      const products = this.productList();
      
      console.log('Signal de productos cambió, guardando en localStorage...');
      
      // Guardamos la lista convertida a string en localStorage
      localStorage.setItem('productsList', JSON.stringify(products));
    });
    effect(() => {
      // Leemos la signal para que el efecto la "escuche"
      const totalCarrito = this.totalCarrito();
      
      console.log('Signal de total cambió, guardando en localStorage...');
      
      // Guardamos la lista convertida a string en localStorage
      localStorage.setItem('totalCarrito', JSON.stringify(totalCarrito));
    });

    // --- EFECTO PARA GUARDAR EL CARRITO EN LOCALSTORAGE ---
    effect(() => {
      // 1. Leemos la signal 'carrito' para que el efecto se suscriba a sus cambios.
      const currentCart = this.carrito();
      
      // Es una buena práctica no guardar el estado inicial vacío si no es necesario.
      // Así evitamos tener un '[]' en localStorage antes de que se agregue algo.
      // (Actualizado para guardar también un carrito vacío si el usuario lo vacía)
      console.log('El carrito cambió, guardando en localStorage...');
        
      // 2. Guardamos el estado actual del carrito en localStorage.
      localStorage.setItem('shoppingCart', JSON.stringify(currentCart));
      
    });
  }

 

  

  // Método privado para traer los productos de la API
  private fetchProductsFromApi() {
    // Reemplaza esta URL con la URL real de tu API
    const apiUrl = 'http://localhost:3000/productos/product-list'; 

    this.http.get<Product[]>(apiUrl).subscribe({
      next: (productsFromApi) => {
        
        // Cuando la API responde, actualizamos la signal
        // Esto disparará el 'effect' de arriba
        this.productList.set(productsFromApi);
      },
      error: (err) => {
        console.error('Error al cargar los productos desde la API', err);
      }
    });
  }

  // --- Métodos de ejemplo para modificar la lista ---
  
  // ***** MÉTODO MODIFICADO *****
  addProductCart(newProduct: ProductCart) {
    try {
      this.carrito.update(currentCart => {
        
        // 1. Buscamos si el producto ya existe por su id
        const existingProductIndex = currentCart.findIndex(p => p.id === newProduct.id);

        if (existingProductIndex > -1) {
          // 2. Si existe: creamos un nuevo array usando map
          // y actualizamos solo el producto que coincide
          return currentCart.map((product, index) => 
            index === existingProductIndex
              // Creamos un nuevo objeto para el producto existente, incrementando su cantidad
              ? { ...product, cantidad: product.cantidad! + 1 } 
              // Devolvemos los demás productos sin cambios
              : product 
          );
        } else {
          // 3. Si no existe: lo agregamos al array con cantidad 1
          // Creamos un nuevo objeto para asegurar la inmutabilidad y establecer la cantidad
          const productToAdd = { ...newProduct, cantidad: 1 };
          return [...currentCart, productToAdd];
        }
      });
      return true; // Éxito
      
    } catch (error) {
      console.error(error);
      return false; // Fallo
    }
  }

  removeProduct(productId: number) {
    this.carrito.update(currentProductsCarts => 
      currentProductsCarts.filter(p => p.id !== productId)
    );
  }


  // En: src/app/services/product.service.ts

  // ... (después de removeProduct)

  incrementCartQuantity(productId: number) {
    this.carrito.update(currentCart => 
      currentCart.map(product => 
        product.id === productId 
          // Importante: creamos un nuevo objeto para que la señal detecte el cambio
          ? { ...product, cantidad: product.cantidad! + 1 } 
          : product
      )
    );
  }

  decrementCartQuantity(productId: number) {
    this.carrito.update(currentCart => 
      currentCart.map(product => 
        (product.id === productId && product.cantidad! > 1) // 
          ? { ...product, cantidad: product.cantidad! - 1 }
          : product
      )
      // (Opcional) Filtrar productos si la cantidad llega a 0 después de decrementar
      // .filter(product => product.cantidad! > 0) 
    );
  }

  // --- 3. NUEVO MÉTODO PARA ENVIAR EL PEDIDO ---

  // Reemplaza esta URL por tu endpoint real
  private orderApiUrl = 'http://localhost:3000/ventas'; 

  submitOrder(orderData: OrderPayload): Observable<any> {
    // Este método recibe el objeto del pedido y lo envía al endpoint
    // Devuelve el Observable para que el componente pueda reaccionar
    return this.http.post(this.orderApiUrl, orderData);
  }
  clearCart() {
    this.carrito.set([]);
    // También podrías querer limpiar el localStorage
    localStorage.removeItem('shoppingCart');
  }


}
