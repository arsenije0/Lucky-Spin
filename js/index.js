let mainContainer = idCatch("main-container");
let controlBoard = idCatch("control-board");
let start = idCatch("start-two");
let score = idCatch("score-p");
let winings = idCatch("winings-p");
let restart = idCatch("restart");
let left = idCatch("left");
let right = idCatch("right");
let pathNumber = idCatch("path-number");
let report = idCatch("report");
let isItMoving = false;
let animationControl = false;
let maxTop = 450;
let cardHeight = 150;
let reel = [];
let data = [];
let stripes = [];
let dataForAnimation = [];
let animaElCount = 0;

//Names of classes that define stripes
let cardClass = ["gold", "gold gold2", "gold gold3", "circle", "circle circle2",
	"circle circle3", "square", "square square2", "square square3", "triangle",
	"triangle triangle2", "triangle triangle3", "wildcard"];

//Capturing reel and stripes ids
for (let j = 0; j < 5; j++) {

	let temp = [];
	for (let i = 0; i < 4; i++) {
		temp[i] = idCatch("reel-" + (j + 1) + "-card-" + (i + 1));
		temp[i].style.top = (cardHeight * (i - 1)) + "px";
	}

	reel[j] = temp;
}

for (let j = 0; j < 5; j++) {

	let temp = [];

	for (let i = 0; i < 4; i++) {
		temp[i] = idCatch("shape" + (j + 1) + (i));
	}

	stripes[j] = temp;
}

//Spin button event
start.addEventListener("click", () => {

	if (betAmount > 0) {

		if (isItMoving == false) {

			if (tba > 0) {

				animationControl = true;
				hideAllLines(path);
				win = 0;
				winings.innerHTML = win;
		
				if (dataForAnimation.length > 0) {
		
					for (let i = 0; i < dataForAnimation.length; i++) {
						for (let j = 0; j < dataForAnimation[i][0].length; j++) {
							dataForAnimation[i][0][j].style.borderColor = "transparent";
							dataForAnimation[i][0][j].style.zIndex = 0;
						}
					}
				}
		
				reelMovement(reel, 0);
			}
		}
	} 
});

//Restart button event
restart.addEventListener("click", (data) => {

	if (isItMoving == false) {

		report.style.height = "200px";
		displayNone(report);
		betAmount = 10;
		win = 0;
		myScore = 470;
		animationControl = true;
		tba = 0;
		totalBetAmount.innerHTML = tba;
		maxLineBet = 3;
		betLineNumber.innerHTML = maxLineBet;

		for (let i = 0; i < dataForAnimation.length; i++) {
			for (let j = 0; j < dataForAnimation[i][0].length; j++) {
				dataForAnimation[i][0][j].style.borderColor = "transparent";
				dataForAnimation[i][0][j].style.zIndex = 0;
			}
		}

		hideAllLines(path);	
		betAmountDiv.innerHTML = betAmount;
		winings.innerHTML = win;
		score.innerHTML = myScore + "$";

		initiateIntro();
	}
});

//Function that checks if some class name is == to an element from cardHolder
function cardSearch(x, cardHolder) {

	let ind = null;

	for (let i = 0; i < cardHolder.length; i++) {

		let temp = "shape " + cardHolder[i];

	 	if (temp == x) {
	 		ind = i;
	 		break;
	 	}
	} 

	return ind;
}

//Initial random stripes
for (let j = 0; j < 5; j++) {

	for (let i = 0; i < 4; i++) {
		let s = cardClass[Math.round(Math.random()*12)];
		if (s == "wildcard") {
			stripes[j][i].innerHTML = "WILDCARD";
		}
		stripes[j][i].setAttribute("class", "shape " + s);
	}
}

/*==============================================================*/ 

//Reel animation, main part of the game

function reelMovement(x, n) {

	let y = n;
	let analysis;

	if (y == 4) {
		analysis = true;
	} else {
		analysis = false;
	}

	startMoving(x[y], analysis);
	y += 1;

	if (y < 5) {
		setTimeout(() => reelMovement(x, y), 400);
	} 
}

