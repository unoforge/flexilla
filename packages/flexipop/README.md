# Flexipop

An ultra-compact positioning engine inspired by [Nanopop](https://www.npmjs.com/package/nanopop), but we decided to create our own solution. The main reason? We wanted something tailored specifically to our [library's](https://github.com/unify-ui-dev/flexilla) needs, while also taking the opportunity to learn new techniques and improve our problem-solving skills.

This library thrives on simplicity and efficiency.

> [!IMPORTANT]
> This package is a part of the `flexilla` library's ecosystem.


## When to opt for FLEXIPOP over PopperJS?

If you are considering `flexipop` over `PopperJS`, it's likely due to similar reasons as [Nanopop](https://github.com/simonwep/nanopop/tree/master).

Choose `FLEXIPOP` for a small, powerful, and efficient positioning solution.


## Usage 

Installation

```bash
npm i flexipop
```

Usage 

```js
import { CreatePopper } from 'flexipop'

new CreatePopper(
    referenceElement,//HTMLElement
    popperElement,//HTMLElement
    {
    //   options here
    }
  )
```

### HTML Markup

```html
<div data-reference-el></div>
<div data-popper-el>Left-start</div>
```


### CSS

> ⚠ The popperElement must have set `position` to `fixed`.