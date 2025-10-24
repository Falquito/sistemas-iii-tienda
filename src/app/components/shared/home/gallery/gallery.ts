import { Component, OnInit, model } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
interface Photo{
    itemImageSrc:string;
    thumbnailImageSrc:string;
    alt:string;
    title:string;
}


@Component({
    selector: 'app-galleria',
    template: `

        <div class="carousel w-full rounded-2xl border border-blue-400">
  <div id="slide1" class="carousel-item relative w-full">
    <img
      src="banner1.webp"
      class="w-full rounded-2xl" />
    <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide4" class="btn btn-circle">❮</a>
      <a href="#slide2" class="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide2" class="carousel-item relative w-full ">
    <img
      src="banner-2.jpg"
      class="w-full rounded-2xl" />
    <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide1" class="btn btn-circle">❮</a>
      <a href="#slide3" class="btn btn-circle">❯</a>
    </div>
  </div>
  <div id="slide3" class="carousel-item relative w-full">
    <img
      src="banner-3.jpg"
      class="w-full" />
    <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <a href="#slide2" class="btn btn-circle">❮</a>
      <a href="#slide4" class="btn btn-circle">❯</a>
    </div>
  </div>
  
</div>
    `,
    standalone: true,
    imports: [],
    providers: []
})
export class GalleriaComponent{
}