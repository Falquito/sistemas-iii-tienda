import { Component } from "@angular/core";
import { HomeTitleComponent } from "../shared/home/tittles/titles";
import { GalleriaComponent } from "../shared/home/gallery/gallery";

@Component({
    selector:"app-home",
    template:`
    <div class=" w-[70%] mx-auto ">
        <app-galleria></app-galleria>
        <!-- Seccion 1 -->
        <div class="flex w-full gap-5 mb-10">
            <div class="flex flex-col w-1/2 gap-5">
                <h1 class="text-[4rem] font-bold">El bien estar de tu <span class="text-blue-400">mascota</span> es nuestra prioridad</h1>
                <p class="font-light text-gray-500">Tecnologia de vanguardia y profesionales apasionados trabajando juntos para brindar el mejor cuidado a tus compañeros peludos</p>
                <div class="flex gap-5">
                    <button class="btn btn-info text-white">Agenta tu cita</button>
                    <button class="btn ">Conoce nuestros servicios</button>
                </div>
                <div class="flex gap-2">
                    <div class="flex flex-col">
                        <h1 class="text-center text-blue-400 text-4xl font-bold">15+</h1>
                        <p class="text-gray-500" >Años de experiencia</p>
                    </div>
                    <hr class="bg-gray-200 w-[0.5px] h-full" />
                    <div class="flex flex-col">
                        <h1 class="text-center text-blue-400 text-4xl font-bold">10k+</h1>
                        <p class="text-gray-500" >Mascotas felices</p>
                    </div>
                    <hr class="bg-gray-200 w-[0.5px] h-full" />
                    <div class="flex flex-col">
                        <h1 class="text-center text-blue-400 text-4xl font-bold">24/7</h1>
                        <p class="text-gray-500" >Atencion disponible</p>
                    </div>
                </div>
            </div>

            <div class="flex rounded-4xl w-1/2 bg-amber-100 items-center justify-center drop-shadow-lg drop-shadow-cyan-500/50 ">
                <img class="rounded-4xl w-full h-full object-fill " src="/landing.jpg" alt="">
            </div>
        </div>

        <!-- Seccion 2 -->
         <div class="flex">
            <div class="flex flex-col w-1/2 gap-10">
                <h1 class="text-[4rem] font-bold">¿Porque elegir <span class="text-blue-400">PetSalud</span>?</h1>
                <p class="text-gray-500">Somos mas que una clinica veterinaria. Somos el hogar donde tu mascota recibe amor, cuidado profesional y la mejor atencion medica</p>
                <div class="flex flex-col p-4 gap-5">

                    <div class="flex gap-5">
                        <div class="rounded-xl">
                            <img class="h-10 w-10" src="/logo.jpg" alt="">
                        </div>
                        <div class="flex flex-col gap-2">
                            <h1 class="font-bold">Equipo altamente calificado</h1>
                            <p class="text-gray-500">Veterinarios certificados con años de experiencia y especializacion continua</p>
                            
                        </div>
                    </div>
                    
                    <div class="flex gap-5">
                        <div class="rounded-xl">
                           <img class="h-10 w-10" src="/logo.jpg" alt="">
                        </div>
                        <div class="flex flex-col gap-2">
                            <h1 class="font-bold">Tecnologia de Vanguardia</h1>
                            <p class="text-gray-500">Equipamiento medico de ultima generacion para diagnosticos precisos.</p>
                            
                        </div>
                    </div>
                    <div class="flex gap-5">
                        <div class="rounded-xl">
                            <img class="h-10 w-10" src="/logo.jpg" alt="">
                        </div>
                        <div class="flex flex-col gap-2">
                            <h1 class="font-bold">Atencion Personalizada</h1>
                            <p class="text-gray-500">Cada mascota recibe un plan de cuidado unico adaptado a sus necesidades</p>

                        </div>
                    </div>
                    <div class="flex gap-5">
                        <div class="rounded-xl">
                            <img class="h-10 w-10" src="/logo.jpg" alt="">
                        </div>
                        <div class="flex flex-col gap-2">
                            <h1 class="font-bold">Disponibilidad Total</h1>
                            <p class="text-gray-500">Servicio de urgencias disponible 24/7 los 365 dias del año</p>
                            
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex w-1/2 gap-5">
                <div class="h-[60%] flex flex-col w-1/2 justify-center gap-5">
                    <div class="rounded-4xl flex flex-col h-40 bg-white drop-shadow items-center justify-center">
                        <p class="text-blue-400 font-bold text-4xl">98%</p>
                        <p class="text-gray-400">Tasa de satisfaccion</p>
                    </div>
                    <div class="text-white bg-blue-400 rounded-4xl flex flex-col h-40  drop-shadow drop-shadow-blue-400 items-center justify-center">
                        <p class="  font-bold text-4xl">15+</p>
                        <p >Tasa de satisfaccion</p>
                    </div>
                </div>
                <div class=" flex flex-col w-1/2 justify-stretch
 gap-5">
                    <div class="rounded-4xl flex flex-col h-40 bg-orange-400 text-white drop-shadow items-center justify-center">
                        <p class="font-bold text-4xl">24/7</p>
                        <p class="">Atencion continua</p>
                    </div>
                    <div class="text-blue-400 bg-white rounded-4xl flex flex-col h-40  items-center justify-center drop-shadow">
                        <p class="  font-bold text-4xl">10k</p>
                        <p >Tasa de satisfaccion</p>
                    </div>
                </div>

            </div>

         </div>
    </div>

    
    `,
    imports: [ GalleriaComponent]

})
export class HomeComponent{

}