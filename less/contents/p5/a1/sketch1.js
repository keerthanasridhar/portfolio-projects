var pointX;
var myPointX=0;
 background(102);

function setup(){
   
   var canvas = createCanvas(1200,1200);
   
    
  
}
function draw(){
    
    print("start a loop");
    fill(143,32,191,10);
    fill("white");
    ellipse(pointX,mouseY,80,80);
    print(pointX);
   if(mouseIsPressed){
        fill(0);
    }else {
        fill(0,0,255);
    }
    strokeWeight(1);
    ellipse(mouseX,mouseY,80,80);
    fill(255,0,255);
    triangle(30, 75, 58, 20, 86, 75);
    }
