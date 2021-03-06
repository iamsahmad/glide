// Generated by CoffeeScript 1.4.0
(function() {
  var Glide,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Glide = (function() {

    Glide.prototype.stylesheetPath = '/';

    Glide.prototype.hooks = {
      'before:to': [],
      'after:to': []
    };

    Glide.prototype.isTransitioning = false;

    Glide.prototype.transitionAnimation = true;

    Glide.prototype.speed = 0.3;

    function Glide(options) {
      var key, value, _ref;
      if (options == null) {
        options = {};
      }
      this.onTouchCancel = __bind(this.onTouchCancel, this);

      this.onTouchEnd = __bind(this.onTouchEnd, this);

      this.onTouchMove = __bind(this.onTouchMove, this);

      this.onTouchStart = __bind(this.onTouchStart, this);

      this.handleEvents = __bind(this.handleEvents, this);

      this.hideTransitionedPage = __bind(this.hideTransitionedPage, this);

      this.to = __bind(this.to, this);

      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      _ref = this.plugins;
      for (key in _ref) {
        value = _ref[key];
        this.plugins[key] = new value(this);
      }
      this.detectUserAgent();
      if (this.isAndroid() && this.os.version < '4') {
        this.setupForAndroid();
      }
      if (this.isTouch()) {
        document.body.addEventListener('touchstart', this.handleEvents, false);
      } else {
        document.body.addEventListener('mousedown', this.handleEvents, false);
      }
    }

    Glide.prototype.detectUserAgent = function() {
      var result, userAgent;
      userAgent = window.navigator.userAgent;
      this.os = {};
      this.os.android = !!userAgent.match(/(Android)\s+([\d.]+)/) || !!userAgent.match(/Silk-Accelerated/);
      this.os.ios = !!userAgent.match(/(iPad).*OS\s([\d_]+)/) || !!userAgent.match(/(iPhone\sOS)\s([\d_]+)/);
      if (this.os.android) {
        result = userAgent.match(/Android (\d+(?:\.\d+)+)/);
        return this.os.version = result[1];
      }
    };

    Glide.prototype.to = function(targetPage) {
      var currentPage, hook, transitionType, _i, _j, _len, _len1, _ref, _ref1, _results,
        _this = this;
      _ref = this.hooks['before:to'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hook = _ref[_i];
        hook();
      }
      if (typeof targetPage === "string") {
        this.targetPage = document.querySelector(targetPage);
      } else if (targetPage) {
        this.targetPage = targetPage;
      }
      if (this.targetPage === this.currentPage || this.isTransitioning) {
        return;
      }
      if (this.currentPage == null) {
        this.targetPage.style.display = "-webkit-box";
        this.pageHistory = [window.location.hash];
        this.currentPage = this.targetPage;
        return;
      }
      this.isTransitioning = true;
      if (this.pageHistory.length === 1 && window.location.hash === this.startPage) {
        this.back = true;
        this.pageHistory.pop();
      }
      if (this.pageHistory.length > 1 && window.location.hash === this.pageHistory[this.pageHistory.length - 2]) {
        this.back = true;
      }
      if (this.back && this.pageHistory.length !== 1) {
        transitionType = this.currentPage.getAttribute("data-transition") || 'slide';
        this.pageHistory.pop();
      } else {
        transitionType = this.targetPage.getAttribute("data-transition") || 'slide';
        this.pageHistory.push(window.location.hash);
      }
      targetPage = this.targetPage;
      currentPage = this.currentPage;
      this.currentPage = this.targetPage;
      this.isTransitioning = false;
      currentPage.addEventListener("webkitTransitionEnd", this.hideTransitionedPage, false);
      setTimeout(function() {
        if (_this.transitionAnimation) {
          switch (transitionType) {
            case "slide":
              return _this.slide(targetPage, currentPage);
            case "slideUp":
              return _this.slideUp(targetPage, currentPage);
          }
        } else {
          return _this.displayPage(targetPage, currentPage);
        }
      }, 10);
      _ref1 = this.hooks['after:to'];
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        hook = _ref1[_j];
        _results.push(hook());
      }
      return _results;
    };

    Glide.prototype.setupForAndroid = function() {
      var androidCSS, head, styleSheet, styleSheets, _i, _len, _ref;
      head = document.getElementsByTagName('head')[0];
      androidCSS = document.createElement('link');
      androidCSS.setAttribute('rel', 'stylesheet');
      androidCSS.setAttribute('type', 'text/css');
      androidCSS.setAttribute('href', "" + this.stylesheetPath + "flight.android.css");
      head.appendChild(androidCSS);
      styleSheets = document.styleSheets;
      for (_i = 0, _len = styleSheets.length; _i < _len; _i++) {
        styleSheet = styleSheets[_i];
        if (((_ref = styleSheet.href) != null ? _ref.indexOf("flight.css") : void 0) !== -1) {
          styleSheet.disabled = true;
        }
      }
      document.body.className = "old-android";
      return this.transitionAnimation = false;
    };

    Glide.prototype.slide = function(targetPage, currentPage) {
      var screenWidth,
        _this = this;
      targetPage.style.display = "-webkit-box";
      screenWidth = window.innerWidth + 'px';
      if (this.back) {
        this.translate(currentPage, "X", "0%");
        this.translate(targetPage, "X", "-" + screenWidth, "0ms");
        setTimeout(function() {
          return _this.translate(currentPage, "X", "100%");
        }, 0);
      } else {
        this.translate(currentPage, "X", "0%");
        this.translate(targetPage, "X", screenWidth, "0ms");
        setTimeout(function() {
          return _this.translate(currentPage, "X", "-100%");
        }, 0);
      }
      return setTimeout(function() {
        _this.translate(targetPage, "X", "0%");
        return _this.back = false;
      }, 0);
    };

    Glide.prototype.slideUp = function(targetPage, currentPage) {
      var screenHeight,
        _this = this;
      targetPage.style.display = "-webkit-box";
      screenHeight = window.innerHeight + 'px';
      if (this.back) {
        setTimeout(function() {
          return _this.translate(currentPage, "Y", screenHeight);
        }, 0);
      } else {
        targetPage.style.zIndex = "1000";
        this.translate(targetPage, "Y", screenHeight, "0ms");
        setTimeout(function() {
          return _this.translate(targetPage, "Y", "0%");
        }, 0);
      }
      return this.back = false;
    };

    Glide.prototype.translate = function(page, axis, distance, duration) {
      if (duration == null) {
        duration = this.speed + "s";
      }
      page.style.webkitTransition = "" + duration + " cubic-bezier(.10, .10, .25, .90)";
      return page.style.webkitTransform = "translate" + axis + "(" + distance + ")";
    };

    Glide.prototype.displayPage = function(targetPage, currentPage) {
      targetPage.style.display = "-webkit-box";
      currentPage.style.display = "none";
      if (this.isAndroid() && this.os.version < '4' && this.back === false) {
        window.scrollTo(0, 0);
      }
      if (this.back === true) {
        return this.back = false;
      }
    };

    Glide.prototype.hideTransitionedPage = function(e) {
      var page;
      page = e.target;
      if (this.hasClass(page, 'page')) {
        if (page.id !== this.targetPage.id) {
          page.style.display = "none";
        }
      }
      if (this.isAndroid() && this.os.version < '4') {
        this.currentPage.style.webkitTransform = "none";
      }
      return page.removeEventListener("webkitTransitionEnd", this.hideTransitionedPage, false);
    };

    Glide.prototype.hasClass = function(el, cssClass) {
      if (el.className !== '') {
        return el.className && new RegExp("(^|\\s)" + cssClass + "(\\s|$)").test(el.className);
      } else {
        return false;
      }
    };

    Glide.prototype.isTouch = function() {
      if (this.isAndroid()) {
        return !!('ontouchstart' in window);
      } else {
        return window.Touch != null;
      }
    };

    Glide.prototype.isIOS = function() {
      return this.os.ios;
    };

    Glide.prototype.isAndroid = function() {
      return this.os.android;
    };

    Glide.prototype.osVersion = function() {
      return this.os.version.toString();
    };

    Glide.prototype.handleEvents = function(e) {
      if (this.isTouch()) {
        switch (e.type) {
          case 'touchstart':
            return this.onTouchStart(e);
          case 'touchmove':
            return this.onTouchMove(e);
          case 'touchend':
            return this.onTouchEnd(e);
        }
      } else {
        switch (e.type) {
          case 'mousedown':
            return this.onTouchStart(e);
        }
      }
    };

    Glide.prototype.onTouchStart = function(e) {
      var _ref;
      if (this.isTouch()) {
        if (this.isAndroid()) {
          this.theTarget = document.elementFromPoint(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
        } else {
          this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        }
      } else {
        this.theTarget = document.elementFromPoint(e.clientX, e.clientY);
      }
      if (((_ref = this.theTarget) != null ? _ref.nodeName : void 0) && this.theTarget.nodeName.toLowerCase() !== 'a' && (this.theTarget.nodeType === 3 || this.theTarget.nodeType === 1)) {
        this.oldTarget = this.theTarget;
        this.parents = $(this.theTarget).parentsUntil('ul li');
        this.theTarget = this.parents[this.parents.length - 1] || this.oldTarget;
      }
      if (this.theTarget === null) {
        return;
      }
      this.theTarget.className += ' pressed';
      this.theTarget.addEventListener('touchmove', this.onTouchMove, false);
      this.theTarget.addEventListener('mouseout', this.onTouchEnd, false);
      this.theTarget.addEventListener('touchend', this.onTouchEnd, false);
      this.theTarget.addEventListener('mouseup', this.onTouchEnd, false);
      return this.theTarget.addEventListener('touchcancel', this.onTouchcancel, false);
    };

    Glide.prototype.onTouchMove = function(e) {
      return this.theTarget.className = this.theTarget.className.replace(/( )? pressed/gi, '');
    };

    Glide.prototype.onTouchEnd = function(e) {
      return this.theTarget.className = this.theTarget.className.replace(/( )? pressed/gi, '');
    };

    Glide.prototype.onTouchCancel = function(e) {
      return this.theTarget.className = this.theTarget.className.replace(/( )? pressed/gi, '');
    };

    return Glide;

  })();

  window.Glide = Glide;

}).call(this);
