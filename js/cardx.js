(function() {
  'use strict';

  var _mobileMenu = document.querySelector('.top-nav__banner');
  var _closeBtn = _mobileMenu.querySelector('.top-nav__close-btn');

  _closeBtn.addEventListener('click', function() {
    if (!_mobileMenu.classList.contains('is-open')) {
      _mobileMenu.classList.add('is-open');
    }
    else {
      _mobileMenu.classList.remove('is-open');
    }
  }, false);
})();