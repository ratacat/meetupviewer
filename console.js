var REPL = require("repl");
var api = require("./api.js");
var db = require("./models");
var repl = REPL.start("api > ");

var meetup = require('./node_modules/meetup-api/lib/meetup')({
	key: process.env.MEETUP_KEY
});




// var pull = function(cb) {
// var request = {
// 	//member_id: 'self',
// 	zip: "94703",
//     time: "-1d,2d",
//     status: "upcoming",
//     radius: "25",
//     key: process.env.MEETUP_KEY};

//  meetup.getOpenEvents(request, function(err, events){
//  	cb(err,events,events.meta.next);
//  });
// }

// data = pull(receive);

// var receive = function(err,events,next){

// }




function get_all_meetup_events( url, callback, eventsSoFar, bodyBag ) {
  
  eventsSoFar = eventsSoFar || [];
  
  // if( tok_or_url.substr(0,4) == 'http' ) url = tok_or_url;
  // else url = 'https://graph.facebook.com/me/friends?access_token=' + tok_or_url;
  
  // we are going to call this recursively, appending the users as we go
  // until facebook decides we don't have anymore friends ( so this shouldn't take long )
  // then we pass that list of friends to the callback
  
  console.log('fetching... ' + url);
  require('request')(
    url,
    function ( err, resp, body ) {
     		var body = JSON.parse(body),
        	data = body.results;
      
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
          	get_all_meetup_events( body.meta.next, callback, eventsSoFar, bodyBag );
          }
        } else {
          // we're done! call the callback!
          callback( NULL, eventsSoFar );
        }
      }
    }
  );
  
}

// var getData = function() {
//   var meetupAPI = "https://api.meetup.com/2/open_events.json?";
//   $.getJSON( meetupAPI, {
//     zip: "94703",
//     time: "-1d,2d",
//     status: "upcoming",
//     radius: "3",
//     key: process.env.MEETUP_KEY
//   })
//     .done(function( data ) {
//       $.each( data.results, function( i, event ) {
//       	console.log(event.name)
//       });
//     });
// }

query = "https://api.meetup.com/2/open_events.json?zip=94703&city=berkeley&page=200&status=upcoming&time=-1d%2C4d&radius=25.0&key=" + process.env.MEETUP_KEY;

//getAll(query,function(err,data){},d);

repl.on("exit", function () {
  console.log("GOODBYE!!");
  process.exit();
});

//var code = require("node-codein");
repl.context.query = query;
//repl.context.data = data;
//repl.context.pull = pull;
repl.context.getAll = get_all_meetup_events;
repl.context.meetup = meetup;
repl.context.api = api;
repl.context.db = db;
