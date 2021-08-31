const aa = document.querySelectorAll(".hello");

function mouseEnterFunc(event) {
  const value = event.target;
  value.style.color = "#" + parseInt(Math.random() * 0xffffff).toString(16);
  value.style.fontSize = "300%";
  value.innerText = "Hello Mouse!";
}
function mouseLeaveFunc(event) {
  const value = event.target;
  value.style.color = "#" + parseInt(Math.random() * 0xffffff).toString(16);
  value.style.fontSize = "200%";
  value.innerText = "@@@@@@@@@@@";
}

Array.from(aa).forEach((a) => {
  a.addEventListener("mouseenter", mouseEnterFunc);
  a.addEventListener("mouseleave", mouseLeaveFunc);
});
