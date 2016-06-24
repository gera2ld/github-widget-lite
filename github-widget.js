!function(){
document.addEventListener('DOMContentLoaded', function (e) {
  Array.prototype.forEach.call(document.querySelectorAll('.github-widget'), loadWidget);
}, false);

!function (root, factory) {
  if (typeof module === 'object' && module.exports)
    module.exports = factory();
  else
    root.githubWidgets = factory();
}(typeof window !== 'undefined' ? window : this, function () {
  return {
    loadWidget: loadWidget,
    initJQuery: initJQuery,
  };
});

if (typeof jQuery !== 'undefined') initJQuery(jQuery);

/**
 * @desc Transform HTML to avoid XSS but keep HTML entities
 * @param {String} html
 * @return {String}
 */
function safeHTML(html) {
  return html.toString().replace(/&</g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
    }[m];
  });
}

/**
 * @desc Load remote data via Github APIs
 * @param {String} repo e.g. `gera2ld/github-widget`
 * @param {Function} cb callback with fetched JSON data
 */
function loadData(repo, cb) {
  // JSON, cross-domain support required
  var req = new XMLHttpRequest();
  req.open('GET', 'https://api.github.com/repos/' + repo, true);
  req.responseType = 'json';
  req.onload = function () {
    var data;
    if (req.responseType) {
      data = req.response;
    } else {
      data = JSON.parse(req.responseText);
    }
    cb(data);
  };
  req.send();
}

/**
 * @desc Parse repo info from widget `data-repo` attribute
 * @param {HTMLElement} widget
 * @return {Object}
 */
function getRepoData(widget) {
  var repo = widget.getAttribute('data-repo');
  var repoParts = repo.split('/');
  var vendorName = repoParts[0];
  var repoName = repoParts[1];
  var vendorUrl = 'https://github.com/' + vendorName;
  var repoUrl = vendorUrl + '/' + repoName;
  if (!vendorName || !repoName) {
    console.warn('Invalid repo reference: ' + repo);
    return;
  }
  return {
    vendorUrl: vendorUrl,
    vendorName: vendorName,
    repoUrl: repoUrl,
    repoName: repoName,
  };
}

/**
 * @desc Load a widget with the given HTML element
 * @param {HTMLElement} widget
 */
function loadWidget(widget) {
  var config = getRepoData(widget);
  if (!config) return;
  widget.innerHTML = "<div class=github-box><div class=github-box-title><h3><svg height=16 viewBox=\"0 0 12 16\" width=12><path d=\"M4 9h-1v-1h1v1z m0-3h-1v1h1v-1z m0-2h-1v1h1v-1z m0-2h-1v1h1v-1z m8-1v12c0 0.55-0.45 1-1 1H6v2l-1.5-1.5-1.5 1.5V14H1c-0.55 0-1-0.45-1-1V1C0 0.45 0.45 0 1 0h10c0.55 0 1 0.45 1 1z m-1 10H1v2h2v-1h3v1h5V11z m0-10H2v9h9V1z\"></path></svg> <a class=github-box-owner></a> / <a class=github-box-repo></a></h3><div class=github-box-stats><a class=github-box-stars title=\"See stargazers\"><svg height=16 viewBox=\"0 0 14 16\" width=14><path d=\"M14 6l-4.9-0.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14l4.33-2.33 4.33 2.33L10.4 9.26 14 6z\"></path></svg> <span>?</span> </a><a class=github-box-forks title=\"See forkers\"><svg height=16 viewBox=\"0 0 10 16\" width=10><path d=\"M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z\"></path></svg> <span>?</span></a></div></div><div class=github-box-content><p class=github-box-description><span></span> &mdash; <a>Read More</a></p><p class=github-box-link></p></div><div class=github-box-info><div class=github-box-updated></div><a class=github-box-download title=\"Get an archive of this repository\">Download as zip</a></div></div>";
  var prefix = '.github-box-';
  var $ = widget.querySelector.bind(widget);
  var owner = $(prefix + 'owner');
  owner.href = owner.title = config.vendorUrl;
  owner.innerHTML = safeHTML(config.vendorName);
  var repo = $(prefix + 'repo');
  repo.href = repo.title = config.repoUrl;
  repo.innerHTML = safeHTML(config.repoName);
  $(prefix + 'stars').href = config.repoUrl + '/stargazers';
  $(prefix + 'forks').href = config.repoUrl + '/network';
  $(prefix + 'description>a').href = config.repoUrl + '#readme';
  loadData(config.vendorName + '/' + config.repoName, function (data) {
    var pushed_at = 'unknown';
    if (data.pushed_at) {
      var date = new Date(data.pushed_at);
      pushed_at = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    }
    $(prefix + 'stars>span').innerHTML = safeHTML(data.stargazers_count);
    $(prefix + 'forks>span').innerHTML = safeHTML(data.forks);
    $(prefix + 'description>span').innerHTML = safeHTML(data.description);
    $(prefix + 'updated').innerHTML = 'Latest commit to the <strong>' + data.default_branch + '</strong> branch on ' + pushed_at;
    $(prefix + 'download').href = config.repoUrl + '/zipball/' + data.default_branch;
    if (data.homepage) {
      var link = $(prefix + 'link');
      var a = document.createElement('a');
      a.href = data.homepage;
      a.innerHTML = safeHTML(data.homepage);
      link.innerHTML = '';
      link.appendChild(a);
    }
  });
}

