let palette = ['#FF0078', '#8F00FF', '#0027FF', '#00FFF9', '#00FEAB', '#0088FF'] //messing with the palette colors: trying to make the colors more complimentary

let gradients = []
let noiseZs = []
let m
let radius
let seed

const PARAMS = {
	step: 100,
	precision: 100,
	diff: 0.8,
	noiseAmt: 0.9, 
	noiseScale: 5
} //changing amount of noise creates little furball scribble dudes

function setVars() {
	m = floor(min(width, height) * 0.6) // messes with the amount of little dudes
	m = floor(m / PARAMS.step) * PARAMS.step
	radius = PARAMS.step * 0.4 //changes overall size of everything    
	
	gradients = [] 
	noiseZs = []
	
	let i = 0
	for (let x = 0; x < m; x += PARAMS.step) {
		for (let y = 0; y < m; y += PARAMS.step) {
			let gx = random(PARAMS.step * -0.25, PARAMS.step * 0.25) 
			let gy = random(PARAMS.step * -0.25, PARAMS.step * 0.25)
			let gradient = drawingContext.createRadialGradient(gx, gy, 0, gx, gy, PARAMS.step) 

			gradient.addColorStop(0, random(palette))
			gradient.addColorStop(1, random(palette))
			gradients.push(gradient)
			noiseZs[i] = random(100, 500)
			i++
		}
	}
}

function setup() {
	seed = floor(random(1000))
	createCanvas(windowWidth, windowHeight);
	
	noLoop()
	
	setVars()
}

function draw() {
	background(10)
	push() 
	translate((width - m + PARAMS.step) / 2, (height - m + PARAMS.step) / 2)
	noStroke() 
	let i = 0 
	let noiseScale = PARAMS.noiseScaleDenom / radius
	
	for (let x = 0; x < m; x += PARAMS.step) {
		for (let y = 0; y < m; y += PARAMS.step) {
			push() 
			drawingContext.fillStyle = gradients[i]
			translate(x, y) 
			rotate(noise(y + PARAMS.step, x - y) * TWO_PI)
			noisyCircle(radius, noiseZs[i])
			
			noFill()
			stroke(255)
			strokeWeight(2)
			noisyCircle(radius, noiseZs[i] + PARAMS.diff)
			noisyCircle(radius, noiseZs[i] + PARAMS.diff * 2)
			pop()
			
			i++
		}
	}
}

function keyPressed() {
	if (keyCode === 32) {
		noiseSeed(++seed)
		setVars()
		redraw()
	}
}

function windowResized() {
	resizeCanvas(window.innerWidth, window.innerHeight)
	setVars()
	redraw()
}

function noisyCircle(r, noiseZ) {
		beginShape() 
		let angleStep = TWO_PI / PARAMS.precision 
		let noiseAmount = r * PARAMS.noiseAmt
		let noiseScale = PARAMS.noiseScale / r
		for (let i = -1; i <= PARAMS.precision + 1; i++) {
			let angle = angleStep * i 
			let x = cos(angle) * r 
			let y = sin(angle) * r 
			let n = noise(noiseScale * x, noiseScale * y, noiseZ)
			n = map(n, 0, 1, -noiseAmount, noiseAmount)
			curveVertex(x + n, y + n)
		}
		endShape()

}