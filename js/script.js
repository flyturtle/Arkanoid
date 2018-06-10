// inner variables
var canvas, ctx ,r1 ,r2 ,bottom1;

var iStart = 0;
var bRightBut = false;
var bLeftBut = false;
var oBall, oPadd, oBricks;
var aSounds = [];
var iPoints = 0;
var iGameTimer;
var iElapsed = iMin = iSec = 0;
var sLastTime, sLastPoints;
var BrickEmpty = false;




// objects :
function Ball(x, y, dx, dy, r) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
}
function Padd(x, w, h, img) {
    this.x = x;
    this.w = w;
    this.h = h;
    this.img = img;
}
function Bricks(w, h, r, c, p) {
    this.w = w;
    this.h = h;
    this.r = r; // rows
    this.c = c; // cols
    this.p = p; // padd
    this.objs;
    this.colors = ['#6eed34', '#f80207', '#feff01', '#0072ff', '#fc01fc', '#03fe03', '#da571a', '#45efe9','#456258']; // colors for rows
}

// -------------------------------------------------------------
// draw functions :

function clear() { // clear canvas function
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // fill background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() { // main drawScene function
    clear(); // clear canvas

    // draw Ball (circle)
    ctx.fillStyle = '#4def28';
    ctx.beginPath();
    ctx.arc(oBall.x, oBall.y, oBall.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    if (bRightBut)
        oPadd.x += 5;
    else if (bLeftBut)
        oPadd.x -= 5;

    // draw Padd (rectangle)
    ctx.drawImage(oPadd.img, oPadd.x, ctx.canvas.height - oPadd.h);

    // draw bricks (from array of its objects)
    for (i=0; i < oBricks.r; i++) {
        ctx.fillStyle = oBricks.colors[i];
        for (j=0; j < oBricks.c; j++) {
            if (oBricks.objs[i][j] == 1) {
                ctx.beginPath();
                ctx.rect((j * (oBricks.w + oBricks.p)) + oBricks.p, (i * (oBricks.h + oBricks.p)) + oBricks.p, oBricks.w, oBricks.h);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    // collision detection
    iRowH = oBricks.h + oBricks.p;
    iRow = Math.floor(oBall.y / iRowH);
    iCol = Math.floor(oBall.x / (oBricks.w + oBricks.p));

    // mark brick as broken (empty) and reverse brick
    if (oBall.y < oBricks.r * iRowH && iRow >= 0 && iCol >= 0 && oBricks.objs[iRow][iCol] == 1) {
        oBricks.objs[iRow][iCol] = 0;
        oBall.dy = -oBall.dy;
        iPoints++;
   		console.log(iPoints);


        aSounds[0].play(); // play sound
		//brock all bricks and level up
		if ( iRow ==0&& iCol == 0){
		    console.log("Empty");
        BrickEmpty= true;
        console.log("Level up");
        drawScene();

          }
    }

    // reverse X position of ball
    if (oBall.x + oBall.dx + oBall.r > ctx.canvas.width || oBall.x + oBall.dx - oBall.r < 0) {
        oBall.dx = -oBall.dx;
    }

    if (oBall.y + oBall.dy - oBall.r < 0) {
        oBall.dy = -oBall.dy;
    } else if (oBall.y + oBall.dy + oBall.r > ctx.canvas.height - oPadd.h) {
        if (oBall.x > oPadd.x && oBall.x < oPadd.x + oPadd.w) {
            oBall.dx = 10 * ((oBall.x-(oPadd.x+oPadd.w/2))/oPadd.w);
            oBall.dy = -oBall.dy;

            aSounds[2].play(); // play sound
        }
		//ball out of gameground ,stop time and start button can be enable
        else if (oBall.y + oBall.dy + oBall.r > ctx.canvas.height) {
            clearInterval(iStart);
            clearInterval(iGameTimer);



      			//enable all button
      			$('#start').attr("disabled",false);
      			$('#low').attr("disabled", false);
      			$('#high').attr("disabled",false);

            // HTML5 Local storage - save values
            localStorage.setItem('last-time', iMin + ':' + iSec);
            localStorage.setItem('last-points', iPoints);
            time= 0;
            iPoints= 0;



            aSounds[1].play(); // play sound
        }
    }

    oBall.x += oBall.dx;
    oBall.y += oBall.dy;

    ctx.font = '16px Verdana';
    ctx.fillStyle = '#fff';
    iMin = Math.floor(iElapsed / 60);
    iSec = iElapsed % 60;
    if (iMin < 10) iMin = "0" + iMin;
    if (iSec < 10) iSec = "0" + iSec;
    ctx.fillText('Time: ' + iMin + ':' + iSec, 10, 500);
    ctx.fillText('Points: ' + iPoints, 10, 530);

    if (sLastTime != null && sLastPoints != null) {
        ctx.fillText('Last Time: ' + sLastTime, 600, 500);
        ctx.fillText('Last Points: ' + sLastPoints, 600, 530);
    }
}


// initialization
$( document ).ready(start1);

function start1(){
	$('#start').click(game);
}

function game(){
  BrickEmpty= false;
	$('#start').attr("disabled",true);
	$('#low').attr("disabled", true);
	$('#high').attr("disabled",true);

    canvas = document.getElementById('scene');
	   r1 = document.getElementById('low');
     r2 = document.getElementById('high');
    ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    var padImg = new Image();
    padImg.src = 'images/padd.png';
    //padImg.onload = function() {};
	   oPadd = new Padd(width / 2, 120, 20, padImg); // new padd object

    oBall = new Ball(width / 2, 550, 0.5, -5, 10);

    //function Bricks(w, h, r, c, p)
    var widthBrick = [(width / 2) - 1,(width / 5) - 1,(width / 8) - 1,(width / 11) - 1];
    var heightBrick = [20];
    var rowsBrick =[2,4,6,8,10];
    var colsBrick=[8,10,12,14];
    console.log(widthBrick[0]);

	   if(r1.checked==true)
	    {
		oBricks = new Bricks(widthBrick[0], heightBrick[0], rowsBrick[0], colsBrick[0], 2); // new bricks object
	}else if(r2.checked==true)
	{
		oBricks = new Bricks(widthBrick[2], heightBrick[0], rowsBrick[2], colsBrick[2], 2); // new bricks object
	}
    oBricks.objs = new Array(oBricks.r); // fill-in bricks
	for (i=0; i < oBricks.r; i++) {
		oBricks.objs[i] = new Array(oBricks.c);
		for (j=0; j < oBricks.c; j++) {
			oBricks.objs[i][j] = 1;
		}
	}




    aSounds[0] = new Audio('media/snd1.wav');
    aSounds[0].volume = 0.9;
    aSounds[1] = new Audio('media/snd2.wav');
    aSounds[1].volume = 0.9;
    aSounds[2] = new Audio('media/snd3.wav');
    aSounds[2].volume = 0.9;

    iStart = setInterval(drawScene, 10); // loop drawScene
    iGameTimer = setInterval(countTimer, 1000); // inner game timer

    // HTML5 Local storage - get values
    sLastTime = localStorage.getItem('last-time');
    sLastPoints = localStorage.getItem('last-points');


    $(window).keydown(function(event){ // keyboard-down alerts
        switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = true;
                break;
            case 39: // 'Right' key
                bRightBut = true;
                break;
        }
    });
    $(window).keyup(function(event){ // keyboard-up alerts
        switch (event.keyCode) {
            case 37: // 'Left' key
                bLeftBut = false;
                break;
            case 39: // 'Right' key
                bRightBut = false;
                break;
        }
    });

    var iCanvX1 = $(canvas).offset().left;
    var iCanvX2 = iCanvX1 + width;
    $('#scene').mousemove(function(e) { // binding mousemove event
        if (e.pageX > iCanvX1 && e.pageX < iCanvX2) {
			//oPadd.x = e.pageX - iCanvX1- (oPadd.w/2);
            oPadd.x = Math.max(e.pageX - iCanvX1 - (oPadd.w/2), 0);
            oPadd.x = Math.min(ctx.canvas.width - oPadd.w, oPadd.x);
        }
    });
};

function countTimer() {
    iElapsed++;
}
