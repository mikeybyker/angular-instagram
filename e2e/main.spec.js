'use strict';

describe('The main view', function () {
    var page;

  beforeEach(function () {
    browser.get('/index.html');
    page = require('./main.po');

  });

  it('should include jumbotron with correct data', function() {
    expect(page.h1El.getText()).toBe('');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/instagram.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('Instagram');
  });


});