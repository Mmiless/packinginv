// require commands ensure that whatever machine running this application has the correct dependencies from package.json and files for routes and services
var express = require("express"),
app = express();
//var router = express.Router();

const router = express.Router()
const db = require("./database.js");
const port = 3003 || process.env.PORT;
// Defines variables referring to the routing files for fetch requests
const itemRouter = require('./routes/itemsRoute.js');
const updateRouter = require('./routes/updateVal.js');
const deleteItemRouter = require('./routes/deleteItemRoute.js');
const toteRouter = require('./routes/totesRoute.js');
const deleteToteRouter = require('./routes/deleteToteRoute.js');

const editBoardsRouter = require('./routes/editBoardsRoute.js');
const viewBoardRouter = require('./routes/viewBoardRoute.js');

// Lets us dynamically receive tote names to load parts.ejs
const partsServices = require('./services/itemServices');

//Enables the app to use json in POST requests
app.use(express.json());

// '/' indicates the initial render when the page is ran. For this, the index (or home) page is displayed
app.get('/', (req, res) => {
  res.render('index');
});

// Directs routes for post requests
app.use('/packinv/items', itemRouter);
app.use('/packinv/updateVal', updateRouter);
app.use('/packinv/deleteItem', deleteItemRouter);
app.use('/packinv/totes', toteRouter);
app.use('/packinv/deleteTote', deleteToteRouter);

app.use('/packinv/editBoards', editBoardsRouter);
app.use('/packinv/getBoard', viewBoardRouter);



// Defines the port used for hosting the site and provides the link in the terminal
app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});


// enables use of public folder for css, images, and linked JS files
app.use(express.static(__dirname + '/public'));

// setting view engine to ejs to render ejs files for webpages
app.set("view engine", "ejs");

// The following are get commands to render ejs files when the directory in a browser matches the /___ keyword
// NOTE: For the server, file paths need a /packinv before the page title ex. /packinv/index or /packinv/parts
// For localhost, leave as /___ ex. /index or /parts

app.get('/index', function (req, res) {
    res.render('index');
});

app.get('/items', async function(req, res) { 
    try{
        const toteMap = await partsServices.getTotes(); // Fetch the tote map
        res.render('items', {toteMap});
    } catch(err){
        console.log("Error while loading parts.ejs", err.message);
    }
});

app.get('/addItem', async function(req, res) { 
    try{
        const toteMap = await partsServices.getTotes(); // Fetch the tote map
        res.render('addItem', {toteMap});
    } catch(err){
        console.log("Error while loading parts.ejs", err.message);
    }
});

app.get('/changeLog', function (req, res) {
    res.render('changeLog');
});

app.get('/totes', function (req, res) {
    res.render('totes');
});

app.get('/addTote', function (req, res) {
    res.render('addTote');
});

app.get('/viewBoard', function (req, res) {
    res.render('viewBoard');
});

app.get('/viewLayup', function (req, res) {
    res.render('viewLayup');
});


// Pages that will be made further down the roadmap
// app.get('/orders', function (req, res) {
//     res.render('orders');
// });

// app.get('/cart', function (req, res) {
//     res.render('cart');
// });

// app.get('/signup', function (req, res) {
//     res.render('signup');
// });
