let _theme = "light2";
function graph() {
	graph1()
	graph2()
	graph3()
	graph4()
	graph5()
	graph6()
}
function graph1() {
	if ($('.graph1').length > 0) {
		let html = '<div id="chartContainer" style="height: 500px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph1').empty().append(html);
		if ($('.userLogOutUserArea').text() == ' (5GEra)') {
			var chart = new CanvasJS.Chart("chartContainer", {
				animationEnabled: true,
				theme: _theme,
				title: {
					text: "Resource Usage Estimation"
				},
				axisX: {
					valueFormatString: "DD MMM",
					crosshair: {
						enabled: true,
						snapToDataPoint: true
					}
				},
				axisY: {
					title: "Unit",
					valueFormatString: "##0.00",
					crosshair: {
						enabled: true,
						snapToDataPoint: true,
						labelFormatter: function (e) {
							return CanvasJS.formatNumber(e.value, "##0.00");
						}
					}
				},
				data: [{
					type: "area",
					xValueFormatString: "DD MMM",
					yValueFormatString: "##0.00",
					dataPoints: [
						{ x: new Date(2017, 08, 01), y: 85.83 },

						{ x: new Date(2017, 08, 04), y: 84.42 },
						{ x: new Date(2017, 08, 05), y: 84.97 },
						{ x: new Date(2017, 08, 06), y: 84.89 },
						{ x: new Date(2017, 08, 07), y: 84.78 },
						{ x: new Date(2017, 08, 08), y: 85.09 },
						{ x: new Date(2017, 08, 09), y: 85.14 },

						{ x: new Date(2017, 08, 11), y: 84.46 },
						{ x: new Date(2017, 08, 12), y: 84.71 },
						{ x: new Date(2017, 08, 13), y: 84.62 },
						{ x: new Date(2017, 08, 14), y: 84.83 },
						{ x: new Date(2017, 08, 15), y: 84.37 },

						{ x: new Date(2017, 08, 18), y: 84.07 },
						{ x: new Date(2017, 08, 19), y: 83.60 },
						{ x: new Date(2017, 08, 20), y: 82.85 },
						{ x: new Date(2017, 08, 21), y: 82.52 },

						{ x: new Date(2017, 08, 25), y: 82.65 },
						{ x: new Date(2017, 08, 26), y: 81.76 },
						{ x: new Date(2017, 08, 27), y: 80.50 },
						{ x: new Date(2017, 08, 28), y: 79.13 },
						{ x: new Date(2017, 08, 29), y: 79.00 }
					]
				}]
			});

			chart.render();
		} else {
			var chart = new CanvasJS.Chart("chartContainer", {
				theme: _theme,
				animationEnabled: true,
				title: {
					text: "CPU Utilization"
				},
				axisX: {
					title: "Time"
				},
				axisY: {
					title: "Percentage",
					suffix: "%",
					includeZero: true
				},
				data: [{
					type: "line",
					name: "CPU Utilization",
					connectNullData: true,
					//nullDataLineDashType: "solid",
					xValueType: "dateTime",
					xValueFormatString: "DD MMM hh:mm TT",
					yValueFormatString: "#,##0.##\"%\"",
					dataPoints: [
						{ x: 1501048673000, y: 35.939 },
						{ x: 1501052273000, y: 40.896 },
						{ x: 1501055873000, y: 56.625 },
						{ x: 1501059473000, y: 26.003 },
						{ x: 1501063073000, y: 20.376 },
						{ x: 1501066673000, y: 19.774 },
						{ x: 1501070273000, y: 23.508 },
						{ x: 1501073873000, y: 18.577 },
						{ x: 1501077473000, y: 15.918 },
						{ x: 1501081073000, y: null }, // Null Data
						{ x: 1501084673000, y: 10.314 },
						{ x: 1501088273000, y: 10.574 },
						{ x: 1501091873000, y: 14.422 },
						{ x: 1501095473000, y: 18.576 },
						{ x: 1501099073000, y: 22.342 },
						{ x: 1501102673000, y: 22.836 },
						{ x: 1501106273000, y: 23.220 },
						{ x: 1501109873000, y: 23.594 },
						{ x: 1501113473000, y: 24.596 },
						{ x: 1501117073000, y: 31.947 },
						{ x: 1501120673000, y: 31.142 }
					]
				}]
			});
			chart.render();
        }
	}
}



