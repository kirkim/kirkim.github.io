const aa = document.querySelectorAll(".hello");

for(let i = 0; i < aa.length; i++)
{
	function mouseEnterFunc() {
		aa[i].style.color = "#"+(parseInt(Math.random()*0xffffff)).toString(16);
		aa[i].style.fontSize = "300%";
		aa[i].innerText = "Hello Mouse!";
	}
	function mouseLeaveFunc() {
		aa[i].style.color = "#"+(parseInt(Math.random()*0xffffff)).toString(16);
		aa[i].style.fontSize = "200%";
		aa[i].innerText = "@@@@@@@@@@@";
	}
	aa[i].addEventListener("mouseenter", mouseEnterFunc);
	aa[i].addEventListener("mouseleave", mouseLeaveFunc);
}
