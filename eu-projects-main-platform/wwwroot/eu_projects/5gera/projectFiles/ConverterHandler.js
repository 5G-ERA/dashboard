var sequence_counter = 0;
var service_counter = 0;

function GenerateJsonObject() {
    var html = '';

    var instance = {
        Id: GetNewUuid(),
        Name: $('#instance_name').val(),
        TaskPriority: $('#task_priority_drp').val(),
        ActionSequence: GetAllActionSequences(),
        //relations: GetRootRelations()
    }
    html += '<div class="btn-group" role="group"  style="width:100%">';
    html += ' <button type = "button" class="btn btn-primary" onclick="CopyJsonIntoClipboard()"> <i class="fa-solid fa-clone"></i> Copy</button >';
    //html += '<button type="button" class="btn btn-warning">Middle</button>
    html += '<button type="button" class="btn btn-success" onclick="OnDownloadJsonObject()"> <i class="fa-solid fa-file-code"></i>  Download Json File</button>';
    html += '</div >';
    html += '<pre id="json_content">' + JSON.stringify(instance, null, 2)+'</pre>'

    $('#json_object_preview').empty().append(html);
}

function GetAllActionSequences() {
    var sequences = [];
    var nbr = $('.action-sequence-accordion').length;

    if (nbr === 0) {
        return sequences;
    }

    for (var i = 1; i <= sequence_counter; i++) {
        var id = 'accordionExample' + i;

        if (!$(id).length) {
            sequences.push({
                Id: GetNewUuid(),
                Name: $('#sq_name_' + i).val(),
                ActionFamily: $('#sq_action_family_' + i).val(),
                Order: parseInt($('#sq_order_' + i).val()),
                ActionPriority: $('#action_priority_drp' + i).val(),
                Placement: $('#sq_placement_' + i).val(),
                Services: GetAllServices(i),
                //relations: GetActionSequenceRelations(i)
            });
        }
    }

    return sequences;
}

function GetAllServices(sequenceId) {
    var services = [];

    var nbr = $('.service-accordion' + sequenceId).length;

    if (nbr === 0) {
        return services;
    }

    var maxIndex = parseInt($('.service-accordion1').last()[0].innerText.replace('Service ', ''));

    for (var i = 1; i <= maxIndex; i++) {
        var id = '#accordionExampleService' + sequenceId + '_' + i;

        if ($(id).length === 1) {
            services.push({
                Id: GetNewUuid(),
                Name: $('#s_name_' + sequenceId + '_'  + i).val(),
                ServiceInstanceId: GetNewUuid(),
                ServiceType: $('#service_type_drp' + sequenceId + '_'  + i).val(),
                IsReusable: $('#reusability_drp' + sequenceId + '_'  + i).val(),
                DesiredStatus: $('#desire_status_drp' + sequenceId + '_' + i).val(),
                ServiceUrl: $('#s_url_' + sequenceId + '_' + i).val(),
                ServiceStatus: $('#s_status_' + sequenceId + '_' + i).val(),
                //relations: GetServiceRelations(sequenceId, i),
                ContainerImage: {
                    Id: GetNewUuid(),
                    Name: $('#ci_name_' + sequenceId + '_'  + i).val(),
                    Timestamp: $('#ci_datetime_' + sequenceId + '_'  + i).val(),
                    Description: $('#ci_descr_' + sequenceId + '_'  + i).val(),
                    K8SDeployment: $('#ci_deployment_infos_' + sequenceId + '_'  + i).val(),
                    K8SService: $('#ci_service_infos_' + sequenceId + '_'  + i).val()
                }
            });
        }
    }

    return services;
}

function ResetFields() {
    alert("This functionality is not implemented yet!");
}

function DeleteActionSequenceBlock(index) {
    $('#accordionExample' + index).remove();
    sequence_counter--;
}

function DeleteServiceBlock(parentSequenceId, serviceId) {
    $('#accordionExampleService' + parentSequenceId + '_' + serviceId).remove();
    //service_counter--;
}

function OnDeleteRootRelationItem(id) {
    $('#relation_accordion' + id).remove();
    root_relation_counter--;
}

function GetNewUuid() {
    var uuid = "";

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5gera/GetNewGuid",
        success: function (resp) {
            uuid = resp;
        }, error: function (resp) {

        }
    });

    return uuid;
}

function CopyJsonIntoClipboard() {
    /* Get the text field */
    var copyText = $('#json_content').text();

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText);

    /* Alert the copied text */
    alert("Json Copied!");
}

