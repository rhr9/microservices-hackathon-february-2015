// Generated by LiveScript 1.3.1
(function(){
  this.createCORSRequest = function(method, url){
    var xhr;
    xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      xhr = null;
    }
    return xhr;
  };
}).call(this);
