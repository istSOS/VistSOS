# VistSOS

The VistSOS data visualization framework will allow users to configure and customize static and dynamic charts populated with data coming from istSOS. This visualizations can be included in external websites as Web Components with minimum configuration effort.

For more information about this project:

https://wiki.osgeo.org/wiki/VistSOS_Data_Visualization_Framework

To use VistSOS modify your HTML document like this:

1. Inside the head section include:
  ```html
  <link rel="import" href="default-widget.html" async>
  ```

2. Inside the body of the application include a declaration of a chart with some parameters, e.g.
  ```html
  <div id="f2a24b67">
    <istsos-chart type="multivariable"
     server="http://localhost/istsos"
     service="test"
     offering="offering1"
     procedure="Milano2"
     property="temperature,rainfall"
     from="2015-01-01T00:00"
     until="2015-02-01T00:00"
     timeFormat="%y/%m/%d"
     divId="f2a24b67">
    </istsos-chart>
  </div>
  ```
The property 'type' can take one of the following values: 

  * line
  * bar
  * punch-card
  * scatterplot
  * overview-detail
  * multivariable 

Note the id of the div and the parameter 'divId' of the istsos-chart element should match.

VistSOS support the following list of configuration options:

  * <b>server:</b> The server address to access istSOS.
  * service: A service configured in istSOS.
  * offering: The offering associated with the procedure.
  * procedure: A procedure configured in istSOS.
  * property: A list of observed properties to visualize.
  * from: initial date time.
  * until: final date time.
  * color: Color of the mark (line, bar, circle, etc) used to visualize the data. Not applicable to multivariate charts.
  * color2: Second color of the mark. So far, Applicable only for overview-detail charts.
  * strokeWidth: Line thickness. So far, Applicable to line and multivariate charts.
  * aggregate: An aggregation operation applied on the data, e.g. count, average, stdev, sum, variance. Currently supported by punch-card charts. For more information check vega aggregate documentation: https://vega.github.io/vega-lite/docs/aggregate.html.
  * timeUnit: A time unit or combination of time units to apply to the chart, e.g. date, year, month, hours, minutes, monthdate, monthday, monthdatehour, etc. For more information check vega time unit documentation: https://vega.github.io/vega-lite/docs/timeunit.html.
  * timeUnit2: Same as timeUnit but applied to the second axis. Currently only applicable to punch-card charts.
  * timeFormat: A date time format string, e.g. %y/%m/%d (2 digits year, month number, day of the month). For a detailed list of time format options check d3.js documentation: https://github.com/d3/d3-time-format/blob/master/README.md#locale_format