async function OnDownloadJsonObject() {

    var obj = $('#json_content').text();

    //var file = new File([obj], GetNewUuid()+'.json', { type: "application/json" });

    //console.log(file);
    //window.location = "file:///" + file;

    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([""+obj], { type: "application/json" }));
    a.download = "config.json";
    a.click();
}

function GetRelationsBlock(type, id) {
    var html = '';

    html += '<fieldset id="'+type+'_relation_'+id+'" class="relation-block' + id + '">';

    if (type === "action_sequence") {
        html +=
            '<legend> <div class="row"><div class="col-10 fs-5">Relations </div><div class="col-2"> <button class="btn btn-primary" onclick="OnAddActionSequenceRelationBlock(' + id + ')"><i class="fa-solid fa-plus"></i></button></div ></div></legend >';
    }
    if (type === "service") {
        html +=
            '<legend> <div class="row"><div class="col-10 fs-5">Relations </div><div class="col-2"> <button class="btn btn-primary" onclick="OnAddServiceRelationBlock(' + id + ')"><i class="fa-solid fa-plus"></i></button></div ></div></legend >';
    }

    html += '</fieldset>';

    return html;
}

function OnAddRelationBlock(sequenceId) {
    var html = '';

    html += '<div class="accordion root-relation-accordion" id="root_relation_accordion' + sequenceId +'">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="heading_relation' + sequenceId +'">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#collapse" aria-expanded="true" aria-controls="collapse">'
    html += 'Relation ';
    html += '</button>'
    html += '<button type="button" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>';
    html +=
        '<div id="collapse" class="accordion-collapse collapse show" aria-labelledby="heading_relation' + sequenceId + '" data-bs-parent="#relation_accordion' + sequenceId +'">';
    html += '<div class="accordion-body">';

    html += '<label class="form-label">Name</label>';
    html += '<input type="text" class="form-control form-control-sm" ><br/>';

    html += '<fieldset id="ra_' + sequenceId +'" class="relation-attributes">';
    html +=
        '<legend> <div class="row"><div class="col-10">Attributes </div><div class="col-2"> <button class="btn btn-primary" onclick="OnAddRelationAttributeBlock(' + sequenceId +')"><i class="fa-solid fa-plus"></i></button></div ></div></legend >';

    html += '</fieldset >';

    html += '<fieldset class="relation-attributes-initiate-from">';
    html += '<legend> Initiates From</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '<fieldset class="relation-attributes-points-to">';
    html += '<legend> Points To</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('.relation-block'+ sequenceId).append(html);
}

var attribute_counter = 0;

function OnRemoveRelationAttribute(id) {
    $('#relation_attribute_accordion' + id).remove();
}

var root_relation_counter = 0;

//ACTION SEQUENCE ROOT
function OnAddActionSequenceBlock() {
    sequence_counter++;
    var html = '';
    html += '<div class="accordion action-sequence-accordion" id="accordionExample' + sequence_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="heading' + sequence_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#collapse' + sequence_counter + '" aria-expanded="true" aria-controls="collapse' + sequence_counter + '">'
    html += 'Action Sequence ' + sequence_counter;
    html += '</button>'
    html += '<button type="button" onclick="DeleteActionSequenceBlock(' + sequence_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>'
    html +=
        '<div id="collapse' + sequence_counter + '" class="accordion-collapse collapse show" aria-labelledby="heading' + sequence_counter + '" data-bs-parent="#accordionExample' + sequence_counter + '">';
    html += '<div class="accordion-body">';
    html += '<label class="form-label">Name</label>';
    html += '<input id="sq_name_' + sequence_counter + '" type="text" class="form-control form-control-sm" >';
    html += '<label class="form-label">Action Family</label>';
    html += '<input id="sq_action_family_' + sequence_counter + '" type="text" class="form-control form-control-sm" >';
    html += '<label class="form-label">Order</label>';
    html += '<input id="sq_order_' + sequence_counter + '" type="number" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Placement</label>';
    html += '<input id="sq_placement_' + sequence_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Action Priority</label>';
    html += '<select id="action_priority_drp' + sequence_counter + '">';
    html += '<option>1-High</option>';
    html += '<option>2-Medium</option>';
    html += '<option>3-Low</option>';
    html += '</select><br></br>';

    //html += GetRelationsBlock("action_sequence", sequence_counter);

    html += '<br/>'
    html += '<fieldset id="services_block_of_parent' + sequence_counter + '">';
    html +=
        '<legend> <div class="row"><div class="col-10 fs-4">Services </div><div class="col-2"> <button class="btn btn-primary" onclick="OnAddServicesBlock(' + sequence_counter + ')"><i class="fa-solid fa-plus"></i></button></div ></div></legend >';
    html += '</fieldset >';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('#action_sequence_block').append(html);
    $("#action_priority_drp" + sequence_counter).chosen({ search_contains: true });

    service_counter = 0;
}

