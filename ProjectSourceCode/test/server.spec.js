// ********************** Initialize server **********************************

const server = require('../index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

// *********************** TODO: WRITE 2 UNIT TESTCASES **************************

// ********************************************************************************


// ********************** AGE VERIFICATION TESTCASE *******************************

// CASE 1: User is under 18 years old
describe('Registration', () => {
  it('Rejects registration for users under 18 years of age', done => {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'User0123',
        password: 'Password0123',
        first_name: 'Aaron',
        last_name: 'Van',
        email: 'Aava@example.com',
        birth_date: '2015-01-24'
      })
      .end((err, res) => {
        expect(res).to.have.status(200); 
        expect(res.text).to.include('You must be 18 years or older to register.'); 
        done();
      });
  });

// CASE 2: User is 18
  it('Accepts registration for users who are exactly 18 years old of age', done => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'User018',
        password: 'Password018',
        first_name: 'Robiel',
        last_name: 'Ken',
        email: 'Robo@example.com',
        birth_date: eighteenYearsAgo.toISOString().split('T')[0] // Convertion YYYY-MM-DD
      })
      .end((err, res) => {
        expect(res).to.have.status(200); 
        expect(res.text).to.include('Account Created!');
        done();
      });
  });
// CASE 3: Older than 18
  it('Accepts registration for users who are older than 18 years of age', done => {
    chai
      .request(server)
      .post('/register')
      .send({
        username: 'User2003',
        password: 'Password2003',
        first_name: 'Peter',
        last_name: 'Parker',
        email: 'Pete@example.com',
        birth_date: '2003-01-24' // 21 years old
      })
      .end((err, res) => {
        expect(res).to.have.status(200); 
        expect(res.text).to.include('Account Created!');
        done();
      });
    });
});


// ********************** PART C 2 Unit Testcases *******************************
// Part C
// These tests attempts to place a bet using an invalid deal ID, which does not exist in the deals table.
describe('Testing Place Bet API', () => {
  
  // Positive test case for sucessfully placing a valid and existing bet pulled from the api
  it('Positive: Successfully place a bet', done => {
    chai
      .request(server)
      .post('/place_bet')
      .send({ user_id: 1, event_id: 'EVT123', bet_value: 100.00, deal_id: 2 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Bet placed successfully');
        done();
      });
  });
  
  // Negative test case for attemptting an invaild bet (Bet that doesn't exsist)
  it('Negative: Attempt to place bet with invalid deal ID', done => {
    chai
      .request(server)
      .post('/place_bet')
      .send({ user_id: 1, event_id: 'EVT123', bet_value: 100.00, deal_id: 999 }) // Invalid deal_id
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Invalid deal ID');
        done();
      });
  });
});

// ********************** Home Page Test cases *******************************
describe('HomePage', () => {
  // Positive test case testing valid selection submission
  it('Accepts successfull submission for a valid form selection', done => {
    chai
      .request(server)
      .post('/home/odds')
      .send({
        sportsbook: '01',  
        sport: '02',       
        deal: '03',        
        deal_amount: 1000  // positive deal amount
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('successful', true);
        expect(res.body.message).to.equal('Bets are fetched successfully');
        done();
      });
  });

  // Negative test case testing for invalid input in deal amount
  it('rejects submission for an invalid deal amount', done => {
    chai
      .request(server)
      .post('/home/odds')
      .send({
        sportsbook: '01',  
        sport: '02',       
        deal: '03',        
        deal_amount: -1000 // negative deal amount
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('successfull', false);
        expect(res.body.message).to.equal('Deal amount must be a positive number!');
        done();
      });
  });
});
// **********************Unit Testcase: Chatbot Help *******************************
// Positive test case 1: Sending a non-empty message to chatbot 
describe('Interacting with the Chatbot', () => {
  it('Sends a non-empty message to the chatbot', done => {
    chai
    .request(server)
    .post('/chat')
    .send({
      message: 'Hi, I need help with placing a bet.'
    })
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.text).to.include('Message recieved successfully by chatbot');
      done();
    });
  });
});

// Negative test case 1: Sending a empty message to the chatbot
describe('Interacting with the chatbot', () => {
  it('Sends an empty meassage to the chatbot', done => {
    chai
    .request(server)
    .post('/chat')
    .send({
      message: ''
    })
    .end((err,res) => {
      expect(res).to.have.status(400);
      expect(res.text).to.include('Message cannot be empty');
      done();
    });
  });
});

// Postive test case 2: loading the Chatbot successfully
describe('Loading chatbot', () => {
  it('Load chabot successfully on page', done => {
    chai
    .request(server)
    .get('/help')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.text).to.include('Loading chat...');
      done();
    })
  })
})

// Negative test case 2: loading the Chatbot unsuccessfully
describe('Loading chatbot', () => {
  it('Fail to load chatbot', done => {
    chai
    .request(server)
    .get('/help')
    .end((err,res) => {
      expect(res).to.have.status(404); // 404 error code is error for webpage not loading 
      expect(res.text).to.include('Failed to load chat');
      done();
    });
  });
});

// ********************** Unit Testcase: Profile Page *******************************
// Positive test case: Data is displayed
describe('Profile Page Display - Positive Test', () => {
  it('Displays user profile and betting history', done => {
    chai.request(server)
      .get('/profile') 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('First Name');
        expect(res.text).to.include('Last Name');
        expect(res.text).to.include('Username');
        expect(res.text).to.include('Email');
        expect(res.text).to.include('Register Date');
        expect(res.text).to.include('+300');
        expect(res.text).to.include('NBA');
        expect(res.text).to.include('Lakers vs Nuggets');
        done();
      });
   });
});

// Negative test case: User with no/betting betting history
describe('Profile Page Display - Negative Test', () => {
  it('Handles empty betting history correctly', done => {
    chai.request(server)
      .get('/profile') 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('First Name');
        expect(res.text).to.include('No betting history available'); 
        done();
      });
   });
});

// ********************** Unit Testcase: Login Testing *******************************
// Positive test case: Valid login in database
describe('Login functionality', () => {
  it('Successfully logs in with valid login username and password', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'admin', password: 'admin' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.include('Successfully logged in'); 
        done();
      });
  });
});

// Negative test case: Invalid login not stored in database
describe('Login functionality', () => {
  it('Unsuccessful login with wrong username and password', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'ADMIN', password: 'ADMIN' }) 
      .end((err, res) => {
        expect(res).to.have.status(401); 
        expect(res.text).to.include('Invalid username or password'); 
        done();
      });
  });
});