function graph2() {
	if ($('.graph2').length > 0) {
		let html = '<div id="chartContainer2" style="height: 250px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph2').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer2", {
			theme: _theme,
			title: {
				text: "Temperature of Robots"
			},
			axisY: {
				title: "Temperature (°C)",
				includeZero: true,
				suffix: " °C"
			},
			data: [{
				type: "column",
				yValueFormatString: "#,### °C",
				indexLabel: "{y}",
				dataPoints: [
					{ label: "Robot1", y: 206 },
					{ label: "Robot2", y: 163 },
					{ label: "Robot3", y: 154 },
					{ label: "Robot4", y: 176 },
					{ label: "Robot5", y: 184 },
					{ label: "Robot6", y: 122 }
				]
			}]
		});

		function updateChart() {
			var boilerColor, deltaY, yVal;
			var dps = chart.options.data[0].dataPoints;
			for (var i = 0; i < dps.length; i++) {
				deltaY = Math.round(2 + Math.random() * (-2 - 2));
				yVal = deltaY + dps[i].y > 0 ? dps[i].y + deltaY : 0;
				boilerColor = yVal > 200 ? "#FF2500" : yVal >= 170 ? "#FF6000" : yVal < 170 ? "#6B8E23 " : null;
				dps[i] = { label: "Robot " + (i + 1), y: yVal, color: boilerColor };
			}
			chart.options.data[0].dataPoints = dps;
			chart.render();
		};
		updateChart();

		setInterval(function () { updateChart() }, 500);
	}
}

function graph3() {
	if ($('.graph3').length > 0) {
		let html = '<div id="chartContainer3" style="height: 250px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph3').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer3", {
			theme: _theme,
			animationEnabled: true,
			title: {
				text: "Skills"
			},
			axisY: {
				title: "Response values",
				includeZero: true,
				interval: 10
			},
			toolTip: {
				shared: true
			},
			data: [{
				type: "bar",
				name: "Avg. Score",
				toolTipContent: "<b>{label}</b> <br> <span style=\"color:#082146\">{name}</span>: {y}",
				dataPoints: [
					{ y: 94, label: "Move using SLAM", color: "#082146" },
					{ y: 74, label: "Detect", color: "#894d04" },
					{ y: 74, label: "Swimming" },
				]
			},
			{
				type: "error",
				name: "Variability Range",
				toolTipContent: "<span style=\"color:#C0504E\">{name}</span>: {y[0]} - {y[1]}",
				dataPoints: [
					{ y: [92, 98], label: "Move using SLAM" },
					{ y: [70, 78], label: "Detect" },
					{ y: [10, 15], label: "Swimming" },
				]
			}]
		});
		chart.render();
	}
}

function graph4() {
	if ($('.graph4').length > 0) {
		let html = '<div id="chartContainer4" style="height: 250px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph4').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer4", {
			theme: _theme,
			animationEnabled: true,
			title: {
				text: "OSM Control"
			},
			data: [{
				type: "pie",
				startAngle: 240,


				dataPoints: [
					{ y: 100, label: "OSM Control Policy Generator" },

				]
			}]
		});
		chart.render();
	}
}

