/*
  JSPad - Javascript学習環境
  Author: M. Bando <bando@ktc.ac.jp>
  Last modified: Fri 26 Oct 2018 17:09:16 JST
*/

var output, source, submit_button;
var canvas, ctx, ptip, pdot;
var ptip_freeze = false, menu_flag = false, position_flag = false;
var file = false, use_pretty = false;

var JavaScriptMode = ace.require("ace/mode/javascript").Mode;
var editor;

function ace_init() {
  editor = ace.edit('mainfunc');
  editor.setFontSize(fontsize);
  // Syntax Highlight (ACE)
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setTabSize(2);
  editor.getSession().setMode(new JavaScriptMode());
  editor.session.setOption("useWorker", false);
}

function init() {
  output = $("#output");
  source = $("#mainfunc");
  submit_button = $("#submit_button");
  ptip = $('#position');
  pdot = $("#pdot");

  ace_init();

  // [Save/Load] ==============================================
  // filename
  setfilename(false);
  // save
  $('#save_button').on("click", function() {
    var d = new Date();
    var fname = "jsp" + d.getFullYear() + zpad(d.getMonth()+1)
      + zpad(d.getDate()) + zpad(d.getHours())
      + zpad(d.getMinutes()) + zpad(d.getSeconds())
      + ".js";
    var agent = navigator.userAgent.toLowerCase();

    if (agent.indexOf('edge')   == -1 &&
        (agent.indexOf('chrome') != -1 ||
         agent.indexOf('firefox') != -1 ||
         agent.indexOf('safari') != -1 ||
         agent.indexOf('opera')  != -1)) {
      $(this).attr("href", "data:application/octed-stream,"
                   + encodeURIComponent(editor.getValue().replace(/\n/g, "\r\n")))
        .attr("download", fname);
    } else {
      var content = editor.getValue().replace(/\n/g, "\r\n");
      var blob = new Blob([ content ], { "type" : "text/plain" });

      window.navigator.msSaveBlob(blob, fname);
    }
  });
  // load
  $('#load_button').on("change", function(e) {
    file = e.target.files[0];
    var reader = new FileReader();
    reader.onerror = function() {
      alert("ファイルの読み込みに失敗しました。");
    };
    reader.onload = function() {
      setfilename(file.name);
      //source.text(reader.result);
      sputs(reader.result);
    };
    reader.readAsText(file);
  });
  // [Print] ==================================================
  $('#print_button').on("click", prep_print);
  // [Clear] ==================================================
  $('#clear_button').on("click", function() {
    $("#sample").val("blank/0").change();
    //prep();
  });
  // [Menu] ==================================================
  // button
  $('#menu_button').off().on("click", function() {
    toggle_menu(!menu_flag);
  });
  // normal --------------------------------------------------
  // theme
  $('#theme').html(
    ["white", "black", "red", "green", "blue"].map(function(v,i) {
      return '<option value="' + v + '">' + v + '</option>';
    }).join("")
  ).val("" + theme).on("change", function() {
    change_theme(theme = $(this).val());
  });
  // fontsize
  $('#fontsize').html(
    Array.apply(null, new Array(13)).map(function(v,i) {
      return '<option value="' + (i+8) + '">' + (i+8) + 'pt</option>';
    }).join("")
  ).val("" + fontsize).on("change", function() {
    fontsize = $(this).val();
    //$("html").css("font-size", fontsize + "pt");
    $("#mainfunc, #output").css("font-size", fontsize + "pt");
    editor.setFontSize(fontsize);
  });
  // sample
  $('#sample').html(
    [
      ["空白", ["blank"]],
      ["Normal/初級", ["normal", "basic"]],
      ["Normal/上級", ["normal", "advanced"]],
      ["Canvas/初級", ["canvas", "basic"]],
      ["Canvas/上級", ["canvas", "advanced"]],
      ["Canvas/アニメーション", ["canvas", "anime"]],
      ["Canvas/その他", ["canvas", "misc"]]
    ].map(function(g,j) {
      var cat = g[1].join("/") + "/";
      return '<optgroup label="' + g[0] + '">'
        + (g[1].length == 2 ? sample[g[1][0]][g[1][1]] : sample[g[1][0]])
        .map(function(c, k) {
          return '<option value="' + (cat + k) + '">' + (cat + k) + '</option>';
        }).join("")
        + '</optgroup>';
    }).join("")
  ).val("" + code).on("change", function() {
    code = $(this).val();
    prep();
  });
  // print-setting
  $('#print_color').val(print_color).on("change", function() {
    use_pretty = ($(this).val == "color");
  });
  use_pretty = (print_color == "color");
  // manual-open
  $('#manual_button').off().on("click", function() {
    window.open('doc/index.html', '_blank', 'width=600, height=500');
  });
  // canvas ---------------------------------------------------
  // position
  $('#position_ckbox').prop('checked', false);
  // color
  $("#color").off().on("change", function() {
    $("#colorout").html($(this).val());
  });
  // menu window
  $('#menu_container').draggable({
    containment: "window", distance: 5, scroll: false
  });

  // [Submit] ============================================
  submit_button.off().on("click", function() {
    //location.reload();
    if (interval) { clearLoop(); }
    var s = editor.getValue();
    // // quick hack for infinite loops
    // s = s.replace(/( |\n|;)(while|for)( |\(|\n)/g,'$1_$2$3');
    mainfunc = eval("(" + s + ")");
    prep(true);
    mainfunc();
  });

  // [Key] ================================================
  $(window).keydown(function(e) {
    switch(e.keyCode) {
    case 116: // F5
      if (confirm("リロードすると変更が失われます。\nリロードしますか？")) {
        location.reload();
      } else {
        return false;
      }
    case 119: // F8
      $('#menu_button').click();
      return false;
    case 120: // F9
      submit_button.click();
      return false;
    }
  });

  // ======================================================
  toggle_menu(show_menu);
  change_theme(theme);
}

