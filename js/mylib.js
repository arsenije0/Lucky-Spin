function opacityIncrease(x) {
    var y = 0;
    var M = setInterval(opacityChange, 50);

    function opacityChange() {
        if(x.style.opacity >= 1) {
            clearInterval(M);
        } else {
            y += 0.05;
            x.style.opacity = y;
        }
    }
}

function opacityDecrease(x) {
    var M = setInterval(opacityChange, 50);

    function opacityChange() {

        if(x.style.opacity < 0) {
            clearInterval(M);
            x.style.display = "none";
            x.style.opacity = 0;
        } else {
            x.style.opacity -= 0.05;
        }
    }
}

//Display control
function displayNone(...arg) {
    for(let i = 0; i < arg.length; i++) {
        arg[i].style.display = "none";
    }
}

function displayBlock(...arg) {
    for(let i = 0; i < arg.length; i++) {
        arg[i].style.display = "block";
    }
}

function displayFlex(...arg) {
    for(let i = 0; i < arg.length; i++) {
        arg[i].style.display = "flex";
    }
}

//ID catcher
function idCatch(id) {
    return document.getElementById(id);
}

//Gives commas to large numbers 
//and returns string: commaCreator(2133454) = "2,133,454"
//Input can be either a number or a string
function commaCreator(num) {

    let numStr = num.toString();
    let c = numStr.split("").reverse();
    let w = [];
    let cTrack = 0;
    
    for(let i = 0, commaTrack = 1; 
        i < (c.length + Math.round(c.length/3)); 
        i++, commaTrack++) {

        if(commaTrack%4 != 0) {
            w[i] = c[cTrack];
            cTrack++;
        } else {
            w[i] = ",";
        }
    }

    if(w[w.length - 1] == ",") {
        w.pop();
    }

    return w.reverse().join("");
}