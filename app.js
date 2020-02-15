const http = require('http');
const fs = require('fs');
const con = require('./db');

const hostname = 'localhost';
const port = '3000';

function onRequest(request, response) {
    var conn = con.getConnection();
    if (request.method == 'POST' && request.url == '/register') {
        registerStudent(request, response, conn);
    }
    if (request.method == 'POST' && request.url == '/createClass') {
        createClass(request, response, conn);
    }
    if (request.method == 'POST' && request.url == '/registerStudenttoClass') {
        registerStudenttoClass(request, response, conn);
    }
    if (request.method = 'GET' && request.url == '/getStudentsFromClass') {
        getStudentsFromClass(request, response, conn);
    }
    if (request.method = 'DELETE' && request.url == '/destroyStudentFromClass') {
        destroyStudentFromClass(request, response, conn);
    }
    if (request.method ='PUT' && request.url == "/gradeStudent") {
        gradeStudent(request, response, conn);
    }
    if (request.method ='GET' && request.url == "/failedStudents") {
        failedStudents(request, response, conn);
    }
}

function registerStudent(request, response, conn) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    content = '';
    request.on('data', function (data) {
        content += data;
        var obj = JSON.parse(content);
        conn.query('INSERT INTO task11.student (student.name) VALUES (?)', [obj.name], function (error, result, fields) {
            if (error) throw error;
            console.log("Inserted");
            var results = { message: `${obj.name} registered successfully` };
            var res = JSON.stringify(results);
            response.end(res);
        })
    });
}

function createClass(request, response, conn) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    var content = '';
    request.on('data', function (data) {
        content += data;
        var obj = JSON.parse(content);
        conn.query('INSERT INTO task11.class (class.name) VALUES (?)', [obj.name], function (error, result, fields) {
            if (error) throw error;
            console.log('success');
            var message = { message: `${obj.name} created successfully` };
            var res = JSON.stringify(message);
            response.end(res);
        });
    })
}

function registerStudenttoClass(request, response, conn) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    var content = '';
    request.on('data', function (data) {
        content += data;
        var obj = JSON.parse(content);
        conn.query('INSERT INTO task11.relation (relation.sub_id,relation.student_id,relation.status) VALUES (?,?,?)', [obj.sub_id, obj.student_id, "not graded"], function (error, result, fields) {
            if (error) throw error;
            var message = { message: "student added" };
            var res = JSON.stringify(message);
            response.end(res);
        })
    });
}

function getStudentsFromClass(request, response, conn) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    content = '';
    request.on('data', function (data) {
        content += data;
        var obj = JSON.parse(content);
        conn.query(`
            SELECT
            relation.id,
            student.name AS s_name,
            class.name AS c_name
            FROM student
            JOIN class
            JOIN relation
            WHERE sub_id= ${obj.sub_id} AND relation.student_id=student.id AND relation.sub_id=class.id
        `, function (error, result, fields) {
            if (error) throw error;
            response.end(JSON.stringify(result));
        });
    })
}

function destroyStudentFromClass(request, response, conn) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    var content = '';
    request.on('data', function (data) {
        content += data;
        var obj = JSON.parse(data);
        conn.query(`DELETE FROM relation WHERE student_id = ${obj.student_id} AND sub_id = ${obj.sub_id}`,function (error,result,field) {
            if(error) throw error;
            var message = {message: ` ${obj.student_id} DELETED FROM ${obj.sub_id}... I mean u get the point right??`};
            var res = JSON.stringify(message);
            response.end(res);
        });

    });
}

function gradeStudent(request, response, conn) {
    response.statusCode =200;
    response.setHeader('Content-Type','application/json');
    var content = '';
    request.on('data',function (data) {
        content += data;
        var obj = JSON.parse(content);
        var query = `UPDATE relation SET status = '${obj.status}' WHERE relation.student_id = ${obj.student_id} AND relation.sub_id = ${obj.sub_id}`;
        console.log(query);
        conn.query(query,
        function (error,result,field) {
            if(error) throw error;
            var message = {message: ` ${obj.student_id} GRADED in  ${obj.sub_id} as ${obj.status}`};
            var res = JSON.stringify(message);
            response.end(res);
        });
    });
}

function failedStudents(request, response, conn){
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    content = '';
    request.on('data', function (data) {
        content += data;
        var obj = JSON.parse(content);
        conn.query(`
            SELECT
            relation.id,
            student.name AS s_name,
            class.name AS c_name
            FROM student
            JOIN class
            JOIN relation
            WHERE sub_id= ${obj.sub_id} AND relation.student_id=student.id AND relation.sub_id=class.id
            AND relation.status='failed'
        `, function (error, result, fields) {
            if (error) throw error;
            response.end(JSON.stringify(result));
        });
    })
}


const server = http.createServer(onRequest);
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});