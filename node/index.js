const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const DbConfig = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

const conn = mysql.createConnection(DbConfig);

const getRandomInt = function (min, max) {

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const criarTabela = async function() {

  await conn.query("show tables like 'people'", async function (err, result, fields) {
    if (err) throw err;
    if(result.length == 0) {
        await conn.query("CREATE TABLE people (id int NOT NULL AUTO_INCREMENT, name varchar(50), PRIMARY KEY (id))");
    }
  });
};

criarTabela();

app.get('/', async (req, res) => {

  let html = '<h1>Full Cycle Rocks!</h1>';
  await conn.query(`INSERT INTO people (name) VALUES ('Ricardo ${getRandomInt(1,100)}')`, async function (err, result, fields) {
    await conn.query("SELECT * FROM people", function (err, result, fields) {
      if (err) throw err;
      Object.keys(result).forEach(function(key) {
        var row = result[key];
        html+= '- ' + row.name + '<br>';
      });
      res.send(html);
    });
   });
  });

app.listen(port, () => {
  console.log('Rodando na porta '+ port);
});