begin;

create table if not exists public.news (
  id text primary key,
  slug text unique,
  "imageUrl" text not null,
  date text not null,
  headline text not null,
  excerpt text,
  tags text[] not null default '{}',
  body jsonb,
  "tableOfContents" text[] not null default '{}',
  author text,
  category text,
  "readingTime" text,
  likes integer,
  views integer,
  comments integer
);

create table if not exists public.updates (
  id text primary key,
  title text not null,
  "thumbnailUrl" text not null,
  date text not null,
  status text not null check (status in ('Live', 'Completed', 'Pending', 'Canceled'))
);

create table if not exists public.users (
  id text primary key,
  "userName" text not null,
  telegram text not null,
  phone text not null,
  email text not null,
  status text not null check (status in ('Pending', 'Failed', 'Complete', 'Archived')),
  "lastUpdate" text not null,
  profits integer not null,
  losses integer not null
);

insert into public.news (
  id, slug, "imageUrl", date, headline, excerpt, tags, body, "tableOfContents",
  author, category, "readingTime", likes, views, comments
)
values
  (
    'soccer-betting-guide-2026',
    'soccer-betting-guide-2026',
    '/images/news/news.jpg',
    'October 15, 2026',
    'The Complete Guide to Soccer Betting: Tips for Big Games in 2026',
    'Master the fundamentals of soccer betting - from understanding odds and value bets to bankroll management and live betting strategies for major matches.',
    array['Soccer', 'Betting Tips', 'Beginners'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Soccer betting has evolved dramatically in 2026. This article covers practical strategy, value betting, and risk control so readers can make stronger decisions.'),
      jsonb_build_object('heading', 'Understanding Odds and Betting Markets', 'content', 'Understand how decimal and fractional odds represent probability and payout. Start with clear markets before moving to advanced ones.'),
      jsonb_build_object('heading', 'Bankroll Management', 'content', 'Use fixed staking, avoid chasing losses, and track every result. Long-term discipline matters more than short-term streaks.')
    ),
    array[
      'Introduction',
      'Understanding Odds and Betting Markets',
      'How to Spot Value in Big Game Bets',
      'Bankroll Management: The Key to Long-Term Success',
      'Live Betting: When the Game Has Started',
      'Champions League and Major League Tips',
      'What to Look for in a Reliable Tipster',
      'Responsible Betting and Setting Limits',
      'Conclusion'
    ],
    'Pablo Escober',
    'Soccer',
    '10 Min',
    24500,
    50000,
    206
  ),
  (
    '1',
    '5-things-beginner-soccer-betting',
    '/images/news/news.jpg',
    'March 2, 2026',
    '5 Things Every Beginner Must Know Before Betting on Soccer',
    'New to soccer betting? Learn the basics: understanding odds, choosing the right markets, and avoiding common mistakes that cost beginners money.',
    array['Beginners', 'Tips', 'Soccer'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Beginners often lose by skipping fundamentals. These five basics help build a sustainable betting routine.'),
      jsonb_build_object('heading', 'Understand Odds', 'content', 'Translate odds into implied probability and compare it against your own estimate before betting.'),
      jsonb_build_object('heading', 'Bankroll Discipline', 'content', 'Keep stake size fixed and avoid emotional decisions after losses.')
    ),
    array['Introduction', 'Understand Odds Before You Stake', 'Start with Simple Markets', 'Avoid Chasing Losses', 'Set a Bankroll and Stick to It', 'Learn from Every Bet', 'Conclusion'],
    'Pablo Escober',
    'Beginners',
    '9 Min',
    2200,
    15420,
    89
  ),
  (
    '2',
    'champions-league-knockout-best-bets',
    '/images/news/news2.jpg',
    'February 28, 2026',
    'Champions League Knockout Stage: Best Bets This Round',
    'Our analysts break down the upcoming Champions League fixtures, highlighting where value lies and which big-game bets are worth considering.',
    array['Champions League', 'Predictions', 'Value'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Knockout matches are heavily priced but still create selective value.'),
      jsonb_build_object('heading', 'Fixture Analysis', 'content', 'Assess form, injuries, and tactical fit in each tie.'),
      jsonb_build_object('heading', 'Markets to Target', 'content', 'Use value-first market selection and compare bookmaker prices.')
    ),
    array['Introduction', 'Fixture-by-Fixture Analysis', 'Where the Odds Are Sharp', 'Value Picks for This Round', 'Markets to Target', 'Conclusion'],
    'Pablo Escober',
    'Champions League',
    '11 Min',
    8400,
    32100,
    156
  ),
  (
    '3',
    'live-betting-explained-profit-match-started',
    '/images/news/news3.jpg',
    'February 25, 2026',
    'Live Betting Explained: How to Profit When the Match Has Started',
    'In-play betting offers unique opportunities. Discover when to back the underdog, how to read momentum shifts, and why late goals can be your friend.',
    array['Live Betting', 'Strategy', 'Odds'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Live markets move fast and reward prepared bettors.'),
      jsonb_build_object('heading', 'Momentum Shifts', 'content', 'Watch game state, not just the scoreline, for mispriced moments.'),
      jsonb_build_object('heading', 'Late Opportunities', 'content', 'Final phases often provide short-lived value windows.')
    ),
    array['Introduction', 'Why Live Odds Move', 'Momentum and Momentum Shifts', 'When to Back the Underdog', 'Late-Goal Opportunities', 'Pitfalls of Live Betting', 'Conclusion'],
    'Pablo Escober',
    'Live Betting',
    '10 Min',
    6100,
    28900,
    134
  ),
  (
    '4',
    'over-under-goals-soccer-betting-strategy',
    '/images/news/news4.jpg',
    'February 22, 2026',
    'Over/Under Goals: A Simple Strategy for Soccer Betting',
    'Both Teams to Score and Over/Under markets are among the most popular. Here''s how to use team stats and fixture history to find consistent value.',
    array['Goals', 'Markets', 'Strategy'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Goal markets are simple and data-friendly for structured betting.'),
      jsonb_build_object('heading', 'Over/Under Basics', 'content', 'Use scoring profiles and league patterns to estimate fair lines.'),
      jsonb_build_object('heading', 'BTTS', 'content', 'Model both scoring and conceding tendencies before placing bets.')
    ),
    array['Introduction', 'Understanding Over/Under Markets', 'Both Teams to Score Explained', 'Using Team and League Stats', 'Fixture History and Trends', 'Common Mistakes', 'Conclusion'],
    'Pablo Escober',
    'Markets',
    '10 Min',
    5300,
    24400,
    98
  ),
  (
    '5',
    'bankroll-management-beats-tipster-picks',
    '/images/news/news5.jpg',
    'February 20, 2026',
    'Why Bankroll Management Beats Tipster Picks Every Time',
    'The best tip in the world means nothing if you stake too much. Learn why disciplined staking is the real secret to long-term betting success.',
    array['Bankroll', 'Discipline', 'Long-term'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Staking strategy determines survival through variance.'),
      jsonb_build_object('heading', 'Math of Staking', 'content', 'Smaller fixed stakes reduce drawdown and improve long-term durability.'),
      jsonb_build_object('heading', 'Discipline', 'content', 'A clear staking framework beats emotional decision-making.')
    ),
    array['Introduction', 'The Maths of Staking', 'Why Tipsters Can''t Save You', 'Fixed Percentage Staking', 'Emotional Discipline', 'Tracking and Review', 'Conclusion'],
    'Pablo Escober',
    'Strategy',
    '9 Min',
    7200,
    35600,
    167
  ),
  (
    '6',
    'derby-matches-emotion-meets-opportunity',
    '/images/news/news6.jpg',
    'February 18, 2026',
    'Derby Matches: When Emotion Meets Opportunity',
    'Local derbies and rivalry games have unique dynamics. Here''s how to spot overreactions in the odds and when passion on the pitch affects the result.',
    array['Derby', 'Value', 'Psychology'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Rivalry fixtures create emotional volatility in both teams and markets.'),
      jsonb_build_object('heading', 'Market Overreaction', 'content', 'Public sentiment can create price inefficiencies around derby narratives.'),
      jsonb_build_object('heading', 'Practical Markets', 'content', 'Lower-variance options often work better than high-volatility picks.')
    ),
    array['Introduction', 'Why Derbies Are Different', 'Form vs History in Derbies', 'Odds Overreactions', 'Markets That Work in Derbies', 'Conclusion'],
    'Pablo Escober',
    'Soccer',
    '10 Min',
    4900,
    22100,
    76
  ),
  (
    '7',
    'choose-trustworthy-telegram-betting-tipster',
    '/images/news/news7.jpg',
    'February 15, 2026',
    'How to Choose a Trustworthy Telegram Betting Tipster',
    'The Telegram tipster scene is crowded. Learn how to verify track records, avoid fake proofs, and find communities that deliver real value.',
    array['Tipsters', 'Telegram', 'Verification'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Verification separates real analysts from marketing-only channels.'),
      jsonb_build_object('heading', 'Red Flags', 'content', 'Unrealistic win rates and cherry-picked screenshots are common warning signs.'),
      jsonb_build_object('heading', 'Track Records', 'content', 'Prioritize transparent, timestamped logs and meaningful sample sizes.')
    ),
    array['Introduction', 'Red Flags: How to Spot Fake Tipsters', 'Verifying Track Records', 'What a Real Proof Looks Like', 'Free vs Paid Tips', 'Conclusion'],
    'Pablo Escober',
    'Tips',
    '11 Min',
    8900,
    41200,
    203
  ),
  (
    '8',
    'asian-handicap-explained',
    '/images/news/news8.jpg',
    'February 12, 2026',
    'Asian Handicap Explained: Level the Playing Field',
    'Asian Handicap removes the draw and gives underdogs a head start. Perfect for big games where you expect a close result but want better odds.',
    array['Asian Handicap', 'Markets', 'Odds'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Asian handicap simplifies match betting by removing draw outcomes.'),
      jsonb_build_object('heading', 'How It Works', 'content', 'Handicap lines rebalance team strength and alter payout profiles.'),
      jsonb_build_object('heading', 'When to Use It', 'content', 'Use AH when match-up expectations differ from 1X2 market pricing.')
    ),
    array['Introduction', 'How Asian Handicap Works', 'Half and Full Goals', 'When to Use Asian Handicap', 'Comparing to 1X2', 'Conclusion'],
    'Pablo Escober',
    'Markets',
    '10 Min',
    6500,
    28700,
    112
  ),
  (
    '9',
    'international-breaks-betting-odds',
    '/images/news/news9.jpg',
    'February 10, 2026',
    'International Breaks: What Happens to Betting Odds?',
    'Player fatigue, injuries, and motivation change during international windows. Here''s how to adjust your approach when clubs pause for country duty.',
    array['International', 'Fitness', 'Odds'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'International breaks disrupt club routines and shift expected performance.'),
      jsonb_build_object('heading', 'Fatigue and Rotation', 'content', 'Travel load and squad depth heavily impact post-break fixtures.'),
      jsonb_build_object('heading', 'Execution', 'content', 'Team news timing is critical for pre-match and live opportunities.')
    ),
    array['Introduction', 'Post-Break Fatigue', 'Injury Risk and Squad Depth', 'Motivation and Rotation', 'League Games Around Breaks', 'Conclusion'],
    'Pablo Escober',
    'International',
    '9 Min',
    4100,
    19800,
    67
  ),
  (
    '10',
    'top-10-online-bookmakers-soccer-2026',
    '/images/news/news.jpg',
    'February 8, 2026',
    'Top 10 Online Bookmakers for Soccer Betting in 2026',
    'We compare odds, markets, live streaming, and promos across the leading licensed bookmakers so you can get the best value on every bet.',
    array['Bookmakers', 'Reviews', 'Odds'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Bookmaker selection can materially improve long-term returns.'),
      jsonb_build_object('heading', 'Odds Comparison', 'content', 'Small pricing differences compound over many bets.'),
      jsonb_build_object('heading', 'Coverage', 'content', 'Market depth and in-play tooling vary significantly between operators.')
    ),
    array['Introduction', 'What to Look for in a Bookmaker', 'Odds Comparison', 'Markets and Coverage', 'Live Streaming and In-Play', 'Promotions and Loyalty', 'Conclusion'],
    'Pablo Escober',
    'Reviews',
    '12 Min',
    10200,
    52100,
    234
  ),
  (
    '11',
    'responsible-betting-limits-that-work',
    '/images/news/news2.jpg',
    'February 5, 2026',
    'Responsible Betting: Setting Limits That Actually Work',
    'Betting should be entertainment, not a money problem. Practical tips for deposit limits, loss limits, and recognising when to take a break.',
    array['Responsible Gambling', 'Limits', 'Safety'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Responsible betting protects both bankroll and wellbeing.'),
      jsonb_build_object('heading', 'Limit Framework', 'content', 'Set deposit, loss, and time limits before activity begins.'),
      jsonb_build_object('heading', 'Early Warning Signs', 'content', 'Identify behavior changes early and use support tools proactively.')
    ),
    array['Introduction', 'Deposit and Loss Limits', 'Time Limits', 'Recognising Problem Signs', 'When to Take a Break', 'Getting Help', 'Conclusion'],
    'Pablo Escober',
    'Responsible Betting',
    '10 Min',
    15800,
    67800,
    312
  ),
  (
    'similar-1',
    'premier-league-title-race-best-bets',
    '/images/news/news2.jpg',
    'March 1, 2026',
    'Premier League Title Race: Best Bets for the Run-In',
    'With the season entering its final stretch, we analyse the odds for title hopefuls and where the smart money is going.',
    array['Premier League'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Late-season fixtures often decide both titles and betting value opportunities.')
    ),
    array['Introduction', 'Current Standings and Form', 'Fixture Difficulty Analysis', 'Value in the Outright Market', 'Match-by-Match Opportunities', 'Conclusion'],
    'Pablo Escober',
    'Soccer',
    '10 Min',
    2200,
    18600,
    78
  ),
  (
    'similar-2',
    'euro-2026-qualifiers-value-picks',
    '/images/news/news3.jpg',
    'February 28, 2026',
    'Euro 2026 Qualifiers: Value Picks for Underdog Nations',
    'International qualifiers often misprice smaller nations. Our picks for the best value bets in the current qualifying campaign.',
    array['Euro 2026'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'International qualifiers regularly produce context-driven pricing inefficiencies.')
    ),
    array['Introduction', 'Why Qualifiers Offer Value', 'Home Advantage in Internationals', 'Motivation and Context', 'Underdog Spotting', 'Conclusion'],
    'Pablo Escober',
    'International',
    '11 Min',
    6000,
    28400,
    134
  ),
  (
    'similar-3',
    'soccer-best-bets-weekend-tipsters',
    '/images/news/news4.jpg',
    'February 25, 2026',
    'Soccer Best Bets This Weekend: Top Picks from Our Tipsters',
    'Curated selections from across Europe''s top leagues - our analysts'' favourite value bets for the coming matchday.',
    array['Weekend Picks'],
    jsonb_build_array(
      jsonb_build_object('heading', 'Introduction', 'content', 'Weekly shortlists should focus on repeatable edge and stable stake sizing.')
    ),
    array['Introduction', 'Premier League Picks', 'La Liga and Serie A', 'Bundesliga and Ligue 1', 'Championship and Lower Leagues', 'Conclusion'],
    'Pablo Escober',
    'Tips',
    '10 Min',
    10000,
    45200,
    189
  )
