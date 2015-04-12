
/*!
 *  Project: circplus

 Initialize circplus using the code below:

to init, tag any div with class "circplus"
  $.circPlus({dfpID: '6394/6394.test', setTargeting: {dept: 'beverages'} });
  $.circPlus({ dfpID: '6394/partner-root-3566/123.giantcarlisle', setTargeting: {dept: 'beverages'} });

same command to refresh:
  $.circPlus({ dfpID: '6394/partner-root-3566/123.giantcarlisle', setTargeting: {dept: 'beverages'} });
 */
(function($, window) {
  'use strict';
  var $adCollection, bodyTemplate, count, createAds, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, displayAds, getDimensions, getID, init, isInView, rendered, sessionStorageX, setOptions, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.circplus';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'circplus';
  bodyTemplate = '<div class="gsn-slot-container"><div class="cpslot cpslot2" data-companion="true" data-dimensions="300x50"></div></div><div class="gsn-slot-container"><div class="cpslot cpslot1" data-dimensions="300x100,300x120"></div></div>';
  init = function(id, selector, options) {
    dfpID = id;
    if ($(selector).html() === '') {
      if (options.templateSelector) {
        $(selector).html($(options.templateSelector).html());
      } else {
        $(selector).html(options.bodyTemplate || bodyTemplate);
      }
    }
    $adCollection = $($('.cpslot').get().reverse());
    dfpLoader();
    setOptions(options);
    $(function() {
      createAds();
      displayAds();
    });
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: false,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      inViewOnly: true,
      noFetch: false
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsncircplus', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, companion, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        companion = $adUnit.data('companion');
        if (companion) {
          googleAdUnit.addService(window.googletag.companionAds());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          googleAdUnit.oldRenderEnded();
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs === true || dfpOptions.collapseEmptyDivs === 'original') {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.companionAds().setRefreshUnfilledSlots(true);
      window.googletag.enableServices();
    });
  };
  isInView = function(elem) {
    var docViewBottom, docViewTop, elemBottom, elemTop;
    docViewTop = $(window).scrollTop();
    docViewBottom = docViewTop + $(window).height();
    elemTop = elem.offset().top;
    elemBottom = elemTop + elem.height();
    return elemTop + (elemBottom - elemTop) / 2 >= docViewTop && elemTop + (elemBottom - elemTop) / 2 <= docViewBottom;
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        if (!dfpOptions.inViewOnly || isInView($adUnit)) {
          toPush.push($adUnitData);
        }
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSsl;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSsl = 'https:' === document.location.protocol;
    gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
          }
        },
        ads: [],
        pubads: function() {
          return this;
        },
        noFetch: function() {
          return this;
        },
        disableInitialLoad: function() {
          return this;
        },
        disablePublisherConsole: function() {
          return this;
        },
        enableSingleRequest: function() {
          return this;
        },
        setTargeting: function() {
          return this;
        },
        collapseEmptyDivs: function() {
          return this;
        },
        enableServices: function() {
          return this;
        },
        defineSlot: function(name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function(name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function(id) {
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   */
  $.circPlus = $.fn.circPlus = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    init(id, selector, options);
    return this;
  };
})(window.jQuery || window.Zepto || window.tire || window.$, window);


/*!
 *  Project: gsndfp
 * ===============================
 */

(function($, window) {
  'use strict';
  var $adCollection, count, createAds, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, displayAds, getDimensions, getID, init, isInView, rendered, sessionStorageX, setOptions, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.gsnunit';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'gsnUnit';
  init = function(id, selector, options) {
    dfpID = id;
    $adCollection = $(selector);
    dfpLoader();
    setOptions(options);
    $(function() {
      createAds();
      displayAds();
    });
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: false,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      inViewOnly: true,
      noFetch: false
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsn', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          googleAdUnit.oldRenderEnded();
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs) {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.enableServices();
    });
  };
  isInView = function(elem) {
    var docViewBottom, docViewTop, elemBottom, elemTop;
    docViewTop = $(window).scrollTop();
    docViewBottom = docViewTop + $(window).height();
    elemTop = elem.offset().top;
    elemBottom = elemTop + elem.height();
    return elemTop + (elemBottom - elemTop) / 2 >= docViewTop && elemTop + (elemBottom - elemTop) / 2 <= docViewBottom;
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        if (!dfpOptions.inViewOnly || isInView($adUnit)) {
          toPush.push($adUnitData);
        }
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSsl;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSsl = 'https:' === document.location.protocol;
    gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
          }
        },
        ads: [],
        pubads: function() {
          return this;
        },
        noFetch: function() {
          return this;
        },
        disableInitialLoad: function() {
          return this;
        },
        disablePublisherConsole: function() {
          return this;
        },
        enableSingleRequest: function() {
          return this;
        },
        setTargeting: function() {
          return this;
        },
        collapseEmptyDivs: function() {
          return this;
        },
        enableServices: function() {
          return this;
        },
        defineSlot: function(name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function(name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function(id) {
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   */
  $.gsnDfp = $.fn.gsnDfp = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    init(id, selector, options);
    return this;
  };
})(window.jQuery || window.Zepto || window.tire || window.$, window);


/*!
 *  Project: gsnsw2
 * ===============================
 */

