//引入数据库包
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//封装数据库连接的操作
function _connect(callback) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        callback(db);
    });
}

//增
module.exports.insert = function (dbName, col, myObj, callback) {
    _connect(function (db) {
        let dbo = db.db(dbName);
        myObj = myObj instanceof Array ? myObj : [myObj];
        dbo.collection(col).insertMany(myObj, function (err, result) {
            if (err) throw err;
            db.close();
            callback(result);
        });
    });
};

//查
module.exports.find = function (dbName, col, callback, myObj = {}, mySort = {}, mySkip = 0, myLimit = 0) {
    _connect(function (db) {
        let dbo = db.db(dbName);
        dbo.collection(col).find(myObj).sort(mySort).skip(mySkip).limit(myLimit).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            callback(result);
        });
    })
};

//改
module.exports.update = function (dbName, col, myObj, updateObj, callback) {
    _connect(function (db) {
        let dbo = db.db(dbName);
        let updateStr = {$set: updateObj};
        dbo.collection(col).updateOne(myObj, updateStr, function (err, result) {
            if (err) throw err;
            db.close();
            callback(result);
        });
    })
};

//删
module.exports.delete = function (dbName, col, myObj, callback) {
    _connect(function (db) {
        let dbo = db.db(dbName);
        dbo.collection(col).deleteOne(myObj, function (err, result) {
            if (err) throw err;
            db.close();
            callback(result);
        });
    })
};