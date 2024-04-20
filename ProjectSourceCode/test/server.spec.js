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


// *********************** Test Case profile.hbs  **************************

// Positive Test case

// Negative Test case







// *********************** Test Case about.hbs  **************************

// Positive Test case

// Negative Test case

// *********************** Test Case help.hbs  **************************

// Positive Test case

// Negative Test case

// *********************** Test Case home.hbs  **************************

// Positive Test case

// Negative Test case

// *********************** Test Case login.hbs  **************************

// Forgot password

// Create an account

// Positive Test case

// Negative Test case




// *********************** Test Case profile.hbs  **************************

// Positive Test case (The users past bets are pulled and displayed on the page correctly)
// Negative Test case (Select a bet and don't submit the bet (which should not store the bet in the user profile)

describe('Past bets are pulled', () => {
  it('Positive : /add_user', done => {
    chai
      .request(server)
      .post('/add_user')
      .send({id: 5, name: 'John Doe', dob: '2020-02-20'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Success');
        done();
      });
  });

  it('Negative : /add_user. Bets are not submitted', done => {
    chai
      .request(server)
      .post('/add_user')
      .send({id: '5', name: 10, dob: '2020-02-20'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });
});



// *********************** Test Case profile.hbs  **************************

// Positive Test case (The users past bets are pulled and displayed on the page correctly)
// Negative Test case (Select a bet and don't submit the bet (which should not store the bet in the user profile)

describe('Past bets are pulled', () => {
  it('Positive : /add_user', done => {
    chai
      .request(server)
      .post('/add_user')
      .send({id: 5, name: 'John Doe', dob: '2020-02-20'})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('Success');
        done();
      });
  });

  it('Negative : /add_user. Bets are not submitted', done => {
    chai
      .request(server)
      .post('/add_user')
      .send({id: '5', name: 10, dob: '2020-02-20'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equals('Invalid input');
        done();
      });
  });
});


// *********************** Test Case register.hbs  **************************

// Positive Test case (the user is over, exactly, or under the age verification of 18)
// Negative Test case (Input of a future year like 2050)

// DONE line 37
 