var data = require("./data.json");
data = data.results;
var newData = [];

//for object with meta info chopped off
// var output = function(data) {
// 	for(i=0;i<data.length;i++) {
// 		var city;
// 		var title = data[i].name;
// 		var timestamp = data[i].time;
// 		if (data[i].hasOwnProperty("venue")) {
// 			city = data[i].venue.city;
// 		} else {
// 			city = "-------";
// 		}
// 		console.log(i + "  " + city + " "+formatAsDay(timestamp)+" " + formatAsTime(timestamp) + "  " + title);
// 	}
// };

var buildOneEvent = function(oldEvent) {
	var newEvent = {};
	var weekdays = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
	var date = new Date(oldEvent.time);

	//title
	newEvent.title = oldEvent.name;
	
	//time
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	newEvent.time = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);

	//url
	newEvent.url = oldEvent.event_url;

	//city
	newEvent.city = oldEvent.hasOwnProperty("venue") ? oldEvent.venue.city : "----------";

	//date
	newEvent.date = weekdays[date.getDay()] + " " + date.getDate();
	return newEvent;
}

for (i=0;i<data.length;i++){
	newData.push(buildOneEvent(data[i]));
}



// var obj = function (a, b) {
//   if (+a.time > +b.time) {
//     return 1;
//   }
//   if (+a.time < +b.time) {
//     return -1;
//   }
//   // a must be equal to b
//   return 0;
// }


// var formatAsDay = function(timestamp){
// 	weekdays = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
// 	var date = new Date(timestamp);

// 	return weekdays[date.getDay()] + " " + date.getDate();
// }

// var formatAsTime = function(timestamp){
// 	var date = new Date(timestamp);
// 	// hours part from the timestamp
// 	var hours = date.getHours();
// 	// minutes part from the timestamp
// 	var minutes = "0" + date.getMinutes();
// 	// seconds part from the timestamp
// 	var seconds = "0" + date.getSeconds();

// 	// will display time in 10:30:23 format
// 	var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);

// 	return formattedTime;
// }

//module.exports.sorts = sorts;
// module.exports.out = output;
// module.exports.query = q;
// module.exports.obj = obj;

var base = "https://api.meetup.com/2/open_events.json";
var zip = "94703";
var time = "-1d,2d";
var status = "upcoming";
var key = "31725141c7d574a794053611745241f";
var radius = "3";
var page = "500";

var q = base + 
"?zip=" + zip +
"&time=" + time +
"&status=" + status +
"&radius=" + radius +
"&page=" + page +
"&key=" + key;

module.exports.data = newData;
module.exports.query = q;