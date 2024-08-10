# My Blog

[![Netlify Status](https://api.netlify.com/api/v1/badges/d6bc6430-fca7-4881-b7e4-5338e8812ef2/deploy-status)](https://app.netlify.com/sites/davidwhittingham/deploys)

This blog uses [Hugo](https://gohugo.io/) and the [doIt](https://hugodoit.pages.dev/) theme.

## Quick Start

```bash
# 0. Install Hugo
# sudo snap install hugo
# 1. Clone this repository
git clone git@github.com:01100100/blog.git
# 2. Install the theme
git submodule update --init --recursive
# 3. Run the server
hugo server --disableFastRender
```

## Hosting

This blog is hosted using [Netlify](https://www.netlify.com/). The deployment is triggered automatically when a new commit is pushed to the `main` branch. Preview deploys are triggered when a pull request is opened.
