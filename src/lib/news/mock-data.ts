import type { NewsArticle } from "@/types/news";

/** Images from images/news – replace with real article images from backend */
const IMAGES = [
  "/images/news/news.jpg",
  "/images/news/news2.jpg",
  "/images/news/news3.jpg",
  "/images/news/news4.jpg",
  "/images/news/news5.jpg",
  "/images/news/news6.jpg",
  "/images/news/news7.jpg",
  "/images/news/news8.jpg",
  "/images/news/news9.jpg",
];

/** Full article – for article detail view */
const SOCCER_BETTING_GUIDE_ARTICLE: NewsArticle = {
  id: "soccer-betting-guide-2026",
  slug: "soccer-betting-guide-2026",
  imageUrl: IMAGES[0],
  date: "October 15, 2026",
  headline: "The Complete Guide to Soccer Betting: Tips for Big Games in 2026",
  excerpt:
    "Master the fundamentals of soccer betting—from understanding odds and value bets to bankroll management and live betting strategies for major matches.",
  tags: ["Soccer", "Betting Tips", "Beginners"],
  category: "Soccer",
  author: "Pablo Escober",
  readingTime: "10 Min",
  likes: 24500,
  views: 50000,
  comments: 206,
  tableOfContents: [
    "Introduction",
    "Understanding Odds and Betting Markets",
    "How to Spot Value in Big Game Bets",
    "Bankroll Management: The Key to Long-Term Success",
    "Live Betting: When the Game Has Started",
    "Champions League and Major League Tips",
    "What to Look for in a Reliable Tipster",
    "Responsible Betting and Setting Limits",
    "Conclusion",
  ],
  body: [
    {
      heading: "Introduction",
      content:
        "Soccer betting has evolved dramatically. Whether you're following the Champions League, Premier League, or international tournaments, having a solid strategy is essential. This guide covers everything from reading odds and finding value to managing your bankroll and betting responsibly. Whether you're new to online betting or looking to sharpen your approach for big games, these insights will help you make smarter decisions.",
    },
    {
      heading: "Understanding Odds and Betting Markets",
      content:
        "Before placing any bet, you need to understand how odds work. Odds represent the probability of an outcome and determine your potential payout. Decimal odds (e.g. 2.50) mean you win 2.50 for every 1 unit staked. Fractional odds (e.g. 6/4) show profit relative to stake. Beyond the standard Match Result (1X2), explore markets like Both Teams to Score, Over/Under goals, Correct Score, and Asian Handicaps. Each market offers different risk profiles—big games often see more liquidity and sharper odds, so value can be harder to find.",
    },
    {
      heading: "How to Spot Value in Big Game Bets",
      content:
        "Value betting means finding odds that are higher than the true probability of an outcome. Before a big match, analyse team form, head-to-head records, injuries, and motivation (e.g. relegation battles, cup finals). Compare odds across bookmakers—the best value often appears when one bookmaker has mispriced an event. Tipster communities and tools can highlight discrepancies between market odds and statistical models. Remember: even the best tipsters can't win every bet, but consistent value leads to long-term profit.",
    },
    {
      heading: "Bankroll Management: The Key to Long-Term Success",
      content:
        "No matter how good your tips, poor bankroll management will break you. Set a dedicated betting bankroll you can afford to lose. Stake a fixed percentage per bet (commonly 1–5%) rather than chasing losses. Avoid betting when emotional or after a losing streak. Track your bets in a simple spreadsheet: stake, odds, outcome, and profit/loss. Over time, this discipline separates recreational bettors from those who treat it as a serious hobby or side income.",
    },
  ],
};

/**
 * Mock articles – REMOVE when backend is ready.
 * Replace with: useSWR('/api/news', fetcher) or CMS query.
 */