// jQuery support
function initJQuery($) {
  if ($.fn && !$.fn.githubWidgets) $.fn.githubWidgets = function () {
    this.each(function (i, el) {
      loadWidget(el);
    });
    return this;
  };
}

}();
(function (doc, cssText) {
    var styleEl = doc.createElement("style");
    doc.getElementsByTagName("head")[0].appendChild(styleEl);
    if (styleEl.styleSheet) {
        if (!styleEl.styleSheet.disabled) {
            styleEl.styleSheet.cssText = cssText;
        }
    } else {
        try {
            styleEl.innerHTML = cssText;
        } catch (ignore) {
            styleEl.innerText = cssText;
        }
    }
}(document, ".github-box{font-family:helvetica,arial,sans-serif;font-size:13px;line-height:18px;background:#fafafa;border:1px solid #ddd;color:#666;border-radius:3px}.github-box *{margin:0;padding:0;box-sizing:content-box}.github-box a{color:#4078c0;border:0;text-decoration:none;font-size:13px}.github-box a,.github-box svg,.github-box svg~*{vertical-align:middle}.github-box-title{position:relative;border-bottom:1px solid #ddd;border-radius:3px 3px 0 0;background:#fcfcfc;background:-webkit-linear-gradient(#fcfcfc,#ebebeb);background:linear-gradient(#fcfcfc,#ebebeb)}.github-box-title h3{width:auto;padding:10px;word-wrap:break-word;line-height:1;font-weight:400;font-size:18px;color:gray}.github-box-repo{font-weight:700}.github-box-stats{position:absolute;height:auto;min-height:21px;top:8px;right:10px;font-size:11px;font-weight:700;line-height:21px}.github-box-stats a{display:inline-block;height:21px;padding:0 5px;background-color:#fff;color:#666;border:1px solid #ddd;border-radius:3px}.github-box-content{padding:10px;font-weight:300}.github-box-link{font-weight:700}.github-box-info{position:relative;height:auto;min-height:24px;padding:10px;background:#fff;border-top:1px solid #ddd;border-radius:0 0 3px 3px}.github-box-updated{word-wrap:break-word;margin:0;font-size:11px;color:#666;line-height:24px;font-weight:300;width:auto}.github-box-updated strong{font-weight:700;color:#000}a.github-box-download{position:absolute;height:24px;top:10px;right:10px;padding:0 10px;line-height:24px;font-size:12px;color:#333;background-color:#eee;background-image:-webkit-linear-gradient(#fcfcfc,#eee);background-image:linear-gradient(#fcfcfc,#eee);font-weight:700;border:1px solid #d5d5d5;border-radius:3px}a.github-box-download:hover{border-color:#ccc;background-color:#ddd;background-image:-webkit-linear-gradient(#eee,#ddd);background-image:linear-gradient(#eee,#ddd)}@media (max-width:767px){.github-box-title{height:auto;min-height:60px}.github-box-repo{display:block}.github-box-stats a{display:block;clear:right;float:right}.github-box-info{height:auto;min-height:46px}a.github-box-download{top:32px}}"));
