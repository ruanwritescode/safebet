// const express = require('express');
// const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');
// const path = require('path');

// const app = express();

// app.engine('hbs', exphbs({ defaultLayout: false, extname: '.hbs' }));
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));

// app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//     res.render('register');
// });

// app.post('/register', (req, res) => {
//     const { birth_date } = req.body;

//     const birthDate = new Date(birth_date);
//     const todayDate = new Date();
//     const UserAge = todayDate.getFullYear() - birthDate.getFullYear();
//     const month = todayDate.getMonth() - birthDate.getMonth();
//     if (month < 0 || (month === 0 && todayDate.getDate() < birthDate.getDate())) {
//         UserAge--;
//     }

//     if (UserAge < 18) {
//         return res.send('You are not 18 years or older to register.');
//     }

//     res.send('Account Created!');
// });