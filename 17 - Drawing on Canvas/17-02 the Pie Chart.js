/* 17.2 the Pie Chart
    author: SheronW
    date: 7/30/2019 */

let cx = document.querySelector("canvas").getContext("2d");
let total = results
  .reduce((sum, {count}) => sum + count, 0);
let currentAngle = -0.5 * Math.PI;
let centerX = 300, centerY = 150;
cx.font = "20px Georgia";
cx.textAlign = "center";

for (let result of results) {
  let sliceAngle = (result.count / total) * 2 * Math.PI;
  cx.beginPath();
  cx.arc(centerX, centerY, 100,
         currentAngle, currentAngle + sliceAngle);
  currentAngle += sliceAngle;
  cx.lineTo(centerX, centerY);
  cx.fillStyle = result.color;
  cx.fill();
  cx.fillStyle = "black";
  let textX = centerX+Math.cos(currentAngle-sliceAngle/2)*100;
  let textY = centerY+Math.sin(currentAngle-sliceAngle/2)*100;
  cx.fillText(results.name, textX, textY);
}
