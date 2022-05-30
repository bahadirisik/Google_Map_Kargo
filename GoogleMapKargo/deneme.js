$: mongodb = require("mongodb")
let MongoClient = mongodb.MongoClient;
let url = "mongodb+srv://bugrahan:Bugra_01@database.ibnls.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    let dbo = db.db("mydb");
    dbo.collection("mapapp").find().toArray(function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            console.log("giris basarili")
            console.log(result)

        } else {

            console.log("giris basarisiz")

        }
        db.close();
    });
});