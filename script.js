const container = $('.grid-container')[0];

const cellSize = 12;
const columns = Math.floor(window.innerWidth / cellSize);
const totalCells = columns * 115;
const cells = []

for (let i = 0; i < totalCells; i++) {
	const cell = document.createElement('div');
	cells.push(cell);
	cell.classList.add('cell');

	cell.addEventListener('mouseenter', () => {
		cell.classList.add('glow');
	});

	cell.addEventListener('mouseleave', () => {
		setTimeout(() => {
			cell.classList.remove('glow');
		}, 300);
	});

	container.appendChild(cell);
}

var streaks = []

setInterval(() => {
	streaks.push([Math.random() * columns - 1, 0]);

	const angle = Math.random() * Math.PI / 6 + Math.PI / 4;
	console.log(angle);

	const intervalID = setInterval((run, rise, streak) => {
		cells[Math.round(streak[0]) + Math.round(streak[1]) * columns].classList.add("glow");

		setTimeout((old_x, old_y) => {
			cells[old_x + old_y * columns].classList.remove("glow");
		}, 100, Math.round(streak[0]), Math.round(streak[1]));

		streak[0] -= run;
		streak[1] += rise;

		if (streak[1] > 115)
		{
			streaks = streaks.filter(el => el === streak);
			clearInterval(intervalID);
		}
	}, 30, Math.cos(angle), Math.sin(angle), streaks[streaks.length - 1]);
}, 50)