var _ = require("lodash");
var Data = function(){}

Data.prototype.getAll = function(url, callback, eventsSoFar) {
  url = url ? url : "https://api.meetup.com/2/open_events.json?zip=94703&city=berkeley&page=200&status=upcoming&time=-1d%2C4d&radius=25.0&key=" + process.env.MEETUP_KEY;
  eventsSoFar = eventsSoFar || [];
  console.log('fetching... ' + url);
  that = this;
  require('request')(
    url,
    function ( err, resp, body ) {
        body = JSON.parse(body);
        var data = body.results;
      
      if ( err || body.error ) {
        callback( err || body.error );
      } else {
      
        if ( data.length > 0 ) {
          // something was returned... keep on keepin on
          while ( next = data.pop() ) {
            eventsSoFar.push( next );
          }
          if (!body.meta.next) {
            callback( null, eventsSoFar );
          } else {
            that.getAll( body.meta.next, callback, eventsSoFar);
          }
        } else {
          // we're done! call the callback!
          callback( NULL, eventsSoFar );
        }
      }
    }
  );
  
}

 Data.prototype.prepare = function(oldEvent) {
  function splice(str, index, count, add) {
    return str.slice(0, index) + (add || "") + str.slice(index + count);
  }

// console.log("before unique:"+oldEvent.length);
   var newArr = [];
  
  var unique = _.uniq(oldEvent,'name');
  oldEvent = unique;

  var weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  
  for (i=0;i<oldEvent.length;i++){
    var date = new Date(oldEvent[i].time);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var newEvent = {};

    newEvent.title = (oldEvent[i].name.length < 78 ? oldEvent[i].name : splice(oldEvent[i].name,75,75) + "...").toLowerCase();

    newEvent.time = hours + ':' + minutes.substr(minutes.length-2) + ':' + seconds.substr(seconds.length-2);
    newEvent.time = date.toString("h:mm tt").toLowerCase();
    newEvent.timestamp = oldEvent[i].time;
    newEvent.url = oldEvent[i].event_url;
    newEvent.city = oldEvent[i].hasOwnProperty("venue") ? oldEvent[i].venue.city : "----------";
    newEvent.city = (newEvent.city.length < 15 ? newEvent.city : splice(newEvent.city,15,75)).toLowerCase();
    newEvent.groupId = oldEvent[i].group.id;
    newEvent.groupName = oldEvent[i].group.name;
    newEvent.date = (weekdays[date.getDay()] + " " + date.getDate()).toLowerCase();

    newArr.push(newEvent);
  }

  newArr.sort(function(a,b){
    return a.timestamp - b.timestamp;
  });

  return newArr;
}

module.exports = Data;