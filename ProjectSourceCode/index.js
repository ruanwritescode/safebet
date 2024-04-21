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
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

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
  user_id: undefined,
  username: undefined,
  password: undefined,
  email: undefined,
  first_name: undefined,
  last_name: undefined,
  birth_date: undefined,
  register_date: undefined,
  age: undefined,
};

const selection = {
  sportsbook: undefined,
  deal: undefined,
  sport: undefined,
  sport_key: undefined,
  bet_amount: undefined,
};

const options = {
  sportsbooks: undefined,
  deals: undefined,
  sports: undefined,
};

let events = undefined;

let data = JSON.stringify({
  query: ``,
  variables: {}
});

const free_url = 'https://api.the-odds-api.com/v4/sports?' //basic url to call api without cost

app.get('/', async (req, res) => {
  res.redirect('/register') //this will call the /register route in the API
});

// ------------------- ROUTES for register.hbs ------------------- //
// GET
app.get('/register', (req, res) => {
    res.render('pages/register', {
      user: user,
    })
});
// POST
app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const hash = await bcrypt.hash(req.body.password, 10);
    user.username = req.body.username;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    let birthday = new Date(req.body.birth_date);
    user.birth_date = birthday;
    const register_date = new Date().toJSON().slice(0, 10);
    user.reg_date = new Date(register_date);
    let age = user.reg_date.getFullYear() - birthday.getFullYear();
    if (age< 21) {
        err = `Sorry, you are not old enough to gamble so according to state law we cannot allow you to register`;
        console.log(err);
        res.render('pages/register', {
          error: true,
          message: err,
          user: user,
        });
        return;
    };
    // To-DO: Insert username and hashed password into the 'users' table
    const query = 'INSERT INTO users(username, password, first_name, last_name, email, birth_date, register_date) VALUES ($1, $2, $3, $4, $5, $6, $7);'

    db.none(query, [
        user.username,
        hash,
        user.first_name,
        user.last_name,
        user.email,
        user.birth_date,
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
        message = `Username "${username}" Could Not Be Found`;
        throw new Error(message);
      }
      const match = await bcrypt.compare(password, data.password);
      if(!match) {
        message = `Incorrect Password for "${username}"`;
        throw new Error(message);
      } 
      user.user_id = data.user_id;
      user.username = data.username;
      user.password = bcrypt.hash(data.password, 10);
      user.first_name = data.first_name;
      user.last_name = data.last_name;
      user.email = data.email;
      let birth_date = new Date(data.birth_date)
      user.birth_date = birth_date.toJSON().slice(0, 10);
      let reg_date = new Date(data.register_date);
      user.register_date = reg_date.toJSON().slice(0, 10);
      user.age = (reg_date.getFullYear() - birth_date.getFullYear());
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
    message = "Please Login First!"
    return res.redirect('/login?message=' + message);
  }
  next();
};

// Authentication Required
app.use(auth);

