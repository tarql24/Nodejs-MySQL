var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: '',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  ProductList();
});

function ProductList() {
  connection.query('SELECT * FROM products', function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          ' | ' +
          res[i].product_name +
          ' | ' +
          res[i].department_nameprice +
          ' | ' +
          res[i].stock_quantity
      );
    }

    runSearch();
  });
}

//=================================Item selection and Quantity desired===============================

function runSearch() {
  inquirer
    .prompt([
      {
        name: 'itemID',
        type: 'input',
        message: 'Select Porduct ID you want to buy:'
      },
      {
        name: 'quantity',
        type: 'input',
        message: 'Select how many ou want to buy:'
      }
    ])
    .then(function(answer) {
      var query = 'SELECT * FROM products WHERE ?';
      connection.query(query, { item_id: answer.itemID }, function(err, res) {
        var cost = res[0].department_nameprice;
        console.log(
          'Item ID: ' +
            res[0].item_id +
            ' || ' +
            res[0].product_name +
            ' || $' +
            res[0].department_nameprice +
            ' || Qty: ' +
            res[0].stock_quantity
        );
        var cost = res[0].department_nameprice;
        if (answer.quantity <= res[0].stock_quantity) {
          var newAmount = connection.query(
            'UPDATE products SET ? WHERE ?',
            [
              {
                stock_quantity: res[0].stock_quantity - answer.quantity
              },
              {
                item_id: answer.itemID
              }
            ],
            function(err, res) {
              console.log(
                'Thank you for order total cost is: $' +
                  (cost * answer.quantity).toFixed(2) +
                  '\nThank You for Shopping with us come see us again!'
              );
            }
          );
        } else {
          console.log(
            'Sorry we do not have that many items in stock. Come back later'
          );
        }
        connection.end();
      });
    });
}
