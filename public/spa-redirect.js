(function(l) {
  if (l.search[1] === '/') {
    document.onready = function() {
      var newLink = l.pathname.slice(0, -1) + l.search.slice(1) + l.hash;
      window.history.replaceState(null, null, newLink);
    };
  }
}(window.location))
