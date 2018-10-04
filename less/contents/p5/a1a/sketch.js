function setup() {
  var canvas=createCanvas(500, 400);
 
}

function draw() {
    background(102);
    //Left small screw
    fill(152,251,152);
    ellipse(12,15,20,20);
    fill(0);
     ellipse(12,15,7,7);
    //right topscrew
    fill(152,251,152);
    ellipse(475,15,20,20);
    fill(0);
     ellipse(475,15,7,7);
    
    //down left screw
     fill(152,251,152);
    ellipse(12,375,20,20);
    fill(0);
     ellipse(12,375,7,7);
    
    //down right screw
     fill(152,251,152);
    ellipse(475,375,20,20);
    fill(0);
     ellipse(475,375,7,7);
    
    
     
    
    
    //The pink background
    fill(255,192,203);
    rect(15,35,475,270);
    
  
    
  //black mix tape label
    fill(0);
    rect(30,45,450,60);
    fill(255,255,255);
    textSize(32);
    text("MIX TAPE", 160,85);
    
    //white box 
    fill(211,211,211);
    rect(55,125,375,150);
    

  push();
  translate(width*0.30, height*0.50);
  rotate(frameCount / 100.0);
    //fill(192,192,592,1);
    fill(255,255,255);
  polygon(0, 0, 60, 20); 
  pop();
    //nostroke();
    c=color(255,255,255,105);
    fill(c);
    value= alpha(c);
    fill(value);
      ellipse(150,197,60,60);
    
    //small circle inside
    push();
    stroke(7);
    fill(255,255,255);
  translate(width*0.7, height*0.5);
  rotate(frameCount / -100.0);
  //rotate(frameCount / -120.0);
  polygon(0, 0, 60, 20); 
    pop();
    stroke(3);
    fill(value);
     ellipse(351,197,60,60);
    
    
   /*for (var i = 0; i < 10; i ++) {  //flower design using translate
    ellipse(0, 10, 15, 60);
    rotate(PI/5);
  }
  */

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