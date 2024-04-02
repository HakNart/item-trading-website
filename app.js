// Create module
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const mainRoutes = require('./routes/mainRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const userRoutes = require('./routes/userRoutes');


// Create express app
const app = express();
// Configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

// mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extends:true}))
app.use(morgan('tiny'));
app.use(methodOverride("_method"));

// connect to database with mongoose
mongoose.connect('mongodb://localhost:27017/tradeSite',
{useNewUrlParser:true, useUnifiedTopology:true})
.then(() => {
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    })
})
.catch(err=>console.log(err.message));

// Mount session as middleware
app.use(
  session({
    secret: '358A5A57BE6ED697D78B13C8B37BC',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/tradeSite'}),
    cookie: {maxAge: 60*60*1000} // 60 minnutes
    })
);
// Mount flash as middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});

// Route for general site navigation
app.use('/', mainRoutes);
// Route to trade
app.use('/trades', tradeRoutes);
// Route to user
app.use('/users', userRoutes);

app.use((req, res, next) => {
  let err = new Error('The server cannot locate ' + req.url);
  err.status = 404;
  next(err);
})

// Error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }
  res.status(err.status);
  res.render('error', {error: err});
})

