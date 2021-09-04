const timer = document.querySelector(".timer");
let temps = [];
let result;

function makeString(temp) {
	if (result === undefined) {
		result = `${temp}`;
	} else {
		result = `${result} ${temp}`;
	}
}

function printRandom(count) {
	if (count <= 0)
		return ;
	while (count-- > 0) {
		const value = Math.ceil(Math.random() * 100);
		temps.push(value);
	}
	temps.forEach(makeString);
	timer.innerText = result;
}

printRandom(10);

