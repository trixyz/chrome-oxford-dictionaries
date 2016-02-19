"use strict";

var lang =  {
    ENG: 'english',
    AENG: 'american_english'
}

//make request to oxforddictionaries
function getWord(word, language, callback){
    var x = new XMLHttpRequest();
    var url = 'http://www.oxforddictionaries.com/search/?direct=1&multi=1&dictCode='+language+'&q='+word;
    x.onload = function() {
        callback(parseIt(x.response,url));
        //pass the parseIt func result to callback function
    };
    x.open('GET', url, true);
    x.send();
}


//get HTML string, parse it for data then return it as JSON  
function parseIt(str,url){
    var doc = $.parseHTML(str);
    var group = $(doc).find('.se1.senseGroup');
    var result = new Object();
    result.word = $(doc).find('.pageTitle').text();
    result.senses = [];
    $(group).each(function(index){
        result.senses[index] = [];
        result.senses[index].push($(this).find('.partOfSpeechTitle').text());
        var subgroup = $(this).find('.msDict');
        $(subgroup).each(function(){
            var num = $(this).find('.iteration').text();
            var definition = $(this).find('.definition').text().replace(':','.');
            var block = num+ '. ' +$.trim(definition);
            result.senses[index].push(block);
        });    
    });
    result.url = url;
    return JSON.stringify(result);
}

chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {turn: 'turn'}, function(response) {
            if(response.turn=="off"){
                chrome.browserAction.setIcon({path:{
                    "38":"images/icon-off.png"
                }});
            } else {
                chrome.browserAction.setIcon({path:{
                    "38":"images/icon.png"
                }});
            }
        });  
    });
});

//listen to message  from content script  
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //send a message that contains parsed data to content script
    getWord(request.word, lang.ENG, function(data){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {defs: data}, function(response) {});
        });     
    });
});