//SERVICE ROOT
function OnAddServicesBlock(sequenceId) {
    service_counter++;

    var html = '';
    html += '<div class="accordion service-accordion' + sequenceId + '" id="accordionExampleService' + sequenceId + '_' + service_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="headingService' + sequenceId + '_' + service_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#collapseService' + sequenceId + '_' + service_counter + '" aria-expanded="true" aria-controls="collapseService' + sequenceId + '_' + service_counter + '">'
    html += 'Service ' + service_counter;
    html += '</button>'
    html += '<button type="button" onclick="DeleteServiceBlock(' + sequenceId + ', ' + service_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>'
    html +=
        '<div id="collapseService' + sequenceId + '_' + service_counter + '" class="accordion-collapse collapse show" aria-labelledby="headingService' + sequenceId + '_' + service_counter + '" data-bs-parent="#accordionExampleService' + sequenceId + '_' + service_counter + '">';
    html += '<div class="accordion-body">';
    html += '<label class="form-label col-4"">Name</label>';
    html += '<input id="s_name_' + sequenceId + '_' + service_counter + '" type="text" class="form-control form-control-sm" ><br/>';
    html += '<label class="form-label col-4">Service Type</label>';
    html += '<select id="service_type_drp' + sequenceId + '_' + service_counter + '">';
    html += '<option value="Web-API">1-Web API</option>';
    html += '<option value="Others">2-Others</option>';
    html += '</select><br></br>';
    html += '<label class="form-label col-4""> Is Reusable ?</label>'
    html += '<select id="reusability_drp' + sequenceId + '_' + service_counter + '">';
    html += '<option value="true">Yes</option>';
    html += '<option value="false">No</option>';
    html += '</select><br></br>';

    html += '<label class="form-label col-4">Desire Status</label>';
    html += '<select id="desire_status_drp' + sequenceId + '_' + service_counter + '">';
    html += '<option value="running">Running</option>';
    html += '<option value="stopped">Stopped</option>';
    html += '</select><br></br>';

    html += '<label class="form-label">Service Url</label>';
    html += '<input id="s_url_' + sequenceId + '_' + service_counter + '" type="url" class="form-control form-control-sm" >';

    html += '<label class="form-label">Service Status</label>';
    html += '<input id="s_status_' + sequenceId + '_' + service_counter + '" type="text" class="form-control form-control-sm" >';

    //html += GetRelationsBlock("service", service_counter);

    html += '<fieldset id="container_image_block">';
    html += '<legend> Container Image</legend>';

    html += '<label class="form-label">Name</label>';
    html += '<input id="ci_name_' + sequenceId + '_' + service_counter + '" type="text" class="form-control form-control-sm" >';

    html += '<label class="form-label">Timestamp</label>';
    html += '<input id="ci_datetime_' + sequenceId + '_' + service_counter + '" type="datetime-local" class="form-control form-control-sm" >';

    html += '<label class="form-label">Description</label>';
    html += '<textarea id="ci_descr_' + sequenceId + '_' + service_counter + '" class="form-control form-control-sm" rows="3"></textarea>';

    html += '<label class="form-label">KBS Deployment String</label>';
    html += '<textarea id="ci_deployment_infos_' + sequenceId + '_' + service_counter + '" class="form-control form-control-sm" rows="3"></textarea>';

    html += '<label class="form-label">KBS Service</label>';
    html += '<input id="ci_service_infos_' + sequenceId + '_'  + service_counter + '" type="text" class="form-control form-control-sm" >';

    html += '</fieldset >';

    html += '</div>'

    $('#services_block_of_parent' + sequenceId).append(html);
    $("#service_type_drp" + sequenceId + '_' + service_counter).chosen({ search_contains: true });
    $("#reusability_drp" + sequenceId + '_' + service_counter).chosen({ search_contains: true });
    $("#desire_status_drp" + sequenceId + '_' + service_counter).chosen({ search_contains: true });
}

