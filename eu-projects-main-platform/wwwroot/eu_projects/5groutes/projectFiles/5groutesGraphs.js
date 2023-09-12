function ShowTestScenarioSpiderGraph(test, compositeKpis, testScenarioPercentageValues) {
    var myConfig = {
        theme: IsDarkMode() ? 'dark' : 'light',
        type: "radar",
        plot: {
            aspect: "area",
            animation: {
                effect: 3,
                sequence: 1,
                speed: 700,
            }
        },
        legend: {},
        scaleK: {
            labels: compositeKpis,
            guide: {
                alpha: 0.3,
                backgroundColor: '#c5c5c5 #718eb4',
                lineColor: '#607D8B',
                lineStyle: 'solid',
            },
            item: {
                backgroundColor: IsDarkMode() ? '#2d2d3c' :'white',
                borderColor: IsDarkMode() ? '#3c3c56' : '#aeaeae',
                borderRadius: '10px',
                borderWidth: '1px',
                fontColor: IsDarkMode() ? 'white' : '#607D8B',
                padding: '5 10',
            },
            refLine: {
                lineColor: '#c10000',
            }
        },
        series: [
            {
                values: testScenarioPercentageValues,
                text: test.TestScenarioName,
                backgroundColor: test.TestScenarioColor,
                lineColor: test.TestScenarioColor,
                marker: {
                    backgroundColor: test.TestScenarioColor
                }
            }
        ]
    };

    zingchart.render({
        id: 'test_spider_chart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });
}

function IsDarkMode() {
    var isDark = false;
    isDark = $('.main-panel').hasClass('darkMode');
    return isDark;
}

function ShowAllScenarioGraphs(scenarioName, compositeKpis, testSeries) {
    var kpiTypes = compositeKpis.map(s => s.KpiSubTypeCode);

    var myConfig = GetDefaultSpiderChartConfig(scenarioName, kpiTypes, testSeries, "individual");

    zingchart.render({
        id: 'scenario_spider_chart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });

    var myConfig2 = GetDefaultSpiderChartConfig(scenarioName, kpiTypes, testSeries, "aggregated");

    zingchart.render({
        id: 'aggregated_scenario_spider_chart',
        data: myConfig2,
        height: '100%',
        width: '100%'
    });

    //Display composite kpis values

    $('#composite_kpi_analytics_left_block').empty();
    $('#composite_kpi_analytics_right_block').empty();

    var scenarioId = $('#scenariodesc_id').val();

    for (var i in compositeKpis) {
        var compositeKpiName = compositeKpis[i].KpiSubTypeCode;
        var compositeKpiId = compositeKpis[i].KpiSubTypeID;

        GenerateKpiGraphBloc(compositeKpiName, i);

        var values = RetrieveMeasurementValuesPerScenarioAndKpiSubtypeId(scenarioId, compositeKpiId);

        GetCompositekpiGraphConfig(values);
    }
}

function GetDefaultSpiderChartConfig(scenarioName, kpiTypes, testSeries, subtitle) {
    var config = {
        theme: IsDarkMode() ? 'dark' : 'light',
        type: "radar",
        title: {
            text: scenarioName
        },
        subtitle: {
            text: "Composite KPI ("+ subtitle + ")"
        },
        plot: {
            aspect: "area",
            animation: {
                effect: 3,
                sequence: 1,
                speed: 700
            }
        },
        scaleV: {
            values: "0:100"
        },
        scaleK: {
            labels: kpiTypes,
            guide: {
                alpha: 0.3,
                backgroundColor: '#c5c5c5 #718eb4',
                lineColor: '#607D8B',
                lineStyle: 'solid',
            },
            item: {
                backgroundColor: IsDarkMode() ? '#2d2d3c' : 'white',
                borderColor: IsDarkMode() ? '#3c3c56' : '#aeaeae',
                borderRadius: '10px',
                borderWidth: '1px',
                fontColor: IsDarkMode() ? 'white' : '#607D8B',
                padding: '5 10'
            },
            refLine: {
                lineColor: '#c10000'
            }
        },
        series: testSeries
    };

    return config;
}
function GenerateKpiGraphBloc(kpiSubtypeName, i) {
    var html = '<div class="card" style="margin-top:1.8em">';
    html += '       <div class="card-header">';
    html += '           <b>' + kpiSubtypeName + '</b>';
    html += '       </div>';
    html += '       <div class="card-body">';
    /*html += '           <h5 class="card-title">' + kpiSubtypeName + ' Graph compared to Threshold Values</h5>';*/
    html += '           <div id="' + kpiSubtypeName + '_charts" class="composite-graph-style"><div>';
    html += '       </div>';
    html += '   </div>';

    if (i % 2 == 0) {
        $('#composite_kpi_analytics_left_block').append(html);
    } else {
        $('#composite_kpi_analytics_right_block').append(html);
    }
}

function GetCompositekpiGraphConfig(testvalues) {
    
    var groupedByPerformanceIndicator= testvalues.reduce((acc, value) => {

        acc[value.PiId] = [...acc[value.PiId] || [], value];
        return acc;
    }, {});

    var j = 0;
    for (var i in groupedByPerformanceIndicator) {

        var html = '<div class="row" style="height:17.1rem; margin-bottom:2.8rem">';
        html += '<div id="' + groupedByPerformanceIndicator[i].map(v => v.KpiSubTypeCode)[0] +'_' +j +'_chart" style="width:100%"></div>';
        html += '</div>';

        $('#' + groupedByPerformanceIndicator[i].map(v => v.KpiSubTypeCode)[0] + '_charts').append(html);

        var highValues = groupedByPerformanceIndicator[i].map(v => parseFloat(v.HighValue))[0];
        var lowValues = groupedByPerformanceIndicator[i].map(v => parseFloat(v.LowValue))[0];
         
        var subgraphConfig = {
            theme: IsDarkMode() ? 'dark' : 'light',
            type: "mixed",
            title: {
                text: groupedByPerformanceIndicator[i].map(v => v.PIName)[0],
                fontWeight: "bolder",
                fontFamily: "tahoma",
                fontSize: 14,
                padding: "10%",
            },
            plotarea: {
                maskTolerance: [0, 0]
            },
            plot: {
                animation: {
                    effect: "ANIMATION_FADE_IN"
                }
            },
            'scale-x': {
                'min-value': 0,
                'max-value': 2,
                offset: 0,
                item: {visible:false}

            },
            'scale-y': {
                label: {
                    text: groupedByPerformanceIndicator[i].map(v => v.UnitOfMeasure)[0] != null ? "(" + groupedByPerformanceIndicator[i].map(v => v.UnitOfMeasure)[0] + ")" : '',
                    fontSize: 14
                }
            },
            series: [
                {
                    type: "line",
                    values: Array.of(Array.of(0, highValues), Array.of(1, highValues), Array.of(2, highValues)),
                    /*text: "Green Threshold",*/
                    //'value-box': {
                    //    text: "%t",
                    //    type: "last",
                    //    placement: "top"
                    //},
                    lineColor: "seagreen",
                    marker: {
                        backgroundColor: "seagreen"
                    }
                },
                {
                    type: "line",
                    values: Array.of(Array.of(0, lowValues), Array.of(1, lowValues), Array.of(2, lowValues)),
                    aspect: "spline",
                    //text: "Red Threshold",
                    //'value-box': {
                    //    text: "%t",
                    //    type: "first",
                    //    placement: "bottom"
                    //},
                    marker: {
                        backgroundColor: "#dd3311"
                    }
                }
                ]
        }

        zingchart.render({
            id: groupedByPerformanceIndicator[i].map(v => v.KpiSubTypeCode)[0] + '_' + j +'_chart',
            data: subgraphConfig,
            height: '100%',
            width: '100%'
        });

        j++;
        //setOfGraphs.push(subgraphConfig);

    }


    //return myConfig = {
    //    graphset: setOfGraphs,
    //    layout: "vertical"
    //};
}

function GetCompositeKpiMeasureGaugeGraphConfig(kpisubtypeId) {
    var scenarioId = parseInt($('#scenariodesc_id').val());
    var usecaseId = parseInt($('#ucdesc_id').val());

    var setOfGraphs = [];

    var testScenarios = RetrieveTestScenariosPerScenario_JS(scenarioId);

    var measurementPerformanceIndicators = RetrievePIMeasurementDetails(usecaseId).filter(pi => pi.KPISubTypeId === kpisubtypeId);

    for (var i in measurementPerformanceIndicators) {

        var lowValue = parseFloat(measurementPerformanceIndicators[i].LowValue);
        var highValue = parseFloat(measurementPerformanceIndicators[i].HighValue);
        var performanceIndicatorName = measurementPerformanceIndicators[i].PIName;
        var unit = measurementPerformanceIndicators[i].UnitOfMeasure;
        var measurementId = measurementPerformanceIndicators[i].ScenarioMeasurementId;
        var measureValue = 0;

        var measureValueSeries = [];

        for (var j in testScenarios) {

            var measureValueObj = RetrieveLatestTestScenarioMeasureValue(testScenarios[j].TestScenarioId, measurementId);

            if (measureValueObj != null) {

                measureValue = measureValueObj.MeasurementValue;
                measureValueSeries.push({
                    values: Array.of(measureValue),
                    text: testScenarios[j].TestScenarioName,
                    animation: {
                        effect: 'ANIMATION_EXPAND_VERTICAL',
                        method: 'ANIMATION_REGULAR_EASE_OUT',
                        speed: 2500
                    }
                });
            }
            
        }

        var rules = [];
        rules.push({
            backgroundColor: '#dd3311',
            rule: '%v < '+lowValue
        });

        rules.push({
            backgroundColor: 'orange',
            color: 'black',
            rule: '%v >='+ lowValue+ ' && %v < '+highValue
        });

        rules.push({
            backgroundColor: 'seagreen',
            rule: '%v >= '+highValue
        });

        setOfGraphs.push({
            type: 'gauge',
            theme: 'classic',
            title: {
                text: performanceIndicatorName + ' (' + unit + ')',
                color: 'black',
                'background-color': 'transparent',
                "adjust-layout": true,
                'font-size': '12px'
            },
            alpha: 1,
            backgroundColor: '#fff',
            plotarea: {
                margin: '0 0 0 0',
                "adjust-layout": true
            },
            legend: {
                shared: true,
                "adjust-layout": true
            },
            scaleR: {
                values: '0:100',
                backgroundColor: '#eeeeee,#b3b3b3',
                borderColor: '#b3b3b3',
                borderWidth: '2px',
                ring: {
                    rules: rules,
                    size: '20px'
                },
            },
            series: measureValueSeries
        });
    }

    var config = {
        layout: 'vertical',
        graphset: setOfGraphs
    };
    return config;
}
//----------- Monika Development-----

function GetTestresultGraphConfig(data) {
   // debugger
    var config = {
        width: 1060,
        animationEnabled: true,
        axisX: {
            valueFormatString: "hh:mm:ss:ms",
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

