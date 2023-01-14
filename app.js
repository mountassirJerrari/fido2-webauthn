require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('hbs');
const session = require ('express-session')
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const connectMongoDBSession = require('connect-mongodb-session');
const MongoDBStore = connectMongoDBSession(session);

var sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017/pfe',
  collection: 'sessions'
});
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
  secret: 'secret', // You should specify a real secret here
  resave: true,
  saveUninitialized: false,
  proxy: true,
  store:sessionStore,

  cookie:{
    httpOnly: true,
    sameSite: 'none'
  }
}));

// routes
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', './views');
app.get('/', (req, res) => {
  res.render('index.html');
});
app.use('/auth', authRouter);





const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URl);
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();