//ROOT RELATIONS PART
function OnAddRootRelationBlock() {
    //root_relation_counter++;

    if ($('.root-relation-accordion').last().length === 0) {
        root_relation_counter = 1;
    } else {
        root_relation_counter = parseInt($('.root-relation-accordion').last()[0].innerText.replace('Relation ', '')) + 1
    }

    var html = '';

    html += '<div class="accordion root-relation-accordion" id="relation_accordion' + root_relation_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="heading_relation' + root_relation_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#relation_collapse_item' + root_relation_counter + '" aria-expanded="true" aria-controls="collapse">'
    html += 'Relation ' + root_relation_counter;
    html += '</button>'
    html += '<button type="button" onclick="OnDeleteRootRelationItem(' + root_relation_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>';
    html +=
        '<div id="relation_collapse_item' + root_relation_counter + '" class="accordion-collapse collapse show" aria-labelledby="heading_relation' + root_relation_counter + '" data-bs-parent="#relation_accordion' + root_relation_counter + '">';
    html += '<div class="accordion-body">';

    html += '<label class="form-label">Name</label>';
    html += '<input id="rr_name' + root_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<fieldset id="root_attribute_block' + root_relation_counter + '" class="relation-attributes">';
    html +=
        '<legend> <div class="row"><div class="col-10">Attributes </div><div class="col-2"> <button class="btn btn-primary" onclick="OnAddRootRelationAttributeBlock(' + root_relation_counter + ')"><i class="fa-solid fa-plus"></i></button></div ></div></legend >';

    html += '</fieldset >';

    html += '<fieldset class="relation-attributes-initiate-from">';
    html += '<legend> Initiates From</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input id="rr_init_from_type' + root_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input id="rr_init_from_name' + root_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '<fieldset class="relation-attributes-points-to">';
    html += '<legend> Points To</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input id="rr_point_to_type' + root_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input id="rr_point_to_name' + root_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('#root_relations_block').append(html);
}

function GetRootRelations() {
    var relations = [];

    var nbr = $('.root-relation-accordion').length;

    if (nbr === 0) {
        return relations;
    }

    for (var i = 1; i <= root_relation_counter; i++) {
        var id = 'root_relation_accordion' + i;

        if (!$(id).length) {
            relations.push({
                initiatesFrom: {
                    id: GetNewUuid(),
                    type: $('#rr_init_from_type' + i).val(),
                    name: $('#rr_init_from_name' + i).val()
                },
                relationName: $('#rr_name' + i).val(),
                relationAttributes: GetRootRelationAttributes(i),
                pointsTo: {
                    id: GetNewUuid(),
                    type: $('#rr_point_to_type' + i).val(),
                    name: $('#rr_point_to_name' + i).val()
                }
            });
        }
    }

    return relations;
}

function GetRootRelationAttributes(relationId) {
    var attributes = [];
    var nbr = $('#relation_accordion'+relationId+' .relation-attribute-accordion').length;

    if (nbr === 0) return attributes;

    for (var i = 1; i <= attribute_counter; i++) {
        var id = '#relation_accordion' + relationId +' #relation_attribute_accordion' + i;
        if ($(id).length === 1) {
            attributes.push({
                key: $('#attribute_key' + i).val(),
                value: $('#attribute_value' + i).val()
            });
        }
    }
    return attributes;
}

function OnAddRootRelationAttributeBlock(id) {

    attribute_counter++;
    var html = '';

    html += '<div class="accordion relation-attribute-accordion" id="relation_attribute_accordion' + attribute_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="heading_relation_attribute' + attribute_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_relation_attribute' + attribute_counter + '" aria-expanded="true" aria-controls="collapse">'
    html += 'Attribute ' + attribute_counter;
    html += '</button>'
    html += '<button type="button" onclick="OnRemoveRelationAttribute(' + attribute_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>';
    html +=
        '<div id="collapse_relation_attribute' + attribute_counter + '" class="accordion-collapse collapse show" aria-labelledby="heading_relation_attribute' + attribute_counter + '" data-bs-parent="#relation_attribute_accordion' + attribute_counter + '">';
    html += '<div class="accordion-body">';

    html += '<label class="form-label">Key</label>';
    html += '<input id="attribute_key' + attribute_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Value</label>';
    html += '<input id="attribute_value' + attribute_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>'

    $('#root_attribute_block'+id).append(html);
}


