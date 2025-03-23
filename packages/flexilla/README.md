# Flexilla

Flexilla is an open-source set of unstyled interactive UI components for building accessible user interfaces.

## Why Flexilla

Flexilla(flexilla) is a set of unstyled components  that help you quickly add interactivity to your UI Element with accessibility in mind. Flexilla includes Dropdown, collapse, accordion, tabs, Offcanvas and more. It's mainly designed to be integrated beautifully with Tailwind CSS or UnoCSS.


## Where Can I use it?

- When dealing with a project where you don't want to use a JS Framework but you need interactive component with accessibility in mind (Recommanded : AstroJS, PHP and PHP frameworks, Static Websites)


## Installation

### Install the library

```shell
npm install @flexilla/flexilla
```

### Install a package

If you want to use only one package or two then we recommand you to install only those packages

- let's say you need an Accordion component only

```shell
npm install @flexilla/accordion
```


## Styling

Flexilla doesn't use any CSS Framework, it's just update states via data attributes, you can directly specify style on the component according to it's state (for an accordion: each item has a data-open attribute wich can be close or open, and eache item has trigger `aria-expended="true"` or `aria-expended="false"` and content `data-state="open"` or `data-state="close"`) 


### With UnoCSS

Flexilla has a UnoCSS preset allowing you to have nice prefix like `fx-open` instead of writting `data-[state=open]`. [Check the list off all prefixes](https://flexilla-docs.vercel.app/docs/styling/uno-preset)

- Install flexilla preset 

```bash
npm i -D @flexilla/uno-preset
```

### Using TailwindCSS

Flexilla has a TailwindCSS Plugin allowing you to have nice prefix like `data-opened` instead of writting `data-[state=open]`. [Check the list off all prefixes](https://flexilla-docs.vercel.app/docs/styling/tailwind-plugin)

- Install flexilla tailwind Plugin

```bash
npm i -D @flexilla/tailwind-plugin
```


## Installation

### Install all components

To install the library :

1. Install It From Npm
   
You need to add it as a dependency in your project using npm or any other package manager

```bash
npm install @flexilla/flexilla
```
Or
```bash
yarn add @flexilla/flexilla
```

2. Use CDN

Import Module from CDN

```html
<script type="module">
  import * as flexilla from 'https://cdn.jsdelivr.net/npm/@flexilla/flexilla@latest/+esm';
  new flexilla.Accordion("#ac-el")
</script>
```

> **Note** : You can use any available CDN Deliver

### Install a single package

If you want to use only one package or two then we recommand you to install only those packages

1. let's say you need an Accordion component only

```shell
npm install @flexilla/accordion
```

2. From CDN
```html
<script type="module"> 
import * as flexillatabs from 'https://cdn.jsdelivr.net/npm/@flexilla/tabs@latest/+esm'
new  flexillatabs.Tabs("#myTabs")
</script>
```


[Check all packages](./../../packages/)

## Usage

See examples [Here](./../../examples/)