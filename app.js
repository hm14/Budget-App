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

  // data structure for item data
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, description, value) {
      var newItem, id;
      // create id
      if(data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // create new item based on item type
      if(type === 'inc') {
          newItem = new Income(id, description, value);
      } else if(type === 'exp') {
          newItem = new Expense(id, description, value);
      }
      // push newly created item to relevant array
      data.allItems[type].push(newItem);
      // return newly added item
      return newItem;
    }
  };

})();

// Immediately Invoked Function Expression for UI CONTROLLER
var uiController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  };

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

    addListItem: function(item, type) {
      var htmlStr, newHtmlStr, element;

      // 1. create HTML str with placeholder text-transform
      if(type === 'exp') {
        element = DOMstrings.expenseContainer;
        htmlStr = '<div class="item clearfix" id="expense-%0%"><div class="item__description">%description%</div>\
        <div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div>\
        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
        </div></div></div>'
      } else if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        htmlStr = '<div class="item clearfix" id="income-%0%"><div class="item__description">%description%</div>\
        <div class="right clearfix"><div class="item__value">+%value%</div><div class="item__delete">\
        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // 2. replace placeholder text with actual item data
      //  uses built in str method replace
      newHtmlStr = htmlStr.replace('%id%', item.id);
      newHtmlStr = newHtmlStr.replace('%description%', item.description);
      newHtmlStr = newHtmlStr.replace('%value%', item.value);

      // 3. insert HTML into DOM
      // uses built in insertAdjacentHTML method
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtmlStr);
    },

    // clear input fields after reading input
    clearFields: function() {
      var fields, fieldsArray;
      // document.querySelectorAll() will return a list
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      // use array slice method for a list
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = "";
      });
      // bring cursor back to second input element after clearing input
      fieldsArray[0].focus();
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
    var input, newItem;
    // 1. get user input data
    input = uiCtrl.getInput();

    // 2. add user input item to data controller
    newItem = dataCtrl.addItem(input.type, input.description, input.value);

    // 3. add new item to UI
    uiCtrl.addListItem(newItem, input.type);

    // 4. clear input fields after reading data
    uiCtrl.clearFields();

    // 5. calculate budget

    // 6. display budget
  };

  return {
    init: function() {
      setUpEventListeners();
    }
  }

})(dataController, uiController);

appController.init();
