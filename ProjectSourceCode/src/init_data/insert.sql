-- This is dummy data to test the site before we use the api
INSERT INTO users (username, password, first_name, last_name, email, birth_date, register_date)
    VALUES
    ('cgoren', 'abc1234', 'Chasen', 'Goren', 'chgo3684@colorado.edu', '2000-10-18', '2023-03-30'),
    ('berg', '$2b$10$SANLjs99hcYsWJ0T/nvAEO5URLzDXED.ZRIL0wKRT1xvQLoWHi2cu', 'Ruan', 'Abarbanel', 'ruab1658@colorad.edu', '1997-12-13', '2023-01-01'),
    ('joshgildred', 'asecge', 'Josh', 'Gildred', 'jogi2895@colorado.edu', '2002-04-26', '2023-02-12'),
    ('aava7378', 'hsvase', 'Aaron', 'Van', 'aava7378@gmail.com', '2001-02-28', '2022-05-01'),
    ('admin','$2b$10$NEtH/I6xX1e58LzONkM6SeKBnrgvbkn/wcXCcERsywRb6R8k.VLgO','Adminny','McAdminister','jogi2895@colorado.edu','1999-12-31','2024-04-14');

-- INSERT INTO events (event_id, team_f, team_n, event_date, outcome_f)
--     VALUES
--     ('adcea12351d134ar1', 'Indiana St Sycamores', 'Utah Utes', '2022-04-30', TRUE),
--     ('acegae12354ce3a12', 'Chicago White Sox', 'Cleveland Guardians', '2022-04-16', FALSE),
--     ('adcf31c235a231ad1', 'Miami Marlins', 'New York Yankees', '2022-05-01', TRUE);

INSERT INTO sportsbooks (sportsbook_name,sportsbook_url)
    VALUES
    ('DraftKings','https://sportsbook.draftkings.com/'),
    ('FanDuel','https://www.fanduel.com/'),
    ('BetMGM','https://sports.co.betmgm.com/'),
    ('Caesars','https://www.caesars.com/sportsbook-and-casino'),
    ('BetRivers','https://co.betrivers.com/'),
    ('MyBookie.ag','https://www.mybookie.ag'),
    ('BetUS','https://betusa.online/');

-- INSERT INTO bets (event_id, bet_value, winnings, deal_id)
--     VALUES
--     ('adcea12351d134ar1', 123.2, 4123, 1),
--     ('acegae12354ce3a12', 1223, 4223, 1),
--     ('adcf31c235a231ad1', 1251, 4141, 1);

-- INSERT INTO userHistory (user_id, bet_id)
--     VALUES
--     (1,1),
--     (1,2),
--     (2,3);

