var YTtabs= getYoutubeTabs(filterYoutubeTabs); 
var videoId = "";
var thumbnailUrl = "";
import {next as nextCommand} from './Controls/Youtube/Commands/nextSongCommand.js';
import {play as playCommand} from './Controls/Youtube/Commands/pauseSongCommand.js';
import {back as backCommand} from './Controls/Youtube/Commands/prevSongCommand.js';
import {changeVolume as volumeCommand} from './Controls/Youtube/Commands/changeVolumeCommand.js';

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
	}
	}, 10);
});
$('#button-next').click( function(e) {
	e.preventDefault();
	nextCommand.execute(YTtabs[0]);
 } );

 $('#button-pause').click( function(e) {
	e.preventDefault();
	playCommand.execute(YTtabs[0])
 });

 $('#button-back').click( function(e) {
	e.preventDefault();
	backCommand.execute(YTtabs[0]);
 } );
createVolumeControl();

 function getYoutubeTabs(callback){ //Take a callback
    chrome.tabs.query({},function(tab){
        return callback(tab,_displayTab); //call the callback with argument
    });
};


function getVideoId(youtubeUrl){
	var res = youtubeUrl.split("v=")[1];
	var ampersandPosition = res.indexOf('&');
	if(ampersandPosition != -1) {
		res = res.substring(0, ampersandPosition);
	}
	console.log("new Video ID:",res);
	return res;
}

function filterYoutubeTabs(tabArray, callback){ // Gets all tabs that contain http://www.youtube.com
	var finalTabs = [];
	for (let i = 0; i < tabArray.length; i++) {
		const iteratedTab = tabArray[i];
		if(iteratedTab.url.indexOf("https://www.youtube.com")!=-1){
			finalTabs.push(iteratedTab);
		}
	}
	console.log("finals", finalTabs);	
	YTtabs = finalTabs;
	return callback(finalTabs);
}

function _displayTab(tab){ //define your callback function
	document.getElementById("now-playing-header").innerHTML= _parseYoutubeTitle(tab[0].title);
	videoId = getVideoId(tab[0].url);
	thumbnailUrl = "https://img.youtube.com/vi/"+videoId+"/0.jpg";
	changeThumbnail();
    return (tab[0]);
 };


 function _parseYoutubeTitle(oldTitle){
	var ytIndex = oldTitle.indexOf("- YouTube");
	var newTitle = oldTitle.substring(0,ytIndex);
	return newTitle;
 }

 function _controlPlayer(button){
	chrome.tabs.executeScript(YTtabs[0].id,{
		code: '(' + emulateKeyPress + ')(\''+button +'\');' //argument here is a string but function.toString() returns function's code
	}, (results) => {
		//Here we have just the innerHTML and not DOM structure
		//console.log(results[0]);
	});
		var greeting = "hola, ";
		console.log(YTtabs[0]);
	};

	function emulateKeyPress(buttonClass) {
        //You can play with your DOM here or check URL against your regex
        console.log('Tab script:');
		var button = document.getElementsByClassName(buttonClass)[0];
		console.log(button);
		button.click();
        return document.body.innerHTML;
    }


function changeThumbnail(){
	$('#thumbnail').css('background-image', 'url(' + thumbnailUrl + ')');
}

 chrome.tabs.onUpdated.addListener(function() {
	var tabs = getYoutubeTabs(filterYoutubeTabs); 
  });

function createVolumeControl(){
	$("#volume").slider({
		min: 0,
		max: 100,
		value: 30,
		range: "min",
		slide: function( event, ui ) {
			volumeCommand.execute(YTtabs[0],ui.value);
		}
	  });
	
}