on conflict (id) do update
set
  slug = excluded.slug,
  "imageUrl" = excluded."imageUrl",
  date = excluded.date,
  headline = excluded.headline,
  excerpt = excluded.excerpt,
  tags = excluded.tags,
  body = excluded.body,
  "tableOfContents" = excluded."tableOfContents",
  author = excluded.author,
  category = excluded.category,
  "readingTime" = excluded."readingTime",
  likes = excluded.likes,
  views = excluded.views,
  comments = excluded.comments;

with config as (
  select
    array[
      '/images/news/news.jpg',
      '/images/news/news2.jpg',
      '/images/news/news3.jpg',
      '/images/news/news4.jpg',
      '/images/news/news5.jpg',
      '/images/news/news6.jpg',
      '/images/news/news7.jpg',
      '/images/news/news8.jpg',
      '/images/news/news9.jpg'
    ]::text[] as images,
    array['Live', 'Live', 'Live', 'Completed', 'Pending', 'Live', 'Canceled', 'Live', 'Pending', 'Live']::text[] as statuses
),
generated_updates as (
  select
    'post-' || gs::text as id,
    'News and Predictions Post'::text as title,
    c.images[((gs - 1) % array_length(c.images, 1)) + 1] as "thumbnailUrl",
    '01-01-2025'::text as date,
    c.statuses[((gs - 1) % array_length(c.statuses, 1)) + 1] as status
  from generate_series(1, 100) gs
  cross join config c
)
insert into public.updates (id, title, "thumbnailUrl", date, status)
select id, title, "thumbnailUrl", date, status
from generated_updates
on conflict (id) do update
set
  title = excluded.title,
  "thumbnailUrl" = excluded."thumbnailUrl",
  date = excluded.date,
  status = excluded.status;

