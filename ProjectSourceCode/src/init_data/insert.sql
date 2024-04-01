-- This is dummy data to test the site before we use the api
INSERT INTO userTable (username, password, first_name, last_name, email, birth_date, register_date)
    VALUES
    ('cgoren', 'abc1234', 'Chasen', 'Goren', 'chgo3684@colorado.edu', 2000-10-18, CURDATE()),
    ('rabarbanel', '123abc', 'Ruan', 'Abarbanel', 'ruab1658@colorad.edu', 1997-12-13, CURDATE()),
    ('joshgildred', 'asecge', 'Josh', 'Gildred', 'jogi2895@colorado.edu', 2002-4-26, 2023-2-12),
    ('aava7378', 'hsvase', 'Aaron', 'Van', 'aava7378@gmail.com', 2001-2-29, 2022-5-1);

INSERT INTO events (game_id, team_f, team_n, odds_f, odds_n, outcome_f)
    VALUES
    ('adcea12351d134ar1', 'Indiana St Sycamores', 'Utah Utes', )