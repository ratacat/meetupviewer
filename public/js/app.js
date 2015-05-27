$(function() {
	render("eventTemplate","eventsContainer");

});

function sendFollow(event) {
	var groupId = $(event).data().id;
	$.ajax({
		url: "/follow/" + groupId,
		type: "POST",
		success: function(data,status) {
			console.log("ajax-data:"+data);
			console.log("ajax-status:"+status);
			//lets rerender everything?
			render("eventTemplate","eventsContainer");
		}
	});
}

//renders all templates and appends them inside targetId element
function render(templateId,targetId) {
	var groups,followed;

	//get json and build template view
    $.get('/events').done(function(events) {
    	$.get("/follows").done(function(groups) {
	    	$("#" + targetId).html('');
	        _.each(events,function(event,index,list) {
	         	//console.log("data: " + element);
	            var template = _.template($("#" + templateId).html());
	           // console.log(template);
	           //first key in object sets the variable in the template
	           //console.log("event: " + event);
	           //console.log("event.groupId: "+ event.groupId);
	           if (groups.indexOf(event.groupId) > 0) {followed = 'followed'} else {followed=''}
	            $("#" + targetId).append(template({event: event,f: followed}));
	        });
	        //lets add all of the onclick events at once
			//note: because this requires follow data, if user is not logged in
			//no data can be returned, and it breaks the whole render
	        $("div.event div.follow:not(div.followed)").attr("onclick","sendFollow(this)");
        });

    });
}