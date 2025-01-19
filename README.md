<p align="center">
<a href="https://github.com/unoforge/flexilla" target="_blank">
<img src='./docs/public/flexilla-cover.png' width="100%" alt="Flexilla Covers" />
</a>
</p>

# Flexilla

Flexilla is an open-source set of unstyled interactive UI components for building interactive and customizable user interfaces.

## Why Flexilla

Flexilla is a set of unstyled components  that help you quickly add interactivity to your UI Element with accessibility in mind. Flexilla includes Dropdown, collapse, accordion, tabs, Offcanvas and more.

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


[Check all packages](./packages/)

## Usage

See examples [Here](./examples/vanilla/)

## Contributing

To contribute to this project, please make sure you read our [contributing guide](CONTRIBUTING.MD) before submitting a pull request.

## ✨ Maintainers 


<table>
<tr>
<td align="center" width="200"><pre><a href="https://github.com/Johnkat-Mj"><img src="https://avatars.githubusercontent.com/u/59884686?v=4" width="200" alt="Johnkat MJ Github Avatar" /><br><sub>Johnkat MJ</sub></a><br>@johnkat-mj</pre></td>
<td align="center" width="200"><pre><a href="https://github.com/Tresor-Kasenda"><img src="https://avatars.githubusercontent.com/u/34010260?v=4" width="200" alt="Tresor Kasenda Github Avatar" /><br><sub>Tresor Kasenda</sub></a><br>@tresor-kasenda</pre></td>
</tr>
</table>


## 🙌 Acknowledgement

Flexilla is made possible thanks to the inspirations from the following projects:

- <a href="https://github.com/htmlstreamofficial/preline" target="_blank">Preline Plugins</a>
- <a href="https://github.com/themesberg/flowbite" target="_blank">Flowbite Plugin</a>


## Community

Connect with us for future updates

- [Discord](https://discord.gg/6VN6zTPZAy).


## 📄 License

This project is licensed under the **MIT License** - see the [**MIT License**](LICENSE) file for details.