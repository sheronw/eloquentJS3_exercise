/* 19.2 Efficient Drawing
    author: SheronW
    date: 8/21/2019 */

PictureCanvas.prototype.syncState = function(picture) {
  if (this.picture == picture) return;
  drawPicture(picture, this.dom, scale, this.picture);
  this.picture = picture;
};

function drawPicture(picture, canvas, scale, prevPic) {
  let cx = canvas.getContext("2d");
  if(prevPic == null || picture.width != prevPic.width || picture.height != prevPic.height){
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    prevPic == null;
  }

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      if(prevPic==null || picture.pixel(x, y) != prevPic(x, y)){
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
}

document.querySelector("div")
  .appendChild(startPixelEditor({}));
