// Immediately Invoked Function Expression for data controller
var dataController = (function() {
  var x = 23;
  var add = function(a) {
    return x + a;
  }

  return {
    publicTest: function(b) {
      return (add(b));
    }
  }
})();

// Immediately Invoked Function Expression for UI controller
var uiController = (function() {

})();


// Immediately Invoked Function Expression for app controller
var appController = (function(dataCtrl, uiCtrl) {
  var z = dataCtrl.publicTest(15);

  return {
    anotherPubicTest: function() {
      console.log(z);
    }
  }
})(dataController, uiController);
