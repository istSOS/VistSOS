// Retrieve procedure names
function getProcedures(loadProcedureProperties) {    
    var url = "http://131.175.143.71/istsos/wa/istsos/services/test/procedures/operations/getlist";
    
    var procedureNames = [];
    
    $.getJSON(url, function(result) {        
        var data = result["data"];
        
        for (var i = 0; i < data.length; i++) {
            var procedureName = data[i].name;
            procedureNames.push(procedureName);
        }
        
        loadProcedureProperties(procedureNames);
    });    
}

// Retrieve procedure properties
function getProcedureProperties(procedureName, loadProceduresOnMap) {    
    var url = "http://131.175.143.71/istsos/wa/istsos/services/test/procedures/" + procedureName;
    
    $.getJSON(url, function(result) {        
        var procedureProperties = {        
            "name": procedureName,
            "location": result["data"].location,
            "outputs": result["data"].outputs
        }
                
        loadProceduresOnMap(procedureProperties);
    });
}
