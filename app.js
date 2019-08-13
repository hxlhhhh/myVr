var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var hbs = require('express-hbs');
var mongoose = require('mongoose');
var app = express();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');*/
app.engine('html', hbs.express4({
  extname: 'html'
}));
app.set('view engine', 'html');
app.set('views', path.resolve('./views/'));

//连接数据库之类
// connect to mongodb
var dbName = 'movieDb';
var url = 'mongodb://localhost:27017/' + dbName;
var mongoOptions = {
  server: {
    useMongoClient: true,
    socketOptions: {
      keepAlive: 1
    }
  }
};
mongoose.connect(url, mongoOptions);
mongoose.connection.on('error', function (err) {
  console.log('Mongo Error:' + err);
}).on('open', function () {
  console.log('Connection opened');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
var movies = require('./modules/route/route')(app);



app.use('/', indexRouter);
app.use("/",express.static(path.join(__dirname, 'views')));


app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