function startMoving(icons, analysis) {

	let m = setInterval(() => move(icons), 20);
	let stageOneIncrement = 10;
	let counter = 0;
	let blur = 1;
	let boo = 1;
	let n = 1;
	isItMoving = true;

	function move(icons) {

		for (let i = 0; i < icons.length; i++) {
			if (parseInt(icons[i].style.top) < maxTop) {
				icons[i].style.top = parseInt(icons[i].style.top) 
									+ stageOneIncrement + "px"; 
			} else {
				icons[i].style.top = ((-1)*cardHeight) + stageOneIncrement
								 + "px";
			}
		}

		counter++;

		if (counter > 8) {
			if (boo <= 7) {
				for (let i = 0; i < icons.length; i++) {
					icons[i].style.filter = "blur(" + blur + "px)";
				}

				if (boo == 7){
					for (let i = 0; i < 3; i++) {
						let s = cardClass[Math.round(Math.random()*12)];
						if (s == "wildcard") {
							icons[i].children[0].innerHTML = "WILDCARD";
						} else {
							icons[i].children[0].innerHTML = "";
						}
						icons[i].children[0].setAttribute("class", 
							"shape " + s);
    				}
				}

				counter = 0;
				blur++;
				boo++;
				clearInterval(m);
				m = setInterval(() => move(icons), 20 - (boo*2));
			}
		}

		if ((boo > 7) && (counter > 400)) {

			clearInterval(m);

			for (let i = 0; i < icons.length; i++) {
				icons[i].style.top = (cardHeight * i) + "px";
				icons[i].style.filter = "blur(0px)";
			}

			m = setInterval(() => halt(icons), 20);
			
			let c = 1;
			let b = 0;
			let par = 6;

			//Function that performs stop animation and analysis of the game
			function halt(icons) {

				if (b > 2) {

					clearInterval(m);

					//Analysis of data...

					if (analysis == true) {

						data.length = 0;

						for (let i = 0, n = 0; i < path.length; i++) {
							let a = lineAnalysis(stripes, path[i]);

							if (a != false) {
								data[n] = [a[0], i, a[1]];
								n++;
							}
						}

						console.log(data);

						animaElCount = 0;
						dataForAnimation.length = 0;

						let lost = 0;
						let animaGo = false;

						//Financial aspect...

						for (let i = 0; i < data.length; i++) {
							if (data[i][1] < maxLineBet) {
								win += betAmount *
									pay[cardSearch(data[i][2], cardClass)][data[i][0].length-2];
								

								let temp = [];
								for (let j = 0; j < data[i][0].length; j++) {
									temp[j] = data[i][0][j].parentElement;
								}

								dataForAnimation[animaElCount] = [temp, data[i][1]];
								animaElCount++;
							}
						}

						if ((win - tba) < 0) {
							{
								displayBlock(report);
								report.style.opacity = 1;
								report.children[0].innerHTML = "YOU LOST:";
								report.children[1].innerHTML = (tba - win);
								report.children[2].innerHTML = "Winnings: " + win;
								report.children[3].innerHTML = "Your bet: " + tba;
								setTimeout(() => {
									opacityDecrease(report);
								}, 3000);
							}
							lost = (tba - win);

						} else {
							{
								displayBlock(report);
								report.style.opacity = 1;
								report.style.boxShadow = "0px 0px 59px 38px silver";
								report.children[0].innerHTML = "YOU WON:";
								report.children[1].innerHTML = (win - tba);
								report.children[2].innerHTML = "Winnings: " + win;
								report.children[3].innerHTML = "Your bet: " + tba;
								setTimeout(() => {
									setTimeout(() => {
										report.style.boxShadow = "none";
									}, 1000);									
									opacityDecrease(report);
								}, 3000);
							}
							win = win - tba;
						}

						if (lost == 0) {
							winings.innerHTML = win;
							myScore += win + tba;
							score.innerHTML = myScore + "$";
							animaGo = true;
						} else {
							win = 0;
							winings.innerHTML = win;
							myScore = myScore + tba - lost;
							score.innerHTML = myScore + "$";
							animaGo = false;
						}

						if (myScore - tba < 0) {
							betAmount = 0;
						}

						tba = maxLineBet * betAmount;
						totalBetAmount.innerHTML = tba;
						betAmountDiv.innerHTML = betAmount;
						myScore -= tba;
						score.innerHTML = myScore + "$";

						if ((myScore <= 0) && (betAmount == 0)) {

							report.children[0].innerHTML = "";
							report.children[1].innerHTML = "GAME OVER";
							report.children[2].innerHTML = "";
							report.children[3].innerHTML = "";
							report.style.height = "90px";
						}
						

						analysis = false;
						isItMoving = false;
						animationControl = false;

						//Win animation

						if ((dataForAnimation.length > 0) && (animaGo == true)) {
							winAnima(dataForAnimation, dataForAnimation.length - 1);
						}

						function winAnima(data, par) {

							if ((par >= 0) && (animationControl == false)) {

								for (let j = 0; j < data[par][0].length; j++) {

									if (data[par][1]%3 == 1) {
										data[par][0][j].style.borderColor = "#f74a52";
										data[par][0][j].style.outlineColor = "brown";
									} else if (data[par][1]%3 == 2) {
										data[par][0][j].style.borderColor = "#b6beef";
										data[par][0][j].style.outlineColor = "aqua";
									} else {
										data[par][0][j].style.borderColor = "yellow";
										data[par][0][j].style.outlineColor = "orange";
									}
									data[par][0][j].style.zIndex = 10;
									showLine(path, data[par][1]);
								};

								setTimeout(() => {

									for (let j = 0; j < data[par][0].length; j++) {
										data[par][0][j].style.borderColor = "transparent";
										data[par][0][j].style.outlineColor = "darkgreen";
										data[par][0][j].style.zIndex = 0;
										hideAllLines(path);
									}
									par--;
									winAnima(data, par);
								}, 1200);

							} else if ((par < 0) && (animationControl == false)){
								winAnima(data, data.length - 1);
							}
						} 
					}

				} else { 

					if (c < 6) {

						for (let i = 0; i < icons.length; i++) {
							icons[i].style.top = parseInt(icons[i].style.top)
												+ par + "px";
						}

					} else {

						for (let i = 0; i < icons.length; i++) {
							icons[i].style.top = parseInt(icons[i].style.top)
												- par + "px";
						}

						if (c == 10) {
							c = 0;
							b++;
							par = 3;
						}
					}

					c++;
				}
			}
		}
	}
}

