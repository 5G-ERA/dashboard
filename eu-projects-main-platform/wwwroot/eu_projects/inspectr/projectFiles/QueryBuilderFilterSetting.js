function GetDefaultQueryBuilderFilters() {

    var categories = [
        { index: 'requestor_country', id: '[tblRequestRules_Inspectr].[RequestorCountryID]', label: "Requestor Country", placeholder: "Select a country", values: [] },
        { index: 'requestor_member', id: '[tblRequestRules_Inspectr].[RequestorMemberID]', label: "Requestor Member", placeholder: "Select a requestor Member", values: [] },
        { index: 'requestType', id: '[tblRequestRules_Inspectr].[RequestTypeID]', label: "Request Type", placeholder: "Select a request Type", values: [] },
        { index: 'request_jurisdiction', id: '[tblRequestRules_Inspectr].[RequestJurisdictionID]', label: "Request Jurisdiction", placeholder: "Select a request Jurisdiction", values: [] },
        { index: 'crime_type', id: '[tblRequestRules_Inspectr].[CrimeTypeID]', label: "Crime Type", placeholder: "Select a crime Type", values: [] },
        { index: 'crime_country', id: '[tblRequestRules_Inspectr].[CrimeCountryID]', label: "Crime Country", placeholder: "Select a crime Country", values: [] },
        { index: 'crime_case', id: '[tblRequestRules_Inspectr].[CrimeCaseID]', label: "Crime Case", placeholder: "Select a crime Case", values: [] },
        { index: 'crime_level', id: '[tblRequestRules_Inspectr].[CrimeLevelID]', label: "Crime Level", placeholder: "Select a crime Level", values: [] },
        { index: 'evidence_source', id: '[tblRequestRules_Inspectr].[EvidenceSourceID]', label: "Evidence Source", placeholder: "Select an evidence Source", values: [] },
        { index: 'evidenceType', id: '[tblRequestRules_Inspectr].[EvidenceTypeID]', label: "Evidence Type", placeholder: "Select an evidence Type", values: [] }
        //{ id: 'priority', label: "Priority", placeholder: "Select a priority Level", values: [] },
        //{ id: 'status', label: "Status", placeholder: "Select a Status", values: [] },
    ];
    var filters = [];


    for (var c in categories) {

        if (categories[c].index == 'requestor_country' || categories[c].index == 'crime_country') {
            var countries = resources.requestor_countries;
            countries.forEach(e => categories[c].values.push({ label: e.countryName, value: e.countryID }));
        }
        else if (categories[c].index == 'requestor_member') {
            var members = resources.requestor_members;
            members.forEach(e => categories[c].values.push({ label: e.requestorMemberName, value: e.requestorMemberID }));

        } else if (categories[c].index == 'requestType') {
            var requests = resources.request_types;
            requests.forEach(e => categories[c].values.push({ label: e.requestTypeName, value: e.requestTypeID }));

        } else if (categories[c].index == 'request_jurisdiction') {
            var requestJurisdictions = resources.request_jurisdictions;
            requestJurisdictions.forEach(e => categories[c].values.push({ label: e.requestJurisdictionName, value: e.requestJurisdictionID }));

        } else if (categories[c].index == 'crime_type') {
            var crimeTypes = resources.crime_types;
            crimeTypes.forEach(e => categories[c].values.push({ label: e.crimeTypeName, value: e.crimeTypeID }));

        } else if (categories[c].index == 'crime_case') {
            var crimeCases = resources.crime_cases;
            crimeCases.forEach(e => categories[c].values.push({ label: e.crimeCaseName, value: e.crimeCaseID }));

        } else if (categories[c].index == 'evidence_source') {
            var evidenceSources = resources.evidence_sources;
            evidenceSources.forEach(e => categories[c].values.push({ label: e.evidenceSourceName, value: e.evidenceSourceID }));
        } else if (categories[c].index == 'evidenceType') {
            var evidenceTypes = resources.evidence_types;
            evidenceTypes.forEach(e => categories[c].values.push({ label: e.evidenceTypeName, value: e.evidenceTypeID }));
        } else if (categories[c].index == 'crime_level') {
            var crimeLevels = resources.crime_levels;
            crimeLevels.forEach(e => categories[c].values.push({ label: e.crimeLevelName, value: e.crimeLevelID }));
        }
        //else if (categories[c].id == 'priority') {
        //    var levels = ["Low", "Medium", "High"];
        //    for (var i = 1; i <= levels.length; i++) {
        //        categories[c].values.push({ label: i + ' - ' + levels[i - 1], value: levels[i - 1] });
        //    }
        //} else {
        //    var statuses = ["New", "In Progress", "Completed"];
        //    for (var i = 1; i <= statuses.length; i++) {
        //        categories[c].values.push({ label: statuses[i - 1], value: statuses[i - 1] });
        //    }
        //}


        var filter = {
            id: categories[c].index,
            field: categories[c].id,
            label: categories[c].label,
            icon: 'fa fa-globe',
            type: 'string',
            input: 'select',
            placeholder: categories[c].placeholder,
            plugin: 'chosen',
            values: categories[c].values,
            operators: ['equal', 'not_equal'],
            size: 40,
            validation: { allow_empty_value: false },
            valueSetter: function (rule, value) {
                if (!value) return;
                rule.$el.find('.rule-value-container select').val(value).change().trigger('chosen:updated');
            }
        }

        filters.push(filter);
    }

    return filters.sort(function (a, b) {
        var x = a.id.toLowerCase();
        var y = b.id.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });
}