//ACTION SEQUENCE RELATIONS PART
var ac_relation_counter = 0;
var ac_relation_attribute_counter = 0;

function OnAddActionSequenceRelationBlock(sequenceId) {
    if ($('.as-relation-accordion').last().length === 0) {
        ac_relation_counter = 1;
    } else {
        ac_relation_counter = parseInt($('.as-relation-accordion').last()[0].innerText.replace('Relation ', '')) + 1;
    }

    //ac_relation_counter++;

    var html = '';

    html += '<div class="accordion as-relation-accordion" id="as_relation_accordion' + ac_relation_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="s_heading_relation' + ac_relation_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#as_relation_collapse_item' + ac_relation_counter + '" aria-expanded="true" aria-controls="as_relation_collapse_item' + ac_relation_counter + '">'
    html += 'Relation ' + ac_relation_counter;
    html += '</button>'
    html += '<button type="button" onclick="OnDeleteActionSequenceRelationItem(' + ac_relation_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>';
    html +=
        '<div id="as_relation_collapse_item' + ac_relation_counter + '" class="accordion-collapse collapse show" aria-labelledby="s_heading_relation' + ac_relation_counter + '" data-bs-parent="#as_relation_accordion' + ac_relation_counter + '">';
    html += '<div class="accordion-body">';

    html += '<label class="form-label">Name</label>';
    html += '<input id="acr_name' + ac_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<fieldset id="ra_' + ac_relation_counter + '" class="relation-attributes">';
    html +=
        '<legend> <div class="row"><div class="col-10 fs-6">Attributes </div><div class="col-2"> <button class="btn btn-primary" onclick="OnAddACRelationAttributeBlock(' + sequenceId+', ' + ac_relation_counter + ')"><i class="fa-solid fa-plus"></i></button></div ></div></legend >';

    html += '</fieldset >';

    html += '<fieldset class="relation-attributes-initiate-from">';
    html += '<legend> Initiates From</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input id="acr_init_from_type' + ac_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input id="acr_init_from_name' + ac_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '<fieldset id="acr_attribute_" class="relation-attributes-points-to">';
    html += '<legend> Points To</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input id="acr_point_to_type' + ac_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input id="acr_point_to_name' + ac_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('#action_sequence_relation_' + sequenceId).append(html);
    ac_relation_attribute_counter = 0;
}

function OnAddACRelationAttributeBlock(sequenceId, relationId) {

    ac_relation_attribute_counter++;
    var html = '';

    html += '<div class="accordion relation-attribute-accordion" id="relation_attribute_accordion' + ac_relation_attribute_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="heading_relation_attribute' + ac_relation_attribute_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_relation_attribute' + ac_relation_attribute_counter + '" aria-expanded="true" aria-controls="collapse">'
    html += 'Attribute ' + ac_relation_attribute_counter;
    html += '</button>'
    html += '<button type="button" onclick="OnRemoveACRelationAttribute(' + ac_relation_attribute_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>';
    html +=
        '<div id="collapse_relation_attribute' + ac_relation_attribute_counter + '" class="accordion-collapse collapse show" aria-labelledby="heading_relation_attribute' + ac_relation_attribute_counter + '" data-bs-parent="#relation_attribute_accordion' + ac_relation_attribute_counter + '">';
    html += '<div class="accordion-body">';

    html += '<label class="form-label">Key</label>';
    html += '<input id="as_attribute_key' + ac_relation_attribute_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Value</label>';
    html += '<input id="as_attribute_value' + ac_relation_attribute_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    var sp = '#accordionExample' + sequenceId + ' #as_relation_accordion' + relationId + ' #ra_' + relationId;
    $(sp).append(html);

}

function OnDeleteActionSequenceRelationItem(id) {
    $('#as_relation_accordion' + id).remove();
    ac_relation_counter--;
}

function GetActionSequenceRelations(sequenceId) {
    var relations = [];

    var nbr = $('#action_sequence_relation_'+sequenceId+' .as-relation-accordion').length;

    if (nbr === 0) {
        return relations;
    }

    for (var i = 1; i <= ac_relation_counter; i++) {
        var id = 'as_relation_accordion' + i;

        if (!$(id).length) {
            relations.push({
                initiatesFrom: {
                    id: GetNewUuid(),
                    type: $('#acr_init_from_type' + i).val(),
                    name: $('#acr_init_from_name' + i).val()
                },
                relationName: $('#acr_name' + i).val(),
                relationAttributes: GetActionSequenceRelationAttributes(sequenceId, i),
                pointsTo: {
                    id: GetNewUuid(),
                    type: $('#acr_point_to_type' + i).val(),
                    name: $('#acr_point_to_name' + i).val()
                }
            });
        }
    }

    return relations;

}