/*=================================================================*/

//Path for lines
let path = [
	[1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0],
	[2, 2, 2, 2, 2],
	[0, 1, 2, 1, 0],
	[2, 1, 0, 1, 2],
	[0, 0, 1, 2, 2],
	[2, 2, 1, 0, 0],
	[1, 0, 1, 2, 1],
	[1, 2, 1, 0, 1]
];

//Rewards for wining
let pay = [
	[10, 200, 2000, 10000],
	[2, 25, 100, 750],
	[2, 25, 100, 750],
	[2, 15, 100, 400],
	[2, 10, 75, 250],
	[2, 10, 50, 250],
	[2, 10, 50, 125],
	[2, 5, 50, 100],
	[2, 5, 25, 100],
	[2, 5, 25, 100],
	[2, 5, 25, 100],
	[2, 5, 25, 100]
];

/*==============================================================*/

//Functions that perform analysis
function lineAnalysis(stripes, path) {

	let temp = [];
	for (let i = 0; i < stripes.length; i++) {
		temp[i] = stripes[i][path[i]];
	}

	let arr = reelRowAnalysis(temp);
	let result = arr[0];
	let symbol = arr[1];

	if (result > 1) {

		temp.length = result;
		return [temp, symbol];

	} else {
		return false;
	}
}

function reelRowAnalysis(x) {

	let counter = 0;
	let symbol = false;
	let T = x[0].className;

	for (let i = 0; i < x.length; i++) {
		
		if ((symbol == false) && (x[i].className != "shape wildcard")) {
			symbol = x[i].className;
		}

		if ((T == x[i].className) 
			|| (x[i].className == "shape wildcard")) {

			if (T == "shape wildcard") {
				T = x[i + 1].className;
			}

			counter++;

		} else {
			break;
		}
	}

	return [counter, symbol];
}

/*============================================================*/

//Functions that draw betting lines

function drawPath(reel, path, cl, clTwo) {

	for (let i = 0; i < reel.length - 1; i++) {
		
		if (path[i] == path[i + 1]) {
    		createLines(i, path, cl, mainContainer, i);
    		createLines(i, path, clTwo, mainContainer, i + "-2");
		
		} else if (path[i] < path[i + 1]) {

			createSlopedLines(i, path, cl, mainContainer, i, "45", 1);
			createSlopedLines(i, path, clTwo, mainContainer, i + "-2", "45", 1);

		} else {

			createSlopedLines(i, path, cl, mainContainer, i, "-45", 0);
			createSlopedLines(i, path, clTwo, mainContainer, i + "-2", "-45", 0);
		}
	}
}

