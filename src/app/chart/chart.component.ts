import {AfterViewInit, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild} from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  private root!: am5.Root;
  wheelY: any = "zoomX";
  wheelX: any = "panX";
  cursorBehavior: any = "zoomX";
  chart: any;
  root2: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {

  }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    this.createChart();
  }


  zoomWheel(e: any, type: string) {
    if (type === 'X')
      this.chart.set("wheelX", e.target.value);
    else
      this.chart.set("wheelY", e.target.value);
  }

  cursor(e: any) {
    this.chart.set("cursor", am5xy.XYCursor.new(this.root, {
      behavior: e.target.value,
    }));
  }

  scrollbar(e: any) {
    if (e.target.value === 'horizontal') {
      this.chart.set("scrollbarX", am5.Scrollbar.new(this.root, {orientation: "horizontal"}));
    }
    if (e.target.value === 'vertical') {
      this.chart.set("scrollbarY", am5.Scrollbar.new(this.root, {orientation: "vertical"}));
    }


  }

  createChart() {
    if (this.root) {
      this.root.dispose();
    }
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          wheelX: this.wheelX,
          wheelY: this.wheelY,
          layout: root.verticalLayout
        })
      );


      // Define data
      let data = [
        {
          category: "Research",
          value1: 1000,
          value2: 588
        },
        {
          category: "Marketing",
          value1: 1200,
          value2: 1800
        },
        {
          category: "Sales",
          value1: 850,
          value2: 1230
        }
      ];

      // Create Y-axis
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Create X-Axis
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          categoryField: "category"
        })
      );
      xAxis.data.setAll(data);

      // Create series
      let series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value1",
          categoryXField: "category"
        })
      );
      series1.data.setAll(data);

      let series2 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value2",
          categoryXField: "category"
        })
      );
      series2.data.setAll(data);
      series2.columns.template.events.on("click", function (ev) {
        console.log("Clicked on a column", ev.target);
      });
      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomY",
      }));

      this.root = root;
      this.chart = chart
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
