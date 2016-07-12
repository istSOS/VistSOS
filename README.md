# VistSOS

The VistSOS data visualization framework will allow users to configure and customize static and dynamic charts populated with data coming from istSOS. This visualizations can be included in external websites as Web Components with minimum configuration effort.

For more information about this project:

https://wiki.osgeo.org/wiki/VistSOS_Data_Visualization_Framework

To use VistSOS modify your HTML document like this:

1. Inside the head section include:
  ```html
  <link rel="import" href="default-widget.html" async>
  ```

2. Inside the body of the HTML document include a declaration of a chart with some parameters, e.g.
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
Note the id of the div and the parameter 'divId' of the istsos-chart element should match.

The property 'type' can take one of the following values: 

  * line
  * bar
  * punch-card
  * scatterplot
  * overview-detail
  * multivariable
  * trellis (https://en.wikipedia.org/wiki/Small_multiple) 

VistSOS support the following list of configuration options:

  * <b>server:</b> The server address to access istSOS.
  * <b>service:</b> A service configured in istSOS.
  * <b>offering:</b>  The offering associated with the procedure.
  * <b>procedure:</b>  A procedure configured in istSOS.
  * <b>property:</b>  A list of observed properties to visualize.
  * <b>from:</b>  initial date time.
  * <b>until:</b>  final date time.
  * <b>color:</b>  Color of the mark (line, bar, circle, etc) used to visualize the data, e.g, 00A800. Not applicable to multivariate charts.
  * <b>color2:</b>  Second color of the mark, e.g, 00A800. So far, Applicable only for overview-detail charts.
  * <b>strokeWidth:</b>  Line thickness. So far, Applicable to line and multivariate charts.
  * <b>aggregate:</b>  An aggregation operation applied on the data, e.g. count, average, stdev, sum, variance. Currently supported by punch-card and trellis charts. For more information check vega aggregate documentation: https://vega.github.io/vega-lite/docs/aggregate.html.
  * <b>timeUnit:</b>  A time unit or combination of time units to apply to the chart, e.g. date, year, month, hours, minutes, monthdate, monthday, monthdatehour, etc. For more information check vega time unit documentation: https://vega.github.io/vega-lite/docs/timeunit.html.
  * <b>timeUnit2</b> : Same as timeUnit but applied to the second axis. Currently only applicable to punch-card charts.
  * <b>timeFormat:</b>  A date time format string, e.g. %y/%m/%d (2 digits year, month number, day of the month). For a detailed list of time format options check d3.js documentation: https://github.com/d3/d3-time-format/blob/master/README.md#locale_format
  * <b>rowTimeUnit:</b> The time unit (year, month, date, hours, etc) or combination of time units applied to each row of a trellis chart. Each row is represented as a separate plot visualizing a different subset of the datset, e.g, each row represents a year.
  * <b>xTimeUnit:</b> The time unit (year, month, date, hours, etc) or combination of time units applied to the X axis of a trellis chart.
  * <b>yTimeUnit:</b> The time unit (year, month, date, hours, etc) or combination of time units applied to the Y axis of a trellis chart.
  * <b>bin:</b> If this parameter is equal to the string "true", the trellis chart will create a number bins aggregating the data by measurement. To use a different aggregation, set this parameter to "false" and specify a supported aggregation operation with the parameter aggregate.