function createLines(i, path, cl, parent, ID) {

	let element = document.createElement("div");
    element.setAttribute("class", cl);
    element.setAttribute("id", "[" + path.toString()
    		 + "]" + ID);
    parent.appendChild(element);

    idCatch("[" + path.toString() + "]" + ID).style.top = 
    		(path[i]*2 + 1)*75 + "px";
    idCatch("[" + path.toString() + "]" + ID).style.width = "150px";
    idCatch("[" + path.toString() + "]" + ID).style.left = 
    		(i*2 + 1)*75 + "px";
}

function createSlopedLines(i, path, cl, parent, ID, angle, par) {

	let element = document.createElement("div");
    element.setAttribute("class", cl);
    element.setAttribute("id", "[" + path.toString()
    		 + "]" + ID);
    parent.appendChild(element);

    idCatch("[" + path.toString() + "]" + ID).style.transform = 
    		"rotate(" + angle + "deg)";
    idCatch("[" + path.toString() + "]" + ID).style.top = 
    		(150 * (path[i] + par)) + "px";
    //pythagoras...
    idCatch("[" + path.toString() + "]" + ID).style.width = "212px";
    idCatch("[" + path.toString() + "]" + ID).style.left = 
    		(40 + 150 * i) + "px";
}

//Calling functions....
for (var i = 0; i < path.length; i++) {

	if (i%3 == 1) {
		drawPath(reel, path[i], "path-cl", "path-cl-2");
	} else if (i%3 == 2){
		drawPath(reel, path[i], "path-cl path-cl-3", "path-cl-2 path-cl-4");
	} else {
		drawPath(reel, path[i], "path-cl path-cl-5", "path-cl-2 path-cl-6");
	}
}

/*==================================================================*/

//Functions that control display of lines

let lineFactor = 0;
pathNumber.innerHTML = lineFactor;

function linesOn(path) {
	lineFactor++;
	pathNumber.innerHTML = lineFactor;
	for (let i = lineFactor-1; i < lineFactor; i++) {

		if (lineFactor == 10) {
			lineFactor--;
			pathNumber.innerHTML = lineFactor;
			break;
		}

		for (let j = 0; j < path[i].length - 1; j++) {
			displayBlock(idCatch("[" + path[i].toString() + "]" + j));
			displayBlock(idCatch("[" + path[i].toString() + "]" + j + "-2"));
		}
	}
}

function linesOff(path) {

	if (lineFactor > 0) {
		for (var i = lineFactor - 1; i < lineFactor; i++) {
	
			for (let j = 0; j < path[i].length - 1; j++) {
				displayNone(idCatch("[" + path[i].toString() + "]" + j));
				displayNone(idCatch("[" + path[i].toString() + "]" + j + "-2"));
			}
			lineFactor--;
			pathNumber.innerHTML = lineFactor;
		}
	}
}

function hideAllLines(path) {

	for (let i = 0; i < path.length; i++) {
		for (let j = 0; j < path[i].length - 1; j++) {
			displayNone(idCatch("[" + path[i].toString() + "]" + j));
			displayNone(idCatch("[" + path[i].toString() + "]" + j + "-2"));
		}
	}

	lineFactor = 0;
	pathNumber.innerHTML = lineFactor;
}

function showLine(path, ind) {
	for (let j = 0; j < path[ind].length - 1; j++) {
		displayBlock(idCatch("[" + path[ind].toString() + "]" + j));
		displayBlock(idCatch("[" + path[ind].toString() + "]" + j + "-2"));
	}
}

//Buttons for hiding/showing lines

right.addEventListener("click", () => {
	if (isItMoving == false) {
		linesOn(path);
	}
});

left.addEventListener("click", () => {
	if (isItMoving == false) {
		linesOff(path);
	}
});

/*===============================================================*/

//Finacial aspect

let win = 0;
let myScore = 470;
let maxLineBet = 3;
let betAmount = 10;

let betAmountDiv = idCatch("bet-amount");
let upBet = idCatch("up-bet");
let downBet = idCatch("down-bet");
let totalBetAmount = idCatch("total-bet-amount");


score.innerHTML = myScore + "$";
let tba = maxLineBet * betAmount;
totalBetAmount.innerHTML = tba;
betAmountDiv.innerHTML = 10;

//Buttons
upBet.addEventListener("click", betUp);
downBet.addEventListener("click", betDown);

