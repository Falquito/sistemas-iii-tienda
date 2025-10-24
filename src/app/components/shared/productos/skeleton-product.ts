import { Component } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'skeleton-card-demo',
    template: `
        <div class="card p-8 w-[25rem] ">
            <div class="rounded border border-surface-200  p-6 bg-surface-0 ">
                <div class="flex mb-4">
                    <p-skeleton shape="circle" size="4rem" class="mr-2" />
                    <div>
                        <p-skeleton width="10rem" class="mb-2" />
                        <p-skeleton width="5rem" class="mb-2" />
                        <p-skeleton height=".5rem" />
                    </div>
                </div>
                <p-skeleton width="100%" height="150px" />
                <div class="flex justify-between mt-4">
                    <p-skeleton width="4rem" height="2rem" />
                    <p-skeleton width="4rem" height="2rem" />
                </div>
            </div>
    </div>
    `,
    standalone: true,
    imports: [Skeleton]
})
export class ProductSkeletonCard {}