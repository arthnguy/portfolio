// Digital rain animation
const container = $(".grid-container");

const cellSize = 12;
let columns = Math.floor($(window).width() / cellSize);
let rows = Math.ceil($(window).height() / cellSize) + 10; // Fixed viewport-based rows
let totalCells = columns * rows;

const cells = [];
let streaks = [];

// Create grid cells with document fragment for better performance
const fragment = document.createDocumentFragment();
for (let i = 0; i < totalCells; i++) {
	const cell = document.createElement("div");
	cell.className = "cell";
	cells.push(cell);
	fragment.appendChild(cell);
}
container[0].appendChild(fragment);

// Add hover effects using event delegation for better performance
container.on("mouseenter", ".cell", function() {
	this.classList.add("glow");
});

container.on("mouseleave", ".cell", function() {
	const cell = this;
	setTimeout(() => {
		cell.classList.remove("glow");
	}, 300);
});

// Animation constants
const INTERVAL = 10;
const TRAIL_LENGTH = 5;
const SPAWN_TIME = 150;

// Use performance.now() for more accurate timing
function createAnimation(run, rise, streak) {
    let lastTime = performance.now();
    const trail = [];
    let isActive = true;

    function animate() {
        if (!isActive) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - lastTime;
        
        if (elapsed >= INTERVAL) {
            let x = Math.round(streak[0]);
            const y = Math.round(streak[1]);
            
            // Wrap x coordinate around screen edges
            if (x < 0) {
                x = columns + x;
            } else if (x >= columns) {
                x = x - columns;
            }
            
            const index = x + y * columns;

            if (index >= 0 && index < cells.length && y >= 0 && y < rows) {
                cells[index].classList.add("glow");
                trail.push(index);

                if (trail.length > TRAIL_LENGTH) {
                    const oldIndex = trail.shift();
                    if (cells[oldIndex]) {
                        cells[oldIndex].classList.remove("glow");
                    }
                }
            }

            // Update position based on actual elapsed time to maintain consistent speed
            const steps = Math.floor(elapsed / INTERVAL);
            streak[0] -= run * steps;
            streak[1] += rise * steps;

            lastTime = currentTime;

            // Clean up when off screen vertically
            if (streak[1] > rows) {
                isActive = false;
                while (trail.length > 0) {
                    const oldIndex = trail.shift();
                    if (cells[oldIndex]) {
                        cells[oldIndex].classList.remove("glow");
                    }
                }
                streaks = streaks.filter(el => el !== streak);
                return;
            }
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// Spawn new streaks with throttling
let lastSpawnTime = performance.now();

function spawn() {
    const currentTime = performance.now();
    
	if (currentTime - lastSpawnTime >= SPAWN_TIME) {
		streaks.push([Math.random() * columns, 0]);
		const angle = Math.random() * Math.PI / 6 + Math.PI / 4;
		createAnimation(Math.cos(angle), Math.sin(angle), streaks[streaks.length - 1]);

		lastSpawnTime = currentTime;
	}
	
	requestAnimationFrame(spawn);
}

requestAnimationFrame(spawn);

// Handle window resize with debouncing
let resizeTimeout;
$(window).on("resize", function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate dimensions
        columns = Math.floor($(window).width() / cellSize);
        const newRows = Math.ceil($(window).height() / cellSize) + 10;
        
        if (newRows !== rows) {
            rows = newRows;
            const newTotalCells = columns * rows;
            
            // Add or remove cells as needed
            if (newTotalCells > totalCells) {
                const fragment = document.createDocumentFragment();
                for (let i = totalCells; i < newTotalCells; i++) {
                    const cell = document.createElement("div");
                    cell.className = "cell";
                    cells.push(cell);
                    fragment.appendChild(cell);
                }
                container.appendChild(fragment);
            } else if (newTotalCells < totalCells) {
                for (let i = totalCells - 1; i >= newTotalCells; i--) {
                    if (cells[i] && cells[i].parentNode) {
                        cells[i].remove();
                    }
                    cells.pop();
                }
            }
            
            totalCells = newTotalCells;
        }
    }, 250);
});

// Smooth scroll for navigation links
$('a[href^="#"]').on("click", function(e) {
    e.preventDefault();
    const $target = $($(this).attr("href"));
    if ($target.length) {
        $("html, body").animate({
            scrollTop: $target.offset().top
        }, 600);
    }
});
