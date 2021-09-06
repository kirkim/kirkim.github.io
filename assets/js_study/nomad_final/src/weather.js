export default class Weather {
	constructor() {
		this.API_KEY = "bfb1ec7429aee49a725a5c8b7a708115";
		navigator.geolocation.getCurrentPosition(this.onGeoOk, this.onGeoError);
	}

	onGeoOk = (position) => {
		const lat = position.coords.latitude;
		const lon = position.coords.longitude;
		const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const weather = document.querySelector("#weather #wt");
				const city = document.querySelector("#weather #city");
				const temp = document.querySelector("#weather #temp");
				city.innerText = data.name;
				weather.innerText = `${data.weather[0].main}`;
				temp.innerText = `${data.main.temp} ℃`;
		});
	}

	onGeoError = () => {
		alert("Can't find you. No weather for you.");
	}
}