(function($, window, doc) {
  'use strict';
  var $adCollection, advertUrl, clean, clearCookie, count, createAds, cssUrl, dfpBlocked, dfpID, dfpIsLoaded, dfpLoader, dfpOptions, dfpScript, dfpSelector, didOpen, displayAds, getCookie, getDimensions, getID, getPopup, init, onCloseCallback, onOpenCallback, rendered, sessionStorageX, setAdvertisingTester, setCookie, setOptions, setResponsiveCss, storeAs;
  sessionStorageX = sessionStorage;
  if (typeof sessionStorageX === 'undefined') {
    sessionStorageX = {
      getItem: function() {},
      setItem: function() {}
    };
  }
  dfpScript = this;
  dfpID = '';
  count = 0;
  rendered = 0;
  dfpSelector = '.gsnsw';
  dfpOptions = {};
  dfpIsLoaded = false;
  $adCollection = void 0;
  storeAs = 'gsnsw';
  cssUrl = 'https://cdn.gsngrocers.com/script/sw2/1.1.0/sw2-override.css';
  advertUrl = 'https://cdn.gsngrocers.com/script/sw2/1.1.0/advertisement.js';
  didOpen = false;
  init = function(id, selector, options) {
    var advert, css;
    setOptions(options);
    css = dfpOptions.cssUrl || cssUrl;
    advert = dfpOptions.advertUrl || advertUrl;
    if (dfpOptions.cancel) {
      onCloseCallback({
        cancel: true
      });
    }
    setResponsiveCss(css);
    setAdvertisingTester(advert);
    if (getCookie('gsnsw2') === null) {
      dfpID = id;
      dfpLoader();
      getPopup(selector);
      Gsn.Advertising.on('clickBrand', function(e) {
        $('.sw-close').click();
      });
    } else {
      onCloseCallback({
        cancel: true
      });
    }
  };
  setResponsiveCss = function(css) {
    var cssTag, el, head;
    el = document.getElementById('respo');
    if (el != null) {
      return;
    }
    head = document.getElementsByTagName('head').item(0);
    cssTag = document.createElement('link');
    cssTag.setAttribute('href', css);
    cssTag.setAttribute('rel', 'stylesheet');
    cssTag.setAttribute('id', 'respo');
    return head.appendChild(cssTag);
  };
  setAdvertisingTester = function(advert) {
    var body, el, scriptTag;
    el = document.getElementById('advertScript');
    if (el != null) {
      return;
    }
    body = document.getElementsByTagName('head').item(0);
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', advert);
    scriptTag.setAttribute('id', 'advertScript');
    return body.appendChild(scriptTag);
  };
  onOpenCallback = function(event) {
    didOpen = true;
    setTimeout((function() {
      if (typeof gsnGlobalTester === 'undefined') {
        jQuery('.sw-msg').show();
        jQuery('.sw-header-copy').hide();
        jQuery('.sw-row').hide();
      }
    }), 150);
  };
  onCloseCallback = function(event) {
    $('.sw-pop').remove();
    $('.lean-overlay').remove();
    window.scrollTo(0, 0);
    if (getCookie('gsnsw2') === null) {
      setCookie('gsnsw2', Gsn.Advertising.gsnNetworkId + ',' + Gsn.Advertising.enableCircPlus, 1);
    }
    if (typeof dfpOptions.onClose === 'function') {
      dfpOptions.onClose(didOpen);
    }
  };
  getPopup = function(selector) {
    var dataType, url;
    url = Gsn.Advertising.apiUrl + '/ShopperWelcome/Get/' + Gsn.Advertising.gsnid;
    dataType = 'json';
    if (!!(window.opera && window.opera.version)) {
      if (document.all && !window.atop) {
        url += '?callback=?';
        dataType = 'jsonp';
      }
    }
    $.ajax({
      url: url,
      dataType: dataType,
      success: function(rsp) {
        var body, data, div, evt;
        if (rsp) {
          if (!Gsn.Advertising.gsnNetworkId) {
            Gsn.Advertising.gsnNetworkId = rsp.NetworkId;
          }
          Gsn.Advertising.enableCircPlus = rsp.EnableCircPlus;
          Gsn.Advertising.disableSw = rsp.DisableSw;
          data = rsp.Template;
        }
        dfpID = Gsn.Advertising.getNetworkId();
        evt = {
          data: rsp,
          cancel: false
        };
        dfpOptions.onData(evt);
        if (evt.cancel) {
          data = null;
        }
        if (data) {
          data = data.replace(/%%CACHEBUSTER%%/g, (new Date).getTime()).replace(/%%CHAINID%%/g, Gsn.Advertising.gsnid);
          if (0 === $('#sw').length) {
            body = document.getElementsByTagName('body').item(0);
            div = document.createElement('div');
            div.setAttribute('id', 'sw');
            body.appendChild(div);
          }
          $('#sw').html(clean(data));
          $adCollection = $(selector);
          if ($adCollection) {
            createAds();
            displayAds();
            $('.sw-pop').easyModal({
              autoOpen: true,
              closeOnEscape: false,
              onClose: onCloseCallback,
              onOpen: onOpenCallback,
              top: 25
            });
          }
        } else {
          onCloseCallback({
            cancel: true
          });
        }
      }
    });
  };
  clean = function(data) {
    var template;
    template = $(data.trim());
    $('.remove', template).remove();
    return template.prop('outerHTML');
  };
  getCookie = function(NameOfCookie) {
    var begin, cookieData, cookieDatas, end;
    if (document.cookie.length > 0) {
      begin = document.cookie.indexOf(NameOfCookie + '=');
      end = 0;
      if (begin !== -1) {
        begin += NameOfCookie.length + 1;
        end = document.cookie.indexOf(';', begin);
        if (end === -1) {
          end = document.cookie.length;
        }
        cookieData = decodeURI(document.cookie.substring(begin, end));
        if (cookieData.indexOf(',') > 0) {
          cookieDatas = cookieData.split(',');
          Gsn.Advertising.gsnNetworkId = cookieDatas[0];
          Gsn.Advertising.enableCircPlus = cookieData[1];
          Gsn.Advertising.disableSw = cookieData[2];
        }
        return cookieData;
      }
    }
    return null;
  };
  setCookie = function(NameOfCookie, value, expiredays) {
    var ExpireDate;
    ExpireDate = new Date;
    ExpireDate.setTime(ExpireDate.getTime() + expiredays * 24 * 3600 * 1000);
    document.cookie = NameOfCookie + '=' + encodeURI(value) + (expiredays === null ? '' : '; expires=' + ExpireDate.toGMTString()) + '; path=/';
  };
  clearCookie = function(nameOfCookie) {
    if (nameOfCookie === getCookie(nameOfCookie)) {
      document.cookie = nameOfCookie + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };
  setOptions = function(options) {
    dfpOptions = {
      setTargeting: {},
      setCategoryExclusion: '',
      setLocation: '',
      enableSingleRequest: false,
      collapseEmptyDivs: true,
      refreshExisting: true,
      disablePublisherConsole: false,
      disableInitialLoad: false,
      noFetch: false
    };
    $.extend(true, dfpOptions, options);
    if (dfpOptions.googletag) {
      window.googletag.cmd.push(function() {
        $.extend(true, window.googletag, dfpOptions.googletag);
      });
    }
  };
  createAds = function() {
    $adCollection.each(function() {
      var $adUnit, $existingContent, adUnitID, dimensions;
      $adUnit = $(this);
      count++;
      adUnitID = getID($adUnit, 'gsnsw', count);
      dimensions = getDimensions($adUnit);
      $existingContent = $adUnit.html();
      $adUnit.html('').addClass('display-none');
      window.googletag.cmd.push(function() {
        var $adUnitData, exclusions, exclusionsGroup, googleAdUnit, targeting, valueTrimmed;
        googleAdUnit = void 0;
        $adUnitData = $adUnit.data(storeAs);
        if ($adUnitData) {
          return;
        }
        dfpID = dfpID.replace(/(\/\/)+/gi, '/').replace(/\s+/gi, '').replace(/(\/)$/, '/');
        if (dfpID.indexOf('/') !== 0) {
          dfpID = '/' + dfpID;
        }
        if ($adUnit.data('outofpage')) {
          googleAdUnit = window.googletag.defineOutOfPageSlot(dfpID, adUnitID).addService(window.googletag.pubads());
        } else {
          googleAdUnit = window.googletag.defineSlot(dfpID, dimensions, adUnitID).addService(window.googletag.pubads());
        }
        targeting = $adUnit.data('targeting');
        if (targeting) {
          if (typeof targeting === 'string') {
            targeting = eval('(' + targeting + ')');
          }
          $.each(targeting, function(k, v) {
            if (k === 'brand') {
              sessionStorageX.setItem('brand', v);
            }
            googleAdUnit.setTargeting(k, v);
          });
        }
        exclusions = $adUnit.data('exclusions');
        if (exclusions) {
          exclusionsGroup = exclusions.split(',');
          valueTrimmed = void 0;
          $.each(exclusionsGroup, function(k, v) {
            valueTrimmed = $.trim(v);
            if (valueTrimmed.length > 0) {
              googleAdUnit.setCategoryExclusion(valueTrimmed);
            }
          });
        }
        googleAdUnit.oldRenderEnded = googleAdUnit.oldRenderEnded || googleAdUnit.renderEnded;
        googleAdUnit.renderEnded = function() {
          var display;
          rendered++;
          display = $adUnit.css('display');
          $adUnit.removeClass('display-none').addClass('display-' + display);
          if (typeof dfpOptions.afterEachAdLoaded === 'function') {
            dfpOptions.afterEachAdLoaded.call(this, $adUnit);
          }
          if (typeof dfpOptions.afterAllAdsLoaded === 'function' && rendered === count) {
            dfpOptions.afterAllAdsLoaded.call(this, $adCollection);
          }
        };
        $adUnit.data(storeAs, googleAdUnit);
      });
    });
    window.googletag.cmd.push(function() {
      var exclusionsGroup, valueTrimmed;
      if (typeof dfpOptions.setTargeting['brand'] === 'undefined') {
        if (sessionStorageX.getItem('brand')) {
          dfpOptions.setTargeting['brand'] = sessionStorageX.getItem('brand');
        }
      }
      if (dfpOptions.enableSingleRequest === true) {
        window.googletag.pubads().enableSingleRequest();
      }
      $.each(dfpOptions.setTargeting, function(k, v) {
        if (k === 'brand') {
          sessionStorageX.setItem('brand', v);
        }
        window.googletag.pubads().setTargeting(k, v);
      });
      if (typeof dfpOptions.setLocation === 'object') {
        if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number' && typeof dfpOptions.setLocation.precision === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude, dfpOptions.setLocation.precision);
        } else if (typeof dfpOptions.setLocation.latitude === 'number' && typeof dfpOptions.setLocation.longitude === 'number') {
          window.googletag.pubads().setLocation(dfpOptions.setLocation.latitude, dfpOptions.setLocation.longitude);
        }
      }
      if (dfpOptions.setCategoryExclusion.length > 0) {
        exclusionsGroup = dfpOptions.setCategoryExclusion.split(',');
        valueTrimmed = void 0;
        $.each(exclusionsGroup, function(k, v) {
          valueTrimmed = $.trim(v);
          if (valueTrimmed.length > 0) {
            window.googletag.pubads().setCategoryExclusion(valueTrimmed);
          }
        });
      }
      if (dfpOptions.collapseEmptyDivs) {
        window.googletag.pubads().collapseEmptyDivs();
      }
      if (dfpOptions.disablePublisherConsole === true) {
        window.googletag.pubads().disablePublisherConsole();
      }
      if (dfpOptions.disableInitialLoad === true) {
        window.googletag.pubads().disableInitialLoad();
      }
      if (dfpOptions.noFetch === true) {
        window.googletag.pubads().noFetch();
      }
      window.googletag.enableServices();
    });
  };
  displayAds = function() {
    var toPush;
    toPush = [];
    $adCollection.each(function() {
      var $adUnit, $adUnitData;
      $adUnit = $(this);
      $adUnitData = $adUnit.data(storeAs);
      if (dfpOptions.refreshExisting && $adUnitData && $adUnit.data('gsnDfpExisting')) {
        toPush.push($adUnitData);
      } else {
        $adUnit.data('gsnDfpExisting', true);
        window.googletag.cmd.push(function() {
          window.googletag.display($adUnit.attr('id'));
        });
      }
    });
    if (toPush.length > 0) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().refresh(toPush);
      });
    }
  };
  getID = function($adUnit, adUnitName, count) {
    if (!dfpOptions.refreshExisting) {
      $adUnit.data(storeAs, null);
      $adUnit.data('gsnDfpExisting', null);
      if ($adUnit.attr('id')) {
        $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count);
      }
    }
    return $adUnit.attr('id') || $adUnit.attr('id', adUnitName + '-auto-gen-id-' + count).attr('id');
  };
  getDimensions = function($adUnit) {
    var dimensionGroups, dimensions, dimensionsData;
    dimensions = [];
    dimensionsData = $adUnit.data('dimensions');
    if (dimensionsData) {
      dimensionGroups = dimensionsData.split(',');
      $.each(dimensionGroups, function(k, v) {
        var dimensionSet;
        dimensionSet = v.split('x');
        dimensions.push([parseInt(dimensionSet[0], 10), parseInt(dimensionSet[1], 10)]);
      });
    } else {
      dimensions.push([$adUnit.width(), $adUnit.height()]);
    }
    return dimensions;
  };
  dfpLoader = function() {
    var gads, node, useSSL;
    dfpIsLoaded = dfpIsLoaded || $('script[src*="googletagservices.com/tag/js/gpt.js"]').length;
    if (dfpIsLoaded) {
      return;
    }
    window.googletag = window.googletag || {};
    window.googletag.cmd = window.googletag.cmd || [];
    gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    gads.onerror = function() {
      dfpBlocked();
    };
    useSSL = 'https:' === document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
    if (gads.style.display === 'none') {
      dfpBlocked();
    }
  };
  dfpBlocked = function() {
    var commands;
    commands = window.googletag.cmd;
    setTimeout((function() {
      var _defineSlot;
      _defineSlot = function(name, dimensions, id, oop) {
        window.googletag.ads.push(id);
        window.googletag.ads[id] = {
          renderEnded: function() {},
          addService: function() {
            return this;
          }
        };
        return window.googletag.ads[id];
      };
      window.googletag = {
        cmd: {
          push: function(callback) {
            callback.call(dfpScript);
          }
        },
        ads: [],
        pubads: function() {
          return this;
        },
        noFetch: function() {
          return this;
        },
        disableInitialLoad: function() {
          return this;
        },
        disablePublisherConsole: function() {
          return this;
        },
        enableSingleRequest: function() {
          return this;
        },
        setTargeting: function() {
          return this;
        },
        collapseEmptyDivs: function() {
          return this;
        },
        enableServices: function() {
          return this;
        },
        defineSlot: function(name, dimensions, id) {
          return _defineSlot(name, dimensions, id, false);
        },
        defineOutOfPageSlot: function(name, id) {
          return _defineSlot(name, [], id, true);
        },
        display: function(id) {
          window.googletag.ads[id].renderEnded.call(dfpScript);
          return this;
        }
      };
      $.each(commands, function(k, v) {
        window.googletag.cmd.push(v);
      });
    }), 50);
  };

  /**
   * Add function to the jQuery / Zepto / tire namespace
   * @param  String id      (Optional) The DFP account ID
   * @param  Object options (Optional) Custom options to apply
   - network id
   - chain id
   - store id (optional)
   */
  $.gsnSw2 = $.fn.gsnSw2 = function(id, options) {
    var selector;
    options = options || {};
    if (id === void 0) {
      id = dfpID;
    }
    if (typeof id === 'object') {
      options = id;
      id = options.dfpID || dfpID;
    }
    selector = this;
    if (typeof this === 'function') {
      selector = dfpSelector;
    }
    if ($(options.displayWhenExists || '.gsnunit').length) {
      init(id, selector, options);
    }
    return this;
  };
})(window.jQuery || window.Zepto || window.tire, window, document);


