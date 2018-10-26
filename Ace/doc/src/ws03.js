// JavaScript for ws03
/*
  Version: 1.2
*/

function ws03() {
  // fade duration (ms)
  const FADE_DURATION = {show: 400, hide: 200, wait: 100};
  // container No. (0: show-all,  (n >= 1): .container:eq(n-1))
  var current_container = 0;

  function create_topbutton(s) {
    $('body').append('<div id="goto_top" class="button">' + s + '<div>');
    $('#goto_top').click(function() { scrollTo(0,0); });
  }

  function create_menu() {
    function select_container(cont_num) {
      sc = cont_num == 0 ? $('div.container')
        : $('div.container:eq(' + (cont_num - 1) + ')');
      hc = current_container == 0 ? $('div.container')
        : $('div.container:eq(' + (current_container - 1) + ')');
      current_container = cont_num;
      hc.each(function() { $(this).stop().fadeOut(FADE_DURATION.hide); });
      setTimeout(function() {
        sc.each(function() { $(this).stop().fadeIn(FADE_DURATION.show); });
      }, FADE_DURATION.hide + FADE_DURATION.wait);
    }
    $('body').prepend(
      '<div id="menu"><ul>'
        + '<li class="button">Show All</li>'
        + $('div.container').map(function() {
          return '<li class="button">' + $(this).children('h2.sec').html() + '</li>'
        }).get().join("")
        + '</ul>'
        + '</div>');
    $('#menu ul li').each(function(i) {
      $(this).click(function() { select_container(i); });
    });
    select_container(current_container);
  }

  function qh_for_iphone(csss,ipcsss) {
    if (navigator.userAgent.indexOf('iPhone') != -1) {
      // menu
      $('#menu').css('display', 'none');
      $('#content').css('padding', '1em 0.6em');
      $('div.container').css('display', 'block');
      // top button
      $('#goto_top').css('display', 'none');
    }
  }

  function go() {
    create_menu();
    create_topbutton("Top");
    qh_for_iphone();
    // SAMPLE
    $('div.container:not(:first-child) div.text p').html(
      Array(60).join("sample text ")
    );
  }
  go();
}

$(function() {
  ws03();
});

