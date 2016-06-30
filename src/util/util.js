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