/**
 * gsn.easyModal.js v1.0.1
 * A minimal jQuery modal that works with your CSS.
 * Author: Flavius Matis - http://flaviusmatis.github.com/
 * URL: https://github.com/flaviusmatis/easyModal.js
 * Modified: Eric Schmit - GSN
 *========================================================
 */

(function($) {
  'use strict';
  var methods;
  methods = {
    init: function(options) {
      var defaults;
      defaults = {
        top: 'auto',
        autoOpen: false,
        overlayOpacity: 0.5,
        overlayColor: '#000',
        overlayClose: true,
        overlayParent: 'body',
        closeOnEscape: true,
        closeButtonClass: '.close',
        transitionIn: '',
        transitionOut: '',
        onOpen: false,
        onClose: false,
        zIndex: function() {
          return (function(value) {
            if (value === -Infinity) {
              return 0;
            } else {
              return value + 1;
            }
          })(Math.max.apply(Math, $.makeArray($('*').map(function() {
            return $(this).css('z-index');
          }).filter(function() {
            return $.isNumeric(this);
          }).map(function() {
            return parseInt(this, 10);
          }))));
        },
        updateZIndexOnOpen: false,
        adClass: 'gsnsw'
      };
      options = $.extend(defaults, options);
      return this.each(function() {
        var $modal, $overlay, o;
        o = options;
        $overlay = $('<div class="lean-overlay"></div>');
        $modal = $(this);
        $overlay.css({
          'display': 'none',
          'position': 'absolute',
          'z-index': 2147483640,
          'top': 0,
          'left': 0,
          'height': '100%',
          'width': '100%',
          'background': o.overlayColor,
          'opacity': o.overlayOpacity,
          'overflow': 'auto'
        }).appendTo(o.overlayParent);
        $modal.css({
          'display': 'none',
          'position': 'absolute',
          'z-index': 2147483647,
          'left': window.devicePixelRatio >= 2 ? 33 + '%' : 50 + '%',
          'top': parseInt(o.top, 10) > -1 ? o.top + 'px' : 50 + '%'
        });
        $modal.bind('openModal', function() {
          var modalZ, overlayZ;
          overlayZ = o.updateZIndexOnOpen ? o.zIndex() : parseInt($overlay.css('z-index'), 10);
          modalZ = overlayZ + 1;
          if (o.transitionIn !== '' && o.transitionOut !== '') {
            $modal.removeClass(o.transitionOut).addClass(o.transitionIn);
          }
          $modal.css({
            'display': 'block',
            'margin-left': window.devicePixelRatio >= 2 ? 0 : -($modal.outerWidth() / 2) + 'px',
            'margin-top': (parseInt(o.top, 10) > -1 ? 0 : -($modal.outerHeight() / 2)) + 'px',
            'z-index': modalZ
          });
          $overlay.css({
            'z-index': overlayZ,
            'display': 'block'
          });
          if (o.onOpen && typeof o.onOpen === 'function') {
            o.onOpen($modal[0]);
          }
        });
        $modal.bind('closeModal', function() {
          if (o.transitionIn !== '' && o.transitionOut !== '') {
            $modal.removeClass(o.transitionIn).addClass(o.transitionOut);
            $modal.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
              $modal.css('display', 'none');
              $overlay.css('display', 'none');
            });
          } else {
            $modal.css('display', 'none');
            $overlay.css('display', 'none');
          }
          if (o.onClose && typeof o.onClose === 'function') {
            o.onClose($modal[0]);
          }
        });
        $overlay.click(function() {
          if (o.overlayClose) {

          } else {

          }
        });
        $(document).keydown(function(e) {
          if (o.closeOnEscape && e.keyCode === 27) {
            $modal.trigger('closeModal');
          }
        });
        $modal.on('click', o.adClass, function(e) {
          $modal.trigger('closeModal');
          e.preventDefault();
        });
        $modal.on('click', o.closeButtonClass, function(e) {
          $modal.trigger('closeModal');
          e.preventDefault();
        });
        if (o.autoOpen) {
          $modal.trigger('openModal');
        }
      });
    }
  };
  $.fn.easyModal = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    }
    $.error('Method ' + method + ' does not exist on jQuery.easyModal');
  };
})(window.jQuery || window.Zepto || window.tire);


