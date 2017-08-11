/* wmemo.js - v1.1
   phis9 <phis9.rb@gmail.com>
   depends: wmemo.css, jquery, jquery-ui
   Last modified: Sat 05 Aug 2017 17:16:37 JST
*/

// parameters
var wmemo_nmax = 10; // number of memo
var wmemo_width = 220, wmemo_height = 220;
var wmemo_minwidth = 160, wmemo_minheight = 160;
var wmemo_fall = false; // fall?
var wmemo_dec = 0.7, wmemo_acc = 4; // decrease, acceleration
// color
var wmemo_collist = ["#f77", "#5a5", "#77f", "#777"];

// init
var wmemo_maxcolnum = wmemo_collist.length;
var wmemo_num = 0, wmemo_id = 0;

function wmemo_setup() {
  $('#wmemo_gen_button').dblclick(wmemo_gen);
}

function fontsize_change(qmemo_tarea,i) { // i>=0: inc, i<0: dec
  var fs = parseInt(qmemo_tarea.css('font-size'));
  if (i >= 0 || fs < 10) { qmemo_tarea[0].style.fontSize = (fs + 1) + "px"; }
  else if (i < 0) { qmemo_tarea[0].style.fontSize = (fs - 1) + "px"; }
}

function col_change(qmemo,c) { qmemo[0].style.backgroundColor = c; }
function bgcol_change(qmemo_tarea,fgc,bgc,fgcc,bgcc) {
  if (qmemo_tarea.bgc_flag) {
    qmemo_tarea[0].style.color = fgcc;
    qmemo_tarea[0].style.backgroundColor = bgcc;
  } else {
    qmemo_tarea[0].style.color = fgc;
    qmemo_tarea[0].style.backgroundColor = bgc;
  }
  qmemo_tarea.bgc_flag = !(qmemo_tarea.bgc_flag);
}

function wmemo_gen() {
  if ( wmemo_num < wmemo_nmax) {
    var cl = new Array(wmemo_maxcolnum);
    var idstr = '#wmemo' + wmemo_id;
    for (i=0; i<wmemo_maxcolnum; i++) { cl[i] = i; }
    $('#wmemo_field').append(
      '<div class="wmemo" id="wmemo' + wmemo_id + '">'
        + cl.map(function(i) {
          return '<div class="colbutton col' + i + '"></div>'
        }).join('')
        + '<div class="bgcolbutton"></div>'
        + '<div class="fbutton inc"></div>'
        + '<div class="fbutton dec"></div>'
        + '<div class="sbutton close">x</div><br/>'
        + '<textarea></textarea></div>');
    var qmemo = $(idstr);
    var qmemo_tarea = $(idstr + ' textarea');
    qmemo.draggable({containment: 'window', scroll: false});
    qmemo.resizable({
      minHeight: wmemo_minheight, minWidth: wmemo_minwidth,
      start: function(evt,ui) { qmemo_tarea.fadeOut(50); },
      stop: function(evt,ui) {
        qmemo_tarea[0].style.width = (qmemo[0].offsetWidth - 14) + 'px';
        qmemo_tarea[0].style.height = (qmemo[0].offsetHeight - 32) + 'px';
        qmemo_tarea.fadeIn(50);
      }
    });
    // size
    qmemo[0].style.width = wmemo_width + "px";
    qmemo[0].style.height = wmemo_height + "px";
    qmemo_tarea[0].style.width = (qmemo[0].offsetWidth - 14) + 'px';
    qmemo_tarea[0].style.height = (qmemo[0].offsetHeight - 32) + 'px';
    // button [color]
    for (i=0; i<wmemo_maxcolnum; i++) {
      var b = $(idstr + ' div.colbutton.col' + i)[0];
      b.style.backgroundColor = wmemo_collist[i];
      b.onclick = function() {
        qmemo[0].style.backgroundColor = this.style.backgroundColor;
      }
    }
    // button [bg-color]
    qmemo_tarea.bgc_flag = true;
    $(idstr + ' div.bgcolbutton')[0].onclick
      = function() { bgcol_change(qmemo_tarea,"#000","#fff","#fff","#111"); }
    // button [font]
    $(idstr + ' div.fbutton.inc')[0].onclick
      = function() { fontsize_change(qmemo_tarea,1); }
    $(idstr + ' div.fbutton.dec')[0].onclick
      = function() { fontsize_change(qmemo_tarea,-1); }
    // button [close]
    $(idstr + ' div.sbutton.close')[0].onclick
      = function() { wmemo_close(qmemo); }
    // move and stop
    if (wmemo_fall) { qmemo.dblclick(function() { wmemo_move(qmemo); }); }
    qmemo.show_flag = true;
    wmemo_num++;
    wmemo_id++;
  }
}

function wmemo_close(qmemo) {
  qmemo[0].parentNode.removeChild(qmemo[0]);
  wmemo_num--;
}

function wmemo_move(qmemo) {
  var wmemo_vy = 0;
  var wmemo_r = qmemo[0].offsetHeight;
  var wmemo_top = qmemo[0].offsetTop;
  var wmemo_ymax = $(window).height() - wmemo_r;
  var wmemo_interval;
  function wmemo_move_1() {
    wmemo_vy += wmemo_acc;
    wmemo_top += wmemo_vy;
    if (wmemo_top >= wmemo_ymax) {
      wmemo_top = wmemo_ymax;
      wmemo_vy *= -wmemo_dec;
      if (!~~wmemo_vy) { clearInterval(wmemo_interval); }
    }
    qmemo[0].style.top = wmemo_top + "px";
  }
  wmemo_interval = setInterval(wmemo_move_1, 10);
}

function toggle_wmemo(qmemo) {
  if (qmemo.show_flag) { qmemo.fadeOut(300); } else { qmemo.fadeIn(300); }
  qmemo.show_flag = !(qmemo.show_flag);
}
