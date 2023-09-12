namespace eu_projects_main_platform.Models._5groutes.static_classes
{
    public static class TestMeasurementCalculator
    {
        public static ScenarioMeasurementValue GetMeasurementValue(ScenarioMeasurement measurement,
            decimal? measurementValue)
        {
            var lowValue = decimal.Parse(measurement.LowValue);
            var highValue = decimal.Parse(measurement.HighValue);
            var lowOperator = measurement.LowOperator.Trim();
            var highOperator = measurement.HighOperator.Trim();

            var valueObject = new ScenarioMeasurementValue
            {
                MeasurementId = measurement.ScenarioMeasurementId,
                MeasurementValue = measurementValue,
                SatisfactoryLevelType = SatisfactoryLevelTypes.None
            };

            if (measurementValue is null)
            {
                return valueObject;
            }

            if (lowValue < highValue)
            {
                if (lowOperator.Equals("<") || lowOperator.Equals("<="))
                {
                    if (lowValue < measurementValue)
                    {
                        if (highOperator.Equals("<"))
                        {
                            if (measurementValue < highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else if (measurementValue > highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (highOperator.Equals("<="))
                        {
                            if (measurementValue <= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                        }
                        else if (highOperator.Equals(">"))
                        {
                            if (measurementValue > highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else if (measurementValue < highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (highOperator.Equals(">="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                        }
                        else if (highOperator.Equals("="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                        }

                    }
                    else if (lowValue > measurementValue)
                    {
                        if (highOperator.Equals("<"))
                        {
                            if (measurementValue < highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (highOperator.Equals("<="))
                        {
                            if (measurementValue <= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (highOperator.Equals(">"))
                        {
                            if (measurementValue > highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else if( measurementValue < highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                        }
                        else if (highOperator.Equals(">="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (highOperator.Equals("="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                    }
                    else
                    {
                        if (lowOperator.Equals("<")) valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        else if (lowOperator.Equals("<=")) valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                    }
                }
                else if (lowOperator.Equals("="))
                {
                    if (measurementValue > lowValue)
                    {
                        if(measurementValue < highValue)
                        {
                            valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (measurementValue > highValue)
                        {
                            valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                        }
                        else
                        {
                            valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                        }
                    }
                    else if(measurementValue < lowValue)
                    {
                        if (measurementValue < highValue)
                        {
                            valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                        }
                        else if (measurementValue > highValue)
                        {
                            valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else
                        {
                            valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                        }
                    }
                    else
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                    }
                }
            }
            else if (lowValue > highValue)
            {
                if (lowOperator.Equals(">") || lowOperator.Equals(">="))
                {
                    if (lowValue > measurementValue)
                    {
                        if (highOperator.Equals("<"))
                        {
                            if (measurementValue < highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else if (measurementValue > highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                            }
                            else
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                            }
                        }
                        else if (highOperator.Equals("<="))
                        {
                            if (measurementValue <= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                            }
                        }
                        else if (highOperator.Equals(">="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (highOperator.Equals("="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                    }
                    else if (lowValue < measurementValue)
                    {
                        if (highOperator.Equals("<"))
                        {
                            if (measurementValue < highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                            }
                        }
                        else if (highOperator.Equals(">="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                        else if (highOperator.Equals("="))
                        {
                            if (measurementValue >= highValue)
                            {
                                valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                            }
                            else valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        }
                    }
                    else
                    {
                        if (lowOperator.Equals(">")) valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                        else if (lowOperator.Equals(">=")) valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                    }
                }
                else if (lowOperator.Equals("="))
                {
                    if (measurementValue > lowValue && measurementValue < highValue)
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                    }
                    else
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                    }
                }
            }
            else
            {
                if (lowOperator.Equals("<") && highOperator.Equals(">"))
                {
                    if (measurementValue == highValue)
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                    }
                    else if (measurementValue < lowValue)
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                    }
                    else
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                    }
                }
                else if (lowOperator.Equals(">") && highOperator.Equals("<"))
                {
                    if (measurementValue == highValue)
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Acceptable;
                    }
                    else if (measurementValue > lowValue)
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Bad;
                    }
                    else
                    {
                        valueObject.SatisfactoryLevelType = SatisfactoryLevelTypes.Good;
                    }
                }
            }
            

            return valueObject;
        }
    }

    public enum SatisfactoryLevelTypes
    {
        Bad=1,
        Acceptable=2,
        Good=3,
        None=4
    }
}
