"use strict";

var popup = new Object();
popup.id = "oxPopup";
popup.style =  {
    position:  "absolute",
    backgroundColor: "white",
    border: "3px double black",
    width: "500px",
    height: "300px",
    top: "0px",
    left: "0px",
    padding: "5px",
    zIndex: 20,
    overflow: "auto"
}
popup.loading = chrome.extension.getURL("loading.gif");
popup.hasDrown = false;


function createPopup(data){
    var popupBody = document.createElement("div");

    popupBody.id = data.id;
    popupBody.style.position = data.style["position"];
    popupBody.style.backgroundColor = data.style["backgroundColor"];
    popupBody.style.border = data.style["border"];
    popupBody.style.width = data.style["width"];
    popupBody.style.height = data.style["height"];
    popupBody.style.top = data.style["top"];
    popupBody.style.left = data.style["left"];
    popupBody.style.padding = data.style["padding"];
    popupBody.style.zIndex = data.style["zIndex"];
    popupBody.style.overflow = data.style["overflow"];

    var loading = document.createElement("img");

    loading.style.display = "block";
    loading.style.marginLeft = "auto";
    loading.style.marginRight = "auto";
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
    word.innerHTML = data.word;

    popupChild.appendChild(word);
    for (var sense of data.senses){
        for (var def of sense){
            var elem = document.createElement('p');
            elem.innerHTML = def;
            popupChild.appendChild(elem);
        }
    }

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
    console.log(e.target);
    console.log(e.target.id);
    if (e.target.id == "oxChild"){
        console.log('epta');
    }
    if(popup.hasDrown && e.target != document.getElementById('oxPopup') && e.target.id != "oxChild") {
        removePopup();
    }
}

document.addEventListener('dblclick', function (event) {
    console.log(popup.hasDrown);
    if (popup.hasDrown){
        removePopup();
        return;
    }
    var text;
    var x = event.pageX;
    console.log('x is '+ event.pageX);
    if (event.clientX+500>window.innerWidth){
        x -= 500;
    }
    var y = event.pageY;
    console.log('y is '+ event.pageY);
    if (event.clientY+300>window.innerHeight){
        y -= 300;
    }
    if (window.getSelection){
        text = window.getSelection().toString();
        popup.style["top"] = String(y+10)+"px";
        popup.style["left"] = String(x+10)+"px";
        document.body.appendChild(createPopup(popup));
        popup.hasDrown = true;
        chrome.runtime.sendMessage({word: text}, function(response) {});
    } else {console.log('no selection')}
    

});



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var data = request.defs
        addData(data);
  });