function prep(update) {
  $("#canvas_container").html('<canvas id="field" width="300" height="300"></canvas>');
  canvas = $("#field").css("display", "none");
  output.css("display", "inline-block").val("");

  $('#position_ckbox').off().on("change", function() {
    position_flag = $(this).prop('checked');
    if (position_flag) {
      canvas.on({
        "mousedown": function(e) {
          ptip_freeze = !ptip_freeze;
          if (ptip_freeze) {
            var ee = e.originalEvent;
            pdot.css({
              'display': 'inline-block',
              'left': (ee.pageX - 3) + 'px',
              'top': (ee.pageY - 3) + 'px'
            });
          } else {
            pdot.css('display', "none");
          }
        },
        "mousemove": function(e) {
          if (!ptip_freeze) {
            var ee = e.originalEvent;
            ptip.html("(" + ee.offsetX + ", " + ee.offsetY + ")")
              .css({
                'left': (ee.pageX + 7) + 'px',
                'top': (ee.pageY - 32) + 'px'
              });
          }
        },
        "mouseenter": function() {
          ptip.css('display', 'inline-block');
        },
        "mouseleave": function() {
          if (!ptip_freeze) {
            ptip.css('display', 'none');
          }
        }
      });
    } else {
      canvas.off();
      ptip_freeze = false;
      ptip.css('display', 'none');
      pdot.css('display', "none");
    }
  });

  if (!update) { change_code(code); }
  //mainfunc();
}

function zpad(num) { return ("0" + num).slice(-2); }

function prep_print() {
  //$("html").css({"background": "#fff", "color": "#000"});
  //$("#JSPad").css("display", "none");
  //$("#print_container").css("display", "inline-block");
  $("#src").html(
    '<pre class="prettyprint linenums"><code class="lang-js"></code></pre>'
  );
  $("#src > pre > code").text(source.text());
  if (use_pretty) { prettyPrint(); }
  var d = new Date();
  $("#print_title").text(
    "JSPad / " + d.getFullYear() + '-' +  zpad(d.getMonth()+1)
      + '-' + zpad(d.getDate()) + '-' + zpad(d.getHours()) + ':'
      + zpad(d.getMinutes()) + ':' + zpad(d.getSeconds())
  );
  window.print();
  //change_theme($('#theme').val());
  //$("#JSPad").css("display", "block");
  //$("#print_container").css("display", "none");
}

function setfilename(f) {
  $("#filename").html("(" + (f ? f : "") + ")");
}

function change_code(c) {
  if (interval) { clearLoop(); }
  var cst = c.split("/");
  if (cst.length == 3) {
    mainfunc = sample[cst[0]][cst[1]][cst[2]];
  } else {
    mainfunc = sample[cst[0]][cst[1]];
  }
  setfilename("SAMPLE: " + c);
  sputs(mainfunc);// show main()
}

