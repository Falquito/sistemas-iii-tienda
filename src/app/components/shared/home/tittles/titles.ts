import { Component, input } from "@angular/core";

@Component({
    selector:'home-title',
    template:`
    <div class="font-bold text-xl">
        {{titulo()}}

    </div>
    `
})
export class HomeTitleComponent{
    titulo = input.required()
}