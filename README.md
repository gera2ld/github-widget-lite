Github Widget Lite
===

![NPM](https://img.shields.io/npm/v/github-widget-lite.svg)
![License](https://img.shields.io/npm/l/github-widget-lite.svg)
![Downloads](https://img.shields.io/npm/dt/github-widget-lite.svg)

Based on [JoelSutherland/GitHub-jQuery-Repo-Widget](https://github.com/JoelSutherland/GitHub-jQuery-Repo-Widget).

Rewritten to drop unnecessary dependencies.

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
  <div data-repo="gera2ld/github-widget-lite"></div>
  ```

  * Via global

    ``` html
    <script src="dist/github-widget.js"></script>
    ```

    ``` javascript
    var container = document.querySelector('[data-repo]');
    window.githubWidgets.loadWidget(container);
    ```

  * Via CMD

    ``` javascript
    var container = document.querySelector('[data-repo]');
    var githubWidgets = require('github-widget-lite');
    githubWidgets.loadWidget(container);
    ```

  * Via jQuery

    ``` javascript
    // If jQuery is not global, initalize with jQuery manually
    githubWidgets.initJQuery(jQuery);

    $('[data-repo]').githubWidgets();
    ```

Snapshot
---
![Snapshot](demo/snapshot.png)
