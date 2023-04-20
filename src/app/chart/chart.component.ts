import {Component, Inject, NgZone, PLATFORM_ID} from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {isPlatformBrowser} from "@angular/common";
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  private chart!: am4charts.XYChart;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    // Set theme
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);

    // Add data
    chart.data = [{
      "category": "Category 1",
      "value1": 8,
      "value2": 5
    }, {
      "category": "Category 2",
      "value1": 6,
      "value2": 3
    }, {
      "category": "Category 3",
      "value1": 2,
      "value2": 4
    }, {
      "category": "Category 4",
      "value1": 5,
      "value2": 6
    }];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "value1";
    series1.dataFields.categoryX = "category";
    series1.name = "Series 1";

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "value2";
    series2.dataFields.categoryX = "category";
    series2.name = "Series 2";

    // Add legend
    chart.legend = new am4charts.Legend();
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
