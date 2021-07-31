var body =document.getElementById('body');
var red = {
    parent: document.getElementById('red'),
    box: document.getElementById('red').children,
    color: "red",
    unlock: 0,
    ind: 0,
    disc: [{
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }]
}

var green = {
    parent: document.getElementById('green'),
    box: document.getElementById('green').children,
    color: "green",
    unlock: 0,
    ind: 1,

    disc: [{
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }]
}

var blue = {
    parent: document.getElementById('blue'),
    box: document.getElementById('blue').children,
    color: "blue",
    unlock: 0,
    ind: 2,
    disc: [{
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56
    }]
}

var yellow = {
    parent: document.getElementById('yellow'),
    box: document.getElementById('yellow').children,
    color: "yellow",
    unlock: 0,
    ind: 3,

    disc: [{
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56,
    }, {
        status: "locked",
        coords: null,
        color: null,
        id: null,
        reqStep: 56,
    }, {
        status: "locked",
        coords: null,
        color: null,
        reqStep: 56,
        id: null,
    }, {
        status: "locked",
        coords: null,
        color: null,
        reqStep: 56,
        id: null,
    }]
}

wholeDisc = [red, green, blue, yellow];
matchLeft = [red, green, blue, yellow];

var getId = function(box) {
    boxId = box.id;
    var number = parseInt(boxId.substr(boxId.length - 2, 2));
    if (number % 1 != 0) {
        number = parseInt(boxId.substr(boxId.length - 1, 1));
    }
    return number;
}

curTurn = -1;

dice = document.getElementById('dice');
complete=[];
var vict=0;
function checkVict(){
    for(i=0;i<matchLeft.length;i++){
        var localCount=0;
        for(dis of matchLeft[i].disc) if(dis.reqStep==0)localCount++;
        if(localCount==4){
            vict++;
            if(!complete.includes(matchLeft[i].color)) complete.push(matchLeft[i].color);
            matchLeft.pop(i);
            i--;
        }
    }
    return vict;
}

function checkPoss(thisID) {
    if (thisID[thisID.length - 2] == wholeDisc[curTurn].color[wholeDisc[curTurn].color.length - 1]) { return 1; }
    return 0;
}

function checkOther(coord, color) {
    box = document.getElementById(`${color}${coord}`);
    child = box.children;
    if (box.childElementCount == 0 || coord == 14 || coord == 4) return 0;
    else {
        flag = 0;
        for (old of child) {
            if (old.id[old.id.length - 2] != color[color.length - 2]) {
                cur = document.getElementById(old.id);
                curId = old.id;
                for (main of wholeDisc) {
                    for (dics of main.disc) {
                        if (dics.id == old.id) dics.status = "locked";
                    }
                }
                curId = curId.substring(5);
                cur.remove();
                cur = document.getElementById(curId);
                cur.style.display = "block";
                flag = 1;
            }
        }
        return flag;
    }
}


function checkMove(clr, thisID) {
    curObj = wholeDisc[clr];
    moves = parseInt(dice.innerHTML);

    if (checkPoss(thisID) == 0) return;
    flag = 0;
    if (moves == 6) flag = 1;

    for (curDisc of curObj.disc) {
        if (curDisc.id == thisID) {
            if (moves > curDisc.reqStep) {
                return;
            }
            while (moves > 0) {
                if (curDisc.coords == 18) {
                    curDisc.color += 1;
                    curDisc.color %= 4;
                    curDisc.coords = 1;
                } else if (curDisc.coords == 7 && curObj.ind != curDisc.color) {
                    curDisc.coords = 13;
                } else curDisc.coords++;
                moves--;
                curDisc.reqStep--;
            }
            flag = flag | checkOther(curDisc.coords, wholeDisc[curDisc.color].color)
            moveDisc = document.getElementById(curDisc.id);
            moveTo = document.getElementById(`${wholeDisc[curDisc.color].color}${curDisc.coords}`);
            moveTo.append(moveDisc);
            dice.removeAttribute("disabled");
            dice.innerHTML = 0;
            checkVict();
            if(vict==4){
                var elem=`<div id="victLog">
                    <ul id="victList">
                        <li>1st is ${complete[0]}</li>
                        <li>2nd is ${complete[1]}</li>
                        <li>3rd is ${complete[2]}</li>
                        <li>4th is ${complete[3]}</li>
                        
                    </ul>
               </div>`;
               body.innerHTML +=elem;
               var victLog=document.getElementById("victLog");
               victLog.style.top=(innerHeight-320)/2+"px";

            }
            if (curDisc.reqStep == 0) {
                moveDisc.remove();
                flag = 1;
            }
            if (flag) curTurn -= 1;
        }
    }



}

//Checking weather dice can be oppend or not
function checkOpen(clr, thisID) {
    if (clr.color == dice.style.backgroundColor && dice.innerHTML == 6) {

        //hidding the cur element
        elem = document.getElementById(thisID);
        elem.style.display = "none";

        //getting the location of 14th block
        placeDisc = document.getElementById(`${ clr.color}14`);
        for (i = 0; i < 4; i++) {
            if (clr.disc[i].status == "locked") {
                clr.unlock = i;
                break;
            }
        }

        //appending child and updating the disc;
        clr.disc[clr.unlock].status = "unlocked";
        clr.disc[clr.unlock].color = clr.ind;
        clr.disc[clr.unlock].coords = 14;
        clr.disc[clr.unlock].id = `moved${thisID}`;
        clr.unlock += 1;

        //creating the element for image
        var img = document.createElement("img");
        img.setAttribute("src", `board\\${clr.color}Disc.jpg`);
        img.setAttribute("width", "50px");
        img.setAttribute("id", `moved${thisID}`);
        img.setAttribute("onclick", `checkMove(${clr.ind},"moved${thisID}")`)
        placeDisc.appendChild(img);
        dice.innerHTML = 0;
        dice.removeAttribute("disabled");
        curTurn -= 1;
    }
}

function movable() {
    curObj = matchLeft[curTurn];
    if (curObj.unlock != 4 && dice.innerHTML == 6) {
        return 1;
    } else if (curObj.unlock == 0) return 0;
    else {
        flag = 0;
        for (dics of curObj.disc) {
            if (dics.reqStep >= dice.innerHTML && dics.status != "locked") flag = 1;
        }
        return flag;
    }
}


dice.addEventListener('click', function() {
    x = 1 + parseInt(Math.random() * 6);
    dice.innerHTML = x;
    curTurn += 1;
    curTurn %= matchLeft.length;
    checkVict();
    if (movable() == 1) dice.setAttribute("disabled", "");
    dice.style.backgroundColor = matchLeft[curTurn].color;


})