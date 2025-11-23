Unlock the Power of Angular Blocks \| Now Available! 🎉

- [Blocks](https://primeblocks.org/)
- [Documentation](https://primeblocks.org/documentation)
- [Pricing](https://primeblocks.org/pricing)
- [Sign In](https://primeblocks.org/signin) [Get all-access](https://primeblocks.org/pricing)

Primary

Surface

Presets

Aura

Lara

Nora

[Sign In](https://primeblocks.org/signin) [Get all-access](https://primeblocks.org/pricing)

### How to Build Faster?

Just copy and paste the blocks that suits your project, simple as that. However, before diving in, let's ensure you're all set up and ready to go!

##### Framework Guides

Designed for the Prime Ecosystem!

ANGULAR

PrimeNGAvailable

VUE

PrimeVueAvailable

REACT

PrimeReactQ4 - 2025

HTML

PrimeUI2026

Angular CLI

### Tailwind CSS

Install Tailwind v4 as a prerequisite, see the [official documentation](https://tailwindcss.com/docs/installation/framework-guides/angular) for instructions.

#### PrimeUI Plugin

The [tailwindcss-primeui](https://www.npmjs.com/package/tailwindcss-primeui) is an official plugin by PrimeTek to provide first class integration between a Prime UI library and Tailwind CSS. Refer to the [PrimeNG + Tailwind documentation](https://primeng.org/tailwind) for the full set of features.

```
# Using npm
npm install tailwindcss-primeui

# Using yarn
yarn add tailwindcss-primeui

# Using pnpm
pnpm add tailwindcss-primeui
```

In the CSS file that imports Tailwind such as _/src/styles.css_, add the PrimeUI plugin import.

```
@import 'tailwindcss';
@import 'tailwindcss-primeui';
```

#### Font

Live demos use the Inter font to ensure a consistent appearance across environments. However, you can use any font you prefer. In case you decide to setup Inter, add the font assets using a method such as CDN and update the font settings in your Tailwind theme configuration.

```
<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
```

```
@theme {
  --font-sans: InterVariable, sans-serif;
  --font-sans--font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}
```

#### Dark Mode

PrimeNG uses the system as the default darkModeSelector in theme configuration. If you have a dark mode switch in your application, ensure that darkModeSelector is aligned with the Tailwind dark variant for seamless integration. Refer to the [PrimeNG + Tailwind Dark Mode](https://primeng.org/tailwind#darkmode) for an example configuration.

#### Tailwind Config

The Tailwind configuration below is recommended for Blocks. You can customize the theme values as needed.

```
@import "tailwindcss";
@import "tailwindcss-primeui";

@theme {
    --font-sans: InterVariable, sans-serif;
    --font-sans--font-feature-settings: "cv02", "cv03", "cv04", "cv11";

    --breakpoint-sm: 640px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 1024px;
    --breakpoint-xl: 1280px;
    --breakpoint-2xl: 1536px;

    --container-sm: 640px;
    --container-md: 768px;
    --container-lg: 1024px;
    --container-xl: 1280px;
    --container-2xl: 1536px;

    --animate-infinite-scroll: infinite-scroll 40s linear infinite;

    @keyframes infinite-scroll {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(-100%);
        }
    }
}
```

### PrimeNG

PrimeNG is available for download on npm Registry. The minimum version requirement is PrimeNG v20 and newer.

```
# Using npm
npm install primeng @primeuix/themes

# Using yarn
yarn add primeng @primeuix/themes

# Using pnpm
pnpm add primeng @primeuix/themes
```

### Configure PrimeNG

Add providePrimeNG and provideAnimationsAsync to the list of providers in your app.config.ts and use the theme property to configure a theme such as Aura.

```
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [\
        provideAnimationsAsync(),\
        providePrimeNG({\
            theme: {\
                preset: Aura\
            }\
        })\
    ]
};
```

### Test a Block

Copy the code of a PrimeBlock, create a typescript component file and paste the contents inside. Import this standalone component within your project to test your setup.

**my-block.ts**

```
/* Paste the contents of a Block */
@Component({
    selector: 'my-block',
    imports: [],
    template: `...`
})
```

**host-component.ts**

```
import { Component } from '@angular/core';
import { MyBlock } from './myblock';  //replace with the actual path

@Component({
  selector: 'host-component',
  template: `<my-block></my-block>`
})
export class HostComponent {

}
```

2025 PrimeTek Informatics \| All rights reserved.

- [Privacy Policy](https://primeblocks.org/policy/privacy)
- \|
- [Terms and Conditions](https://primeblocks.org/policy/terms)
- \|
- [Refund Policy](https://primeblocks.org/policy/refund)
- \|