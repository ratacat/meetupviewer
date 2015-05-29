$(function() {
	render("eventTemplate","eventsContainer",buildParams());

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
			render("eventTemplate","eventsContainer",buildParams());
		}
	});
}



function buildParams() {
	var resultParams = [];
	var resultString;
	var cityString = null;
	var followString = $("div#follow .button").hasClass("toggleFollow") ? "follows=1" : null;
	$("#city .button").each(function(i,ele) {if ($(ele).hasClass("loc_selected")){cityString = "city="+encodeURIComponent($(ele).text());}});

	if (cityString) {resultParams.push(cityString);}
	if (followString) {resultParams.push(followString);}
	if (!cityString && !followString) {return '';}

	for (i=0;i<resultParams.length;i++) {
		if (i===0) {resultString = "?"+resultParams[0];}
		if (i>0) {
			resultString = resultString + "&" + resultParams[i]
		}
	}

	console.log("resultString: "+resultString);
	return resultString;
}

function toggleFollowFilter(Obj){
	$follow = $("div#follow .button");
	if ($follow.hasClass("toggleFollow")) {
		$follow.removeClass("toggleFollow");
	} else {
		$follow.addClass("toggleFollow");
	}
	$query = buildParams();
	render("eventTemplate","eventsContainer",buildParams());
}

function toggleCityFilter(Obj) {
	var city = $(Obj).text();
	//var cityString = "?city=" +encodeURIComponent(city);
	$("#city .button").removeClass('loc_selected');
	$(Obj).parent().addClass('loc_selected');
	render("eventTemplate","eventsContainer",buildParams());
}

//renders all templates and appends them inside targetId element

function render (templateId,targetId,params) {
	var groups,followed;
	var queryAddr = "/events" + params;
	console.log("query: "+queryAddr);
	//get json and build template view
    $.get(queryAddr).done(function(events) {
    	$.get("/follows").done(function(groups) {
	    	$("#" + targetId).html('');
	        _.each(events,function(event,index,list) {
	            var template = _.template($("#" + templateId).html());

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