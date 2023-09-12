let _theme = "light2";
function graph() {
	//graph1()
	//graph2()
	//graph3()
	graph4()
	graph5()
	graph6()
}
function graph1() {
	if ($('.graph1').length > 0) {
		let html = '<div id="chartContainer" style="height: 500px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph1').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			theme: _theme,
			title: {
				text: "Change of Wind Speed with time"
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
					{ x: new Date(2017, 08, 01), y: 1.42 },

					{ x: new Date(2017, 08, 04), y: 1.79 },
					{ x: new Date(2017, 08, 05), y: 2.90 },
					{ x: new Date(2017, 08, 06), y: 2.41 },
					{ x: new Date(2017, 08, 07), y: 1.76 },
					{ x: new Date(2017, 08, 08), y: 4.05 },
					{ x: new Date(2017, 08, 09), y: 4.27 },

					{ x: new Date(2017, 08, 11), y: 3.42 },
					{ x: new Date(2017, 08, 12), y: 2.20 },
					{ x: new Date(2017, 08, 13), y: 3.14 },
					{ x: new Date(2017, 08, 14), y: 1.59 },
					{ x: new Date(2017, 08, 15), y: 2.96 },

					{ x: new Date(2017, 08, 18), y: 2.82 },
					{ x: new Date(2017, 08, 19), y: 4.22 },
					{ x: new Date(2017, 08, 20), y: 3.90 },
					{ x: new Date(2017, 08, 21), y: 4.39 },

					{ x: new Date(2017, 08, 25), y: 3.79 },
					{ x: new Date(2017, 08, 26), y: 3.51 },
					{ x: new Date(2017, 08, 27), y: 3.11 },
					{ x: new Date(2017, 08, 28), y: 4.42 },
					{ x: new Date(2017, 08, 29), y: 4.01 }
				]
			}]
		});

		chart.render();
		//} else {
		//	var chart = new CanvasJS.Chart("chartContainer", {
		//		theme: _theme,
		//		animationEnabled: true,
		//		title: {
		//			text: "CPU Utilization"
		//		},
		//		axisX: {
		//			title: "Time"
		//		},
		//		axisY: {
		//			title: "Percentage",
		//			suffix: "%",
		//			includeZero: true
		//		},
		//		data: [{
		//			type: "line",
		//			name: "CPU Utilization",
		//			connectNullData: true,
		//			//nullDataLineDashType: "solid",
		//			xValueType: "dateTime",
		//			xValueFormatString: "DD MMM hh:mm TT",
		//			yValueFormatString: "#,##0.##\"%\"",
		//			dataPoints: [
		//				{ x: 1501048673000, y: 35.939 },
		//				{ x: 1501052273000, y: 40.896 },
		//				{ x: 1501055873000, y: 56.625 },
		//				{ x: 1501059473000, y: 26.003 },
		//				{ x: 1501063073000, y: 20.376 },
		//				{ x: 1501066673000, y: 19.774 },
		//				{ x: 1501070273000, y: 23.508 },
		//				{ x: 1501073873000, y: 18.577 },
		//				{ x: 1501077473000, y: 15.918 },
		//				{ x: 1501081073000, y: null }, // Null Data
		//				{ x: 1501084673000, y: 10.314 },
		//				{ x: 1501088273000, y: 10.574 },
		//				{ x: 1501091873000, y: 14.422 },
		//				{ x: 1501095473000, y: 18.576 },
		//				{ x: 1501099073000, y: 22.342 },
		//				{ x: 1501102673000, y: 22.836 },
		//				{ x: 1501106273000, y: 23.220 },
		//				{ x: 1501109873000, y: 23.594 },
		//				{ x: 1501113473000, y: 24.596 },
		//				{ x: 1501117073000, y: 31.947 },
		//				{ x: 1501120673000, y: 31.142 }
		//			]
		//		}]
		//	});
		//	chart.render();
		//}
	}
}



