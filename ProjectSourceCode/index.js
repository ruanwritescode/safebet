// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
// const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/src/views/layouts',
  partialsDir: __dirname + '/src/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.
app.use(express.static(path.join(__dirname, '/src/resources')));

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

const user = {
  username: undefined,
  password: undefined,
  email: undefined,
  first_name: undefined,
  last_name: undefined,
  birth_date: undefined,
  register_date: undefined,
  age: undefined,
};

app.get('/', (req, res) => {
    res.redirect('/register') //this will call the /register route in the API
});

// ------------------- ROUTES for register.hbs ------------------- //
// GET
app.get('/register', (req, res) => {
    res.render('pages/register')
});
// POST
app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const birth_date = req.body.birth_date;
    const register_date = new Date().toJSON().slice(0, 10);
    // let age = register_date - birth_date;
    // console.log(age)
    // if (age.getFullYear() < 21) {
    //     err = `Sorry, you are not old enough to gamble so according to state law we cannot allow you to register`;
    //     console.log(err);
    //     res.redirect('/')
    // };
    // To-DO: Insert username and hashed password into the 'users' table
    const query = 'INSERT INTO users(username, password, first_name, last_name, email, birth_date, register_date) VALUES ($1, $2, $3, $4, $5, $6, $7);'

    db.none(query, [
        username,
        hash,
        first_name,
        last_name,
        email,
        birth_date,
        register_date
    ])
        .then(
            res.redirect('/login')
        )
        .catch(err => {
            console.log(err);
            res.redirect('/');
          });
  });

  // ------------------- ROUTES for login.hbs ------------------- //
  // GET
  app.get('/login', (req, res) => {
    res.render('pages/login');
  });
  // POST
  app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT * FROM users WHERE username = $1`;
    var message = `UNKNOWN ERROR!`;

    try {
      const data = await db.oneOrNone(query,username);
      if(!data) {
        res.redirect('/register');
      }
      const match = await bcrypt.compare(password, data.password);
      if(!match) {
        message = `Incorrect Password for "${username}"`;
        throw new Error(message);
      } 
      user.username = data.username;
      user.password = bcrypt.hash(data.password, 10);
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.email = data.email;
      user.birth_date = data.birth_date;
      user.register_date = data.register_date;
      // user.age = (register_date - birth_date).getFullYear();
      console.log(user);

      req.session.user = user;
      req.session.save();
      res.redirect('/home')
    }
    catch (err) {
      res.render('pages/login', {
            error: true,
            message: message,
      });
    }

  });

  // Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);

// ------------------- ROUTES for home.hbs ------------------- //
app.get('/home', (req,res) => {
  res.render('pages/home')
});
// EXAMPLE FROM AXIOS TICKETMASTER API CALL
// app.get('/discover', (req, res) => {
//   axios({
//     url: ``,
//     method: 'GET',
//     dataType: 'json',
//     headers: {
//       'Accept-Encoding': 'application/json',
//     },
//     params: {
//       apikey: process.env.API_KEY,
//       keyword: 'rock', //you can choose any artist/event here
//       size: 10 // you can choose the number of events you would like to return
//     },
//   })
//     .then(results => {
//       console.log(results.data._embedded.events[4]._embedded.venues); // the results will be displayed on the terminal if the docker containers are running // Send some parameters
//       res.render('pages/discover', {
//         event: results.data._embedded.events,
//       });
//     })
//     .catch(error => {
//       // Handle errors
//       res.render('pages/discover', {
//         results: [],
//         error: error,
//       });
//     });
// });  

// ------------------- ROUTES for profile.hbs ------------------- //
// GET
app.get('/profile', (req, res) => {
  res.render('pages/profile');
});


// ------------------- ROUTES for help.hbs ------------------- //
// GET
app.get('/help', (req, res) => {
  res.render('pages/help');
});

// ------------------- ROUTES for about.hbs ------------------- //
// GET
app.get('/about', (req, res) => {
  res.render('pages/about');
});

// ------------------- ROUTES for logout.hbs ------------------- //
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/logout', {
      message: 'Logged Out Successfully'
    });
  });

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');


// Handlebar helper for conditional statements for partials
Handlebars.registerHelper( "when",function(operand_1, operator, operand_2, options) {
  var operators = {
   'eq': function(l,r) { return l == r; },
   'noteq': function(l,r) { return l != r; },
   'gt': function(l,r) { return Number(l) > Number(r); },
   'or': function(l,r) { return l || r; },
   'and': function(l,r) { return l && r; },
   '%': function(l,r) { return (l % r) == 3; }
  }
  , result = operators[operator](operand_1,operand_2);

  if (result) return options.fn(this);
  else  return options.inverse(this);
});