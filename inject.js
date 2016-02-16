"use strict";

var x,y;

function makePopup(data){
    var text = '';
    data = JSON.parse(data);
    text += '<b>'+data.word+'</b><br>';
    for (var sense of data.senses){
        text+='As ';
        for (var def of sense){
            text+=def+'<br>';
        }
    }
    return text;

}

document.addEventListener('dblclick', function (event) {

    var text;
    x = event.clientX;
    y = event.clientY;
    text = window.getSelection();
    var raw = text.toString();
    chrome.runtime.sendMessage({word: raw}, function(response) {});

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var data = request.defs
        document.body.innerHTML += makePopup(data);
        
  });