function graph2() {
	if ($('.graph2').length > 0) {
		let html = '<div id="chartContainer2" style="height: 250px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph2').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer2", {
			theme: _theme,
			title: {
				text: "Average Experiment Result"
			},
			axisY: {
				title: "Average Value",
				includeZero: true,
				suffix: " °C"
			},
			data: [{
				type: "column",
				yValueFormatString: "#,### °C",
				indexLabel: "{y}",
				dataPoints: [
					{ label: "WindSpeed", y: 2.54 },
					{ label: "WindDirection", y: 142.11 },
					{ label: "Temperature", y: 19.34 },
					{ label: "Pressure", y: 1008.35 }
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
		let html = '<div id="chartContainer4" style="height: 500px; max-width: 920px; margin: 0px auto;"></div>'
		$('.graph4').empty().append(html);
		var chart = new CanvasJS.Chart("chartContainer4", {
			animationEnabled: true,
			theme: _theme,
			title: {
				text: "Wind Direction"
			},
			axisX: {
				title: "Date",
				valueFormatString: "DD MMM",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY: {
				title: "Wd",
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
					{ x: new Date(2017, 08, 01), y: 51.80 },

					{ x: new Date(2017, 08, 04), y: 55.50 },
					{ x: new Date(2017, 08, 05), y: 58.20 },
					{ x: new Date(2017, 08, 06), y: 58.00 },
					{ x: new Date(2017, 08, 07), y: 59.60 },
					{ x: new Date(2017, 08, 08), y: 64.6 },
					{ x: new Date(2017, 08, 09), y: 68.27 },

					{ x: new Date(2017, 08, 11), y: 87.70 },
					{ x: new Date(2017, 08, 12), y: 97.80 },
					{ x: new Date(2017, 08, 13), y: 92.60 },
					{ x: new Date(2017, 08, 14), y: 101.6 },
					{ x: new Date(2017, 08, 15), y: 84.00 },

					{ x: new Date(2017, 08, 18), y: 76.90 },
					{ x: new Date(2017, 08, 19), y: 87.70 },
					{ x: new Date(2017, 08, 20), y: 94.10 },
					{ x: new Date(2017, 08, 21), y: 72.30 },

					{ x: new Date(2017, 08, 25), y: 75.10 },
					{ x: new Date(2017, 08, 26), y: 69.80 },
					{ x: new Date(2017, 08, 27), y: 67.00 },
					{ x: new Date(2017, 08, 28), y: 73.20 },
					{ x: new Date(2017, 08, 29), y: 65.70 }
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
				text: "Ws vs Wd"
			},
			axisX: {
				title: "Ws (m/s)"
			},
			axisY: {
				title: "Wd (°)",
				includeZero: true
			},
			data: [{
				type: "scatter",
				toolTipContent: "<span style=\"color:#4F81BC \"><b>{name}</b></span><br/><b> Load:</b> {x} TPS<br/><b> Response Time:</b></span> {y} ms",
				name: "Relation",
				showInLegend: true,
				dataPoints: [
					{ x: 3.11, y: 13.86 },
					{ x: 4.42, y: 13.68 },
					{ x: 4.01, y: 13.91 },
					{ x: 3.72, y: 13.96 },
					{ x: 3.26, y: 13.90 },
					{ x: 3.69, y: 14.34 },
					{ x: 4.01, y: 14.08 },
					{ x: 3.53, y: 14.25 },
					{ x: 2.82, y: 14.45 },
					{ x: 2.28, y: 14.24 },
					{ x: 2.34, y: 14.51 },
					{ x: 2.05, y: 15.73 },
					{ x: 3.36, y: 15.17 },
					{ x: 3.38, y: 15.16 }
				]
			}]
		});
		chart.render();
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
				text: "Pₐₜₘ vs T"
			},
			axisX: {
				title: "T (℃)"
			},
			axisY: {
				title: "Pₐₜₘ (mPa)",
				includeZero: true
			},
			data: [{
				type: "scatter",
				toolTipContent: "<span style=\"color:#4F81BC \"><b>{name}</b></span><br/><b> Load:</b> {x} TPS<br/><b> Response Time:</b></span> {y} ms",
				name: "Relation",
				showInLegend: true,
				dataPoints: [
					{ x: 53.11, y: 1013.86 },
					{ x: 64.42, y: 1013.68 },
					{ x: 54.01, y: 1013.91 },
					{ x: 53.72, y: 1013.96 },
					{ x: 53.26, y: 1013.90 },
					{ x: 63.69, y: 1013.34 },
					{ x: 64.01, y: 1013.08 },
					{ x: 73.53, y: 1013.25 },
					{ x: 52.82, y: 1013.45 },
					{ x: 52.28, y: 1013.24 },
					{ x: 52.34, y: 1013.51 },
					{ x: 52.05, y: 1013.73 },
					{ x: 53.36, y: 1013.17 },
					{ x: 53.38, y: 1013.16 }
				]
			}]
		});
		chart.render();
	}
}

function GetTestresultGraphConfig(data) {
    // debugger
    var config = {
        width: 1060,
        animationEnabled: true,
        axisX: {
            valueFormatString: "hh:mm:ss",
        },
        axisY: {
            title: "Test Result chart",
        },
        legend: {
            cursor: "pointer",
            fontSize: 16
        },
        toolTip: {
            shared: true
        },
        data: data.values
    }

    return config;

}
function GetTestresultGraphConfig(data) {
	// debugger
	var config = {
		width: 1060,
		animationEnabled: true,
		axisX: {
			valueFormatString: "hh:mm:ss",
		},
		axisY: {
			title: "Mandrekas Usecase result",
		},
		legend: {
			cursor: "pointer",
			fontSize: 16
		},
		toolTip: {
			shared: true
		},
		data: data.values
	}

	return config;

}
