### Environmental Variables
* USE_REAL_DATA set to 1 to pull data each time server starts. This can use up your API requests...also it will take up to 20 seconds to populate all the data.  I take the d3 object from index.js and stringify it as JSON into data.json.  Then set this variable to 0 to use this local file.
* DEVSESSION backdoor for autologin while developing. Probably want this set to 0, but if you end up restarting the server a bunch of times while working on code, then set this to 1, and checkout the devSession variable in 
```
app.use("/")
```
* MEETUP_KEY you can get this at https://secure.meetup.com/meetup_api/key/
* MEETUPVIEWER_MONGO address of mongod server, mine is at: "mongodb://localhost/meetup"

### Install NPM Modules
Running
```
npm install
```
Should do the trick.