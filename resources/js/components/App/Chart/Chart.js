import React, { useRef, useLayoutEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default function Chart(props) {
    const chart = useRef(null);

    useLayoutEffect(() => {
        let x = am4core.create(props.id, am4charts.XYChart);

        let title = x.titles.create();
        title.text = props.title;
        title.fill = am4core.color("#dbdce0");
        title.marginBottom = 30;

        x.data = props.data;

        // Create axes

        let categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.labels.template.fill = am4core.color("#dbdce0");
        categoryAxis.dataFields.category = "date";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;

        let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;
        valueAxis.renderer.labels.template.fill = am4core.color("#dbdce0");

        // Create series
        let series = x.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "stats";
        series.dataFields.categoryX = "date";
        series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

        // on hover, make corner radiuses bigger
        let hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        // Cursor
        x.cursor = new am4charts.XYCursor();

        chart.current = x;

        return () => {
            x.dispose();
        };
    }, []);

    return (
        <div
            id={props.id}
            className="mb-5"
            style={{ width: "100%", height: "300px" }}
        ></div>
    );
}
