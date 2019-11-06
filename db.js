const mysql = require('mysql')

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'mydatabase'
    }
)

function getAllBands(email){
    return new Promise(function(resolve,reject){
        connection.query(`select * from bands b where b.email='${email}'`,
        function(err,rows,cols){
            if(err){
                reject(err)
            }
            else
                resolve(rows)
        })
    })
}


function checkCredentials(email,password){
    return new Promise(function(resolve,reject){
        connection.query(`select * from user u where u.email='${email}' and u.upassword='${password}'`,
        function(err,rows,cols){
            if(err)
                reject(err)
            else
                resolve(rows)
        })
    })
}

function addNewBand(bandname,email){
    return new Promise(function(resolve,reject){
        connection.query(`insert into bands(bandname,email) values(?,?)`,
        [bandname,email],
        function(err,result){
            if (err)
                reject(err)
            else
                resolve()
        })
    })
}

function createCredentials(email,username,password,dob,userprofile){
    return new Promise(function(resolve,reject){
        connection.query(`insert into user(email,username,upassword,dateofbirth,userprofile) values(?,?,?,?,?)`,
        [email,username,password,dob,userprofile],
        function(err,result){
            if(err)
                reject(err)
            else
                resolve()
        })
    })
}


function removeBand(id){
    return new Promise(function(resolve,reject){
        connection.query(`delete from bands where id=?`,
        [id],
        function(err,result){
            if(err)
                reject(err)
            else
                resolve()
        })
    })
}

function updateBand(id,bandname){
    return new Promise(function(resolve,reject){
        connection.query(`update bands set bandname=? where id=?`,
        [bandname,id],
        function(err,result){
            if(err)
                reject(err)
            else
                resolve()
        })
    })
}


module.exports = {
    getAllBands,
    addNewBand,
    checkCredentials,
    createCredentials,
    removeBand,
    updateBand
}