/*!
 *  Project: gsnevent triggering
 * ===============================
 */


/* Usage:
 *   For Publisher:
 *         Gsn.Advertising.clickBrickOffer(clickTrackingUrl, 69);
#
 *   For Consumer:
 *         Gsn.Advertising.on('clickBrickOffer', function(evt)) { alert(evt.OfferCode); });
#
 * The following events are currently available: clickProduct, clickPromotion, clickBrand, clickBrickOffer, clickRecipe, and clickLink
 */

(function(oldGsn, win, doc, gsnContext, gsnDfp, gsnSw2, circplus, trakless) {
  var Plugin, buildQueryString, createFrame, myGsn, myPlugin, oldGsnAdvertising, tickerFrame;
  tickerFrame = void 0;
  myGsn = oldGsn || {};
  oldGsnAdvertising = myGsn.Advertising;
  if (typeof oldGsnAdvertising !== 'undefined') {
    if (oldGsnAdvertising.pluginLoaded) {
      return;
    }
  }
  createFrame = function() {
    var tempIFrame;
    if (typeof tickerFrame === 'undefined') {
      tempIFrame = doc.createElement('iframe');
      tempIFrame.setAttribute('id', 'gsnticker');
      tempIFrame.style.position = 'absolute';
      tempIFrame.style.top = '-9999em';
      tempIFrame.style.left = '-9999em';
      tempIFrame.style.zIndex = '99';
      tempIFrame.style.border = '0px';
      tempIFrame.style.width = '0px';
      tempIFrame.style.height = '0px';
      tickerFrame = doc.body.appendChild(tempIFrame);
      if (doc.frames) {
        tickerFrame = doc.frames['gsnticker'];
      }
    }
  };
  Plugin = (function() {
    function Plugin() {}

    Plugin.prototype.pluginLoaded = true;

    Plugin.prototype.defaultActionParam = {
      page: void 0,
      evtname: '',
      dept: void 0,
      deviceid: '',
      storeid: '',
      consumerid: '',
      isanon: false,
      loyaltyid: '',
      aisle: '',
      category: '',
      shelf: '',
      brand: '',
      pcode: '',
      pdesc: '',
      latlng: [0, 0],
      evtcategory: '',
      evtvalue: 0
    };

    Plugin.prototype.translator = {
      siteid: 'sid',
      page: 'pg',
      evtname: 'en',
      dept: 'dpt',
      deviceid: 'dvc',
      storeid: 'str',
      consumerid: 'cust',
      isanon: 'isa',
      loyaltyid: 'loy',
      aisle: 'asl',
      category: 'cat',
      shelf: 'shf',
      brand: 'brd',
      pcode: 'pcd',
      pdesc: 'pds',
      latlng: 'latlng',
      evtcategory: 'ec',
      evtvalue: 'ev'
    };

    Plugin.prototype.isDebug = false;

    Plugin.prototype.gsnid = 0;

    Plugin.prototype.selector = 'body';

    Plugin.prototype.apiUrl = 'https://clientapi.gsn2.com/api/v1';

    Plugin.prototype.gsnNetworkId = void 0;

    Plugin.prototype.gsnNetworkStore = void 0;

    Plugin.prototype.onAllEvents = void 0;

    Plugin.prototype.oldGsnAdvertising = oldGsnAdvertising;

    Plugin.prototype.minSecondBetweenRefresh = 5;

    Plugin.prototype.enableCircPlus = false;

    Plugin.prototype.disableSw = '';

    Plugin.prototype.source = '';

    Plugin.prototype.targetting = {};

    Plugin.prototype.depts = [];

    Plugin.prototype.circPlusBody = void 0;

    Plugin.prototype.refreshExisting = {
      circPlus: false,
      pods: false
    };

    Plugin.prototype.circPlusDept = void 0;

    Plugin.prototype.timer = void 0;


    /**
     * get network id
    #
     * @return {Object}
     */

    Plugin.prototype.getNetworkId = function() {
      var self;
      self = this;
      return self.gsnNetworkId + ((self.source || "").length > 0 ? "." + self.source : "");
    };


    /**
     * trigger a gsnevent
    #
     * @param {String} en - event name
     * @param {Object} ed - event data
     * @return {Object}
     */

    Plugin.prototype.trigger = function(en, ed) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      win.setTimeout((function() {
        trakless.util.trigger(en, {
          type: en,
          detail: ed
        });
        if (typeof this.onAllEvents === 'function') {
          this.onAllEvents({
            type: en,
            detail: ed
          });
        }
      }), 100);
      return this;
    };


    /**
     * listen to a gsnevent
    #
     * @param {String} en - event name
     * @param {Function} cb - callback
     * @return {Object}
     */

    Plugin.prototype.on = function(en, cb) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      trakless.util.on(en, cb);
      return this;
    };


    /**
     * detach from event
    #
     * @param {String} en - event name
     * @param {Function} cb - cb
     * @return {Object}
     */

    Plugin.prototype.off = function(en, cb) {
      if (en.indexOf('gsnevent') < 0) {
        en = 'gsnevent:' + en;
      }
      trakless.util.off(en, cb);
      return this;
    };

    Plugin.prototype.log = function(message) {
      var self;
      self = myGsn.Advertising;
      if (self.isDebug && console) {
        console.log(message);
      }
      return this;
    };


    /**
     * trigger action tracking
    #
     * @param {String} actionParam
     * @return {Object}
     */

    Plugin.prototype.trackAction = function(actionParam) {
      var i, k, len, self, traker, translatedParam, v;
      self = myGsn.Advertising;
      translatedParam = {};
      if (actionParam != null) {
        for (k = i = 0, len = actionParam.length; i < len; k = ++i) {
          v = actionParam[k];
          translatedParam[self.translator[k]] = v;
        }
        traker = trakless.getDefaultTracker();
        traker.track('gsn', translatedParam);
      }
      self.log(trakless.util.stringToJSON(actionParam));
      return this;
    };


    /**
     * utility method to normalize category
    #
     * @param {String} keyword
     * @return {String}
     */

    Plugin.prototype.cleanKeyword = function(keyword) {
      var result;
      result = keyword.replace(/[^a-zA-Z0-9]+/gi, '_').replace(/^[_]+/gi, '');
      if (result.toLowerCase != null) {
        result = result.toLowerCase();
      }
      return result;
    };


    /**
     * add a dept
    #
     * @param {String} dept
     * @return {Object}
     */

    Plugin.prototype.addDept = function(dept) {
      var depts, goodDepts, i, len, oldDepts, self;
      self = myGsn.Advertising;
      if (dept != null) {
        oldDepts = self.depts;
        depts = [];
        goodDepts = {};
        depts.push(self.cleanKeyword(dept));
        goodDepts[depts[0]] = 1;
        self.circPlusDept = depts[0];
        for (i = 0, len = oldDepts.length; i < len; i++) {
          dept = oldDepts[i];
          if (goodDepts[dept] == null) {
            depts.push(dept);
          }
          goodDepts[dept] = 1;
        }
        while (depts.length > 5) {
          depts.pop();
        }
        self.depts = depts;
      }
      return this;
    };


    /**
     * fire a tracking url
    #
     * @param {String} url
     * @return {Object}
     */

    Plugin.prototype.ajaxFireUrl = function(url) {
      if (typeof url === 'string') {
        if (url.length < 10) {
          return;
        }
        url = url.replace('%%CACHEBUSTER%%', (new Date).getTime());
        createFrame();
        tickerFrame.src = url;
      }
      return this;
    };


    /**
     * Trigger when a product is clicked.  AKA: clickThru
    #
     */

    Plugin.prototype.clickProduct = function(click, categoryId, brandName, productDescription, productCode, quantity, displaySize, regularPrice, currentPrice, savingsAmount, savingsStatement, adCode, creativeId) {
      this.ajaxFireUrl(click);
      this.trigger('clickProduct', {
        myPlugin: this,
        CategoryId: categoryId,
        BrandName: brandName,
        Description: productDescription,
        ProductCode: productCode,
        DisplaySize: displaySize,
        RegularPrice: regularPrice,
        CurrentPrice: currentPrice,
        SavingsAmount: savingsAmount,
        SavingsStatement: savingsStatement,
        AdCode: adCode,
        CreativeId: creativeId,
        Quantity: quantity || 1
      });
      return this;
    };


    /**
     * Trigger when a brick offer is clicked.  AKA: brickRedirect
    #
     */

    Plugin.prototype.clickBrickOffer = function(click, offerCode, checkCode) {
      this.ajaxFireUrl(click);
      this.trigger('clickBrickOffer', {
        myPlugin: this,
        OfferCode: offerCode || 0
      });
      return this;
    };


    /**
     * Trigger when a brand offer or shopper welcome is clicked.
    #
     */

    Plugin.prototype.clickBrand = function(click, brandName) {
      this.ajaxFireUrl(click);
      this.setBrand(brandName);
      this.trigger('clickBrand', {
        myPlugin: this,
        BrandName: brandName
      });
      return this;
    };


    /**
     * Trigger when a promotion is clicked.  AKA: promotionRedirect
    #
     */

    Plugin.prototype.clickPromotion = function(click, adCode) {
      this.ajaxFireUrl(click);
      this.trigger('clickPromotion', {
        myPlugin: this,
        AdCode: adCode
      });
      return this;
    };


    /**
     * Trigger when a recipe is clicked.  AKA: recipeRedirect
    #
     */

    Plugin.prototype.clickRecipe = function(click, recipeId) {
      this.ajaxFireUrl(click);
      this.trigger('clickRecipe', {
        RecipeId: recipeId
      });
      return this;
    };


    /**
     * Trigger when a generic link is clicked.  AKA: verifyClickThru
    #
     */

    Plugin.prototype.clickLink = function(click, url, target) {
      if (target === void 0 || target === '') {
        target = '_top';
      }
      this.ajaxFireUrl(click);
      this.trigger('clickLink', {
        myPlugin: this,
        Url: url,
        Target: target
      });
      return this;
    };


    /**
     * set the brand for the session
    #
     */

    Plugin.prototype.setBrand = function(brandName) {
      trakless.util.session('gsndfp:brand', brandName);
      return this;
    };


    /**
     * get the brand currently in session
    #
     */

    Plugin.prototype.getBrand = function() {
      return trakless.util.session('gsndfp:brand');
    };


    /**
     * handle a dom event
    #
     */

    Plugin.prototype.actionHandler = function(evt) {
      var allData, elem, i, k, len, payLoad, realk, self, v;
      self = myGsn.Advertising;
      elem = evt.target ? evt.target : evt.srcElement;
      payLoad = {};
      if (elem != null) {
        allData = trakless.util.allData(elem);
        for (v = i = 0, len = allData.length; i < len; v = ++i) {
          k = allData[v];
          if (!(/^gsn/gi.test(k))) {
            continue;
          }
          realk = /^gsn/i.replace(k, '').toLowerCase();
          payLoad[realk] = v;
        }
      }
      self.refresh(payLoad);
      return self;
    };


    /**
     * internal method for refreshing adpods
    #
     */

    Plugin.prototype.refreshAdPodsInternal = function(actionParam, forceRefresh) {
      var canRefresh, lastRefreshTime, payLoad, self, targetting;
      self = myGsn.Advertising;
      payLoad = trakless.util.applyDefaults(actionParam, self.defaultActionParam);
      payLoad.siteid = self.gsnid;
      self.trackAction(payLoad);
      canRefresh = lastRefreshTime <= 0 || ((new Date).getTime() / 1000 - lastRefreshTime) >= self.minSecondBetweenRefresh;
      if (forceRefresh || canRefresh) {
        lastRefreshTime = (new Date()).getTime() / 1000;
        self.addDept(payLoad.dept);
        if (forceRefresh) {
          self.refreshExisting.pods = false;
          self.refreshExisting.circPlus = false;
        }
        targetting = {
          dept: self.depts || [],
          brand: self.getBrand()
        };
        if (payLoad.page) {
          targetting.kw = payLoad.page.replace(/[^a-z]/gi, '');
        }
        gsnDfp({
          dfpID: self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore || ''),
          setTargeting: targetting,
          refreshExisting: self.refreshExisting.pods
        });
        self.refreshExisting.pods = true;
        if (self.enableCircPlus) {
          targetting.dept = [self.circPlusDept || 'produce'];
          circPlus({
            dfpID: self.getNetworkId().replace(/\/$/gi, '') + (self.gsnNetworkStore || ''),
            setTargeting: targetting,
            circPlusBody: self.circPlusBody,
            refreshExisting: self.refreshExisting.circPlus
          });
          self.refreshExisting.circPlus = true;
        }
      }
      return this;
    };


    /**
     * adpods refresh
    #
     */

    Plugin.prototype.refresh = function(actionParam, forceRefresh) {
      var self;
      self = myGsn.Advertising;
      if (!self.hasGsnUnit()) {
        return self;
      }
      if (self.gsnid) {
        gsnSw2({
          displayWhenExists: '.gsnadunit,.gsnunit',
          onData: function(evt) {
            if ((self.source || '').length > 0) {
              return evt.cancel = self.disableSw.indexOf(self.source) > 0;
            }
          },
          onClose: function() {
            if (self.selector != null) {
              trakless.util.onClick(self.selector, self.actionHandler, '.gsnaction');
              self.selector = null;
            }
            return self.refreshAdPodsInternal(actionParam, forceRefresh);
          }
        });
      }
      return this;
    };


    /**
     * determine if there are adpods on the page
    #
     */

    Plugin.prototype.hasGsnUnit = function() {
      return trakless.util.$('.gsnadunit,.gsnunit,.circplus').length > 0;
    };


    /**
     * set global defaults
    #
     */

    Plugin.prototype.setDefault = function(defaultParam) {
      var self;
      self = myGsn.Advertising;
      self.defaultActionParam = trakless.util.applyDefaults(defaultParam, self.defaultActionParam);
      return this;
    };


    /**
     * method for support refreshing with timer
    #
     */

    Plugin.prototype.refreshWithTimer = function(actionParam) {
      var self, timer;
      self = myGsn.Advertising;
      if (actionParam == null) {
        actionParam = {
          evtname: 'refresh-timer'
        };
      }
      self.refresh(actionParam, true);
      timer = (self.timer || 0) * 1000;
      if (timer > 0) {
        setTimeout(self.refreshWithTimer, timer);
      }
      return this;
    };


    /**
     * the onload method, document ready friendly
    #
     */

    Plugin.prototype.load = function(gsnid, isDebug) {
      var self;
      self = myGsn.Advertising;
      if (gsnid) {
        self.gsnid = gsnid;
        if (!self.isDebug) {
          self.isDebug = isDebug;
        }
      }
      return self.refreshWithTimer({
        evtname: 'loading'
      });
    };

    return Plugin;

  })();
  myPlugin = new Plugin;
  myGsn.Advertising = myPlugin;
  myGsn.Advertising.brickRedirect = myPlugin.clickBrickOffer;
  myGsn.Advertising.clickBrand = myPlugin.clickBrand;
  myGsn.Advertising.clickThru = myPlugin.clickProduct;
  myGsn.Advertising.refreshAdPods = myPlugin.refresh;
  myGsn.Advertising.logAdImpression = function() {};
  myGsn.Advertising.logAdRequest = function() {};
  myGsn.Advertising.promotionRedirect = myPlugin.clickPromotion;
  myGsn.Advertising.verifyClickThru = myPlugin.clickLink;
  myGsn.Advertising.recipeRedirect = myPlugin.clickRecipe;
  win.Gsn = myGsn;
  buildQueryString = function(keyWord, keyValue) {
    if (keyValue !== null) {
      keyValue = new String(keyValue);
      if (keyWord !== 'ProductDescription') {
        keyValue = keyValue.replace(/&/, '`');
      }
      return keyWord + '=' + keyValue.toString();
    } else {
      return '';
    }
  };
  if ((gsnContext != null)) {
    myGsn.Advertising.on('clickRecipe', function(data) {
      if (data.type !== 'gsnevent:clickRecipe') {
        return;
      }
      win.location.replace('/Recipes/RecipeFull.aspx?recipeid=' + data.detail.RecipeId);
    });
    myGsn.Advertising.on('clickProduct', function(data) {
      var product, queryString;
      if (data.type !== 'gsnevent:clickProduct') {
        return;
      }
      product = data.detail;
      if (product) {
        queryString = new String('');
        queryString += buildQueryString('DepartmentID', product.CategoryId);
        queryString += '~';
        queryString += buildQueryString('BrandName', product.BrandName);
        queryString += '~';
        queryString += buildQueryString('ProductDescription', product.Description);
        queryString += '~';
        queryString += buildQueryString('ProductCode', product.ProductCode);
        queryString += '~';
        queryString += buildQueryString('DisplaySize', product.DisplaySize);
        queryString += '~';
        queryString += buildQueryString('RegularPrice', product.RegularPrice);
        queryString += '~';
        queryString += buildQueryString('CurrentPrice', product.CurrentPrice);
        queryString += '~';
        queryString += buildQueryString('SavingsAmount', product.SavingsAmount);
        queryString += '~';
        queryString += buildQueryString('SavingsStatement', product.SavingsStatement);
        queryString += '~';
        queryString += buildQueryString('Quantity', product.Quantity);
        queryString += '~';
        queryString += buildQueryString('AdCode', product.AdCode);
        queryString += '~';
        queryString += buildQueryString('CreativeID', product.CreativeId);
        if (typeof AddAdToShoppingList === 'function') {
          AddAdToShoppingList(queryString);
        }
      }
    });
    myGsn.Advertising.on('clickLink', function(data) {
      var linkData;
      if (data.type !== 'gsnevent:clickLink') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        if (linkData.Target === void 0 || linkData.Target === '') {
          linkData.Target = '_top';
        }
        if (linkData.Target === '_blank') {
          win.open(linkData.Url);
        } else {
          win.location.replace(linkData.Url);
        }
      }
    });
    myGsn.Advertising.on('clickPromotion', function(data) {
      var linkData;
      if (data.type !== 'gsnevent:clickPromotion') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        win.location.replace('/Ads/Promotion.aspx?adcode=' + linkData.AdCode);
      }
    });
    return myGsn.Advertising.on('clickBrickOffer', function(data) {
      var linkData, url;
      if (data.type !== 'gsnevent:clickBrickOffer') {
        return;
      }
      linkData = data.detail;
      if (linkData) {
        url = myGsn.Advertising.apiUrl + '/profile/BrickOffer/' + gsnContext.ConsumerID + '/' + linkData.OfferCode;
        win.open(url, '');
      }
    });
  }
})(window.Gsn || {}, window, document, window.GSNContext, $.gsnDfp, $.gsnSw2, $.circplus, trakless);

