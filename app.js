// Immediately Invoked Function Expression for DATA CONTROLLER
var dataController = (function() {
  // function constructor for expenses
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round(100 * (this.value / totalIncome));
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

  // function constructor for income
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.totals[type] = sum;
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
    },
    budget: 0,
    percentage: -1
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
    },

    deleteItem: function(type, id) {
      var ids, index;
      // use map method to create an array with ids
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      // index will be -1 if id is not in array
      index = ids.indexOf(id);
      // check if id exists in array before deletion
      if(id !== -1) {
        // use splice method to delete item with matching id
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate budget = income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate percentage of income spent on each expense
      if(data.totals.inc > 0) {
        data.percentage = Math.round(100 * (data.totals.exp / data.totals.inc));
      } else {
        data.percentage = -1;
      }

    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
          cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPercentages = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    }
  }

})();

// Immediately Invoked Function Expression for UI CONTROLLER
var uiController = (function() {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensePercentLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type) {
    var numSplt, integer, decimal;
    // get absolute value of num
    num = Math.abs(num);
    // change num to a decimal with 2 decimal places
    num = num.toFixed(2);
    // splite integer and decimal parts of num
    numSplt = num.split('.');
    integer = numSplt[0];
    decimal = numSplt[1];
    if(integer.length > 3) {
      integer = integer.substr(0, integer.length-3) + ',' + integer.substr(integer.length-3, integer.length-1);
    }
    type === 'exp' ? sign = '-' : sign = '+';
    return sign + ' ' + integer + '.' + decimal;
  };

  var nodeListForEach = function(list, callback) {
    for(var i=0; i<list.length; i++) {
      callback(list[i], i);
    }
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
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(item, type) {
      var htmlStr, newHtmlStr, element;

      // 1. create HTML str with placeholder text-transform
      if(type === 'exp') {
        element = DOMstrings.expenseContainer;
        htmlStr = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>\
        <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>\
        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
        </div></div></div>'
      } else if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        htmlStr = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>\
        <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">\
        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      // 2. replace placeholder text with actual item data
      //  uses built in str method replace
      newHtmlStr = htmlStr.replace('%id%', item.id);
      newHtmlStr = newHtmlStr.replace('%description%', item.description);
      newHtmlStr = newHtmlStr.replace('%value%', formatNumber(item.value, type));
      // 3. insert HTML into DOM
      // uses built in insertAdjacentHTML method
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtmlStr);
    },

    deleteListItem: function(selectorId) {
      var element;
      element = document.getElementById(selectorId);
      element.parentNode.removeChild(element);
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

    displayBudget: function(obj) {
      var type;
      obj.budget >= 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

      if(obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensePercentLabel);

      nodeListForEach(fields, function(current, index) {
        if(percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }

      });
    },

    displayMonth: function() {
      var today, year, month, months;
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      // set variable to today's date object
      today = new Date();
      // extract year and month from date
      year = today.getFullYear();
      month = today.getMonth();
      // display month and year in DOM
      document.querySelector(DOMstrings.dateLabel).textContent = months[month-1] + ' ' + year;
    },

    changedType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
      );

      nodeListForEach(fields, function(current) {
        current.classList.toggle('red-focus');
      });
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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changedType);
  };

  var updateBudget = function() {
    // 1. calculate budget
    dataCtrl.calculateBudget();

    // 2. return budget
    var budget = dataCtrl.getBudget();

    // 3. display budget
    uiCtrl.displayBudget(budget);
  };

  var updatePercentages = function() {
    // calculate percentages
    dataCtrl.calculatePercentages();

    //  read percentages from data CONTROLLER
    var percentages = dataCtrl.getPercentages();

    //  update UI with new percentages
    uiCtrl.displayPercentages(percentages);
  };

  // click event listener for add__btn
  var ctrlAddItem = function() {
    var input, newItem;
    // 1. get user input data
    input = uiCtrl.getInput();

    // ensure that user input is not empty
    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. add user input item to data controller
      newItem = dataCtrl.addItem(input.type, input.description, input.value);

      // 3. add new item to UI
      uiCtrl.addListItem(newItem, input.type);

      // 4. clear input fields after reading data
      uiCtrl.clearFields();

      // 5. calculate and update budget
      updateBudget();

      // 6. calculate and update percentages
      updatePercentages();
    }

  };

  // click event listener for container
  var ctrlDeleteItem = function(event) {
    var itemId, splitID, type, id;
    // event.target identifies element from where the click originated
    // .parentNode climbs up a level to show parent of element
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // extract item type and id from event listener target
    if(itemId) {
      // split str at -
      splitID = itemId.split('-');
      // exp or inc
      type = splitID[0];
      //  numerical id
      id = parseInt(splitID[1]);
      // delete item from data structure
      dataCtrl.deleteItem(type, id);

      // delete item from DOM
      uiCtrl.deleteListItem(itemId);

      // update budget
      updateBudget();

      // update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      uiCtrl.displayMonth();
      uiCtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setUpEventListeners();
    }
  }

})(dataController, uiController);

appController.init();
