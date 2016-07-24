/**
 * VistSOS + World Wind.
 * 
 */

requirejs(['./data-provider', 'WebWorldWind/examples/LayerManager'],
    function (ww, LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Added imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        getProcedures(loadProcedureProperties);
                
        function loadProcedureProperties(procedureNames) {
            for (var i = 0; i < procedureNames.length; i++) {
                getProcedureProperties(procedureNames[i], loadProceduresOnMap);                
            }
        }
        
        // PLACEMARKS SETUP
    
        // Define the images we'll use for the placemarks.
        var images = [
            "station1.png",
            "station2.png",
            "plain-black.png",
            "plain-green.png",
            "plain-red.png",
            "plain-yellow.png",
            "plain-blue.png"
        ];

        var pinLibrary = WorldWind.configuration.baseUrl + "images/pushpins/", // location of the image files            
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

        // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
    
        // Add the placemarks layer to the World Window's layer list.
        wwd.addLayer(placemarkLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

	var procedures = [];
    
        function loadProceduresOnMap(procedure) {            
	    procedures.push(procedure);

            // For each placemark image, create a placemark with a label.
            var placemark, highlightAttributes;
            
            // Get procedure's name and coordinates from procedure's geometry.
            var name = procedure.name;
            var latitude = procedure.location.geometry.coordinates[0];
            var longitude = procedure.location.geometry.coordinates[1];
            var elevation = procedure.location.geometry.coordinates[2];

            // Create the placemark and its label.
            placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 1e2), true, null);
            placemark.label = name + "\n" 
            + "Lat " + latitude + "\n"
            + "Lon " + longitude + "\n"
            + "Elevation " + elevation;

            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            placemarkAttributes.imageSource = pinLibrary + images[4];
            placemark.attributes = placemarkAttributes;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 1.2;
            placemark.highlightAttributes = highlightAttributes;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);                        

            // Now set up to handle picking.
            var highlightedItems = [];

            // The common pick-handling function.
            var handlePick = function (o) {
                // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
                // the mouse or tap location.
                var x = o.clientX,
                    y = o.clientY;

                var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

                // De-highlight any previously highlighted placemarks.
                for (var h = 0; h < highlightedItems.length; h++) {
                    highlightedItems[h].highlighted = false;
                }
                highlightedItems = [];

                // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
                // relative to the upper left corner of the canvas rather than the upper left corner of the page.
                var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

                if (pickList.objects.length > 0) {
                    redrawRequired = true;
                }

                // Highlight the items picked by simply setting their highlight flag to true.
                if (pickList.objects.length > 0) {
                    for (var p = 0; p < pickList.objects.length; p++) {                        
                        pickList.objects[p].userObject.highlighted = true;

                        // Keep track of highlighted items in order to de-highlight them later.
                        highlightedItems.push(pickList.objects[p].userObject);
                    }
                }
                                
                if (pickList.objects.length > 1) {
                    var procName = pickList.objects[0].userObject.label.split("\n")[0];
                    var observedProperties;

		    for (var i = 0; i < procedures.length; i++) {
		    	var procedure = procedures[i];
                        if (procName == procedure.name) {
		            observedProperties = procedure.outputs;
                        }
		    }

                    var descriptionOP = "";
                    // Start from index 1 ignoring Time property located at index 0
		    for (var i = 1; i < observedProperties.length; i++) {
                        var longName = observedProperties[i].name.split("-");
                        var name = longName.length > 2 ? longName[1] + "-" + longName[2] : longName[1];
                        if (name == "relative-humidity") {
                          name = "humidity";
                        }
                        var uom = observedProperties[i].uom;
                        var checkbox = "<input type='checkbox' name='observedProperties' value=" + name + ">";
                        var label = "<label for=" + name + ">" + name + ", uom: " + uom + "</label>";

                        descriptionOP = descriptionOP + checkbox + label + "<br>";
                    }

		    // Include chart type options            	    
                    var chartOptions = "<div><input type='radio' name='chart' value='line' id='line'>" +
          	                       "<label for='line'>Line</label></div>" +
          	                       "<div><input type='radio' name='chart' value='bar' id='bar'>" +
          	                       "<label for='bar'>Bar</label></div>" +
          	                       "<div><input type='radio' name='chart' value='punch-card' id='punch-card'>" +
          	                       "<label for='punch-card'>Punch Card</label></div>" +
          	                       "<div><input type='radio' name='chart' value='scatterplot' id='scatterplot'>" +
          	                       "<label for='scatterplot'>Scatterplot</label></div>" +
          	                       "<div><input type='radio' name='chart' value='overview-detail' id='overview-detail'>" +
          	                       "<label for='overview-detail'>Overview Detail</label></div>" +
          	                       "<div><input type='radio' name='chart' value='trellis' id='trellis'>" +
          	                       "<label for='trellis'>Trellis</label></div>";

                    // If procedure has more than 1 observed properties (not including Time) show Multivariable chart option
                    if (observedProperties.length > 2) {
                        chartOptions = chartOptions + "<div><input type='radio' name='chart' value='multivariable' id='multivariable'>" +
          	                                      "<label for='multivariable'>Multivariable</label></div>";
                    }

                    // Show popup with options.     
                    $(document).ready(function () {
                        $("input[name='procedureName']").val(procName);
			$("#procProperties").html("<b>" + procName + " observed properties:</b><br>" + descriptionOP);
                        $("#chartSelector").html("<b>Chart Type:</b><br>" + chartOptions);
                        $(":radio[name='chart'][value='line']").attr("checked", "checked");
                        $("#procPopup").dialog( { width: 650 } );
                    });                                        
                }
                
                // Update the window if we changed anything.
                if (redrawRequired) {
                    wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
                }                                                
            };

            // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
            wwd.addEventListener("click", handlePick);

            // Listen for taps on mobile devices and highlight the placemarks that the user taps.
            var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

            wwd.navigator.range = 1e6;
            wwd.goTo(new WorldWind.Location(42.50, 12.50));
        }                            
    });
