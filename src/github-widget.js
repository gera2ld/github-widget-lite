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
  widget.innerHTML = __RPL_TEMPLATE__;
  var prefix = '.github-box-';
  var $ = widget.querySelector.bind(widget);
  var owner = $(prefix + 'owner');
  owner.href = owner.title = config.vendorUrl;
  owner.innerHTML = safeHTML(config.vendorName);
  var repo = $(prefix + 'repo');
  repo.href = repo.title = config.repoUrl;
  repo.innerHTML = safeHTML(config.repoName);
  $(prefix + 'watchers').href = config.repoUrl + '/watchers';
  $(prefix + 'forks').href = config.repoUrl + '/network/members';
  $(prefix + 'description>a').href = config.repoUrl + '#readme';
  loadData(config.vendorName + '/' + config.repoName, function (data) {
    var pushed_at = 'unknown';
    if (data.pushed_at) {
      var date = new Date(data.pushed_at);
      pushed_at = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    }
    $(prefix + 'watchers').innerHTML = safeHTML(data.watchers);
    $(prefix + 'forks').innerHTML = safeHTML(data.forks);
    $(prefix + 'description>span').innerHTML = safeHTML(data.description);
    $(prefix + 'updated').innerHTML = 'Latest commit to the <strong>' + data.default_branch + '</strong> branch on ' + pushed_at;
    $(prefix + 'download').href = config.repoUrl + '/zipball/' + data.default_branch;
    if (data.homepage) {
      var a = document.createElement('a');
      a.href = data.homepage;
      a.innerHTML = safeHTML(data.homepage);
      $(prefix + 'link').appendChild(a);
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
