"use strict";

var lang =  {
    ENG: 'english',
    AENG: 'american_english'
}

//make request to oxforddictionaries then call parse function with response as parameter
function getWord(word, language, callback){
    var x = new XMLHttpRequest();
    x.onload = function() {
        callback(parseIt(x.response, word));
    };
    x.open('GET', 
        'http://www.oxforddictionaries.com/search/?direct=1&multi=1&dictCode='+language+'&q='+word, true);
    x.send();
}


//get HTML string, parse it for data then return it as JSON  
function parseIt(str){
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
            var definition = $(this).find('.definition').text();
            var block = num+ '. ' +$.trim(definition);
            result.senses[index].push(block);
        });    
    });
    return JSON.stringify(result);
}

chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.executeScript(null,
		{file:'inject.js'});
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    getWord(request.greeting, lang.ENG, function(data){

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {greeting: data}, function(response) {
                console.log(response.farewell);
              });
            });
        
    });

    sendResponse('got it');
});