function change_theme(t) {
  switch(t) {
  case "white":
    $("html").css({"color": "#000", "background": "#eee"});
    output.css({
      "background": "#fff",
      "box-shadow": "0 0 2px 0px rgba(0,0,0,0.3) inset"
    });
    source.css({
      //"background": "#fff",
      "box-shadow": "0 0 2px 0px rgba(0,0,0,0.3) inset"
    });
    $('#JSPad > h1').css("text-shadow", "2px 2px 2px rgba(0,0,0,0.4)");
    $('#menu_container').css({
      "background": "rgba(255,255,255,0.7)",
      "box-shadow": "2px 2px 2px rgba(0,0,0,0.3)"
    });
    break;
  case "black":
    $("html").css({"color": "#eee", "background": "#222"});
    output.css({
      "background": "#111",
      "box-shadow": "0 0 5px 0px rgba(255,255,255,0.9) inset"
    });
    source.css({
      //"background": "#111",
      "box-shadow": "0 0 5px 0px rgba(255,255,255,0.9) inset"
    });
    $('#JSPad > h1').css("text-shadow", "0 0 8px rgba(250,250,250,0.8)");
    $('#menu_container').css({
      "background": "rgba(50,50,50,0.7)",
      "box-shadow": "2px 2px 2px rgba(255,255,255,0.3)"
    });
    break;
  case "red":
    $("html").css({"color": "#fcc", "background": "#222"});
    output.css({
      "background": "#111",
      "box-shadow": "0 0 5px 0px rgba(255,150,150,0.9) inset"
    });
    source.css({
      //"background": "#111",
      "box-shadow": "0 0 5px 0px rgba(255,150,150,0.9) inset"
    });
    $('#JSPad > h1').css("text-shadow", "0 0 8px rgba(250,150,150,0.8)");
    $('#menu_container').css({
      "background": "rgba(50,50,50,0.7)",
      "box-shadow": "2px 2px 2px rgba(255,150,150,0.3)"
    });
    break;
  case "green":
    $("html").css({"color": "#0e0", "background": "#222"});
    output.css({
      "background": "#111",
      "box-shadow": "0 0 5px 0px rgba(150,255,150,0.9) inset"
    });
    source.css({
      //"background": "#111",
      "box-shadow": "0 0 5px 0px rgba(150,255,150,0.9) inset"
    });
    $('#JSPad > h1').css("text-shadow", "0 0 8px rgba(0,250,0,0.8)");
    $('#menu_container').css({
      "background": "rgba(50,50,50,0.7)",
      "box-shadow": "2px 2px 2px rgba(150,255,150,0.3)"
    });
    break;
  case "blue":
    $("html").css({"color": "#ccf", "background": "#222"});
    output.css({
      "background": "#111",
      "box-shadow": "0 0 5px 0px rgba(150,150,255,0.9) inset"
    });
    source.css({
      //"background": "#111",
      color: "#000",
      "box-shadow": "0 0 5px 0px rgba(150,150,255,0.9) inset"
    });
    $('#JSPad > h1').css("text-shadow", "0 0 8px rgba(200,200,250,0.8)");
    $('#menu_container').css({
      "background": "rgba(50,50,50,0.7)",
      "box-shadow": "2px 2px 2px rgba(150,150,255,0.3)"
    });
    break;
  }
  $("html").css("font-size", fontsize + "pt");
  $("#colorout").html($("#color").val());
}


function toggle_menu(f) {
  menu_flag = f;
  if (menu_flag) {
    $("#menu_container").css('display', 'inline-block');
    $("#menu_button").css('background', '#ddf');
  } else {
    $("#menu_container").css('display', 'none');
    $("#menu_button").css('background', '#aac');
  }
}

// Functions ---------------------------------------------------------
function sputs(str) {
  //source.val("" + str);
  //editor.setValue("");
  editor.setValue("" + str, -1);
}
function gets(str,pre) { return prompt(str,pre); }
function getn(str,pre) { return Number(prompt(str,pre)); }
function puts(str) { output.val(output.val() + str + "\n"); }

var interval = false;
function setLoop(proc, wait) {
  interval = setInterval(proc, wait);
}
function clearLoop() {
  clearInterval(interval);
  interval = false;
}

