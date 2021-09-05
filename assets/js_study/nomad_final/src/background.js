const images = ["0.jpeg", "1.jpeg", "2.jpeg", "3.jpeg"];

export default class Background {
	constructor() {
		this.chosenImage = images[Math.floor(Math.random() * images.length)];
	}

	loadImg() {
		document.body.style.backgroundImage = `url(./img/${this.chosenImage})`;
	}

	loginImg() {
		document.body.style.backgroundImage = `url(./img/login.jpeg)`;
	}
}
