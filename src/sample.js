// JSPad サンプルプログラム
/*
  Author: M. Bando <bando@ktc.ac.jp>
  Last modified: Tue 22 Aug 2017 14:04:41 JST
*/

var sample = {
  blank: [
function() {
  
}
  ],
  normal: {
    // Basic ----------------------------------------
    basic: [
      // 0
      // ただの出力。
      // 何を入れても文字列に変換されて出力される。
function() {
  puts("こんにちは");
},

      // 1
      // 変数の宣言と使用。
      // 宣言時は型に依らず「var」をつける。
      // 「+」使用時の動作は良しなにしてくれる。
function() {
  var a = 3;
  var b = 5;
  var c = a + b;
  puts("答えは" + c + "です。");
},

      // 2
      // ユーザ入力。
      // gets で文字列を取得できる。引数がポップアップのメッセージになる。
function() {
  var name = gets("名前を入力してください。");
  puts("ようこそ、" + name + "さん。");
},

      // 3
      // ユーザ入力その2。
      // getn で数値を取得できる。引数がポップアップのメッセージになる。
function() {
  var a = getn("1つ目の数を入力してください。");
  var b = getn("2つ目の数を入力してください。");
  puts("答えは" + (a + b) + "です。");
}
    ],

    // Advanced -----------------------------------------------
    advanced: [
      // 0
      // for文。
function() {
  for (var i=1; i <= 10; i++) {
    puts(i);
  }
},

      // 1
      // 偶数判定。
function() {
  for (var i=1; i <= 10; i++) {
    if (i % 2 == 0) { puts(i + "は偶数です。"); }
  }
},

      // 2
function() {
  for (;getn("12かける3は？") != 36;) { puts("不正解です"); }
  puts("正解！");
}
    ]
  },

  // Canvas ===================================================
  // draw(width, height) を呼ぶと、お絵描きモードになる。
  // widthとheightには横幅と縦幅を入れる。
  // 座標は左上が (0, 0)。
  // 色は16進数で、#RRGGBB や #RGB のように指定する(CSSと同様)。

  canvas: {
    // Basic ----------------------------------------
    basic: [
      // 0
      // 四角を描く。
      // rectは塗り潰しなし、fillRectは塗り潰しあり。
      // 座標は中心の座標を指定する。
      // 引数は (x座標, y座標, 横幅, 縦幅, 色)。
      // rect は、最後に線の太さを指定可能 (デフォルトは2)。
function() {
  draw(300, 300);
  rect(100, 100, 150, 150, "#ff0000");
  fillRect(200, 200, 150, 150, "#0000ff");
  rect(250, 50, 50, 50, "#ff0000", 6);
},

      // 1
      // 円を描く。
      // circleは塗り潰しなし、fillCircleは塗り潰しあり。
      // 座標は中心の座標を指定する。
      // 引数は (x座標, y座標, 半径, 色)。
      // circle は、最後に線の太さを指定可能 (デフォルトは2)。
function() {
  draw(300, 300);
  circle(100, 100, 85, "#ff0000");
  fillCircle(200, 200, 85, "#0000ff");
  circle(250, 50, 25, "#ff0000", 6);
},

      // 2
      // 線と文字列を描く。
      // line([[x1, y1], [x2, y2], ...], 色) で (x1, y1)--(x2, y2)... の線を引く。
      // cycle([[x1, y1], [x2, y2], ...], 色) で閉じたパスを描く。
      // fillCycle([[x1, y1], [x2, y2], ...], 色) で閉じたパスを塗り潰す。
      // text("文字列", x, y, サイズ, 色) で、(x, y) に文字列を描く。
      // text は塗り潰しなし、fillTextは塗り潰しあり。
      // line, cycleとtextは、最後に線の太さを指定可能 (デフォルトはそれぞれ2, 2と1)。
function() {
  draw(300, 300);
  line([[50, 50], [250, 250]], "#000000");
  cycle([[100, 30], [150, 80], [200, 20]], "#000000");
  fillCycle([[20, 250], [80, 230], [120, 270], [60, 290]], "#0000ff");
  text("文字列", 200, 100, 24, "#000000");
  fillText("もじれつ", 100, 200, 20, "#000000");
},

      // 3
      // 透過。
      // 色の指定で、#RRGGBBAA のように透明度(AA)を指定できる。
function() {
  draw(300, 300);
  fillCircle(150, 100, 85, "#ff000060");
  fillCircle(100, 200, 85, "#00ff0060");
  fillCircle(200, 200, 85, "#0000ff60");
},

      // 4
      // 画像の読み込み
      // image(画像ファイル, x, y, スケール) で、画像を表示できる。
      // xとyは画像の左上の位置。scaleは指定しなければ1になる。
function() {
  draw(300, 300);
  image("sampleimage.png", 30,30, 0.8);
}
    ],

    // Canvas Advanced -----------------------------------
    advanced: [
      // 0
      // for文を使って絵を描く。
      // output.show() で、お絵描き中でもputsの出力が表示できる。
function() {
  draw(400, 400);
  output.show();
  for (var y = 50; y <= 350; y += 100) {
    for (var x = 50; x <= 350; x += 100) {
      fillCircle(x, y, 26, "#0000ff66");
      fillCircle(x+20, y+20, 26, "#ff000066");
      fillCircle(x-20, y+20, 26, "#00ff0066");
      puts("x=" + x + ", y = " + y);
    }
  }
},

      // 1
function() {
  draw(300, 300);
  fillCircle(150, 150, 100, "#6666ff");
  for (var r = 101;r -= 2;) {
    circle(150, 150, r, "rgba(0,0,0," + (r/140) + ")", 2);
  }
}
    ],

    // Canvas Animation ------------------------------
    anime: [
      // 0
      // 四角が動く。
      // setLoop(関数, 間隔(ミリ秒)) で、等間隔で関数を実行する。
function() {
  draw(300, 300);
  var i = 5;
  setLoop(function() {
    clear();
    fillRect(4*i, 4*i, 40, 40, "#9999ff");
    i++;
  }, 40);
},

      // 1
      // 四角がキャンバス内で動く。
      // 壁に当たると跳ね返る。
      // clear() の替わりに半透明のfillRectを使うと、残像が残る。
function() {
  draw(300, 300);
  var i = 6;
  var x = 150, y = 100;
  var vx = 4, vy = 6;
  setLoop(function() {
    fillRect(150, 150, 300, 300, "#ffffff60");
    x += vx;
    y += vy;
    fillRect(x, y, 40, 40, "#9999ff");
    if (x <= 20 || x >= 280) {
      vx = -vx;
    }
    if (y <= 20 || y >= 280) {
      vy = -vy;
    }
    i++;
  }, 40);
},

      // 2
      // 時計
function() {
  draw(400, 400);
  translate(200, 200);
  var i = 0;
  setLoop(function() {
    clear();
    fillRect(0,0,400, 400, "#000");
    fillCircle(0, 0, 150, "#ddd");
    circle(0, 0, 150, "#777", 6);
    for (var h = 1; h <= 12; h++) {
      fillText(h, 130*Math.cos(Math.PI*(0.5 - h/6)),
               -130*Math.sin(Math.PI*(0.5 - h/6)), 14, "#000");
    }
    line([[0, 0],
          [90*Math.cos(Math.PI/2 - i/100),
           -90*Math.sin(Math.PI/2 - i/100)]],
         "#0000ff66", 12);
    line([[0, 0],
          [110*Math.cos(Math.PI/2 - 12*i/100),
           -110*Math.sin(Math.PI/2 - 12*i/100)]],
         "#ff000066", 6);
    fillCircle(0, 0, 6, "#000");
    i++;
  }, 40);
}
    ],


    // Misc (sample9*)  ----------------------------------------
    misc: [
      // 0
      // じゃばすくりぷと
function() {
  var eye = [30, 25];
  var mouse = [[125, 230], [150, 228], [140, 250]];
  var body = [[130, 255], [130, 310], [170, 310], [150, 255]];
  var voice = [30, 30], lc = "#444", lw = 4;
  draw(300, 300);
  // head
  fillRect(130, 205, 140, 100, "#ffdfc9");
  rect(130, 205, 140, 100, lc, lw);
  line([[120+eye[0], 190], [120+eye[0], 190+eye[1]]], lc, lw);
  line([[120-eye[0], 190], [120-eye[0], 190+eye[1]]], lc, lw);
  fillCycle(mouse, "#ff919e");
  cycle(mouse, lc, lw);
  // body
  fillCycle(body, "#aaa");
  cycle(body, lc, lw);
  // voice
  line([[50, 135], [50 - voice[0], 135 - voice[1]]], "#000", 2);
  line([[210, 135], [210 + voice[0], 135 - voice[1]]], "#000", 2);
  fillText("じゃばすくりぷと", 130, 120, 16, "#000");
},

      // 1
      // じゃばすくりぷと！
function() {
  var eye = [30, 25];
  var mouse = [[125, 230], [150, 228], [140, 250]];
  var body = [[130, 255], [130, 310], [170, 310], [150, 255]];
  var voice = [30, 30], lc = "#444", lw = 4, i = 0;
  draw(300, 300);
  setLoop(function() {
    clear();
    if (i == 0) {
      translate(0, 200);
    } else if (i < 101) {
      translate(0, -2);
    }
    i = (i + 1) % 150;
    // head
    fillRect(130, 205, 140, 100, "#ffdfc9");
    rect(130, 205, 140, 100, lc, lw);
    line([[120+eye[0], 190], [120+eye[0], 190+eye[1]]], lc, lw);
    line([[120-eye[0], 190], [120-eye[0], 190+eye[1]]], lc, lw);
    fillCycle(mouse, "#ff919e");
    cycle(mouse, lc, lw);
    // body
    fillCycle(body, "#aaa");
    cycle(body, lc, lw);
    // voice
    if (i > 101) {
      line([[50, 135], [50 - voice[0], 135 - voice[1]]], "#000", 2);
      line([[210, 135], [210 + voice[0], 135 - voice[1]]], "#000", 2);
      fillText("じゃばすくりぷと", 130, 120, 16, "#000");
    }
  }, 40);
}
    ]
  }
};