(function(trakless) {
  var aPlugin, attrs, fn, i, j, k, len, len1, prefix, ref, ref1, script;
  aPlugin = Gsn.Advertising;
  if (!aPlugin) {
    return;
  }
  attrs = {
    debug: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.isDebug = value !== "false";
    },
    api: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.apiUrl = value;
    },
    source: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.source = value;
    },
    gsnid: function(value) {
      if (!value) {
        return;
      }
      aPlugin.gsnid = value;
      return trakless.setSiteId(value);
    },
    timer: function(value) {
      if (!value) {
        return;
      }
      return aPlugin.timer = value;
    },
    selector: function(value) {
      if (typeof value !== "string") {
        return;
      }
      return aPlugin.selector = value;
    }
  };
  ref = document.getElementsByTagName("script");
  for (i = 0, len = ref.length; i < len; i++) {
    script = ref[i];
    if (/gsndfp/i.test(script.src)) {
      ref1 = ['', 'data-'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        prefix = ref1[j];
        for (k in attrs) {
          fn = attrs[k];
          fn(script.getAttribute(prefix + k));
        }
      }
    }
  }
  trakless.setPixel('//pi.gsngrocers.com/pi.gif');
  if (aPlugin.hasGsnUnit()) {
    aPlugin.load();
  } else {
    trakless.util.ready(function() {
      return aPlugin.load();
    });
  }
})(window.trakless);
