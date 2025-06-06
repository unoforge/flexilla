# Flexilla (flexilla) Contributing Guide

Every contribution is welcome to this open source project. However, before submitting your contribution, be sure to take a moment and read the following guidelines.

- [Flexilla (flexilla) Contributing Guide](#flexilla-flexilla-contributing-guide)
  - [Don't know how to contribute or new to Open Source?](#dont-know-how-to-contribute-or-new-to-open-source)
  - [commit-convention](#commit-convention)
  - [Pull Request Guidelines](#pull-request-guidelines)
    - [Steps to PR](#steps-to-pr)
  - [Local Development](#local-development)
    - [Build packages](#build-packages)


## Don't know how to contribute or new to Open Source?

Take a look at :
1. [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
2. [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## Have a question?

1. Check our [Github Issues](https://github.com/unoforge/flexilla/issues) to see if someone has already answered your question.
2. Go to the [Discord Server](https://discord.gg/6VN6zTPZAy)
3. Or Contact one of maintainers

### Prerequisites

- Code Editor
- NodeJS

#### Tools

1. [Nx (https://nx.dev/)](https://nx.dev/)
2. [Vite JS](https://vite.dev/)
3. [Lerna](https://lerna.js.org/)


## Testing Your Changes

We value high-quality contributions. To ensure the stability and reliability of Flexilla, please follow these testing guidelines:

*   **Test thoroughly:** Before submitting your changes, test them comprehensively to ensure they work as expected and don't introduce new issues.
*   **Add or update tests:** If you're contributing a new feature or fixing a bug, please add new tests or update existing ones to cover your changes. This helps us maintain code quality and prevent regressions. (Even if a formal testing suite isn't fully established, this sets the expectation for future development).
*   **Ensure existing tests pass:** Make sure all existing tests pass before submitting your pull request. This helps us catch any unintended side effects of your changes.

## commit-convention

Read [this](https://www.conventionalcommits.org/en/v1.0.0/)

## Pull Request Guidelines

- The `main` branch is basically a snapshot of the latest stable version. All development must be done in dedicated branches.


### Steps to PR

1. Fork of this repository and clone your fork

2. Create a new branch out of the `main` branch.

3. Make and commit your changes following the
   [commit convention](CONTRIBUTING.MD#commit-convention).
   
## Local Development

After cloning the repository, execute the following commands in the root folder:

1. Setup

Make sure to install the dependencies:

```bash
npm run setup
```


### Build packages

```bash
npm run build
```

**Build a single package**

Navigate to the needed package and run 

```bash
npm run build
```
or 

```bash
npx lerna run build -scope=@flexilla/packageToBuild
```
