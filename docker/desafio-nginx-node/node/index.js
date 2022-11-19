const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql')

app.get('/', (req,res) => {
    insertPeople(res);
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})

async function insertPeople(res) {    
    var random_name = require('node-random-name');    
    const connection = mysql.createConnection(config);
    let sql = "INSERT INTO people SET name = ?";
    connection.query(sql, [ random_name() ],  function(err, rows) {});
    getPeople(res, connection);
}
  
function getPeople(res, connection) {    
    const sql = `SELECT id, name FROM people order by id`;  
    
    connection.query(sql, (error, results, fields) => {
      if (error) {
        throw error
      };
      
      let dados = '<p><ul>';
      for(let people of results) {      
        dados += `<li><b>${people.name}</b> (Id: ${people.id})</li>`;
      }  
      dados += '</ul></p>';
      
      res.send('<h1>FullCycle Rocks!</h1><p>Nomes cadastrados no banco de dados:</p>' + dados);    
    });   

    connection.end();
}