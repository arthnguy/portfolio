const container = $('.grid-container')[0];

const cellSize = 12;
const columns = Math.floor(window.innerWidth / cellSize);
const rows = Math.ceil(document.documentElement.scrollHeight / cellSize) + 2;
const totalCells = columns * rows;

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

let lastTime = 0;
const interval = 10;

function createAnimation(run, rise, streak) {
    let lastTime = 0;
    const trailLength = 4;
    const trail = [];

    function animate(timestamp) {
        if (timestamp - lastTime >= interval) {
            const x = Math.round(streak[0]);
            const y = Math.round(streak[1]);
            const index = x + y * columns;

            if (index >= 0 && index < cells.length) {
                cells[index].classList.add("glow");
                trail.push(index);

                // Keep the trail at fixed length
                if (trail.length > trailLength) {
                    const oldIndex = trail.shift();
                    cells[oldIndex]?.classList.remove("glow");
                }
            }

            streak[0] -= run;
            streak[1] += rise;

            lastTime = timestamp;

            // Stop the animation if it goes off screen
            if (streak[1] > rows) {
				const oldIndex = trail.shift();
                cells[oldIndex]?.classList.remove("glow");
				
				if (trail.length == 0)
				{
					streaks = streaks.filter(el => el !== streak);
					return;
				}
            }
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

let currTime = 0;
const spawnTime = 100;

function spawn(timestamp) {
	if (timestamp - currTime >= spawnTime) {
		streaks.push([Math.random() * columns - 1, 0]);
		const angle = Math.random() * Math.PI / 6 + Math.PI / 4;
		createAnimation(Math.cos(angle), Math.sin(angle), streaks[streaks.length - 1]);

		currTime = timestamp;
	}
	
	requestAnimationFrame(spawn);
}

requestAnimationFrame(spawn);