function GetActionSequenceRelationAttributes(sequenceId, relationId) {
    var attributes = [];
    var selector = '#accordionExample'+sequenceId+' #ra_'+relationId+' .relation-attribute-accordion';

    var nbr = $(selector).length;
    if (nbr === 0) return attributes;

    for (var i = 1; i <= ac_relation_attribute_counter; i++) {
        var id = '#ra_' + relationId + ' #relation_attribute_accordion' + i;
        if ($(id).length === 1) {
            attributes.push({
                key: $('#as_attribute_key'+i).val(),
                value: $('#as_attribute_value'+i).val()
            });
        }
    }
    return attributes;
}

function OnRemoveACRelationAttribute(id) {
    $('#relation_attribute_accordion' + id).remove();
    ac_relation_attribute_counter--;
}

//SERVICE RELATION PART

var s_relation_counter = 0;
var s_relation_attribute_counter = 0;
function OnAddServiceRelationBlock(serviceId) {

    //if ($('.service-relation-accordion').last().length === 0) {
    //    s_relation_counter = 1;
    //} else {
    //    s_relation_counter = parseInt($('.service-relation-accordion').last()[0].innerText.replace('Relation ', '')) + 1;
    //}

    s_relation_counter++;

    var html = '';

    html += '<div class="accordion service-relation-accordion" id="service_relation_accordion' + s_relation_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="s_heading_relation' + s_relation_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#service_relation_collapse_item' + s_relation_counter + '" aria-expanded="true" aria-controls="service_relation_collapse_item' + s_relation_counter + '">'
    html += 'Relation ' + s_relation_counter;
    html += '</button>'
    html += '<button type="button" onclick="OnDeleteServiceRelationItem(' + s_relation_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>';
    html +=
        '<div id="service_relation_collapse_item' + s_relation_counter + '" class="accordion-collapse collapse show" aria-labelledby="s_heading_relation' + s_relation_counter + '" data-bs-parent="#service_relation_accordion' + s_relation_counter + '">';
    html += '<div class="accordion-body">';

    html += '<label class="form-label">Name</label>';
    html += '<input id="acr_name' + s_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<fieldset id="ser_' + s_relation_counter + '" class="relation-attributes">';
    html +=
        '<legend> <div class="row"><div class="col-10 fs-6">Attributes </div><div class="col-2"> <button class="btn btn-primary" onclick="OnAddServiceRelationAttributeBlock(' + serviceId + ', ' + s_relation_counter + ')"><i class="fa-solid fa-plus"></i></button></div ></div></legend >';

    html += '</fieldset >';

    html += '<fieldset class="relation-attributes-initiate-from">';
    html += '<legend> Initiates From</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input id="sr_init_from_type' + s_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input id="sr_init_from_name' + s_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '<fieldset id="sr_attribute_" class="relation-attributes-points-to">';
    html += '<legend> Points To</legend>';
    html += '<label class="form-label">Type</label>';
    html += '<input id="sr_point_to_type' + s_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Name</label>';
    html += '<input id="sr_point_to_name' + s_relation_counter + '" type="text" class="form-control form-control-sm" ><br/>';
    html += '</fieldset>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('#service_relation_' + serviceId).append(html);
    s_relation_attribute_counter = 0;
}

function OnDeleteServiceRelationItem(relationId) {
    $('#service_relation_accordion' + relationId).remove();
    s_relation_counter--;
}

