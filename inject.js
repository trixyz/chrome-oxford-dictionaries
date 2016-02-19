"use strict";


var popup = new Object();
popup.id = "oxPopup";
popup.style =  {
    width: "400px",
    height: "300px",
    top: "0px",
    left: "0px",
}
popup.loading = chrome.extension.getURL("images/loading.gif");
popup.hasDrown = false;


function createPopup(data){
    var popupBody = document.createElement("div");

    popupBody.id = data.id;
    popupBody.style.width = data.style["width"];
    popupBody.style.height = data.style["height"];
    popupBody.style.top = data.style["top"];
    popupBody.style.left = data.style["left"];

    var loading = document.createElement("img");

    loading.style.display = "block";
    loading.style.margin = "auto";
    loading.style.marginUp = "100px";
    loading.id = "imgLoading";
    loading.src = data.loading;
    popupBody.appendChild(loading);

    return popupBody;
}

function addData(data){
    data = JSON.parse(data);
    var popupChild = document.createElement('div');
    popupChild.id = 'oxChild';
    var word = document.createElement('h1');
    word.id = 'oxChild';
    word.innerHTML = data.word;

    popupChild.appendChild(word);
    for (var sense of data.senses){
        for (var def of sense){
            var elem = document.createElement('p');
            elem.innerHTML = def;
            elem.id = 'oxChild';
            popupChild.appendChild(elem);
        }
    }
    var url = document.createElement('p');
    url.innerHTML = "Get examples and synonyms of " + data.word + " at:<br>" + 
    '<a href="'+data.url+'"id="oxChild">oxforddictionaries.com</a>';
    url.id = 'oxChild';
    popupChild.appendChild(url);

    document.getElementById('oxPopup').removeChild(document.getElementById("imgLoading"));
    document.getElementById('oxPopup').appendChild(popupChild);


}


function removePopup(){
    var pop = document.getElementById('oxPopup'); 
    var dad = pop.parentNode;
    dad.removeChild(pop);
    popup.innerHTML = "";
    popup.hasDrown = false;
}

document.onclick = function(e) {
    if(popup.hasDrown && e.target != document.getElementById('oxPopup') && e.target.id != "oxChild") {
        removePopup();
    }
}


function dbClickHandler(event) {
    if (popup.hasDrown){
        removePopup();
    }
    var text;
    var x = event.pageX;
    var popupWidth = parseInt(popup.style.width);
    if (event.clientX+popupWidth>window.innerWidth){
        x -= popupWidth;
    }
    var y = event.pageY;
    var popupHeight = parseInt(popup.style.height);
    if (event.clientY+popupHeight>window.innerHeight){
        y -= popupHeight;
    }
    text = window.getSelection().toString();
    if (text){
        console.log(window.getSelection());
        text = window.getSelection().toString();
        popup.style["top"] = String(y+10)+"px";
        popup.style["left"] = String(x+10)+"px";
        document.body.appendChild(createPopup(popup));
        popup.hasDrown = true;
        chrome.runtime.sendMessage({word: text}, function(response) {});
    } else {console.log('no selection')}
}

document.addEventListener('dblclick', dbClickHandler);
var listen = true;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if (request.turn){
            if(listen==true){
                document.removeEventListener('dblclick', dbClickHandler);
                listen = false;
                sendResponse({turn: "off"});
            } else {
                document.addEventListener('dblclick', dbClickHandler);
                listen = true;
                sendResponse({turn: "on"});
            }
        } else {
            var data = request.defs
            addData(data);
        }

  });




