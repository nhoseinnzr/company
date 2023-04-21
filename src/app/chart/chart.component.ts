import {AfterViewInit, Component, ElementRef, Inject, NgZone, PLATFORM_ID, ViewChild} from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Micro from "@amcharts/amcharts5/themes/Micro";
import am5themes_Dataviz from "@amcharts/amcharts5/themes/Dataviz";
import am5themes_Kelly from "@amcharts/amcharts5/themes/Kelly";
import am5themes_Frozen from "@amcharts/amcharts5/themes/Frozen";
import am5themes_Spirited from "@amcharts/amcharts5/themes/Spirited";
import am5themes_Moonrise from "@amcharts/amcharts5/themes/Moonrise";
import {isPlatformBrowser} from "@angular/common";
import {Theme} from "@amcharts/amcharts5";

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
  colorCode!:string;
  public myTheme!: Theme;
  fontSize: any;

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

  setColor(){
    this.myTheme.rule("Label").setAll({
      fill: am5.color(this.colorCode),
    });

  }
  setFontSize(){
    this.myTheme.rule("Label").setAll({
      fontSize: this.fontSize
    });
  }


  createChart() {
    if (this.root) {
      this.root.dispose();
    }
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");
      const myTheme = am5.Theme.new(root);
      myTheme.rule("Label").setAll({
        fill: am5.color("#ccc"),
        fontSize: "14px"
      });
      this.myTheme = myTheme;
      root.setThemes([
        am5themes_Animated.new(root),
        myTheme

      ]);

      var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout

      }));

      var legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );

      // Define data
      var data = [
        {
        "year": "2021",
        "europe": 2.5,
        "namerica": 2.5,
        "asia": 2.1,
        "lamerica": 1,
        "meast": 0.8,
        "africa": 0.4
      }, {
        "year": "2022",
        "europe": 2.6,
        "namerica": 2.7,
        "asia": 2.2,
        "lamerica": 0.5,
        "meast": 0.4,
        "africa": 0.3
      }, {
        "year": "2023",
        "europe": 2.8,
        "namerica": 2.9,
        "asia": 2.4,
        "lamerica": 0.3,
        "meast": 0.9,
        "africa": 0.5
      }]

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
          categoryField: "year",
          tooltip: am5.Tooltip.new(root, {})

        })
      );
      xAxis.data.setAll(data);
      function makeSeries(name:string, fieldName:string) {
        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "year"
        }));

        series.columns.template.setAll({
          tooltipText: "{name}, {categoryX}:{valueY}",
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 0
        });

        series.data.setAll(data);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();

        series.bullets.push(function() {
          return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Label.new(root, {
              text: "{valueY}",
              fill: root.interfaceColors.get("alternativeText"),
              centerY: 0,
              centerX: am5.p50,
              populateText: true
            })
          });
        });

        legend.data.push(series);
      }
      makeSeries("Europe", "europe");
      makeSeries("North America", "namerica");
      makeSeries("Asia", "asia");
      makeSeries("Latin America", "lamerica");
      makeSeries("Middle East", "meast");
      makeSeries("Africa", "africa");

      // Create series




      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomY",
      }));
      chart.appear(1000, 100);
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