function draw(width, height) {
  canvas.css("display", "inline-block");
  output.css("display", "none");
  if (~~width != 0 && ~~height != 0) {
    canvas.attr("width", width).attr("height", height);
  }
  ctx = canvas[0].getContext("2d");
}

function clear() {
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas[0].width, canvas[0].height);
  ctx.restore();
}

function translate(x, y) {
  ctx.translate(x, y);
}

function rect(x, y, width, height, col, lw) {
  if (x == undefined || y == undefined
      || width == undefined || height == undefined) {
    alert("rect の引数が間違っています。");
  } else {
    ctx.save();
    ctx.strokeStyle = (col != undefined ? col : "#000");
    ctx.lineWidth = (lw != undefined ? lw : 2.0);
    ctx.strokeRect(~~(x - width/2), ~~(y - height/2), ~~width, ~~height);
    ctx.restore();
  }
}
function fillRect(x, y, width, height, col) {
  if (x == undefined || y == undefined
      || width == undefined || height == undefined) {
    alert("fillRect の引数が間違っています。");
  } else {
    ctx.save();
    ctx.fillStyle = (col != undefined ? col : "#000");
    ctx.beginPath();
    ctx.fillRect(~~(x - width/2), ~~(y - height/2), ~~width, ~~height);
    ctx.restore();
  }
}

function fillCircle(x, y, r, col) {
  if (x == undefined || y == undefined || (~~r) == 0) {
    alert("fillCircle の引数が間違っています。");
  } else {
    ctx.save();
    ctx.fillStyle = (col != undefined ? col : "#000");
    ctx.beginPath();
    ctx.arc(~~x, ~~y, ~~r, 0, Math.PI*2, true);
    ctx.fill();
    ctx.restore();
  }
}

function circle(x, y, r, col, lw) {
  if (x == undefined || y == undefined || (~~r) == 0) {
    alert("circle の引数が間違っています。");
  } else {
    ctx.save();
    ctx.strokeStyle = (col != undefined ? col : "#000");
    ctx.lineWidth = (lw != undefined ? lw : 2.0);
    ctx.beginPath();
    ctx.arc(~~x, ~~y, ~~r, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.restore();
  }
}

function text(str, x, y, size, col, lw) {
  ctx.save();
  ctx.font = "normal " + size + "pt sans-serif";
  ctx.lineWidth = (lw != undefined ? lw : 1.0);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = (col != undefined ? col : "#000");
  ctx.strokeText(str, x, y);
  ctx.restore();
}

function fillText(str, x, y, size, col) {
  ctx.save();
  ctx.font = "normal " + size + "pt sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = (col != undefined ? col : "#000");
  ctx.fillText(str, x, y);
  ctx.restore();
}

function line(xy_a, col, lw) {
  ctx.save();
  ctx.strokeStyle = (col != undefined ? col : "#000");
  ctx.lineWidth = (lw != undefined ? lw : 2.0);
  ctx.beginPath();
  ctx.moveTo(xy_a[0][0], xy_a[0][1]);
  for (var i = 0; i < xy_a.length; i++) {
    ctx.lineTo(xy_a[i][0], xy_a[i][1]);
  }
  ctx.stroke();
  ctx.restore();
}

function cycle(xy_a, col, lw) {
  ctx.save();
  ctx.strokeStyle = (col != undefined ? col : "#000");
  ctx.lineWidth = (lw != undefined ? lw : 2.0);
  ctx.beginPath();
  ctx.moveTo(xy_a[0][0], xy_a[0][1]);
  for (var i = 0; i < xy_a.length; i++) {
    ctx.lineTo(xy_a[i][0], xy_a[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function fillCycle(xy_a, col) {
  ctx.save();
  ctx.fillStyle = (col != undefined ? col : "#000");
  ctx.beginPath();
  ctx.moveTo(xy_a[0][0], xy_a[0][1]);
  for (var i = 0; i < xy_a.length; i++) {
    ctx.lineTo(xy_a[i][0], xy_a[i][1]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function image(imagefile, x, y, scale) {
  var sc = (scale != undefined ? scale : 1.0);
  var img = new Image();
  img.src = imagefile;
  img.onload = function() {
    ctx.drawImage(img, x, y, ~~(sc*img.width), ~~(sc*img.height));
  }
}


$(function() {
  init();
  prep();
  wmemo_fall = true;
  wmemo_nmax = 1;
  wmemo_dec = 0.7;
  wmemo_acc = 2;
  wmemo_setup();
});
