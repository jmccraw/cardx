(function() {
  'use strict';

  // utility vars
  var _w = window;
  var _body = document.querySelector('body');
  var scrollHeight = 0;

  // navigation vars
  var _topNav = document.querySelector('.top-nav');
  var _mobileMenu = _topNav.querySelector('.top-nav__banner');
  var _hamburger = _mobileMenu.querySelector('.top-nav__close-btn');
  var testMobileNav;
  var scroll = {
    'current': 0,
    'previous': 0,
    // false == down; true == up
    'direction': true
  };

  // hero vars
  var _heroJump = document.querySelector('.hero__jump-btn');

  // testimonial vars
  var _testimonial;
  var _testimonialList;
  var _testimonialCrumbs;
  var _tArrowLeft;
  var _tArrowRight;
  var testimonialAutoAdvance;
  var touches = {
    'current': 0,
    'previous': 0
  };

  /**
   * Checks to see if on the index page
   * @type {Function}
   * @returns {Boolean}
   */
  function isHomepage() {
    if (!_body.classList.contains('index')) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Display the next testimonial
   * @param {Boolean} touched (Optional) If true, stop auto-advancing
   * @type {Function}
   */
  function loadNextTestimonial(touched) {
    var i = _testimonialList.length - 1;
    var tag = -1;
    if (touched) {
      _w.clearInterval(testimonialAutoAdvance);
    }

    for (; i >= 0; --i) {
      var _tl = _testimonialList[i];
      if (_tl.classList.contains('is-visible') && i !== tag) {
        _tl.classList.remove('is-visible');
        _testimonialCrumbs[i].classList.remove('is-active');
        if (_tl.nextElementSibling && !_tl.nextElementSibling.classList.contains('testimonials__breadcrumb')) {
          tag = i + 1;
          _testimonialCrumbs[i].nextElementSibling.classList.add('is-active');
          _tl.nextElementSibling.classList.add('is-visible');
        } else {
          tag = 0;
          _testimonialCrumbs[0].classList.add('is-active');
          _testimonialList[0].classList.add('is-visible');
        }
      }
    }
  }

  /**
   * Display the previous testimonial
   * @param {Boolean} touched (Optional) If true, stop auto-advancing
   * @type {Function}
   */
  function loadPreviousTestimonial(touched) {
    var i = _testimonialList.length - 1;
    var tag = -1;
    if (touched) {
      _w.clearInterval(testimonialAutoAdvance);
    }

    for (; i >= 0; --i) {
      var _tl = _testimonialList[i];
      if (_tl.classList.contains('is-visible') && i !== tag) {
        _tl.classList.remove('is-visible');
        _testimonialCrumbs[i].classList.remove('is-active');
        if (_tl.previousElementSibling && !_tl.previousElementSibling.classList.contains('testimonials__breadcrumb')) {
          tag = i - 1;
          _testimonialCrumbs[i].previousElementSibling.classList.add('is-active');
          _tl.previousElementSibling.classList.add('is-visible');
        } else {
          tag = _testimonialList.length - 1;
          _testimonialCrumbs[tag].classList.add('is-active');
          _testimonialList[tag].classList.add('is-visible');
        }
      }
    }
  }

  /**
   * Load the testimonials section functions and event handlers
   * @type {Function}
   */
  function loadTestimonials() {
    var touching = false;
    var setCurrentPosition = throttle(function(e) {
      if (touching) {
        touches.current = e.touches[0].clientX;
      }
    }, 100);
    _testimonial= document.querySelector('.testimonials');
    _testimonialList = _testimonial.querySelectorAll('.testimonials__testimonial');
    _testimonialCrumbs = _testimonial.querySelectorAll('.testimonials__crumb');
    _tArrowLeft = _testimonial.querySelector('.testimonials__arrow--left');
    _tArrowRight = _testimonial.querySelector('.testimonials__arrow--right');

    // attach event handlers to testimonials
    _testimonial.addEventListener('touchstart', function(e) {
      touching = true;
      touches.previous = e.touches[0].clientX;
    }, false);

    _testimonial.addEventListener('touchmove', setCurrentPosition, false);

    _testimonial.addEventListener('touchend', function() {
      touching = false;
      // advancing carousel
      if (touches.current < touches.previous) {
        loadNextTestimonial(true);
      } else if (touches.current > touches.previous) {
        loadPreviousTestimonial(true);
      }
    }, false);

    _tArrowLeft.addEventListener('click', function() {
      loadPreviousTestimonial(true);
    }, false);

    _tArrowRight.addEventListener('click', function() {
      loadNextTestimonial(true);
    }, false);

    // auto advance the testimonials section
    testimonialAutoAdvance = _w.setInterval(loadNextTestimonial, 3000);
  }

  /**
   * Add or remove the mobile menu visibility toggle class
   * @type {Function}
   */
  function toggleMobileMenu() {
    if (!_topNav.classList.contains('is-hidden')) {
      _topNav.classList.add('is-hidden');
      // check if the menu is open and close it if so
      if (_mobileMenu.classList.contains('is-open')) {
        _mobileMenu.classList.remove('is-open');
      }
    } else {
      _topNav.classList.remove('is-hidden');
    }
  }

  /**
   * Load mobile functions and event listeners
   * @param {Boolean} firstTime Whether the first time loading mobile functions
   * @type {Function}
   */
  function loadMobileFunctionality(firstTime) {
    if (firstTime) {
      // throttle scrolling to check if mobile nav should recede
      testMobileNav = throttle(function() {
        scroll.current = _w.scrollY;
        if (scroll.current > scroll.previous + 100 && scroll.direction) {
          scroll.direction = false;
          toggleMobileMenu();
        } else if (scroll.current < scroll.previous - 50 && !scroll.direction) {
          scroll.direction = true;
          toggleMobileMenu();
        }
        scroll.previous = scroll.current;
      }, 500);
      document.addEventListener('scroll', testMobileNav, false);

      // Add hamburger menu toggle to show/hide menu
      _hamburger.addEventListener('click', function () {
        if (!_mobileMenu.classList.contains('is-open')) {
          _mobileMenu.classList.add('is-open');
        } else {
          _mobileMenu.classList.remove('is-open');
        }
      }, false);
    }
  }

  /**
   * Load desktop functions and event listeners
   * @param {Boolean} firstTime Whether the first time loading desktop functions
   * @type {Function}
   */
  function loadDesktopFunctionality(firstTime) {
    var scrollBy;
    if (firstTime) {
      scrollHeight = _body.scrollHeight;

      if (isHomepage()) {
        // add click to hero image Learn More
        _heroJump.addEventListener('click', function() {
          scrollBy = _w.setInterval(function() {
            var h = _w.innerHeight;
            if (_w.scrollY + 10 <= h - 30 && _w.scrollY + 250 + _w.innerHeight < scrollHeight) {
              _w.scrollBy(0, 10);
            } else {
              _w.clearInterval(scrollBy);
            }
          }, 2);
        }, false);
      }
    }
  }

  /**
   * Throttles the events being received so it doesn't bog down the user experience
   * Taken from Remy Sharp's implementation: https://remysharp.com/2010/07/21/throttling-function-calls
   * @param{Object} fn The function to execute after throttling
   * @param{Number} threshhold The wait time in milliseconds
   * @param{Object} scope The context of 'this' or null
   * @returns {Function}
   */
  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
      deferTimer;
    return function () {
      var context = scope || this;
      var now = +new Date,
        args = arguments;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  /**
   * Initialization functions
   * @type {Function}
   */
  function init() {
    var mobileLoaded = false;
    var desktopLoaded = false;
    // if the homepage, start the testimonials carousel
    if (isHomepage()) {
      loadTestimonials();
    }

    var testBreakpoints = throttle(function() {
      if (_w.innerWidth < 768 && !mobileLoaded) {
        mobileLoaded = true;
        loadMobileFunctionality(true);
      } else if (_w.innerWidth < 768 && mobileLoaded) {
        loadMobileFunctionality(false);
      } else if (_w.innerWidth >= 768 && !desktopLoaded) {
        desktopLoaded = true;
        document.removeEventListener('scroll', testMobileNav, false);
        loadDesktopFunctionality(true);
      } else if (_w.innerWidth >= 768 && mobileLoaded) {
        document.removeEventListener('scroll', testMobileNav, false);
      }
    }, 100);
    document.addEventListener('resize', testBreakpoints, false);

    // load mobile functions if mobile
    testBreakpoints();
  }

  init();

  // TODO FIXME Update so the transition uses translate instead of display none/block.

})();