import { Component, input, output, signal } from "@angular/core";
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
@Component({
    selector:"product-card",
    template:`
    
<div class="mb-4 p-8 flex items-center justify-center drop-shadow drop-shadow-gray-400">
    <p-card [style]="{ width: '25rem', overflow: 'hidden' }">
        <ng-template #header>
            <div class="w-full h-50 flex justify-center p-4">
                <img alt="Card" class="w-[90%] h-[95%] object-fill" [src]="urlImage()" />
            </div>
        </ng-template>
        <ng-template #title>{{titulo()}} </ng-template>
        <ng-template #subtitle> {{price()}} </ng-template>
        <p>
            {{descripcion()}}
        </p>
        <ng-template #footer>
            <div class="flex gap-4 mt-1">
                <p-button label="Detalles" (click)="showDialog()" severity="secondary" class="w-full" [outlined]="true" styleClass="w-full" />
            </div>
        </ng-template>
    </p-card>
</div>
    `,
    imports: [CardModule, ButtonModule]

})
export class ProductCardComponent{

    titulo = input.required<string>()
    price = input.required<number>()
    descripcion = input.required<string>()
    urlImage = input.required<string>()

    eventEmit = output()

    showDialog(){
        this.eventEmit.emit()
    }

   


}