// Immediately Invoked Function Expression for DATA CONTROLLER
var dataController = (function() {

})();

// Immediately Invoked Function Expression for UI CONTROLLER
var uiController = (function() {

})();

// Immediately Invoked Function Expression for APP CONTROLLER
var appController = (function(dataCtrl, uiCtrl) {
  // click event listener for add__btn
  var ctrlAddItem = function() {
    // 1. get user input data

    // 2. add user input item to data controller

    // 3. add new item to ui

    // 4. calculate budget

    // 5. display budget
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  // return key press event listener for page
  document.addEventListener('keypress', function(event) {
    // 1. check if event's keyCode or which equals return key press
    if(event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(dataController, uiController);
