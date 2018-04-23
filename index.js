const express = require('express'),
    consolidate = require('consolidate'),
    mongoClient = require('mongodb').MongoClient;

var app = express();

var db;

app.engine('hbs', consolidate.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

mongoClient.connect('mongodb://localhost:27017',
function (err, client) {
    if (err) throw err;

    db = client.db('Test');
    app.listen(1234);
    
    db.collection('Countries').ensureIndex('name.common', { unique: true });

});

app.get('/', (req, res) => {

    db.collection('Countries').find({
            area: {
                $lt: 90
            }
        }, {
            projection: {
                area: 1,
                'name.common': 1
            }
        })
        .sort({
            area: 1
        })
        .limit(2)
        .toArray(function (err, result) {
            console.log(result);
            res.render('index', {
                title: 'Hello!',
                countries: result
            });
        });
});