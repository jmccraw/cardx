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
  var _solutions = _topNav.querySelector('.top-nav__header');
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

  // modal vars
  var _modalBtns = document.querySelectorAll('.modal-launch-btn');
  var _modal = document.querySelector('.modal');
  var _modalForm;
  var _tel;
  var _modalInputs;
  var _modalRequirements;
  var _modalSuccess;
  var firstModal = true;

  // newsroom vars
  var _archiveBtn = document.querySelectorAll('.splash__article--nav > button');
  var _loadMore = document.getElementById('load-more-news-btn');

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
      if (_tl.classList.contains('is-opaque') && i !== tag) {
        _tl.classList.remove('is-opaque');
        _testimonialCrumbs[i].classList.remove('is-active');
        if (_tl.nextElementSibling && !_tl.nextElementSibling.classList.contains('testimonials__breadcrumb')) {
          tag = i + 1;
          _testimonialCrumbs[i].nextElementSibling.classList.add('is-active');
          _tl.nextElementSibling.classList.add('is-opaque');
        } else {
          tag = 0;
          _testimonialCrumbs[0].classList.add('is-active');
          _testimonialList[0].classList.add('is-opaque');
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
      if (_tl.classList.contains('is-opaque') && i !== tag) {
        _tl.classList.remove('is-opaque');
        _testimonialCrumbs[i].classList.remove('is-active');
        if (_tl.previousElementSibling && !_tl.previousElementSibling.classList.contains('testimonials__breadcrumb')) {
          tag = i - 1;
          _testimonialCrumbs[i].previousElementSibling.classList.add('is-active');
          _tl.previousElementSibling.classList.add('is-opaque');
        } else {
          tag = _testimonialList.length - 1;
          _testimonialCrumbs[tag].classList.add('is-active');
          _testimonialList[tag].classList.add('is-opaque');
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
    testimonialAutoAdvance = _w.setInterval(loadNextTestimonial, 6000);
  }

  /**
   * Displays the form success page and resets fields on close
   * @type {Function}
   */
  function showFormSuccessPage() {
    _modalForm.classList.add('is-hidden');
    _modalSuccess.parentElement.classList.add('is-successful');
    _modalSuccess.setAttribute('data-prev-msg', _modalSuccess.previousElementSibling.innerHTML);
    _modalSuccess.previousElementSibling.innerHTML = "Thank You for Your Interest in CardX";
    if (_w.innerWidth < 850) {
      _w.scrollTo(0, 0);
    }
  }

  /**
   * Submit the valid form data
   * @type {Function}
   */
  function submitDemoRequestForm() {
    // TODO FIXME Submit form data some place

    // load the final modal overlay
    showFormSuccessPage();
  }

  /**
   * Validates our form data
   * @type {Function}
   */
  function validateFormData() {
    var mi = _modalInputs.length - 1;
    var p = _modalInputs[_modalInputs.length - 1];
    for (; mi >= 0; --mi) {
      var m = _modalInputs[mi];
      if ((m.value.length === 0 || m.value === '') && m.name !== 'email' && m.name !== 'phone') {
        m.setAttribute('data-good', 'false');
        m.nextElementSibling.classList.add('is-erroring');
      } else if (m.type === 'email' && m.value.length > 0
          && !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(m.value)) {
        m.value = '';
        m.setAttribute('data-good', 'false');
        m.nextElementSibling.classList.add('is-erroring');
      } else if (m.type === 'tel' && m.value.length < 10 && m.value.length > 0) {
        m.value = '';
        m.setAttribute('data-good', 'false');
        m.nextElementSibling.classList.add('is-erroring');
      } else if (p.value.length === 0 && m.type === 'email' && m.value.length === 0) {
        m.setAttribute('data-good', 'false');
        p.setAttribute('data-good', 'false');
        m.nextElementSibling.classList.add('is-erroring');
        p.nextElementSibling.classList.add('is-erroring');
      } else {
        m.setAttribute('data-good', 'true');
      }
    }
    if (_modal.querySelectorAll('[data-good="true"]').length === _modalInputs.length) {
      submitDemoRequestForm();
    }
  }

  /**
   * Closes the open demo request modal
   * @param {Event} e The click event
   * @type {Function}
   */
  function closeOpenModal(e) {
    var mi = _modalInputs.length - 1;
    if (e.preventDefault) {
      e.preventDefault();
    }
    // close the modal
    _modal.classList.remove('is-open');
    if (_body.classList.contains('is-constrained')) {
      _body.classList.remove('is-constrained');
    }
    // reset all the form data
    _modalForm.classList.remove('is-hidden');
    _modalSuccess.parentElement.classList.remove('is-successful');
    _modalSuccess.previousElementSibling.innerHTML = _modalSuccess.getAttribute('data-prev-msg');
    for (; mi >= 0; --mi) {
      _modalInputs[mi].value = '';
      _modalInputs[mi].setAttribute('data-good', 'false');
    }
  }

  /**
   * Loads modal query selectors and form functions
   * @type {Function}
   */
  function loadModalForm() {
    _tel = _modal.querySelector('.modal__form--tel');
    _modalForm = document.getElementById('modal-form');
    _modalInputs = _modal.querySelectorAll('input');
    _modalRequirements = _modal.querySelectorAll('.modal__form--required');
    _modalSuccess = _modal.querySelector('.modal__text');
    var mi = _modalInputs.length - 1;

    document.getElementById('modal-close-btn').addEventListener('click', closeOpenModal, false);
    document.getElementById('modal-success-close-btn').addEventListener('click', closeOpenModal, false);
    document.querySelector('.modal__overlay').addEventListener('click', closeOpenModal, false);

    for (; mi >= 0; --mi) {
      _modalInputs[mi].addEventListener('focus', function() {
        this.nextElementSibling.classList.remove('is-erroring');
      }, false);
    }

    document.querySelector('.modal__form--submit-btn').addEventListener('click', function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      validateFormData();
    }, false);

    if (_w.innerWidth < 850) {
      _tel.placeholder = 'Phone';
    } else {
      _tel.placeholder = 'Phone Number';
    }
  }

  /**
   * Loads the newsroom section button functionality
   * @type {Function}
   */
  function loadNewsroomFunctionality() {
    if (_loadMore) {
      _loadMore.addEventListener('click', function (e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        _loadMore.previousElementSibling.classList.add('is-loaded');
        _loadMore.classList.add('is-hidden');
      }, false);
    }
    if (_archiveBtn) {
      var ab = _archiveBtn.length - 1;
      for (; ab >= 0; --ab) {
        _archiveBtn[ab].addEventListener('click', function() {
          if (!this.classList.contains('is-active')) {
            this.classList.add('is-active');
          } else {
            this.classList.remove('is-active');
          }
        }, false);
      }
    }
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
        if (scroll.current > scroll.previous + 50 && scroll.direction) {
          scroll.direction = false;
          toggleMobileMenu();
        } else if (scroll.current < scroll.previous - 50 && !scroll.direction) {
          scroll.direction = true;
          toggleMobileMenu();
        }
        scroll.previous = scroll.current;
      }, 300);
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
    var h = 570;
    var scrollBy;
    if (firstTime) {
      scrollHeight = _body.scrollHeight;

      if (isHomepage()) {
        // add click to hero image Learn More
        _heroJump.addEventListener('click', function() {
          scrollBy = _w.setInterval(function() {
            if (_w.scrollY + 10 <= h - 30 && _w.scrollY + 200 + _w.innerHeight < scrollHeight && scrollHeight - h >= _w.scrollY + 10) {
              _w.scrollBy(0, 10);
            } else {
              _w.clearInterval(scrollBy);
            }
          }, 2);
        }, false);
      }

      _solutions.addEventListener('click', function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (!this.classList.contains('is-open')) {
          this.classList.add('is-open');
        } else {
          this.classList.remove('is-open');
        }
      }, false);
    }
  }

  /**
   * Throttles the events being received so it doesn't bog down the user experience
   * Taken from Remy Sharp's implementation: https://remysharp.com/2010/07/21/throttling-function-calls
   * @param{Object} fn The function to execute after throttling
   * @param{Number} threshhold The wait time in milliseconds
   * @param{Object} scope The context of 'this' or null
   * @returns {Function}
   * @type {Function}
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
    var mb = _modalBtns.length - 1;
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
    _w.addEventListener('resize', testBreakpoints, false);

    // load mobile functions if mobile
    testBreakpoints();

    // load modal functionality
    if (_modal) {
      for (; mb >= 0; --mb) {
        _modalBtns[mb].addEventListener('click', function () {
          if (firstModal) {
            firstModal = false;
            loadModalForm();
          }
          _modal.classList.add('is-open');
          if (_w.innerWidth < 850) {
            _w.scrollTo(0, 0);
            _body.classList.add('is-constrained');
          }
        }, false);
      }
    }

    // load newsroom functionality
    if (_loadMore || _archiveBtn) {
      loadNewsroomFunctionality();
    }
  }

  init();
})();