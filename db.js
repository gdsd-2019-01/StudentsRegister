const mysql =  require('mysql');

function getConnection() {
    var con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"task11"
    });
    return con;
}

module.exports.getConnection = getConnection;