export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  SOCCER_BETTING_GUIDE_ARTICLE,
  {
    id: "1",
    slug: "5-things-beginner-soccer-betting",
    imageUrl: IMAGES[0],
    date: "March 2, 2026",
    headline: "5 Things Every Beginner Must Know Before Betting on Soccer",
    excerpt:
      "New to soccer betting? Learn the basics: understanding odds, choosing the right markets, and avoiding common mistakes that cost beginners money.",
    tags: ["Beginners", "Tips", "Soccer"],
    category: "Beginners",
    author: "Pablo Escober",
    readingTime: "9 Min",
    likes: 2200,
    views: 15420,
    comments: 89,
    tableOfContents: [
      "Introduction",
      "Understand Odds Before You Stake",
      "Start with Simple Markets",
      "Avoid Chasing Losses",
      "Set a Bankroll and Stick to It",
      "Learn from Every Bet",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Soccer betting can be exciting and profitable, but only if you approach it with the right mindset. Too many beginners dive in without understanding the fundamentals and end up losing money they can't afford. This guide covers five essential concepts that will set you on the right path—from reading odds correctly to managing your bankroll. Whether you're placing your first bet or looking to formalise your approach, these principles apply to every level.",
      },
      {
        heading: "Understand Odds Before You Stake",
        content:
          "Odds tell you two things: the implied probability of an outcome and your potential payout. Decimal odds of 2.50 mean the bookmaker thinks there's roughly a 40% chance of that outcome occurring. If you bet 10 units and win, you receive 25 units back (including stake). Fractional odds work differently—6/4 means you profit 6 for every 4 staked. Always convert odds to implied probability in your head. If you believe the true chance is higher than the odds suggest, that's value.",
      },
      {
        heading: "Start with Simple Markets",
        content:
          "Resist the urge to bet on exotic markets early. Match Result (1X2), Both Teams to Score, and Over/Under 2.5 goals are the best starting point. They're easy to understand and have the tightest margins, so you can focus on analysis rather than deciphering complex market rules. Once you're comfortable and showing discipline, branch into Correct Score, Asian Handicap, or player props. Complexity doesn't equal profit—clarity does.",
      },
      {
        heading: "Avoid Chasing Losses",
        content:
          "Losing streaks happen to everyone. The worst thing you can do is increase stakes to 'win back' what you lost. Chasing losses leads to emotional decisions and usually bigger losses. Accept that variance is part of betting. If you're following a sound strategy, short-term downturns will even out over time. When you feel frustrated, step away. Take a day off. Review your process, not your bankroll.",
      },
      {
        heading: "Set a Bankroll and Stick to It",
        content:
          "Your bankroll is money you can afford to lose entirely. Never bet with rent, bills, or savings. Decide on a fixed amount per bet—commonly 1% to 5% of your bankroll. A 100-unit bankroll means 1–5 units per bet. When you lose, your next bet stays the same size. When you win, it stays the same until you formally increase your bankroll. This discipline protects you from ruin and keeps betting sustainable.",
      },
    ],
  },
  {
    id: "2",
    slug: "champions-league-knockout-best-bets",
    imageUrl: IMAGES[1],
    date: "February 28, 2026",
    headline: "Champions League Knockout Stage: Best Bets This Round",
    excerpt:
      "Our analysts break down the upcoming Champions League fixtures, highlighting where value lies and which big-game bets are worth considering.",
    tags: ["Champions League", "Predictions", "Value"],
    category: "Champions League",
    author: "Pablo Escober",
    readingTime: "11 Min",
    likes: 8400,
    views: 32100,
    comments: 156,
    tableOfContents: [
      "Introduction",
      "Fixture-by-Fixture Analysis",
      "Where the Odds Are Sharp",
      "Value Picks for This Round",
      "Markets to Target",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "The Champions League knockout stage brings together the best teams in Europe, and with that comes intense scrutiny from bookmakers. Odds are often sharp, but opportunities still exist for those who dig deeper. This round-by-round analysis looks at form, injuries, tactical matchups, and motivation. We identify which ties offer value and which are best avoided. Remember: even the best analysis can't guarantee wins, but it can tilt the odds in your favour over the long run.",
      },
      {
        heading: "Fixture-by-Fixture Analysis",
        content:
          "Each knockout tie has its own story. Home legs matter—teams with strong home form often outperform expectations in first legs. Second legs bring different dynamics: teams chasing a deficit take more risks, while those protecting a lead may sit deeper. Consider travel, rest between domestic fixtures, and squad rotation. Top sides competing on multiple fronts may prioritise differently. These factors create edges that the market doesn't always price in immediately.",
      },
      {
        heading: "Where the Odds Are Sharp",
        content:
          "Big Champions League nights attract heavy liquidity. The marquee ties—Real Madrid vs Bayern, Barcelona vs Manchester City—see odds move quickly on any news. By contrast, less glamorous matchups sometimes retain value longer. Underdogs in knockout football often perform better than league form suggests; cup competitions have different psychological pressures. Look for ties where public sentiment might be misaligned with underlying stats.",
      },
      {
        heading: "Value Picks for This Round",
        content:
          "We won't name specific bets here—odds change daily—but our framework applies: compare multiple bookmakers, use odds comparison tools, and consider Asian Handicaps for matches where you expect a close scoreline. Both Teams to Score often offers value in open knockout ties where both sides need to attack. Double Chance can reduce variance when you're unsure of the exact result. Track your bets and refine your approach each round.",
      },
      {
        heading: "Markets to Target",
        content:
          "Beyond Match Result, knockout football suits Over/Under goals (especially in second legs with aggregate pressure), Correct Score for low-scoring tactical battles, and Draw No Bet when you fancy an underdog but want insurance. Live betting becomes especially valuable—momentum swings in knockout ties can create temporary mispricings. Have your accounts funded and ready; the best in-play value appears in short windows.",
      },
    ],
  },
  {
    id: "3",
    slug: "live-betting-explained-profit-match-started",
    imageUrl: IMAGES[2],
    date: "February 25, 2026",
    headline: "Live Betting Explained: How to Profit When the Match Has Started",
    excerpt:
      "In-play betting offers unique opportunities. Discover when to back the underdog, how to read momentum shifts, and why late goals can be your friend.",
    tags: ["Live Betting", "Strategy", "Odds"],
    category: "Live Betting",
    author: "Pablo Escober",
    readingTime: "10 Min",
    likes: 6100,
    views: 28900,
    comments: 134,
    tableOfContents: [
      "Introduction",
      "Why Live Odds Move",
      "Momentum and Momentum Shifts",
      "When to Back the Underdog",
      "Late-Goal Opportunities",
      "Pitfalls of Live Betting",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Live betting—or in-play betting—lets you place wagers after the match has kicked off. Odds update continuously based on the score, possession, chances, and time remaining. For disciplined bettors, this creates opportunities that pre-match markets don't offer. You can react to red cards, injuries, tactical changes, and momentum. But it also demands focus, speed, and emotional control. This guide explains how to approach live betting strategically and avoid the common traps.",
      },
      {
        heading: "Why Live Odds Move",
        content:
          "Pre-match odds reflect expectations. Once the game starts, reality replaces expectation. A goal (especially an early one) can shift odds dramatically. A team leading 1–0 might shorten from 2.20 to 1.40; the trailing team drifts. Red cards, injuries to key players, and visible fatigue all move the needle. Bookmakers adjust quickly, but sometimes they overreact. A single goal shouldn't always change the fundamental assessment—especially if the scoreline doesn't reflect the run of play.",
      },
      {
        heading: "Momentum and Momentum Shifts",
        content:
          "Momentum is real in football. A team under pressure for 20 minutes often concedes, even if they were favourites before kick-off. Watch for patterns: who's dominating possession, creating chances, winning second balls. If the stats and the score don't align—e.g. the underdog is 1–0 up but being outplayed—there can be value backing the favourite to equalise or win. Conversely, if the favourite is struggling to break down a deep block, Over/Under or Both Teams to Score might offer better value than backing the favourite.",
      },
      {
        heading: "When to Back the Underdog",
        content:
          "Live underdogs often provide the best value. When a favourite goes 1–0 up early, the underdog's odds can drift to attractive levels. If the underdog is still creating chances and the favourite is sitting back, the true probability of a comeback might be higher than the odds suggest. Same logic applies at 0–0: if the underdog has had the better of the first half, their live odds might still be generous. Back underdogs when the game state supports it, not out of hope.",
      },
      {
        heading: "Late-Goal Opportunities",
        content:
          "In the final 15–20 minutes, chasing teams throw caution to the wind. Over 2.5 goals, Both Teams to Score, and Next Goal markets become more volatile. If a match is 1–1 with 20 minutes left and both sides need to win, the probability of another goal rises. Odds don't always reflect this fast enough. Late goals are also common in injury time when defences tire. Be ready to act; these windows close quickly.",
      },
    ],
  },
  {
    id: "4",
    slug: "over-under-goals-soccer-betting-strategy",
    imageUrl: IMAGES[3],
    date: "February 22, 2026",
    headline: "Over/Under Goals: A Simple Strategy for Soccer Betting",
    excerpt:
      "Both Teams to Score and Over/Under markets are among the most popular. Here's how to use team stats and fixture history to find consistent value.",
    tags: ["Goals", "Markets", "Strategy"],
    category: "Markets",
    author: "Pablo Escober",
    readingTime: "10 Min",
    likes: 5300,
    views: 24400,
    comments: 98,
    tableOfContents: [
      "Introduction",
      "Understanding Over/Under Markets",
      "Both Teams to Score Explained",
      "Using Team and League Stats",
      "Fixture History and Trends",
      "Common Mistakes",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Over/Under goals and Both Teams to Score (BTTS) are two of the most popular soccer betting markets. They're simple to understand: will there be more or fewer than X goals? Will both sides score? The appeal is that you don't need to predict the winner—only the goal count or scoring pattern. With the right data, these markets can offer consistent value. This guide covers how to approach them systematically and which stats matter most.",
      },
      {
        heading: "Understanding Over/Under Markets",
        content:
          "Over 2.5 goals means three or more goals in total. Under 2.5 means zero, one, or two. The .5 eliminates the push—you either win or lose. Over 1.5 is easier to hit; Over 3.5 is harder. Different leagues and teams have different goal profiles. The Bundesliga typically produces more goals than Serie A. Defensive teams like Atlético Madrid historically favour Under markets. Know the baseline before you bet.",
      },
      {
        heading: "Both Teams to Score Explained",
        content:
          "BTTS Yes pays out if both teams score at least once, regardless of the final score. BTTS No pays if at least one team fails to score. It's a popular market because it often offers better odds than 1X2 for matches where you expect goals both ways. High-scoring leagues and attack-minded teams favour BTTS Yes. Tactical, defensive matchups favour BTTS No. Check each team's scoring and conceding records home and away.",
      },
      {
        heading: "Using Team and League Stats",
        content:
          "Average goals per game (total and by team) is your starting point. If Team A averages 2.1 goals scored and 1.2 conceded at home, and Team B averages 1.8 scored and 1.5 conceded away, the expected total is around 2.4 + 1.35 = 3.75—so Over 2.5 might be value. For BTTS, look at the percentage of matches where each team scores and concedes. Combine those probabilities to estimate BTTS likelihood. Odds comparison tools help you find the best price.",
      },
      {
        heading: "Fixture History and Trends",
        content:
          "Head-to-head history matters. Some matchups consistently produce goals; others are cagey. Derby games and rivalry matches can buck season-long trends. Also consider recent form: a team in a scoring slump might be undervalued on Over markets if they're due a regression to the mean. Don't overfit—use at least 10–15 games of data. Sample size matters more than a couple of outlier results.",
      },
    ],
  },
  {
    id: "5",
    slug: "bankroll-management-beats-tipster-picks",
    imageUrl: IMAGES[4],
    date: "February 20, 2026",
    headline: "Why Bankroll Management Beats Tipster Picks Every Time",
    excerpt:
      "The best tip in the world means nothing if you stake too much. Learn why disciplined staking is the real secret to long-term betting success.",
    tags: ["Bankroll", "Discipline", "Long-term"],
    category: "Strategy",
    author: "Pablo Escober",
    readingTime: "9 Min",
    likes: 7200,
    views: 35600,
    comments: 167,
    tableOfContents: [
      "Introduction",
      "The Maths of Staking",
      "Why Tipsters Can't Save You",
      "Fixed Percentage Staking",
      "Emotional Discipline",
      "Tracking and Review",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Everyone wants the perfect tip. The reality is that even the best tipsters have losing runs. What separates long-term winners from losers isn't pick quality alone—it's bankroll management. Stake too much on a single bet and one bad run can wipe you out. Stake too little and even a great strategy won't move the needle. This guide explains why staking is the most underrated skill in betting and how to get it right.",
      },
      {
        heading: "The Maths of Staking",
        content:
          "Suppose you have a 100-unit bankroll and stake 10 units per bet. Three losses in a row—common in betting—leave you at 70 units. That's a 30% drawdown from variance alone. If you'd staked 5 units (5%), you'd be at 85 units—uncomfortable but recoverable. At 1% staking, three losses cost you 3 units. The maths is brutal: aggressive staking amplifies variance. Conservative staking smooths it out and keeps you in the game long enough for edge to matter.",
      },
      {
        heading: "Why Tipsters Can't Save You",
        content:
          "A tipster with a 55% strike rate at average odds of 2.00 is profitable over 1000 bets. But over 10 bets, 20 bets, or even 50 bets, you can easily have a losing run. If you're staking 20% per bet because you 'trust the tipster', a short cold streak can destroy your bankroll. The tipster's edge is real; your execution is what turns that edge into profit. Bad staking turns a winning strategy into a losing experience.",
      },
      {
        heading: "Fixed Percentage Staking",
        content:
          "The standard approach: stake 1–5% of your bankroll per bet. If your bankroll is 500 units, each bet is 5–25 units. When you lose, your next stake decreases (because your bankroll shrank). When you win, it increases slightly. This is compound staking—your bet size scales with your results. It prevents runaway losses and lets winners grow naturally. Never increase stake after a loss to 'get it back'. That's the opposite of discipline.",
      },
      {
        heading: "Emotional Discipline",
        content:
          "Bankroll management only works if you follow it. The moment you think 'just this once I'll stake more' after a loss, you've broken the system. Set rules in advance: maximum bet size, maximum daily loss, compulsory breaks after X consecutive losses. Write them down. Use betting apps with deposit and loss limits. Treat your bankroll as sacred. Emotion is the enemy of good staking.",
      },
    ],
  },
  {
    id: "6",
    slug: "derby-matches-emotion-meets-opportunity",
    imageUrl: IMAGES[5],
    date: "February 18, 2026",
    headline: "Derby Matches: When Emotion Meets Opportunity",
    excerpt:
      "Local derbies and rivalry games have unique dynamics. Here's how to spot overreactions in the odds and when passion on the pitch affects the result.",
    tags: ["Derby", "Value", "Psychology"],
    category: "Soccer",
    author: "Pablo Escober",
    readingTime: "10 Min",
    likes: 4900,
    views: 22100,
    comments: 76,
    tableOfContents: [
      "Introduction",
      "Why Derbies Are Different",
      "Form vs History in Derbies",
      "Odds Overreactions",
      "Markets That Work in Derbies",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Derby matches—local rivalries like El Clásico, the Manchester derby, or Merseyside—carry extra weight. Form can go out the window; passion and pride take over. For bettors, this creates both risk and opportunity. The bookmakers know derbies attract disproportionate attention and often shade odds toward sentiment. Understanding when the market overreacts to rivalry narrative—and when it doesn't—can reveal value. This guide walks through how to approach derby betting strategically.",
      },
      {
        heading: "Why Derbies Are Different",
        content:
          "In a normal league game, the better team usually wins more often. In a derby, motivation, aggression, and desire can level the playing field. Underdogs play above their usual level; favourites sometimes freeze or overcommit. Red cards are more common. Referees may be stricter or more lenient depending on the occasion. The emotional context changes the distribution of outcomes. Statistical models built on non-derby data may underpredict underdog wins and draws.",
      },
      {
        heading: "Form vs History in Derbies",
        content:
          "Head-to-head derby history is worth considering but don't overweight it. A team that's lost the last five derbies might be due a result—or they might have a psychological block. Current form, injuries, and tactical setup matter more. If the underdog is in great form and the favourite is struggling, the odds might not fully reflect it because the market 'knows' the favourite 'always wins the derby'. Test that assumption with data.",
      },
      {
        heading: "Odds Overreactions",
        content:
          "The biggest opportunities come when public sentiment pushes odds too far. If the favourite is unbeaten in 10 and the underdog has lost 5 of 6, the favourite's odds might shorten beyond what's justified. Conversely, if the underdog has just beaten a top side, their derby odds might be too long. Look for mismatches between odds and underlying strength. Both Teams to Score and Over/Under can also be mispriced—derbies are often cagey or frantic; the market isn't always sure which.",
      },
      {
        heading: "Markets That Work in Derbies",
        content:
          "Draw No Bet and Double Chance reduce variance when you expect a tight game. Cards markets can offer value if you anticipate a physical, heated affair. First Goal and Correct Score are higher variance—use sparingly. Live betting often captures momentum swings that pre-match odds miss. If the underdog dominates the first half but it's 0–0, their live odds might still be generous. Have a plan before the match; don't get swept up in the occasion.",
      },
    ],
  },
  {
    id: "7",
    slug: "choose-trustworthy-telegram-betting-tipster",
    imageUrl: IMAGES[6],
    date: "February 15, 2026",
    headline: "How to Choose a Trustworthy Telegram Betting Tipster",
    excerpt:
      "The Telegram tipster scene is crowded. Learn how to verify track records, avoid fake proofs, and find communities that deliver real value.",
    tags: ["Tipsters", "Telegram", "Verification"],
    category: "Tips",
    author: "Pablo Escober",
    readingTime: "11 Min",
    likes: 8900,
    views: 41200,
    comments: 203,
    tableOfContents: [
      "Introduction",
      "Red Flags: How to Spot Fake Tipsters",
      "Verifying Track Records",
      "What a Real Proof Looks Like",
      "Free vs Paid Tips",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Telegram has become a hub for betting tipsters. Some are legitimate analysts with transparent track records. Many are not. Fake proofs, selective reporting, and outright scams are common. This guide helps you tell the difference. We cover how to verify a tipster's claims, what realistic performance looks like, and how to protect yourself. Even the best tipster can't win every bet—anyone claiming otherwise is lying. The goal is to find those who add genuine value over time.",
      },
      {
        heading: "Red Flags: How to Spot Fake Tipsters",
        content:
          "Beware of tipsters who never show losing bets, only winners. Real tipsters have losing runs. Be suspicious of 'proof' screenshots with no timestamps, no bet IDs, or cropped-out information. Claims of '95% win rate' or 'guaranteed profit' are always false. If they pressure you to join a paid group immediately or offer 'vip signals' at premium prices, tread carefully. Legitimate tipsters are transparent about methodology and track record. They also welcome scrutiny.",
      },
      {
        heading: "Verifying Track Records",
        content:
          "A proper track record lists every bet: date, match, market, odds, stake, and result. It's updated in real time, not retrospectively. Third-party verification sites (e.g. Tipstrr, BettingMetrics) add credibility—they record bets independently. Check ROI (return on investment) and sample size. A 20% ROI over 50 bets might be variance; over 500 bets it's more meaningful. Expect 5–15% ROI from good tipsters; anything higher over a small sample is likely luck.",
      },
      {
        heading: "What a Real Proof Looks Like",
        content:
          "Real proofs show the full betslip: bookmaker, time, stake, odds, and outcome. They're posted before the match or as soon as the bet is placed, not after. Historical proof pages are maintained with all bets, wins and losses. Tipsters who only share cherry-picked screenshots or vague 'monthly profit' claims without breakdowns are hiding something. Ask for access to full history. If they refuse or get defensive, move on.",
      },
      {
        heading: "Free vs Paid Tips",
        content:
          "Free tips can be genuine—many tipsters use them to build reputation before offering premium content. But free tips are often lower stakes or 'safer' picks. Paid groups should offer better analysis, more markets, and higher-confidence bets. Before paying, trial for a month if possible. Track the tipster's picks yourself in a spreadsheet. Compare their claimed ROI to what you'd have made following their bets. If it doesn't add up, cancel.",
      },
    ],
  },
  {
    id: "8",
    slug: "asian-handicap-explained",
    imageUrl: IMAGES[7],
    date: "February 12, 2026",
    headline: "Asian Handicap Explained: Level the Playing Field",
    excerpt:
      "Asian Handicap removes the draw and gives underdogs a head start. Perfect for big games where you expect a close result but want better odds.",
    tags: ["Asian Handicap", "Markets", "Odds"],
    category: "Markets",
    author: "Pablo Escober",
    readingTime: "10 Min",
    likes: 6500,
    views: 28700,
    comments: 112,
    tableOfContents: [
      "Introduction",
      "How Asian Handicap Works",
      "Half and Full Goals",
      "When to Use Asian Handicap",
      "Comparing to 1X2",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Asian Handicap (AH) is a market that eliminates the draw by giving one team a virtual head start. Instead of betting on Team A to win, draw, or lose, you bet on Team A -0.5 (they must win) or Team A +0.5 (they must not lose). This creates a two-way market with better odds than 1X2. It's especially useful when you think the favourite will win but the draw no bet odds are poor, or when you fancy an underdog to avoid defeat. This guide explains the mechanics and when to use it.",
      },
      {
        heading: "How Asian Handicap Works",
        content:
          "Team A -0.5 means Team A must win by any margin. A draw or loss = you lose. Team A +0.5 means Team A must win or draw. A loss = you lose. So +0.5 is 'draw no bet'—you're covered if it's a draw. -1 means Team A must win by 2 or more; +1 means Team A can lose by 1 and you still win (they'd lose 1–0, so with +1 they 'draw' on the handicap). The handicap levels the perceived strength difference between the teams.",
      },
      {
        heading: "Half and Full Goals",
        content:
          "Half goals (-0.5, +0.5) eliminate the push—you always have a clear win or loss. Full goals (-1, +1, -2, +2) can push: if Team A -1 wins 1–0, the handicap result is a draw, so your stake is returned. Some bettors prefer half goals for certainty; others use full goals when they want the security of a push. Know which you're betting before you place.",
      },
      {
        heading: "When to Use Asian Handicap",
        content:
          "Use AH when you have a strong view on the favourite winning but don't want to pay short odds. Favourite -0.5 or -1 often offers better value than 1X2. Use underdog +0.5 when you think they'll at least draw—you get better odds than Draw No Bet in many books. In big games with evenly matched sides, +0.5 on the slight underdog can be excellent value if you expect a tight, low-scoring affair.",
      },
      {
        heading: "Comparing to 1X2",
        content:
          "1X2 has three outcomes; AH collapses that to two. The bookmaker's margin is often lower on AH, so you get fairer odds. If you'd bet Draw No Bet on the underdog at 1.80, check AH +0.5—it might be 1.85 or 1.90. Small edges compound. Always compare markets before placing. AH isn't always better, but it's a tool every serious bettor should understand.",
      },
    ],
  },
  {
    id: "9",
    slug: "international-breaks-betting-odds",
    imageUrl: IMAGES[8],
    date: "February 10, 2026",
    headline: "International Breaks: What Happens to Betting Odds?",
    excerpt:
      "Player fatigue, injuries, and motivation change during international windows. Here's how to adjust your approach when clubs pause for country duty.",
    tags: ["International", "Fitness", "Odds"],
    category: "International",
    author: "Pablo Escober",
    readingTime: "9 Min",
    likes: 4100,
    views: 19800,
    comments: 67,
    tableOfContents: [
      "Introduction",
      "Post-Break Fatigue",
      "Injury Risk and Squad Depth",
      "Motivation and Rotation",
      "League Games Around Breaks",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "International breaks disrupt the club calendar. Star players travel, play for their countries, and return tired or injured. Squads with many internationals are affected more than those with fewer. Betting odds don't always fully account for this. Understanding how breaks impact performance—and when the market overreacts or underreacts—can uncover value. This guide covers what to watch for in the fixtures immediately before and after international windows.",
      },
      {
        heading: "Post-Break Fatigue",
        content:
          "Players returning from international duty often underperform in their first league game back. Long travel, different time zones, and high-intensity international matches take a toll. Teams with 10+ internationals may rotate or field a weakened XI. Check line-up news closely. If key players are rested, the odds might not move enough. Conversely, if a team has few internationals and their opponents are jet-lagged, that's a potential edge.",
      },
      {
        heading: "Injury Risk and Squad Depth",
        content:
          "Injuries picked up on international duty are announced late. A star striker returning 'tired' might be omitted at the last minute. Follow injury news and manager press conferences. Squads with deep benches cope better; smaller clubs hit harder. Odds can shift significantly when team news drops—sometimes too much, sometimes too little. Having multiple accounts lets you grab value before the market corrects.",
      },
      {
        heading: "Motivation and Rotation",
        content:
          "Managers often rest key players in the league game before a break to keep them fresh for country. And after a break, they might rest those who played 180 minutes for their nation. Rotation is hardest to predict but creates odds movement. If the market assumes full-strength teams and you have intel (or a strong read) on rotation, you can find value. Be cautious—rotation is often overestimated by the public.",
      },
      {
        heading: "League Games Around Breaks",
        content:
          "The game immediately after a break is the most volatile. Fatigue, injuries, and lineup uncertainty are at their peak. Some bettors avoid these fixtures; others specialise in them. If you do bet, wait for confirmed lineups when possible. Live betting can also help—if a team starts slowly, you might get better odds in-play than pre-match once the market sees they're not at full strength.",
      },
    ],
  },
  {
    id: "10",
    slug: "top-10-online-bookmakers-soccer-2026",
    imageUrl: IMAGES[0],
    date: "February 8, 2026",
    headline: "Top 10 Online Bookmakers for Soccer Betting in 2026",
    excerpt:
      "We compare odds, markets, live streaming, and promos across the leading licensed bookmakers so you can get the best value on every bet.",
    tags: ["Bookmakers", "Reviews", "Odds"],
    category: "Reviews",
    author: "Pablo Escober",
    readingTime: "12 Min",
    likes: 10200,
    views: 52100,
    comments: 234,
    tableOfContents: [
      "Introduction",
      "What to Look for in a Bookmaker",
      "Odds Comparison",
      "Markets and Coverage",
      "Live Streaming and In-Play",
      "Promotions and Loyalty",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Choosing the right bookmaker can add 5–15% to your long-term returns. Different books offer different odds, market depth, and promos. Having accounts at multiple bookmakers lets you always take the best price. This guide reviews what to prioritise: licensing and safety, odds competitiveness, variety of markets, live streaming, and customer service. We don't name specific brands—odds and offers change—but we give you the framework to evaluate any bookmaker.",
      },
      {
        heading: "What to Look for in a Bookmaker",
        content:
          "First: is the bookmaker licensed in a reputable jurisdiction (UK, Malta, Gibraltar)? Licensed operators are regulated and your funds are protected. Second: do they offer the leagues and markets you care about? Third: are their odds competitive? Use odds comparison sites to check. Fourth: what's their stance on winning bettors? Some books limit or close accounts of consistent winners. Read terms and reviews.",
      },
      {
        heading: "Odds Comparison",
        content:
          "Odds vary between books. A 2.10 price at Book A might be 2.15 at Book B. On 100 bets of 10 units, that 0.05 difference is 50 units—half a bankroll. Always have 3–5 accounts and compare before placing. Asian books often have better odds on Asian Handicap. European books may lead on Match Result. Specialise per market. Odds comparison tools (Oddschecker, etc.) make this easy.",
      },
      {
        heading: "Markets and Coverage",
        content:
          "Top leagues (Premier League, La Liga, Champions League) are offered everywhere. Lower leagues, women's football, and regional competitions vary. If you bet on niche markets, check coverage before signing up. Same for specials: player props, corners, cards. Depth of markets matters for serious bettors who want to exploit edges beyond 1X2 and Over/Under.",
      },
      {
        heading: "Live Streaming and In-Play",
        content:
          "Live streaming improves in-play betting. Watching the match lets you react to momentum, injuries, and tactical changes. Not all books stream all matches—often you need a funded account or a recent bet. In-play markets vary too: some books offer 100+ markets per match; others have basics only. If live betting is part of your strategy, prioritise books with fast markets and minimal delay.",
      },
    ],
  },
  {
    id: "11",
    slug: "responsible-betting-limits-that-work",
    imageUrl: IMAGES[1],
    date: "February 5, 2026",
    headline: "Responsible Betting: Setting Limits That Actually Work",
    excerpt:
      "Betting should be entertainment, not a money problem. Practical tips for deposit limits, loss limits, and recognising when to take a break.",
    tags: ["Responsible Gambling", "Limits", "Safety"],
    category: "Responsible Betting",
    author: "Pablo Escober",
    readingTime: "10 Min",
    likes: 15800,
    views: 67800,
    comments: 312,
    tableOfContents: [
      "Introduction",
      "Deposit and Loss Limits",
      "Time Limits",
      "Recognising Problem Signs",
      "When to Take a Break",
      "Getting Help",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Betting should be fun. When it stops being fun—when you're chasing losses, betting money you can't afford, or hiding your activity—it's time to act. Responsible betting isn't about never losing; it's about keeping losses within boundaries you've set in advance. This guide covers practical tools: deposit limits, loss limits, and self-exclusion. It also covers the warning signs that suggest you need to step back, and where to get help if you need it.",
      },
      {
        heading: "Deposit and Loss Limits",
        content:
          "Most licensed bookmakers offer deposit limits: cap how much you can add per day, week, or month. Set these when you're calm, not when you're on a losing streak. Loss limits are trickier—some books have them, others don't. You can impose your own: if you lose X units in a session, you stop. Write it down. Tell someone. Use app blockers if you need to enforce it. The goal is to prevent impulsive top-ups and runaway sessions.",
      },
      {
        heading: "Time Limits",
        content:
          "Time flies when you're betting. Set a timer: 'I'll bet for one hour max.' When it goes off, log out. Avoid betting when drunk, stressed, or emotional. These states impair judgment. Schedule betting for specific times rather than impulse sessions. Treat it like entertainment with a budget—you wouldn't binge a whole season of a show in one night; same logic applies to betting.",
      },
      {
        heading: "Recognising Problem Signs",
        content:
          "Warning signs include: betting more than you planned, borrowing to bet, lying about losses, neglecting work or relationships, and feeling anxious or irritable when you can't bet. If you recognise these, don't wait. Reduce limits, take a break, or seek support. Gambling addiction is treatable. The sooner you act, the easier it is to regain control.",
      },
      {
        heading: "When to Take a Break",
        content:
          "Take a break after a big win (to avoid giving it back) and after a big loss (to avoid chasing). Take a break if you're stressed, tired, or going through life changes. Use self-exclusion tools if you need a longer reset—most regulators offer schemes to exclude yourself from all licensed operators for 6 months, a year, or indefinitely. It's not weak to use them; it's smart.",
      },
    ],
  },
  {
    id: "similar-1",
    slug: "premier-league-title-race-best-bets",
    imageUrl: IMAGES[1],
    date: "March 1, 2026",
    headline: "Premier League Title Race: Best Bets for the Run-In",
    excerpt:
      "With the season entering its final stretch, we analyse the odds for title hopefuls and where the smart money is going.",
    tags: ["Premier League"],
    category: "Soccer",
    author: "Pablo Escober",
    readingTime: "10 Min",
    likes: 2200,
    views: 18600,
    comments: 78,
    tableOfContents: [
      "Introduction",
      "Current Standings and Form",
      "Fixture Difficulty Analysis",
      "Value in the Outright Market",
      "Match-by-Match Opportunities",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "The Premier League run-in separates contenders from pretenders. With ten games left, fixture difficulty, fatigue, and motivation all come into play. This analysis breaks down the title race from a betting perspective. We look at where the odds might be wrong, which fixtures could swing the race, and how to approach outright and match markets. Past performance doesn't guarantee future results, but a structured approach improves your chances of finding value.",
      },
      {
        heading: "Current Standings and Form",
        content:
          "Form over the last five games matters more than season-long stats at this stage. A team in a late surge can outperform their overall numbers. Check recent results, goals scored and conceded, and underlying metrics like xG. Injuries to key players in the final weeks can derail a campaign—stay on top of team news. The team that wins the league often has momentum and a relatively kinder fixture list. Compare both before betting.",
      },
      {
        heading: "Fixture Difficulty Analysis",
        content:
          "Not all remaining games are equal. A title challenger facing three top-six opponents in a row has a harder run than one facing mid-table sides. Use fixture difficulty ratings (FDR) or similar tools to rank each team's remaining schedule. The market may not fully price in a brutal run. Conversely, a team with an easy run might be undervalued if the public hasn't noticed. Cross-reference with form.",
      },
      {
        heading: "Value in the Outright Market",
        content:
          "Outright title odds move as results come in. A surprise loss can lengthen a team's odds significantly. If you believe it's an aberration—bad referee call, freak result—there might be value. Likewise, a team on a hot streak might shorten too much. Compare current odds to your assessed probability. Bet when the odds are longer than your true estimate. Avoid betting on sentiment or 'hope'—stick to the numbers.",
      },
      {
        heading: "Match-by-Match Opportunities",
        content:
          "Individual matches in the run-in often have higher stakes and different dynamics. A team chasing the title might overcommit at home; a team with nothing to play for might underperform. Relegation battlers can raise their game. Factor these psychological elements into your analysis. Live betting during key fixtures can capture momentum shifts that pre-match odds miss.",
      },
    ],
  },
  {
    id: "similar-2",
    slug: "euro-2026-qualifiers-value-picks",
    imageUrl: IMAGES[2],
    date: "February 28, 2026",
    headline: "Euro 2026 Qualifiers: Value Picks for Underdog Nations",
    excerpt:
      "International qualifiers often misprice smaller nations. Our picks for the best value bets in the current qualifying campaign.",
    tags: ["Euro 2026"],
    category: "International",
    author: "Pablo Escober",
    readingTime: "11 Min",
    likes: 6000,
    views: 28400,
    comments: 134,
    tableOfContents: [
      "Introduction",
      "Why Qualifiers Offer Value",
      "Home Advantage in Internationals",
      "Motivation and Context",
      "Underdog Spotting",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "International qualifiers are a different beast from club football. Smaller nations play with pride and often outperform expectations at home. The market, heavily influenced by big-name teams and star players, can misprice these matches. This guide explores where value tends to appear in Euro qualifying: home underdogs, motivated minnows, and fixtures where context (e.g. must-win for the underdog) isn't fully reflected in the odds. We don't give specific tips—odds change—but we share the framework.",
      },
      {
        heading: "Why Qualifiers Offer Value",
        content:
          "Club form doesn't always translate. A player who stars for Manchester City might be anonymous for his national team. Squad cohesion, travel, and tactical setups differ. Bookmakers lean on historical results and FIFA rankings, which can be slow to update. A nation on the rise might still be priced as a minnow. Similarly, a traditional power in decline might be overrated. Look for nations whose recent results exceed their reputation.",
      },
      {
        heading: "Home Advantage in Internationals",
        content:
          "Home advantage is stronger in internationals than in club football. Small nations often play in intimidating, packed stadiums; visiting stars may struggle with travel and unfamiliar conditions. A nation ranked 80th beating one ranked 30th at home is less of an upset than the rankings suggest. Check historical home records. Some nations punch well above their weight at home and are consistently undervalued by the market.",
      },
      {
        heading: "Motivation and Context",
        content:
          "Qualification groups have different dynamics. A team needing a win to stay in the race will play differently than one with nothing to play for. A team already qualified might rotate. Understand the stakes for each fixture. Motivation can bridge talent gaps. A desperate underdog at home against a complacent favourite can offer excellent value—especially if the favourite has one eye on the next match.",
      },
      {
        heading: "Underdog Spotting",
        content:
          "Look for underdogs with a solid defence and a reliable goal threat. Teams that can stay compact and nick a goal on the counter are dangerous at home. Check recent head-to-heads: some smaller nations have a mental block against certain opponents; others consistently compete. Use Asian Handicap +0.5 or +1 when you fancy an underdog to at least draw—you'll often get better odds than 1X2.",
      },
    ],
  },
  {
    id: "similar-3",
    slug: "soccer-best-bets-weekend-tipsters",
    imageUrl: IMAGES[3],
    date: "February 25, 2026",
    headline: "Soccer Best Bets This Weekend: Top Picks from Our Tipsters",
    excerpt:
      "Curated selections from across Europe's top leagues—our analysts' favourite value bets for the coming matchday.",
    tags: ["Weekend Picks"],
    category: "Tips",
    author: "Pablo Escober",
    readingTime: "10 Min",
    likes: 10000,
    views: 45200,
    comments: 189,
    tableOfContents: [
      "Introduction",
      "Premier League Picks",
      "La Liga and Serie A",
      "Bundesliga and Ligue 1",
      "Championship and Lower Leagues",
      "Conclusion",
    ],
    body: [
      {
        heading: "Introduction",
        content:
          "Each weekend brings hundreds of soccer matches across Europe. Our analysts sift through the odds to identify the best value bets. This article presents our top picks for the coming matchday, with brief reasoning for each. Remember: no tip is guaranteed. We aim for long-term value, not short-term certainty. Track your bets, manage your bankroll, and never stake more than you can afford to lose. With that in mind, here are our weekend selections.",
      },
      {
        heading: "Premier League Picks",
        content:
          "The Premier League attracts the most attention and the sharpest odds. Value is harder to find but not impossible. We look for matches where recent form, injuries, or tactical matchups create a mispricing. Home underdogs in good form, teams with strong defensive records facing attack-minded opponents (Under markets), and derbies where emotion may have skewed the odds. Always compare odds across books—a 0.05 difference adds up over a season.",
      },
      {
        heading: "La Liga and Serie A",
        content:
          "La Liga and Serie A can offer better value than the Premier League because liquidity is slightly lower. Tactical, low-scoring games in Serie A suit Under and BTTS No markets. La Liga has more variation—Barcelona and Real Madrid dominate, but the mid-table is competitive. Look for teams in false positions, managers under pressure, and fixture congestion. Rotation before European midweek games can create unexpected results.",
      },
      {
        heading: "Bundesliga and Ligue 1",
        content:
          "The Bundesliga is typically high-scoring—Over 2.5 and BTTS Yes are more common. Bayern's dominance can mean the rest of the league is underpriced when facing them. Ligue 1 has similar dynamics with PSG. In both leagues, mid-table clashes often produce more goals than the odds suggest. Home advantage remains significant. Check for absent key players and recent head-to-head trends before backing a favourite.",
      },
      {
        heading: "Championship and Lower Leagues",
        content:
          "Lower leagues offer the most value for sharp bettors. Less media coverage means the market is slower to correct. Form, home advantage, and motivation matter even more. The Championship is particularly volatile—promotion and relegation battles create unpredictable results. We often find our best value here. Be mindful of fixture congestion: teams playing three times in a week may rotate or underperform.",
      },
    ],
  },
];

/** Get similar articles for the article detail view */
export function getSimilarArticles(_currentId?: string, limit = 3): NewsArticle[] {
  const similar = [
    MOCK_NEWS_ARTICLES.find((a) => a.id === "similar-1"),
    MOCK_NEWS_ARTICLES.find((a) => a.id === "similar-2"),
    MOCK_NEWS_ARTICLES.find((a) => a.id === "similar-3"),
  ].filter((a): a is NewsArticle => a != null);
  return similar.slice(0, limit);
}