with config as (
  select
    array[
      'Viktorija Deksne',
      'John Smith',
      'Maria Garcia',
      'Lars Andersen',
      'Anna Kowalski',
      'Erik Nielsen',
      'Sophie Muller',
      'James Wilson',
      'Elena Petrov',
      'Mark Johnson'
    ]::text[] as names,
    array[
      'vicky_latvia',
      'john_smith',
      'maria_g',
      'lars_a',
      'anna_k',
      'erik_n',
      'sophie_m',
      'james_w',
      'elena_p',
      'mark_j'
    ]::text[] as telegrams,
    array[
      '+371 27266132',
      '+44 7700 900123',
      '+34 612 345678',
      '+45 20123456',
      '+48 601 234 567',
      '+46 70 123 4567',
      '+49 151 12345678',
      '+1 555 123 4567',
      '+7 912 345 6789',
      '+33 6 12 34 56 78'
    ]::text[] as phones,
    array[
      'viktorijadeksne@gmail.com',
      'john@example.com',
      'maria@example.com',
      'lars@example.com',
      'anna@example.com',
      'erik@example.com',
      'sophie@example.com',
      'james@example.com',
      'elena@example.com',
      'mark@example.com'
    ]::text[] as emails,
    array['Complete', 'Pending', 'Failed', 'Complete', 'Complete', 'Pending', 'Failed', 'Complete', 'Archived', 'Complete']::text[] as statuses
),
generated_users as (
  select
    'user-' || gs::text as id,
    c.names[((gs - 1) % array_length(c.names, 1)) + 1] as "userName",
    c.telegrams[((gs - 1) % array_length(c.telegrams, 1)) + 1] as telegram,
    c.phones[((gs - 1) % array_length(c.phones, 1)) + 1] as phone,
    c.emails[((gs - 1) % array_length(c.emails, 1)) + 1] as email,
    c.statuses[((gs - 1) % array_length(c.statuses, 1)) + 1] as status,
    lpad((((gs - 1) % 28) + 1)::text, 2, '0')
      || ' Mar 2026, '
      || lpad((9 + ((gs - 1) % 12))::text, 2, '0')
      || ':'
      || lpad(((gs - 1) % 60)::text, 2, '0') as "lastUpdate",
    10500 + ((gs - 1) * 123) as profits,
    10500 - ((gs - 1) * 50) + (((gs - 1) % 3) * 200) as losses
  from generate_series(1, 100) gs
  cross join config c
)
insert into public.users (
  id, "userName", telegram, phone, email, status, "lastUpdate", profits, losses
)
select id, "userName", telegram, phone, email, status, "lastUpdate", profits, losses
from generated_users
on conflict (id) do update
set
  "userName" = excluded."userName",
  telegram = excluded.telegram,
  phone = excluded.phone,
  email = excluded.email,
  status = excluded.status,
  "lastUpdate" = excluded."lastUpdate",
  profits = excluded.profits,
  losses = excluded.losses;

commit;
