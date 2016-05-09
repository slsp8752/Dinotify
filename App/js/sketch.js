var img1;

function setup() {
  var body = document.body, html = document.documentElement;
  pageheight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
  canv = createCanvas(windowWidth,pageheight);
  canv.parent("background-sketch");
  frameRate(30);
}

function draw() {
    
  clear();
  imageMode(CORNER);
  
  //image(img1, mouseX, mouseY);
  //noStroke();
  stroke(255);
  strokeWeight(5);
  w = 256;
  h = 256;
  w2 = w/2
  h2 = h/2;
  
  fill(91,50,62,150);
  rect(0, 0, mouseX + w2, mouseY - h2);
  
  fill(168,39,67,150);
  rect(0, mouseY-h2, mouseX-w2, height - (mouseY - h2));

  fill(225,94,50,150);
  rect(mouseX - w2, mouseY + h2, width - (mouseX - w2), height - (mouseY + h2));

  fill(192,210,62,150);
  rect(mouseX + w2, 0, width - (mouseX + w2), mouseY + h2);
}



