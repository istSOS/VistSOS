// Generates a random id
function getDivId(callback) {
  var id = genRandId() + genRandId();
  callback(id);
}

function genRandId() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

// Returns a vega/vegga-lite JSON specification from specs folder
function getJSONSpec(specName, callback) {
  var specPath = "specs/" + specName;
  var spec = {};
  $.getJSON(specPath, function(response) {
    callback(response);
  });
}


// Taken from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
function getURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
  }
}