// ------------------- ROUTES for home.hbs ------------------- //
app.get('/home', async (req,res) => {
  let selection = {
    sportsbook: undefined,
    deal: undefined,
    sport: undefined,
    sport_key: undefined,
    bet_amount: undefined,
  };
  const sportsbook_query = 'SELECT * FROM sportsbooks';
  const deal_query = 'SELECT * FROM deals';
  const sport_query = 'SELECT * FROM sports';
  
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: free_url,
    headers: { 
      'Content-Type': 'application/json'
    },
    params: {
      api_key: process.env.API_KEY,
    },
    data : data
  };
  // Code block to insert sports available from odds api. checks if the sport being inserted already exists and subsequently skips. If there is a sport in the database that is no longer avaialable from odds api, it is removed.
  try {
    // get available sports from odds-api
    response = await axios.request(config);
    let sports = response.data;
    // get loaded sports in database
    let loaded_sports = await db.any(sport_query);

    // initialize lengths of loaded and incoming sports lists
    let load_limit = loaded_sports.length;
    let import_limit = sports.length;

    // initialize variables to keep track of sports in one or the other list (import vs current)
    let new_sport = true;
    let old_sport = true;
    let to_insert = false;
    let old_sport_key = '';

    // basic start for the insert query. will be appended with all new avialable sports from odds-api
    let query = 'INSERT INTO sports (sport_key, sport_name, sport_league) VALUES';

    // 3 for loops. 1st iterates through import list, second through current database and then again throught the import list. 1st check for if imported sport already exists, 2nd check for if a sport currently in the database is no longer available.
    for (let i = 0; i < import_limit; i++) {
      for (let j = 0; j < load_limit; j++) {
        if(loaded_sports[j].sport_key == sports[i].key) {
          new_sport = false;
        }
        // old_sport_key = loaded_sports[j].sport_key;
        for (let k = 0; k < import_limit; k++) {
          if(loaded_sports[j].sport_key == sports[k].key) {
            old_sport = false;
          }
        }
      }
      // if imported sport is single game, active, and a new sport, add to insert list
      if(!sports[i].has_outrights && sports[i].active && new_sport) {
        query = query + '(\'' + sports[i].key + '\',\'' + sports[i].group + '\',\'' + sports[i].title + '\'),';
        to_insert = true;
      }
      // if sport in database does not exist in available importing sports from odds-api, delete
      if(old_sport) {
        await db.none('DELETE FROM sports WHERE sport_key = $1;',[old_sport_key])
      }
      // reset old sport and new sport markers
      new_sport = true;
      old_sport = true;
    }
    // add semicolon to end of insert string and remove final comma
    query = query.substring(0, query.length - 1) + ';';
    // if the insert string has at least one insert, insert to database.
    if(to_insert) {
      await db.none(query);
    }
  }
  catch(error) {
    console.log(error);
    return;
  };
  // block used to pull options for selecting which bets to view. uses current database state.
  try  {
    options.sportsbooks = await db.many(sportsbook_query);
    options.sports = await db.many(sport_query);
    res.render('pages/home', {
      sportsbook: options.sportsbooks,
      sport: options.sports,
      message: req.query.message,
      selection: selection,
    })
  }
  catch (err) {
      console.log(err);
      message = "Selection Menu Not Found";
      res.render('pages/home', {
        sportsbook: [],
        deal: [],
        sport: [],
        message: message,
      })
  };
});

app.get('/home/sports', async (req, res) => {
  
});

app.post('/home/odds', async (req, res) => {
  try {
    message = "Please Make All Required Selections";
    selection.bet_amount = req.body.bet_amount
    if(req.body.sportsbook) {
      selection.sportsbook = await db.oneOrNone('SELECT * FROM sportsbooks WHERE sportsbook_id = $1',[req.body.sportsbook]);
    }
    else {
      selection.sportsbook = undefined;
    };
    selection.sport = await db.one('SELECT * FROM sports WHERE sport_id = $1',[req.body.sport]);
    selection.deal = req.body.deal;
    // if(selection.deal.deal_type != 'Free Bet') {
    //   message = 'Sorry, functionality is only limited to Free Bets at the moment';
    //   throw new Error(message);
    // }
  }
  catch (err) {
    res.render('pages/home', {
      event: events,
      selection: selection,
      sportsbook: options.sportsbooks,
      deal: options.deals,
      sport: options.sports,
      message: message,
      error: true,
    });
    return;
  }
  const selected_url = 'https://api.the-odds-api.com/v4/sports/' + selection.sport.sport_key + '/odds';
  
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: selected_url,
    headers: { 
      'Content-Type': 'application/json'
    },
    params: {
      api_key: process.env.API_KEY,
      regions: 'us',
      markets: 'h2h',
      oddsFormat: 'american',
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log('Remaining requests',response.headers['x-requests-remaining']);
    console.log('Used requests',response.headers['x-requests-used']);
    events = response.data;
    
    // The ALGORITHM
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      event.valid = undefined;
      for (let j = 0; j < event.bookmakers.length; j++) {
        const bookmaker = event.bookmakers[j];
        if(bookmaker.title == selection.sportsbook.sportsbook_name) {
          event.valid = 1;
          bookmaker.valid = 1;
          if(bookmaker.markets[0].outcomes[0].price > 0 && bookmaker.markets[0].outcomes[1].price < 0) {
            event.p = bookmaker.markets[0].outcomes[0].price;
            bookmaker.bet_team = 'a'
            bookmaker.home = 'btn btn-success'
            bookmaker.away = 'btn btn-outline-danger disabled'
          }
          else if(bookmaker.markets[0].outcomes[1].price > 0 && bookmaker.markets[0].outcomes[0].price < 0) {
            event.p = bookmaker.markets[0].outcomes[1].price;
            bookmaker.bet_team = 'b'
            bookmaker.away = 'btn btn-success'
            bookmaker.home = 'btn btn-outline-danger disabled'
          }
          else {
            bookmaker.valid = 0;
            bookmaker.home = 'btn btn-outline-secondary disabled'
            bookmaker.away = 'btn btn-outline-secondary disabled'
          }
        }
      }
      for (let j = 0; j < event.bookmakers.length; j++) {
        const bookmaker = event.bookmakers[j];
        if((bookmaker.title != selection.sportsbook.sportsbook_name)) {
          bookmaker.valid = 1;
          if(event.valid && bookmaker.markets[0].outcomes[0].price < 0 && bookmaker.markets[0].outcomes[1].price > 0) {
            bookmaker.n = bookmaker.markets[0].outcomes[0].price;
            bookmaker.bet_team = 'a'
            bookmaker.home = 'btn btn-danger'
            bookmaker.away = 'btn btn-outline-success disabled'
          }
          else if(event.valid && bookmaker.markets[0].outcomes[1].price < 0 && bookmaker.markets[0].outcomes[0].price > 0) {
            bookmaker.n = bookmaker.markets[0].outcomes[1].price;
            bookmaker.bet_team = 'b'
            bookmaker.away = 'btn btn-danger'
            bookmaker.home = 'btn btn-outline-success disabled'
          }
          else {
            bookmaker.valid = 0;
            bookmaker.home = 'btn btn-outline-secondary disabled'
            bookmaker.away = 'btn btn-outline-secondary disabled'
          }
          let u = selection.bet_amount;
          let p = event.p;
          let n = Math.abs(bookmaker.n)
          bookmaker.hedge = ((u * p * n)/(100*(100+n))).toFixed(2);
          bookmaker.ratio = ((p)/(n + 100));
          bookmaker.winnings = (bookmaker.ratio * selection.bet_amount).toFixed(2);
          
        }
      }
      event.statics = [];
      for (let j = 0; j < options.sportsbooks.length; j++) {
        const static = options.sportsbooks[j];
        let exists = false;
        for (let k = 0; k < event.bookmakers.length; k++) {
          const dynamic = event.bookmakers[k];
          if(static.sportsbook_name == dynamic.title) {
            exists = true;
            event.statics.push(dynamic);
          }
        }
        if(!exists) {
          const placeholder = {
            title: static.sportsbook_name,
          };
          event.statics.push(placeholder);
        }
      }
      
    }

    res.render('pages/home', {
      event: events,
      selection: selection,
      sportsbook: options.sportsbooks,
      deal: options.deals,
      sport: options.sports,
    });
  })
  .catch((error) => {
    console.log(error);
    message = "Odds Unavialable for Your Selection. Please Try Again";
    res.redirect('/home?message=' + message + '&error=true');
  });
});  

