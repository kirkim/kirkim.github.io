export default class Clock {
	constructor(form, text) {
		this.timer;
		this.BASIC_MODE = "basic";
		this.FULL_MODE = "full"
		this.clockForm = document.querySelector(form);
		this.clockText = document.querySelector(text);
		this.clockText.textContent = "00:00:00";
		this.mode(this.BASIC_MODE);
	}

	basic(hours, minutes, seconds) {
		let ap = "AM";
		let aphours = hours;

		if(Number(hours) === 0) {
			aphours = 12;
		} else if(Number(hours) >= 12) {
			ap = "PM";
			if(Number(hours) !== 12) {
				aphours = hours - 12;
			}
		}
		this.clockText.innerText = `${ap} ${aphours}:${minutes}:${seconds}`;
	}

	setTime(type) {
		const now = new Date();
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");

		if (type === this.FULL_MODE) {
			this.clockText.innerText = `${hours}:${minutes}:${seconds}`;
		} else if (type === this.BASIC_MODE) {
			this.basic(hours, minutes, seconds);
		}
	}

	mode(type) {
		clearInterval(this.timer);
			this.setTime(type);
		this.timer = setInterval(() => {
			this.setTime(type);
		})
	}

	handle(checked) {
		if(checked === true) {
			this.mode(this.FULL_MODE);
		} else if(checked === false) {
			this.mode(this.BASIC_MODE);
		}
	}
}




