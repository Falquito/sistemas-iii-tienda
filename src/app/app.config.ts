import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';
import { routes } from './app.routes';
import { definePreset } from '@primeuix/themes';
import { provideHttpClient, withFetch } from '@angular/common/http';

/* Works because highlight tokens are defined under colorScheme */
const MyPreset = definePreset(Nora, {
    semantic: {
        colorScheme: {
            light: {
                // Aquí es donde defines tus nuevos colores primarios para el modo claro
                primary: {
                    // Puedes usar una paleta de colores de Tailwind CSS o cualquier color hexadecimal
                    // Por ejemplo, para un verde:
                    '50': '{zinc.50}',
                    '100': '{zinc.100}',
                    '200': '{zinc.200}',
                    '300': '{zinc.300}',
                    '400': '{zinc.400}',
                    '500': '{zinc.500}', // ESTE ES EL COLOR PRINCIPAL
                    '600': '{zinc.600}',
                    '700': '{zinc.700}',
                    '800': '{zinc.800}',
                    '900': '{zinc.900}',
                    '950': '{zinc.950}', // Si el tema original lo usa
                },
                semantic: {
                    highlight: {
                        background: '{primary.50}',
                        color: '{white}',
                    }
                }
            },
            dark: {
                // Y aquí para el modo oscuro
                primary: {
                    // Por ejemplo, para un púrpura más oscuro para el dark mode
                    '50': '{purple.50}',
                    '100': '{purple.100}',
                    '200': '{purple.200}',
                    '300': '{purple.300}',
                    '400': '{purple.400}',
                    '500': '{purple.500}',
                    '600': '{purple.600}',
                    '700': '{purple.700}',
                    '800': '{purple.800}',
                    '900': '{purple.900}',
                    '950': '{purple.950}',
                },
                semantic: {
                    highlight: {
                        background: '{primary.900}',
                        color: '{primary.900}',
                    }
                }
            }
        }
    }
});
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
     provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Nora,
                options: {
                  prefix: 'p',
                  darkModeSelector: false || 'none',
                  cssLayer: false,
                    
                
                }

            }
        }),
         provideHttpClient(
            withFetch(),
    )
  ]
};
