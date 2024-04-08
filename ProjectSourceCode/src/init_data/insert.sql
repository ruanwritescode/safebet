-- This is dummy data to test the site before we use the api
INSERT INTO userTable (username, password, first_name, last_name, email, birth_date, register_date)
    VALUES
    ('cgoren', 'abc1234', 'Chasen', 'Goren', 'chgo3684@colorado.edu', 2000-10-18, CURDATE()),
    ('rabarbanel', '123abc', 'Ruan', 'Abarbanel', 'ruab1658@colorad.edu', 1997-12-13, CURDATE()),
    ('joshgildred', 'asecge', 'Josh', 'Gildred', 'jogi2895@colorado.edu', 2002-4-26, 2023-2-12),
    ('aava7378', 'hsvase', 'Aaron', 'Van', 'aava7378@gmail.com', 2001-2-29, 2022-5-1);

INSERT INTO events (game_id, team_f, team_n, odds_f, odds_n, outcome_f)
    VALUES
    ('adcea12351d134ar1', 'Indiana St Sycamores', 'Utah Utes', -102, -118, TRUE),
    ('acegae12354ce3a12', 'Chicago White Sox', 'Cleveland Guardians', -110, -110, FALSE),
    ('adcf31c235a231ad1', 'Miami Marlins', 'New York Yankees', -155,130, TRUE);

INSERT INTO bets (game_id, bet_value, winnging, deal_id)
    VALUES
    ('adcea12351d134ar1', 123.2, 4123, 1),
    ('acegae12354ce3a12', 1223, 4223, 1),
    ('adcf31c235a231ad1', 1251, 4141, 1);

INSERT INTO userHistory (user_id, bet_id)
    VALUES
    (1,1),
    (1,2),
    (2,3);

INSERT INTO deals (type, amount)
    VALUES
    ('Test', 3412),
    ('Test 2', 412);