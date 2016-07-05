# VistSOS

The VistSOS data visualization framework will allow users of the istSOS system to configure and customize static and dynamic charts of data coming from istSOS. This visualizations will be included in external websites.

For more information about this project:

https://wiki.osgeo.org/wiki/VistSOS_Data_Visualization_Framework

To use VistSOS modify your HTML document like this:

1. Inside the head section include:
  ```html
  <link rel="import" href="default-widget.html" async>
  ```

2. Inside the body of the application include a declaration of a chart with some parameters, e.g:
  ```html
  <div id='f2a24b67'>
    <istsos-chart type="multivariable"
     server="http://131.175.143.71/istsos"
     service="test"
     offering="offering1"
     procedure="Milano2"
     property="temperature,rainfall,relative-humidity"
     from="2015-01-01T00:00"
     until="2015-02-01T00:00"
     color="000000"
     divId="f2a24b67">
    </istsos-chart>
  </div>
  ```
The property type can take one of the following values: 

  * line
  * bar
  * punch-card
  * scatterplot
  * overview-detail
  * multivariable 

The id of the div and the parameter divId should be the same.

