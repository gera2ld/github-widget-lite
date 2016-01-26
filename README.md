Github Widget Lite
===

![NPM](https://img.shields.io/npm/v/github-widget-lite.svg)
![License](https://img.shields.io/npm/l/github-widget-lite.svg)
![Downloads](https://img.shields.io/npm/dt/github-widget-lite.svg)

Based on [JoelSutherland/GitHub-jQuery-Repo-Widget](https://github.com/JoelSutherland/GitHub-jQuery-Repo-Widget).

Rewrite to drop jQuery dependency and some unnecessary code.

Installation
---
* NPM

  ``` sh
  $ npm install github-widget-lite
  ```

Usage
---
* Load via HTML:

  ``` html
  <script src="dist/github-widget.js"></script>
  <div class="github-widget" data-repo="gera2ld/github-widget-lite"></div>
  ```

  The widget container MUST have a className of `github-widget`.

* Load via JavaScript dynamically:

  ``` html
  <script src="dist/github-widget.js"></script>
  <div data-repo="gera2ld/github-widget-lite"></div>
  ```

  ``` javascript
  var container = document.querySelector('[data-repo]');
  githubWidget.loadWidget(container);

  // Or via CMD
  var container = document.querySelector('[data-repo]');
  var loadWidget = require('github-widget-lite').loadWidget;
  loadWidget(container);
  ```