function OnAddServiceRelationAttributeBlock(serviceId, relationId) {
    s_relation_attribute_counter++;
    var html = '';

    html += '<div class="accordion s-relation-attribute-accordion" id="s_relation_attribute_accordion' + s_relation_attribute_counter + '">'
    html += '<div class="accordion-item" >'
    html += '<h2 class="accordion-header row" id="heading_s_relation_attribute' + s_relation_attribute_counter + '">'
    html += '<button class="accordion-button acc-btn col-11" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_s_relation_attribute' + s_relation_attribute_counter + '" aria-expanded="true" aria-controls="collapse">'
    html += 'Attribute ' + s_relation_attribute_counter;
    html += '</button>'
    html += '<button type="button" onclick="OnRemoveServiceRelationAttribute(' + s_relation_attribute_counter + ')" class="btn btn-danger btn-icon acc-btn-close col-1" style="width: 100 %; height: auto;"><i class="fa-solid fa-trash"></i></button >'
    html += '</h2>';
    html +=
        '<div id="collapse_s_relation_attribute' + s_relation_attribute_counter + '" class="accordion-collapse collapse show" aria-labelledby="heading_s_relation_attribute' + s_relation_attribute_counter + '" data-bs-parent="#s_relation_attribute_accordion' + s_relation_attribute_counter + '">';
    html += '<div class="accordion-body">';

    html += '<label class="form-label">Key</label>';
    html += '<input id="service_attribute_key' + s_relation_attribute_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '<label class="form-label">Value</label>';
    html += '<input id="service_attribute_value' + s_relation_attribute_counter + '" type="text" class="form-control form-control-sm" ><br/>';

    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    //var sp = '#accordionExample' + serviceId + ' #ser_' + relationId;
    $('#ser_'+relationId).append(html);
}

function GetServiceRelations(sequenceId, serviceId) {
    var relations = [];

    var nbr = $('#accordionExampleService' + sequenceId + '_' + serviceId +' .service-relation-accordion').length;

    if (nbr === 0) {
        return relations;
    }

    for (var i = 1; i <= nbr; i++) {
        var id = '#service_relation_accordion' + i;

        if ($(id).length === 1) {
            relations.push({
                initiatesFrom: {
                    id: GetNewUuid(),
                    type: $('#sr_init_from_type' + i).val(),
                    name: $('#sr_init_from_name' + i).val()
                },
                relationName: $('#sr_name' + i).val(),
                relationAttributes: GetServiceRelationAttributes(sequenceId, serviceId, i),
                pointsTo: {
                    id: GetNewUuid(),
                    type: $('#sr_point_to_type' + i).val(),
                    name: $('#sr_point_to_name' + i).val()
                }
            });
        }
    }

    return relations;
}

function GetServiceRelationAttributes(sequenceId, serviceId, relationId) {
    var attributes = [];
    var selector = '#accordionExampleService' + sequenceId + '_' + serviceId + ' #service_relation_accordion' + relationId + ' .s-relation-attribute-accordion';

    var nbr = $(selector).length;
    if (nbr === 0) return attributes;

    for (var i = 1; i <= nbr; i++) {
        var id = '#accordionExampleService' + sequenceId + '_' + serviceId + ' #service_relation_accordion' + relationId + ' #s_relation_attribute_accordion' + i;
        if ($(id).length === 1) {
            attributes.push({
                key: $('#service_attribute_key' + i).val(),
                value: $('#service_attribute_value' + i).val()
            });
        }
    }
    return attributes;
}

function OnRemoveServiceRelationAttribute(id) {
    $('#s_relation_attribute_accordion' + id).remove();
    s_relation_attribute_counter--;
}

function ImportTask() {
    var instance = {
        Id: GetNewUuid(),
        Name: $('#instance_name').val(),
        TaskPriority: $('#task_priority_drp').val(),
        ActionSequence: GetAllActionSequences(),
        //relations: GetRootRelations()
    };

    var obj = JSON.stringify(instance);

    $.ajax({
        async: false,
        type: "POST",
        url: "/_5gera/ImportTask",
        data: {
            obj: obj
        },
        beforeSend: function() {
            $('#main-platform-content').LoadingOverlay("show", {
                text: "Loading...",
                textColor: "#131313",
                imageColor: "#3e4b5b",
            });
        },
        success: function (resp) {

            var res = JSON.parse(resp.data.result);
            if (res.hasOwnProperty('actionPlanId')) {
                swal({
                    title: "Success!",
                    icon: "success",
                    text: "Task imported successfully!",
                    buttons: "Done"
                });
            }
            else if (res.hasOwnProperty('statusCode') && res.statusCode === 400) {
                swal({
                    title: "Error!",
                    text: res.message,
                    icon: "warning",
                    buttons: "Done",
                    dangerMode: true
                });
            }
            else {
                console.log(res);
                swal({
                    title: "Error!",
                    text: res.title,
                    icon: "warning",
                    buttons: "Done",
                    dangerMode: true
                });
            }
            
        },
        complete: function() {
            $('#main-platform-content').LoadingOverlay("hide");
        }
    });
}