// ------------------- ROUTES for saving bets ------------------- //
app.post('/bets/add', async (req, res) => {
  const check_event = 'SELECT * FROM events WHERE event_id = $1';
  const new_event = `INSERT INTO events (event_id, sport_id, team_f, team_n, event_date) VALUES ($1,$2,$3,$4,$5)`;

  const check_bet = 'SELECT * FROM bets WHERE user_id = $1 AND event_id = $2 AND deal_id = $3 AND hedge_id = $4 ';
  const new_bet = `INSERT INTO bets (user_id, event_id, deal_id, hedge_id, winnings) VALUES ($1,$2,$3,$4,$5)`;

  const check_deal = 'SELECT * FROM deals WHERE sportsbook_id = $1 AND deal_type = $2 AND deal_amount = $3 AND deal_line = $4'
  const new_deal = 'INSERT INTO deals (sportsbook_id, deal_type, deal_amount, deal_line) VALUES ($1,$2,$3,$4)'

  const check_hedge = 'SELECT * FROM hedges WHERE sportsbook_id = $1 AND hedge_amount = $2 AND hedge_line = $3'
  const new_hedge = 'INSERT INTO hedges (sportsbook_id, hedge_amount, hedge_line) VALUES ($1,$2,$3)'

  // Variables required to insert new event
  const event_id = req.body.event_id;  
  let sport_id = selection.sport.sport_id
  let team_f = undefined;
  let team_n = undefined;
  const event_date = req.body.time;

  // Variables required to insert new deal
  const sb_deal_id = req.body.sb_deal_id;
  const deal_type = req.body.deal_type;
  const deal_amount = req.body.deal_amount;
  const deal_line = req.body.deal_line;

  // Variables required to insert new hedge
  let sb_hedge_name = req.body.sb_hedge_name;
  const hedge_amount = req.body.hedge_amount;
  const hedge_line = req.body.hedge_line;

  // Variable required to make new bet
  // user_id
  // event_id
  // deal_id
  // hedge_id
  // winnings
  let user_id = user.user_id;
  const winnings = req.body.winnings;

  // Check for which team is favored and which team is underdog
  if(req.body.odds_a < 0){
    team_f = req.body.team_a;
    team_n = req.body.team_b;
  }
  else {
    team_f = req.body.team_b;
    team_n = req.body.team_a;
  }

  try {
    // First check if api recieved any data. Throw error if not
    if(!req.body) {
      message = 'Error: No Data Found';
      throw new Error(message);
    }
    
    // Check if event already exists in database. Add if not.
    let exists_event = await db.any(check_event, [event_id]);
    if(!exists_event[0]) {
      await db.none(new_event,[event_id,sport_id,team_f,team_n,event_date])
    }

    // Check if deal entry already exists in database. Add if not.
    let deal_vars = [sb_deal_id, deal_type, deal_amount, deal_line];
    let deal = await db.any(check_deal, deal_vars);
    if(!deal[0]) {
      await db.none(new_deal,deal_vars);
      deal = await db.one(check_deal, deal_vars);
    }
    else {
      deal = deal[0];
    }

    // Check if hedge entry exists in database. Add if not.
    let sb_hedge = await db.one('SELECT * FROM sportsbooks WHERE sportsbook_name = $1',[sb_hedge_name])
    let hedge_vars = [sb_hedge.sportsbook_id, hedge_amount, hedge_line];
    let hedge = await db.any(check_hedge, hedge_vars);
    if(!hedge[0]) {
      await db.none(new_hedge,hedge_vars);
      hedge = await db.one(check_hedge, hedge_vars);
    }
    else {
      hedge = hedge[0];
    }
    console.log(deal);
    console.log(hedge);
    // Check if bet entry already exists, error if not
    let exists_bet = await db.any(check_bet,[user.user_id,event_id,deal.deal_id,hedge.hedge_id]);
    if(exists_bet[0]) {
      message = "This Bet Already Exists In Your History";
      throw new Error(message);
    }
    await db.none(new_bet, [user_id,event_id,deal.deal_id,hedge.hedge_id,winnings]);
    message = "Bet Added To User History"
    res.render('pages/home', {
      event: events,
      selection: selection,
      sportsbook: options.sportsbooks,
      deal: options.deals,
      sport: options.sports,
      message: message,
      error: false,
    })
  }
  catch (error) {
    console.log(error);
    res.render('pages/home', {
      event: events,
      selection: selection,
      sportsbook: options.sportsbooks,
      deal: options.deals,
      sport: options.sports,
      error: true,
      message: message,
    })
  }
});

