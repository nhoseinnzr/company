import {AfterViewInit, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import {isPlatformBrowser} from "@angular/common";
import {Theme} from "@amcharts/amcharts5";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit ,OnInit {
  private root!: am5.Root;
  wheelY: "zoomX" | "panX" | "panY" | "zoomY" | "zoomXY" | "panXY" | "none" | undefined = "zoomX";
  wheelX: "zoomX" | "panX" | "panY" | "zoomY" | "zoomXY" | "panXY" | "none" | undefined = "panX";
  cursorBehavior: "zoomX" | "zoomY" | "zoomXY" | "none" | "selectX" | "selectY" | "selectXY" | undefined = "zoomX";
  chart!: am5xy.XYChart;
  colorCode!: string;
  public myTheme!: Theme;
  fontSize: string | number | undefined;
  seriesVal!: am5xy.ColumnSeries;
  formGroup!: FormGroup;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private fb: FormBuilder,
              private zone: NgZone) {

  }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      wheelX: new FormControl('zoomX'),
      wheelY: new FormControl('zoomX'),
      cursor: new FormControl('zoomX'),
      scrollbar: new FormControl('horizontal'),
      color: new FormControl("#000"),
      fontSize: new FormControl('14px'),
      title: new FormGroup({
        titleText: new FormControl('This is chart Title'),
        fontSize: new FormControl(40),
        fontWeight: new FormControl(30),
        textAlign: new FormControl('left'),
        paddingTop: new FormControl(10),
        paddingBottom: new FormControl(10),
      })

    })
  }

  ngAfterViewInit() {
    this.createChart();
  }


  setFontSize() {
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
        fill: am5.color(this.formGroup.get('color')?.value),
        fontSize: this.formGroup.get('fontSize')?.value
      });
      this.myTheme = myTheme;
      root.setThemes([
        am5themes_Animated.new(root),
        myTheme

      ]);

      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: this.formGroup.get('wheelX')?.value,
        wheelY: this.formGroup.get('whellY')?.value,
        layout: root.verticalLayout

      }));

      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50
        })
      );
      chart.children.unshift(am5.Label.new(root, {
        text: this.formGroup.get('title.titleText')?.value,
        fontSize: +this.formGroup.get('title.fontSize')?.value,
        fontWeight: this.formGroup.get('title.fontWeight')?.value,
        textAlign: this.formGroup.get('title.textAlign')?.value,
        x: am5.percent(50),
        centerX: am5.percent(50),
        paddingTop: +this.formGroup.get('title.paddingTop')?.value,
        paddingBottom: +this.formGroup.get('title.paddingBottom')?.value,
      }));

      // Define data
      let data = [
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
      const makeSeries = (name: string, fieldName: string): any => {
        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: fieldName,
          categoryXField: "year",

        }));


        series.columns.template.setAll({
          tooltipText: "{name}, {categoryX}:{valueY}",
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 1,
          strokeWidth: 2,
          fillOpacity: 0.5,
          stroke: am5.color(0x000000),
        });


        series.data.setAll(data);

        // Make stuff animate on load


        series.appear();

        series.bullets.push(function () {
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
        this.seriesVal = series;

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
