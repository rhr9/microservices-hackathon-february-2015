// Generated by LiveScript 1.3.1
(function(){
  this.Combo = (function(){
    Combo.displayName = 'Combo';
    var prototype = Combo.prototype, constructor = Combo;
    function Combo(url){
      var this$ = this instanceof ctor$ ? this : new ctor$;
      this$.url = url;
      this$.subs = {};
      this$.buffers = {};
      return this$;
    } function ctor$(){} ctor$.prototype = prototype;
    prototype.request = function(method, path, headers, data, callback){
      var dataBuffer, req, k, v;
      dataBuffer = JSON.stringify(data);
      req = createCORSRequest(method, this.url + path);
      req.setRequestHeader('Content-Type', 'application/json');
      if (headers) {
        for (k in headers) {
          v = headers[k];
          req.setRequestHeader(k, v);
        }
      }
      req.onload = function(){
        var result;
        result = req.responseText;
        if (req.status >= 200 && req.status < 300) {
          console.log("Success: " + path);
          if (callback) {
            return callback(result && JSON.parse(result));
          }
        } else {
          console.log(JSON.stringify(data));
          return console.log("Error: " + req.status + " for " + method + " " + path);
        }
      };
      if (data) {
        return req.send(dataBuffer);
      } else {
        return req.send();
      }
    };
    prototype.list = function(callback){
      return this.request('GET', '/topics', null, null, callback);
    };
    prototype.publish = function(topic_name, after_id, fact, callback){
      return this.request('POST', "/topics/" + topic_name + "/facts", null, fact, callback);
    };
    prototype.get = function(topic_name, after_id, callback){
      if (after_id) {
        after_id = "?" + after_id;
      } else {
        after_id = "";
      }
      return this.request('GET', ("/topics/" + topic_name + "/facts") + after_id, null, null, callback);
    };
    prototype.subscribe = function(topic_name, callback){
      console.log("Subscribing to " + topic_name + "...");
      return this.request('POST', "/topics/" + topic_name + "/subscriptions", null, null, callback);
    };
    prototype.next = function(topic_name, subscription_id, timeout, callback){
      return this.request('GET', "/topics/" + topic_name + "/subscriptions/" + subscription_id + "/next", null, null, callback);
    };
    prototype.use = function(topic_names){
      var i$, len$, results$ = [];
      for (i$ = 0, len$ = topic_names.length; i$ < len$; ++i$) {
        results$.push((fn$.call(this, topic_names[i$])));
      }
      return results$;
      function fn$(topic_name){
        var this$ = this;
        this.buffers[topic_name] = [];
        return this.subscribe(topic_name, function(result){
          var subscription_id, run;
          console.log("Subscription succeeded: " + result);
          subscription_id = result.subscription_id;
          console.log("Running worker...");
          return (run = function(){
            return this$.next(topic_name, subscription_id, 30, function(item){
              if (item) {
                if (this$.subs[topic_name]) {
                  this$.subs[topic_name](item);
                } else {
                  this$.buffers[topic_name].push(item);
                }
              }
              return run();
            });
          })();
        });
      }
    };
    prototype.listen = function(topic_name, callback){
      var i$, ref$, len$, item;
      this.subs[topic_name] = callback;
      for (i$ = 0, len$ = (ref$ = this.buffers[topic_name]).length; i$ < len$; ++i$) {
        item = ref$[i$];
        callback(item);
      }
      return this.buffers[topic_name] = [];
    };
    prototype.unlisten = function(topic_name){
      return this.subs[topic_name] = null;
    };
    return Combo;
  }());
}).call(this);