function graph5() {
	if ($('.graph5').length > 0) {
		let html = '<div id="chartContainer5" style="height: 250px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph5').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer5", {
			theme: _theme,
			animationEnabled: true,
			title: {
				text: "Traffic"
			},
			axisX: {
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "Number of Visits",
				includeZero: true,
				crosshair: {
					enabled: true
				}
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				verticalAlign: "bottom",
				horizontalAlign: "left",
				dockInsidePlotArea: true,
				itemclick: toogleDataSeries
			},
			data: [{
				type: "line",
				showInLegend: true,
				name: "Total Visit",
				markerType: "square",
				xValueFormatString: "DD MMM, YYYY",
				color: "#F08080",
				dataPoints: [
					{ x: new Date(2017, 0, 3), y: 650 },
					{ x: new Date(2017, 0, 4), y: 700 },
					{ x: new Date(2017, 0, 5), y: 710 },
					{ x: new Date(2017, 0, 6), y: 658 },
					{ x: new Date(2017, 0, 7), y: 734 },
					{ x: new Date(2017, 0, 8), y: 963 },
					{ x: new Date(2017, 0, 9), y: 847 },
					{ x: new Date(2017, 0, 10), y: 853 },
					{ x: new Date(2017, 0, 11), y: 869 },
					{ x: new Date(2017, 0, 12), y: 943 },
					{ x: new Date(2017, 0, 13), y: 970 },
					{ x: new Date(2017, 0, 14), y: 869 },
					{ x: new Date(2017, 0, 15), y: 890 },
					{ x: new Date(2017, 0, 16), y: 930 }
				]
			},
			{
				type: "line",
				showInLegend: true,
				name: "Unique Visit",
				lineDashType: "dash",
				dataPoints: [
					{ x: new Date(2017, 0, 3), y: 510 },
					{ x: new Date(2017, 0, 4), y: 560 },
					{ x: new Date(2017, 0, 5), y: 540 },
					{ x: new Date(2017, 0, 6), y: 558 },
					{ x: new Date(2017, 0, 7), y: 544 },
					{ x: new Date(2017, 0, 8), y: 693 },
					{ x: new Date(2017, 0, 9), y: 657 },
					{ x: new Date(2017, 0, 10), y: 663 },
					{ x: new Date(2017, 0, 11), y: 639 },
					{ x: new Date(2017, 0, 12), y: 673 },
					{ x: new Date(2017, 0, 13), y: 660 },
					{ x: new Date(2017, 0, 14), y: 562 },
					{ x: new Date(2017, 0, 15), y: 643 },
					{ x: new Date(2017, 0, 16), y: 570 }
				]
			}]
		});
		chart.render();

		function toogleDataSeries(e) {
			if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
				e.dataSeries.visible = false;
			} else {
				e.dataSeries.visible = true;
			}
			chart.render();
		}
	}

}

function graph6() {
	if ($('.graph6').length > 0) {
		let html = '<div id="chartContainer6" style="height: 250px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph6').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer6", {
			theme: _theme,
			animationEnabled: true,
			title: {
				text: "Server Performance"
			},
			axisX: {
				title: "Server Load (in TPS)"
			},
			axisY: {
				title: "Response Time (in ms)",
				includeZero: true
			},
			data: [{
				type: "scatter",
				toolTipContent: "<span style=\"color:#4F81BC \"><b>{name}</b></span><br/><b> Load:</b> {x} TPS<br/><b> Response Time:</b></span> {y} ms",
				name: "Server Pluto",
				showInLegend: true,
				dataPoints: [
					{ x: 23, y: 330 },
					{ x: 28, y: 390 },
					{ x: 39, y: 400 },
					{ x: 34, y: 430 },
					{ x: 24, y: 321 },
					{ x: 29, y: 250 },
					{ x: 29, y: 370 },
					{ x: 23, y: 290 },
					{ x: 27, y: 250 },
					{ x: 34, y: 380 },
					{ x: 36, y: 320 },
					{ x: 33, y: 405 },
					{ x: 32, y: 453 },
					{ x: 21, y: 292 }
				]
			},
			{
				type: "scatter",
				name: "Server Mars",
				showInLegend: true,
				toolTipContent: "<span style=\"color:#C0504E \"><b>{name}</b></span><br/><b> Load:</b> {x} TPS<br/><b> Response Time:</b></span> {y} ms",
				dataPoints: [
					{ x: 19, y: 200 },
					{ x: 27, y: 300 },
					{ x: 35, y: 330 },
					{ x: 32, y: 190 },
					{ x: 29, y: 189 },
					{ x: 22, y: 150 },
					{ x: 27, y: 200 },
					{ x: 26, y: 190 },
					{ x: 24, y: 225 },
					{ x: 33, y: 330 },
					{ x: 34, y: 250 },
					{ x: 30, y: 120 },
					{ x: 37, y: 153 },
					{ x: 24, y: 196 }
				]
			}]
		});
		chart.render();
	}
}
