var base = "https://api.meetup.com/2/open_events.json";
var zip = "94703";
var time = "-1d,2";
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

little = [
	{name: "heibi", age: 7},
	{name:"charles", age: 9},
	{name: "Frona", age: 1}
];


//console.log(q);

var output = function(data) {
	for(i=0;i<data.results.length;i++) {
		var city;
		var title = data.results[i].name;
		var timestamp = data.results[i].time;
		if (data.results[i].hasOwnProperty("venue")) {
			var city = data.results[i].venue.city;
		} else {
			var city = "-------";
		}
		console.log(i + "  " + city + " "+formatAsDay(timestamp)+"  " + formatAsTime(timestamp) + "  " + title);
	}
};

var out = function(data) {
	for(i=0;i<data.length;i++) {
		var city;
		var title = data[i].name;
		var timestamp = data[i].time;
		if (data[i].hasOwnProperty("venue")) {
			var city = data[i].venue.city;
		} else {
			var city = "-------";
		}
		console.log(i + "  " + city + " "+formatAsDay(timestamp)+" " + formatAsTime(timestamp) + "  " + title);
	}
};

var sorts = [];

function obj (a, b) {
  if (+a.time > +b.time) {
  	sorts.push({atime: a.time, btime: b.time, return: 1});
    return 1;
  }
  if (+a.time < +b.time) {
  	sorts.push({atime: a.time, btime: b.time, return: -1});
    return -1;
  }
  // a must be equal to b
  sorts.push({atime: a.time, btime: b.time, return: 0});
  return 0;
}

// var sortObject = function(obj) {
//     var arr = [];
//     for (var prop in obj) {
//         if (obj.hasOwnProperty(prop)) {
//             arr.push({
//                 'key': prop,
//                 'value': obj[prop]
//             });
//         }
//     }
//     arr.sort(function(a, b) { return a.value - b.value; });
//     //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
//     return arr; // returns array
// }

var formatAsDay = function(timestamp){
	weekdays = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
	var date = new Date(timestamp);

	return weekdays[date.getDay()] + " " + date.getDate();
}

var formatAsTime = function(timestamp){
	var date = new Date(timestamp);
	// hours part from the timestamp
	var hours = date.getHours();
	// minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// seconds part from the timestamp
	var seconds = "0" + date.getSeconds();

	// will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);

	return formattedTime;
}

module.exports.sorts = sorts;
module.exports.output = output;
module.exports.out = out;
module.exports.query = q;
module.exports.obj = obj;