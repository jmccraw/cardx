(function() {
  'use strict';

  var _mobileMenu = document.querySelector('.top-nav__banner');
  var _hamburger = _mobileMenu.querySelector('.top-nav__close-btn');

  // Add hamburger menu toggle to show/hide menu
  _hamburger.addEventListener('click', function() {
    if (!_mobileMenu.classList.contains('is-open')) {
      _mobileMenu.classList.add('is-open');
    }
    else {
      _mobileMenu.classList.remove('is-open');
    }
  }, false);

})();