//Functions for increasing/decreasing bet amount
function betUp() {

	if (isItMoving == false){
		if ((betAmount < 50) && (myScore > 0)) {
			if ((myScore - (10*maxLineBet)) >= 0) { 
				betAmount += 10;
				betAmountDiv.innerHTML = betAmount;
	
				tba = maxLineBet * betAmount;
				totalBetAmount.innerHTML = tba;
	
				myScore -= 10 * maxLineBet;
				score.innerHTML = myScore + "$";
			}
		}
	}
}

function betDown() {

	if (isItMoving == false) {
		if (betAmount > 0) {

			betAmount -= 10;
			betAmountDiv.innerHTML = betAmount;

			tba = maxLineBet * betAmount;
			totalBetAmount.innerHTML = tba;

			myScore += 10 * maxLineBet;
			score.innerHTML = myScore + "$";
		}
	}
}

/*===========================================================*/ 

//Functions for the control of number of active beting lines

let upLine = idCatch("up-line");
let downLine = idCatch("down-line");
let betLineNumber = idCatch("bet-line-number");

betLineNumber.innerHTML = maxLineBet;

//Buttons
upLine.addEventListener("click", BettingLinesPlus);
downLine.addEventListener("click", BettingLinesMinus);

function BettingLinesPlus() {
	
	if ((isItMoving == false) && (myScore > 0)) {
		if (parseInt(betLineNumber.innerHTML) < 9) {
			if (myScore - betAmount >= 0) {
				maxLineBet++;
				betLineNumber.innerHTML = maxLineBet;
	
				tba = maxLineBet * betAmount;
				totalBetAmount.innerHTML = tba;
	
				myScore -= betAmount;
				score.innerHTML = myScore + "$";
			}
		} 
	}
}

function BettingLinesMinus() {

	if (isItMoving == false) {
		if (parseInt(betLineNumber.innerHTML) > 0) {
			maxLineBet--;
			betLineNumber.innerHTML = maxLineBet;

			tba = maxLineBet * betAmount;
			totalBetAmount.innerHTML = tba;

			myScore += betAmount;
			score.innerHTML = myScore + "$";
		}
	}
}

/*============================================================*/

//Intro loader

let intro = idCatch("intro");
intro.style.opacity = 1;

function initiateIntro() {

	displayNone(mainContainer, controlBoard);
	mainContainer.style.opacity = 0;
	mainContainer.style.opacity = 0;
	displayBlock(intro);
	intro.style.opacity = 1;

	setTimeout(() => {
		opacityDecrease(intro);
		setTimeout(() => {
			displayFlex(mainContainer, controlBoard);
			opacityIncrease(mainContainer);
			opacityIncrease(controlBoard);
		}, 500);
	}, 1000);
}

initiateIntro();

/*============================================================*/ 

//Help Section

let toHelp = idCatch("to-help");
let next = idCatch("next");
let back = idCatch("back");
let helpOne = idCatch("help-1");
let helpTwo = idCatch("help-2");
let helpThree = idCatch("help-3");

toHelp.addEventListener("click", () => {

	if (isItMoving == false) {
		displayNone(controlBoard, mainContainer, helpTwo, helpThree);
		controlBoard.style.opacity = 0;
		mainContainer.style.opacity = 0;
		displayBlock(help, helpOne);
	}
});

//Buttons
next.addEventListener("click", goNext);
back.addEventListener("click", goBack);

function goNext() {

	if (helpOne.style.display == "block") {
		displayNone(helpOne);
		displayBlock(helpTwo);
	} else if (helpTwo.style.display == "block") {
		displayNone(helpTwo);
		displayBlock(helpThree);
		next.innerHTML = "TO GAME";
	} else if (helpThree.style.display == "block") {
		displayNone(helpOne, helpTwo, helpThree, help);
		displayFlex(mainContainer, controlBoard);
		opacityIncrease(mainContainer);
		opacityIncrease(controlBoard);
	}
}

function goBack() {
	
	if (helpOne.style.display == "block") {
		displayNone(help);
		displayFlex(mainContainer, controlBoard);
		opacityIncrease(mainContainer);
		opacityIncrease(controlBoard);
	}  
	if (helpTwo.style.display == "block") {
		displayNone(helpTwo);
		displayBlock(helpOne);
	}  
	if (helpThree.style.display == "block"){
		displayNone(helpThree);
		displayBlock(helpTwo);
		next.innerHTML = "NEXT";
	}
}