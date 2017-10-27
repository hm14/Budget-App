// Immediately Invoked Function Expression for DATA CONTROLLER
var dataController = (function() {
  // function constructor for expenses
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // function constructor for income
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  }

})();

// Immediately Invoked Function Expression for UI CONTROLLER
var uiController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    // 1. get user input data
    getInput: function() {
      // return object with all 3 values extracted from user input
      return {
        // get user input for item type, description and value
        // type will be inc for income or exp for expense
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };

})();

// Immediately Invoked Function Expression for APP CONTROLLER
var appController = (function(dataCtrl, uiCtrl) {

  var setUpEventListeners = function() {
    var DOM = uiCtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    // return key press event listener for page
    document.addEventListener('keypress', function(event) {
      // 1. check if event's keyCode or which equals return key press
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  }

  // click event listener for add__btn
  var ctrlAddItem = function() {
    // 1. get user input data
    var input = uiCtrl.getInput();
    // console.log(input.type);
    // console.log(input.description);
    // console.log(input.value);

    // 2. add user input item to data controller

    // 3. add new item to ui

    // 4. calculate budget

    // 5. display budget
  };

  return {
    init: function() {
      setUpEventListeners();
    }
  }

})(dataController, uiController);

appController.init();
