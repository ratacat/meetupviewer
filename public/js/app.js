$(function() {
	render("eventTemplate","eventsContainer");
});


//renders all templates and appends them inside targetId element
function render(templateId,targetId) {
	//console.log("render init");
	//get json and build template view
    $.get('/events').done(function(events) {
    	$("#" + targetId).html('');
        _.each(events,function(event,index,list) {
         	//console.log("data: " + element);
            var template = _.template($("#" + templateId).html());
           // console.log(template);
           //first key in object sets the variable in the template
           console.log("event: " + event);
            $("#" + targetId).append(template({event: event}));
        });

    });
}