// ------------------- ROUTES for profile.hbs ------------------- //
// GET
app.get('/profile', async (req, res) => {
  const bets_query = 'SELECT * FROM bets WHERE user_id = $1'
  const events_query = 'SELECT * FROM events e INNER JOIN sports s ON s.sport_id = e.sport_id WHERE event_id = $1'
  const deals_query = 'SELECT * FROM deals d INNER JOIN sportsbooks s ON s.sportsbook_id = d.sportsbook_id WHERE d.deal_id = $1';
  const hedges_query = 'SELECT * FROM hedges h INNER JOIN sportsbooks s ON s.sportsbook_id = h.sportsbook_id WHERE h.hedge_id = $1';

  try {
    history = await db.any(bets_query,[user.user_id]);
    for (let i = 0; i < history.length; i++) {
      const bet = history[i];
      bet.event = await db.one(events_query,[bet.event_id]);
      bet.deal = await db.one(deals_query,[bet.deal_id]);
      bet.hedge = await db.one(hedges_query,[bet.hedge_id]);
    }
    res.render('pages/profile', {
      user: user,
      history: history,
    })
  }
  catch (error) {
    console.log(error);
    message = "Could Not Load User History"
    res.render('pages/profile', {
      message: message,
    });
  }
  
});

// ------------------- ROUTES for help.hbs ------------------- //
// GET
app.get('/help', (req, res) => {
  res.render('pages/help',{
    username: req.session.user.username,
    first_name: req.session.user.first_name,
    email: req.session.user.email,
  });
});

// ------------------- ROUTES for about.hbs ------------------- //
// GET
app.get('/faq', (req, res) => {
  res.render('pages/faq');
});

// ------------------- ROUTES for about.hbs ------------------- //
// GET
app.get('/about', (req, res) => {
  res.render('pages/about');
});

// ------------------- ROUTES for logout.hbs ------------------- //
app.get('/logout', (req, res) => {
    user.user_id = undefined;
    user.username = undefined;
    user.password = undefined;
    user.email = undefined;
    user.first_name = undefined;
    user.last_name = undefined;
    user.birth_date = undefined;
    user.register_date = undefined;
    user.age = undefined;
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

Handlebars.registerHelper( "setVariable", function(varName, varValue, options){
  options.data.root[varName] = varValue;
});