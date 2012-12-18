## up-client
#### Node.js client for the (unofficial) Jawbone UP API

### Installation
```bash
npm install up-client
```

### Basic Use
```javascript
var up = require('up-client');

// First, let's authorize a user and get their unique id (XID)
up.authorize('someone@email.com', 'somePassword', function (err, xid) {
     // Next, let's take a look at their activity summary
     up.summary(xid, function (err, result) {
        console.dir(result);    // Ta da!
     });
});
```

### Testing
```bash
npm test
```