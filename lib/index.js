/**
 * Node.js client for the (unofficial) Jawbone UP API
 *
 * @package up-client
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var cork    = require('cork');

/**
 * Constructor
 */
function Client () {
    var self = this;

    // Register the API defaults with cork
    cork.register('up', {
        method:     'GET',
        base:       'https://jawbone.com',
        throttle:   100
    });

    // Token storage object
    self.tokens = Object.create(null);

    // Request handler
    self.request = function (xid, path, qs, callback) {
        if (typeof self.tokens[xid] === 'undefined') return callback('Unauthorized');
        
        cork.request('up', {
            method: 'GET',
            uri:    '/nudge/api/v.1.0/users/' + xid + path,
            qs:     qs,
            headers: {
                'User-Agent': 'Nudge/2.1.10 CFNetwork/609 Darwin/13.0.0',
                'x-nudge-token': self.tokens[xid]                
            }
        }, function (err, result) {
            if (err) return callback(err);
            try {
                return callback(null, JSON.parse(result));
            } catch (e) {
                return callback(e);
            }
        });
    }
};

/**
 * Authorization handler.
 *
 * @param {String} Email address
 * @param {String} Password
 * 
 * @return {String} User's XID
 */
Client.prototype.authorize = function (email, password, callback) {
    var self = this;

    cork.request('up', {
        method:     'POST',
        uri:        '/user/signin/login',
        form:       {
            email:      email.toLowerCase(),
            pwd:        password,
            service:    'nudge'
        }
    }, function (err, response) {
        if (err) return callback(err);
        try {
            response = JSON.parse(response);
            if (typeof response.token === 'undefined') return callback('Unauthorized');

            self.tokens[response.user.xid] = response.token;
            return callback(null, response.user.xid);
        } catch (e) {
            return callback(e);
        }
    });
}

/**
 * Feed for the specified user by XID.
 *
 * @param {String} User XID (see API docs)
 *
 * @return {Object}
 */
Client.prototype.feed = function (xid, callback) {
    this.request(xid, '/social', {}, callback);
}

/**
 * Steps information by day for last 30 days.
 *
 * @param {String} User XID (see API) docs
 *
 * @return {Object}
 */
Client.prototype.summary = function (xid, callback) {
    this.request(xid, '/healthCredits', {}, callback);
};

/**
 * Sleep information by day for last 30 days.
 *
 * @param {String} User XID (see API) docs
 *
 * @return {Object}
 */
Client.prototype.sleep = function (xid, callback) {
    this.request(xid, '/sleeps', {}, callback);
};

/**
 * Workout information by day for last 30 days.
 *
 * @param {String} User XID (see API) docs
 *
 * @return {Object}
 */
Client.prototype.workout = function (xid, callback) {
    this.request(xid, '/workouts', {}, callback);
};

/**
 * Export
 */
module.exports = new Client();
