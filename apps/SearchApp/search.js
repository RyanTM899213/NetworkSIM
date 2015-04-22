// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms


// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    // This API key is intended for use only in this lesson.
    // See http://goo.gl/PdPA1 to get a key for your own applications.
    gapi.client.setApiKey('AIzaSyBvw7YNDVhOOng1yM_zETWAY73EeIloJDE');

    search();
}

// Once the api loads call enable the search box.
function handleAPILoaded() {
  $('#search-button').attr('disabled', false);
}

// Search for a given string.
function search() {
	$('#search-button').attr('disabled', false);
  var q = $('#query').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet'
  });

   //request.execute(function(response) {
   	 //var str = JSON.stringify(response.result);
    	
   // $('#search-container').html('<pre>' + str + '</pre>');
    // Send the request to the API server,
    // and invoke onSearchRepsonse() with the response.
    request.execute(onSearchResponse);
	//});	
}
 //Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
   showResponse(response);
 }

function showResponse(response) {
  var responseString = response.result;
    showMyVideos1(responseString); 
    
}

