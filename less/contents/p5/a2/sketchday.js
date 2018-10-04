/*var cloud1X;
var cloud1Y;
var cloud2X;
var cloud2Y;
var cloud3X;
var xpos;
var speed = 0.5;

function setup(){
    createCanvas(480,380);
}

function draw(){
    background(135,206,250);
    push();
  translate(width*0.5, height*0.5);
  rotate(frameCount / 50.0);
    strokeWeight(4);
    stroke(255,215,0);
    fill(255,255,0);
  polygon(0, 0, 80, 40); 
  pop();
    
    cloud(20,20);//cloud 1
  cloud(200,10);//cloud 2
  cloud(360,30);//cloud 3
    
    //trunk of the tree1
  fill("#846d37");
  stroke("#846d37");
  rect(70,200,10,190);
  fill("rgb(52, 183, 61)");
  stroke("rgb(52, 183, 61)");
  ellipse(70,200,90,100);
    
    //trunk of the tree2
     fill("#846d37");
     stroke("#846d37");
     rect(170,250,10,190);
     fill("rgb(52, 183, 61)");
     stroke("rgb(52, 183, 61)");
     ellipse(170,200,90,100);
    
    //trunk of the tree3
    fill("#846d37");
     stroke("#846d37");
     rect(350,250,10,190);
     fill("rgb(52, 183, 61)");
     stroke("rgb(52, 183, 61)");
     ellipse(350,200,90,100);
    
    //trunk of the tree4
     fill("#846d37");
     stroke("#846d37");
     rect(400,250,10,190);
     fill("rgb(52, 183, 61)");
     stroke("rgb(52, 183, 61)");
     ellipse(400,200,90,100);
    
    
}
function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE); 
}


//Cloud
function cloud(cloudX, cloudY){
    /*xpos = xpos + speed;
    if((xpos > width) || (xpos<0))
        {
            speed = speed * -1;
        }
  stroke("rgba(255, 255, 255, 0.8)");
  fill("rgba(255, 255, 255, 0.8)");
  ellipse(xposcloudX + 35,cloudY + 20,50,40);
  ellipse(cloudX + 55,cloudY + 30,60,30);
  ellipse(cloudX + 60,cloudY + 20,20,20);
  ellipse(cloudX + 15,cloudY + 30,30,20); 
  ellipse(cloudX + 35,cloudY + 35,40,30);   
}*/

var fr = 30;
var x = 1200;
var y = 0;
var rads = 0; // declare variable rads, angle at which sun will rotate
var speedX = 1; //declare variable speedX
var speedY = 1; //declare variable speedY

var color
var ypos=100;
var speed=0.5;
var r;
var g;
var b;
function setup() {
createCanvas(1100,600);
//background(252,240,232);
r = 230;
g = random(100,200);
b = random(100,200);

}

function draw() {
      background(220,250,0);
  color=map(ypos,50,360,255,0);
  background (color);
  fill(253, 184, 19);
  noStroke();
    ypos =ypos+speed;
    if((ypos>height)||(ypos<0))
        {
            speed= speed*-1;
        }
rect(250,ypos,100,100,100);

//draw sun and rays and make them rotate.
/*push();
translate(350,100);
rotate (rads);

for (var d = 0; d < 10; d ++){
noStroke();
fill(206+d,188+d,122+d);
ellipse(0,0,175,175);

stroke(206+d,188+d,122+d);
strokeWeight(3);

for (var i = 0; i < 36; i ++) {
line(0,0,x,y);
rotate(PI/20);

}
}
pop ();

rads = rads + 1.57;*/

//Stars
    
     //Stars 1
    push();
  translate(width*0.25, height*0.19);
  rotate(frameCount / 400.0);
    fill(255,255,255);
  star(0, 0, 2, 10, 3); 
  pop();
    
    //stars 1.5 
    push();
  translate(width*0.8, height*0.017);
  rotate(frameCount / 400.0);
    fill(255,255,255);
  star(0, 0, 2, 10, 3); 
  pop();
    
//star 2
      push();
  translate(width*0.9, height*0.015);
  rotate(frameCount / 400.0);
    fill(255,255,255);
  star(0, 0, 2, 10, 3); 
  pop();
    
    push();
  translate(width*0.4, height*0.015);
  rotate(frameCount / 400.0);
    fill(255,255,255);
  star(0, 0, 2, 10, 3); 
  pop();
    
    //star 3
     push();
  translate(width*0.65, height*0.1);
  rotate(frameCount / 400.0);
    fill(255,255,255);
  star(0, 0, 2, 10, 3); 
  pop();
    
    //star 4
    push();
  translate(width*0.01, height*0.2);
  rotate(frameCount / 400.0);
    fill(255,255,255);
  star(0, 0, 2, 10, 3); 
  pop();

//mountains layer three
stroke(136,167,173);
fill(136,167,173);
beginShape();
vertex(0,600);
vertex(0,400);
vertex(200,300);
vertex(300,350);
vertex(400,250);
vertex(500,325);
vertex(600,100);
vertex(750,200);
vertex(875,60);
vertex(1000,150);
vertex(1100,100);
vertex(1100,600);
endShape();

//mountains layer two
stroke(92,109,120,100);
fill(92,109,120,100);
beginShape();
vertex(0,600);
vertex(0,400);
vertex(275,375);
vertex(350,400);
vertex(425,375);
vertex(575,375);
vertex(800,200);
vertex(900,300);
vertex(1100,250);
vertex(1100,600);
endShape();

//mountains layer three
stroke(92,109,112,200);
fill(92,109,112,200);
beginShape();
vertex(0,600);
vertex(0,550);
vertex(500,400);
vertex(575,425);
vertex(600,400);
vertex(800,400);
vertex(875,300);
vertex(925,375);
vertex(1100,300);
vertex(1100,600);
endShape();

//mountains layer four 
stroke(213,207,225,25);
fill(213,207,225,25);
triangle(0,600,1100,425,1100,600);

//bicycle

stroke(r,g,b,255);
strokeWeight(5);
noFill();

ellipse(225+speedX,520-speedY,100,100); //bike wheel 
ellipse(400+speedX,490-speedY,100,100); //bike wheel
ellipse(225+speedX,520-speedY,10,10); //inner bike wheel
ellipse(400+speedX,490-speedY,10,10); //inner bike wheel
quad(225+speedX,520-speedY,305+speedX,505-speedY,350+speedX,435-speedY,265+speedX,450-speedY); //frame
line(260+speedX,445-speedY,305+speedX,505-speedY); //frame
line(400+speedX,490-speedY,352+speedX,435-speedY); //frame
ellipse(305+speedX,505-speedY,30,30); //frame
quad(250+speedX,450-speedY,245+speedX,440-speedY,275+speedX,440-speedY,275+speedX,445-speedY);

speedX+=map(mouseX,0,width,1,5); //x coordinate of the mouse determine speed of the bike
speedY+=0.25;

}
        
function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


    
