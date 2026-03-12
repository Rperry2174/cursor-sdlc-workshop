// ============================================
// LinkedOut - Mock Data
// ============================================
// This file contains all the fake data for the app.
// Teams can modify, extend, or replace this data
// as they build out features.
// ============================================

// --- Current User (You) ---
export const currentUser = {
  id: 'user-0',
  name: 'Sarah Chen',
  headline: 'Senior Engineer @ Acme Corp',
  location: 'San Francisco, CA',
  avatar: null,
  coverPhoto: null,
  profileViewers: 847,
  postImpressions: 2103,
  connections: 512,
  following: 89,
  followers: 234,
  about: 'Passionate about building scalable systems and mentoring junior engineers. Previously at Google and Meta. Open source contributor.',
  experience: [
    { title: 'Senior Engineer', company: 'Acme Corp', duration: '2022 - Present', location: 'San Francisco, CA' },
    { title: 'Software Engineer', company: 'Google', duration: '2019 - 2022', location: 'Mountain View, CA' },
    { title: 'Junior Developer', company: 'StartupXYZ', duration: '2017 - 2019', location: 'San Francisco, CA' },
  ],
  education: [
    { school: 'Stanford University', degree: 'M.S. Computer Science', year: '2017' },
    { school: 'UC Berkeley', degree: 'B.S. Computer Science', year: '2015' },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'System Design', 'AWS', 'GraphQL', 'PostgreSQL'],
};

// --- Other Users ---
export const users = [
  // --- Org people ---
  {
    id: 'user-brian',
    name: 'Brian McCarthy',
    headline: 'New Hire | Father of 5 | Survivor of 10 Siblings | Follically Challenged',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-tomer',
    name: 'Tomer',
    headline: 'Engineering',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-jordan',
    name: 'Jordan',
    headline: 'Sales',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-ricky',
    name: 'Ricky',
    headline: 'Product',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-lee',
    name: 'Lee',
    headline: 'Enablement & Ops',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-diggory',
    name: 'Diggory Rycroft',
    headline: 'Sales Engineering / GTM',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-nicole',
    name: 'Nicole Zhang',
    headline: 'Marketing',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-alex-d',
    name: 'Alex DeMarco',
    headline: 'Sales',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-hanna',
    name: 'Hanna Wintz',
    headline: 'Sales',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-trevor',
    name: 'Trevor Cotta',
    headline: 'Sales',
    avatar: null,
    connectionDegree: '1st',
  },
  // --- External / industry people ---
  {
    id: 'user-1',
    name: 'Marcus Johnson',
    headline: 'VP of Engineering @ CloudScale',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    headline: 'Product Manager @ FinTech Innovations',
    avatar: null,
    connectionDegree: '2nd',
  },
  {
    id: 'user-3',
    name: 'Alex Rivera',
    headline: 'Developer Advocate @ DevToolsCo',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-4',
    name: 'Nina Okafor',
    headline: 'Head of Design @ Anthropic',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-5',
    name: 'James Wright',
    headline: 'Tech Journalist @ The Verge',
    avatar: null,
    connectionDegree: '3rd+',
  },
  {
    id: 'user-6',
    name: 'David Kim',
    headline: 'CTO @ StartupXYZ',
    avatar: null,
    connectionDegree: '2nd',
  },
  {
    id: 'user-7',
    name: 'Rachel Torres',
    headline: 'Director of Product @ MegaCorp',
    avatar: null,
    connectionDegree: '2nd',
  },
  {
    id: 'user-8',
    name: 'Tom Bradley',
    headline: 'Frontend Lead @ Vercel',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-9',
    name: 'Emily Watson',
    headline: 'Staff Engineer @ Acme Corp',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-12',
    name: 'Lisa Chen',
    headline: 'Engineering Manager @ Netflix',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-13',
    name: 'Mike Tanaka',
    headline: 'Senior DevOps @ Stripe',
    avatar: null,
    connectionDegree: '1st',
  },
  {
    id: 'user-14',
    name: 'Sofia Rodriguez',
    headline: 'UX Researcher @ Figma',
    avatar: null,
    connectionDegree: '2nd',
  },
  // --- Celebrity / Public Figure Users ---
  { id: 'user-badbunny', name: 'Bad Bunny', headline: 'Artist | Producer | Occasionally Catches Footballs in My Dreams', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-zuck', name: 'Mark Zuckerberg', headline: 'CEO @ Meta | Father | MMA Enthusiast | Chain Collector', avatar: null, connectionDegree: '2nd' },
  { id: 'user-satya', name: 'Satya Nadella', headline: 'Chairman & CEO @ Microsoft', avatar: null, connectionDegree: '2nd' },
  { id: 'user-elonmusk', name: 'Elon Musk', headline: 'Technoking of Tesla | Chief Tweeter Emeritus | DOGE', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-timcook', name: 'Tim Cook', headline: 'CEO @ Apple', avatar: null, connectionDegree: '2nd' },
  { id: 'user-trump', name: 'Donald J. Trump', headline: '47th President of the United States', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-rihanna', name: 'Rihanna', headline: 'Founder @ Fenty | Music? Maybe. Makeup? Definitely.', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-jensen', name: 'Jensen Huang', headline: 'CEO @ NVIDIA | Leather Jacket Enthusiast', avatar: null, connectionDegree: '2nd' },
  { id: 'user-oprah', name: 'Oprah Winfrey', headline: 'Media Executive | Philanthropist | You Get a Car', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-drake', name: 'Drake', headline: 'Artist | OVO | Professional Sports Curse', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-bezos', name: 'Jeff Bezos', headline: 'Founder @ Amazon | Blue Origin | Washington Post', avatar: null, connectionDegree: '2nd' },
  { id: 'user-billgates', name: 'Bill Gates', headline: 'Co-chair @ Gates Foundation | Reader | Climate Optimist', avatar: null, connectionDegree: '2nd' },
  { id: 'user-cardi', name: 'Cardi B', headline: 'Artist | Entrepreneur | Political Commentator (self-appointed)', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-swift', name: 'Taylor Swift', headline: '14x Grammy Winner | Eras Tour | Re-Recording Everything', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-shaq', name: 'Shaquille O\'Neal', headline: 'Analyst @ TNT | Investor | DJ Diesel | Big Aristotle', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-sama', name: 'Sam Altman', headline: 'CEO @ OpenAI', avatar: null, connectionDegree: '2nd' },
  { id: 'user-dario', name: 'Dario Amodei', headline: 'CEO @ Anthropic', avatar: null, connectionDegree: '2nd' },
  { id: 'user-kelce', name: 'Travis Kelce', headline: 'Tight End @ Kansas City Chiefs | New Heights Podcast', avatar: null, connectionDegree: '3rd+' },
  { id: 'user-mahomes', name: 'Patrick Mahomes', headline: 'QB @ Kansas City Chiefs | 3x Super Bowl Champion', avatar: null, connectionDegree: '3rd+' },
];

// --- Feed Posts ---
export const posts = [
  { id: 'post-brian', authorId: 'user-brian', authorName: 'Brian McCarthy', authorHeadline: 'New Hire | Father of 5 | Survivor of 10 Siblings | Follically Challenged', connectionDegree: '1st', timeAgo: '1h ago', visibility: 'public',
    content: 'Thrilled to announce I\'m starting a new chapter! \n\nA little about me: I\'m one of 10 kids (yes, Irish Catholic, yes, we needed a scheduling algorithm for the bathroom). I got married at 22 because when you grow up in a house that loud, you learn to commit to things fast.\n\nMy wife and I now have 5 kids of our own, because apparently I thought "go big or go home" was a family planning strategy.\n\nWhat I lack in hair follicles I make up for in enthusiasm and sheer volume of dad jokes. The bald spot has been "building character" since 2018. My kids call it my solar panel for wisdom. I call it genetics and stress, in that order.\n\nIf I can survive Sunday dinners with 10 siblings, a 3-bathroom house with 12 people, and the great Christmas Gift Exchange Spreadsheet Incident of 2019, I can survive anything. Let\'s go!',
    image: null, likes: 847, likedBy: 'Everyone in the office', comments: 156, reposts: 43, type: 'jobChange', reactions: ['👍', '🎉', '❤️', '😂'],
    topComments: [
      { authorId: 'user-lee', authorName: 'Lee', authorHeadline: 'Enablement & Ops', content: 'Welcome Brian! I\'ve already added you to 14 onboarding docs, 6 Looms, and a quiz. You\'re welcome.', likes: 89, replies: 3 },
      { authorId: 'user-diggory', authorName: 'Diggory Rycroft', authorHeadline: 'Sales Engineering / GTM', content: 'The bathroom scheduling algorithm is basically distributed systems. You\'ll fit right in.', likes: 67, replies: 5 },
    ],
  },
  { id: 'post-badbunny', authorId: 'user-badbunny', authorName: 'Bad Bunny', authorHeadline: 'Artist | Producer | Occasionally Catches Footballs in My Dreams', connectionDegree: '3rd+', timeAgo: '2h ago', visibility: 'public',
    content: 'They told me the Super Bowl halftime show was 13 minutes.\n\nI gave them 13 minutes and 47 seconds.\n\nThat\'s called exceeding your KPIs. LinkedIn, take notes.',
    image: '[IMAGE: Bad Bunny on stage at Super Bowl halftime with pyrotechnics]', likes: 847293, likedBy: 'Rihanna', comments: 34502, reposts: 12847, type: 'regular', reactions: ['👍', '🎉', '❤️', '😂'],
    topComments: [
      { authorId: 'user-trump', authorName: 'Donald J. Trump', authorHeadline: '47th President of the United States', content: 'Many people are saying it was the GREATEST halftime show in history. I don\'t know, I was busy, but many people are saying it. Tremendous energy. Almost as much energy as my rallies!', likes: 89432, replies: 4521 },
      { authorId: 'user-rihanna', authorName: 'Rihanna', authorHeadline: 'Founder @ Fenty | Music? Maybe. Makeup? Definitely.', content: 'Welcome to the halftime alumni club. The pregnancy reveal was a better plot twist though, just saying', likes: 67891, replies: 2341 },
      { authorId: 'user-drake', authorName: 'Drake', authorHeadline: 'Artist | OVO | Professional Sports Curse', content: 'Honestly I was rooting for both teams', likes: 23456, replies: 8901 },
    ],
  },
  { id: 'post-tomer', authorId: 'user-tomer', authorName: 'Tomer', authorHeadline: 'Engineering', connectionDegree: '1st', timeAgo: '2h ago', visibility: 'public',
    content: 'If your AI demo doesn\'t fail at least once on stage, was it even a real demo or just a glorified screen recording?',
    image: null, likes: 512, likedBy: null, comments: 87, reposts: 34, type: 'regular', topComments: [] },
  { id: 'post-elon', authorId: 'user-elonmusk', authorName: 'Elon Musk', authorHeadline: 'Technoking of Tesla | Chief Tweeter Emeritus | DOGE', connectionDegree: '3rd+', timeAgo: '3h ago', visibility: 'public',
    content: 'Excited to share that DOGE saved $14 billion this week by canceling 847 government subscriptions to Adobe Creative Suite.\n\nAlso we found a server room in the Pentagon that\'s been mining Bitcoin since 2019. Nobody claimed it.',
    image: null, likes: 678901, likedBy: null, comments: 89012, reposts: 34567, type: 'regular', reactions: ['👍', '😂', '🎉'],
    topComments: [
      { authorId: 'user-trump', authorName: 'Donald J. Trump', authorHeadline: '47th President of the United States', content: 'Elon is doing a FANTASTIC job. Saving billions. Maybe trillions. Nobody has ever saved this much money. I told him, Elon, save the money, and he did. That\'s called LEADERSHIP.', likes: 234567, replies: 12345 },
      { authorId: 'user-billgates', authorName: 'Bill Gates', authorHeadline: 'Co-chair @ Gates Foundation | Reader | Climate Optimist', content: 'I have some thoughts on government IT infrastructure that I\'ve outlined in a 47-page memo. Happy to share if anyone\'s interested. Anyone? Is this thing on?', likes: 56789, replies: 2345 },
    ],
  },
  { id: 'post-diggory', authorId: 'user-diggory', authorName: 'Diggory Rycroft', authorHeadline: 'Sales Engineering / GTM', connectionDegree: '1st', timeAgo: '3h ago', visibility: 'public',
    content: 'I don\'t fear AI taking my job. I fear AI reading my commit history and forming an opinion.',
    image: null, likes: 1203, likedBy: 'Tomer', comments: 198, reposts: 156, type: 'regular',
    topComments: [
      { authorId: 'user-ricky', authorName: 'Ricky', authorHeadline: 'Product', content: 'My commit messages from 2019 would get me put on a performance plan by any LLM.', likes: 89, replies: 12 },
    ],
  },
  { id: 'post-sama', authorId: 'user-sama', authorName: 'Sam Altman', authorHeadline: 'CEO @ OpenAI', connectionDegree: '2nd', timeAgo: '4h ago', visibility: 'public',
    content: 'i think we\'re about 2-3 weeks away from something really exciting.\n\n(i\'ve been saying this every 2-3 weeks for 2 years but this time i mean it)',
    image: null, likes: 345678, likedBy: null, comments: 45678, reposts: 12345, type: 'regular', reactions: ['👍', '😂'],
    topComments: [
      { authorId: 'user-dario', authorName: 'Dario Amodei', authorHeadline: 'CEO @ Anthropic', content: 'Sam we need to talk. Have you seen what Cursor is doing? I just watched one of their demos and I couldn\'t sleep for three days. They\'re using ALL of our models. Against us. It\'s beautiful and terrifying.', likes: 198765, replies: 8765 },
      { authorId: 'user-elonmusk', authorName: 'Elon Musk', authorHeadline: 'Technoking of Tesla | Chief Tweeter Emeritus | DOGE', content: 'Grok already did this 6 months ago. Most people don\'t know that.', likes: 87654, replies: 34567 },
    ],
  },
  { id: 'post-jensen', authorId: 'user-jensen', authorName: 'Jensen Huang', authorHeadline: 'CEO @ NVIDIA | Leather Jacket Enthusiast', connectionDegree: '2nd', timeAgo: '4h ago', visibility: 'public',
    content: 'People keep asking about my leather jacket. Let me be clear:\n\nI don\'t have "a" leather jacket. I have THE leather jacket. It\'s the same one. Every time. Every keynote. Every earnings call.\n\nIt has seen $3 trillion in market cap creation. It deserves equity at this point.\n\nThe jacket stays on.',
    image: null, likes: 567890, likedBy: null, comments: 23456, reposts: 8901, type: 'regular', reactions: ['👍', '😂', '❤️'],
    topComments: [
      { authorId: 'user-zuck', authorName: 'Mark Zuckerberg', authorHeadline: 'CEO @ Meta | Father | MMA Enthusiast | Chain Collector', content: 'I wore the same grey t-shirt for a decade and people called it a problem. You do it with leather and suddenly it\'s "iconic." Noted.', likes: 234567, replies: 5678 },
      { authorId: 'user-satya', authorName: 'Satya Nadella', authorHeadline: 'Chairman & CEO @ Microsoft', content: 'At Microsoft, we believe every jacket deserves to be empowered to achieve more.', likes: 123456, replies: 2345 },
    ],
  },
  { id: 'post-2', authorId: 'user-2', authorName: 'Priya Sharma', authorHeadline: 'Product Manager @ FinTech Innovations', connectionDegree: '2nd', timeAgo: '4h ago', visibility: 'public',
    content: 'Unpopular opinion: The best product managers aren\'t the ones with the best ideas. They\'re the ones who kill the most ideas. Here\'s my framework for saying no:',
    extraContent: '1. Does it move the north star metric?\n2. Can we ship it in under 2 weeks?\n3. Will 80% of users benefit?\n\nIf it\'s not 3/3, it goes in the parking lot. Saved my team from building 40+ features last year that would have flopped.',
    image: null, likes: 1432, likedBy: 'You', comments: 312, reposts: 89, type: 'regular',
    topComments: [
      { authorId: 'user-6', authorName: 'David Kim', authorHeadline: 'CTO @ StartupXYZ', content: 'This is spot on. We burned 3 months on a feature 4% of users wanted. Never again.', likes: 45, replies: 0 },
      { authorId: 'user-7', authorName: 'Rachel Torres', authorHeadline: 'Director of Product @ MegaCorp', content: 'Hard disagree on #2. Some of the best products took years. Think bigger.', likes: 23, replies: 8 },
    ],
  },
  { id: 'post-zuck', authorId: 'user-zuck', authorName: 'Mark Zuckerberg', authorHeadline: 'CEO @ Meta | Father | MMA Enthusiast | Chain Collector', connectionDegree: '2nd', timeAgo: '5h ago', visibility: 'public',
    content: 'Great Super Bowl. I watched from a suite but honestly I could have played. I\'ve been training MMA for 2 years and my 40-yard dash time is classified.\n\nAlso yes the chain is real. No you can\'t touch it.',
    image: '[IMAGE: Zuckerberg at Super Bowl in a chain and casual hoodie next to celebrity section]', likes: 234567, likedBy: null, comments: 18923, reposts: 5672, type: 'regular', reactions: ['👍', '😂'],
    topComments: [
      { authorId: 'user-elonmusk', authorName: 'Elon Musk', authorHeadline: 'Technoking of Tesla | Chief Tweeter Emeritus | DOGE', content: 'Cage match offer still stands.', likes: 145678, replies: 12340 },
      { authorId: 'user-timcook', authorName: 'Tim Cook', authorHeadline: 'CEO @ Apple', content: 'I was also at the Super Bowl. I sat quietly and enjoyed the game. This has been my update.', likes: 89234, replies: 3456 },
    ],
  },
  { id: 'post-jordan', authorId: 'user-jordan', authorName: 'Jordan', authorHeadline: 'Sales', connectionDegree: '1st', timeAgo: '5h ago', visibility: 'public',
    content: '"Let\'s keep this meeting 25 minutes" he said, then opened with 12 minutes of small talk and a story about his first quota. Elite sales cardio.',
    image: null, likes: 634, likedBy: null, comments: 91, reposts: 45, type: 'regular', topComments: [] },
  { id: 'post-dario', authorId: 'user-dario', authorName: 'Dario Amodei', authorHeadline: 'CEO @ Anthropic', connectionDegree: '2nd', timeAgo: '5h ago', visibility: 'public',
    content: 'Long post about something that\'s been keeping me up at night.\n\nWe spent years building the most capable AI models on the planet. We thought the moat was the model.\n\nThen Cursor said "thanks for the model, we\'ll take it from here" and built an experience so good that engineers forget which model they\'re even using.\n\nI\'m not mad. I\'m impressed. And a little mad.',
    image: null, likes: 234567, likedBy: null, comments: 34567, reposts: 12345, type: 'regular', reactions: ['👍', '😂', '🔥'],
    topComments: [
      { authorId: 'user-sama', authorName: 'Sam Altman', authorHeadline: 'CEO @ OpenAI', content: 'dario DM me. i have a plan. it involves buying them. they said no three times already but i think a fourth time might work.', likes: 345678, replies: 12345 },
      { authorId: 'user-jensen', authorName: 'Jensen Huang', authorHeadline: 'CEO @ NVIDIA | Leather Jacket Enthusiast', content: 'They need GPUs to run those models. I\'m playing both sides so I always come out on top. *adjusts leather jacket*', likes: 198765, replies: 6789 },
      { authorId: 'user-satya', authorName: 'Satya Nadella', authorHeadline: 'Chairman & CEO @ Microsoft', content: 'At Microsoft we believe in empowering every developer to achieve more. We also own GitHub Copilot. Which is... fine. Everything is fine.', likes: 156789, replies: 4567 },
    ],
  },
  { id: 'post-ricky', authorId: 'user-ricky', authorName: 'Ricky', authorHeadline: 'Product', connectionDegree: '1st', timeAgo: '5h ago', visibility: 'public',
    content: 'If your bug can\'t be reproduced unless the user is on macOS 10.14, Zoom is open, and their cat walks across the keyboard, congrats: that bug is now a legend, not a ticket.',
    image: null, likes: 923, likedBy: null, comments: 134, reposts: 78, type: 'regular',
    topComments: [
      { authorId: 'user-tomer', authorName: 'Tomer', authorHeadline: 'Engineering', content: 'We have 3 of those in our backlog right now. They have names.', likes: 156, replies: 7 },
    ],
  },
  { id: 'post-oprah', authorId: 'user-oprah', authorName: 'Oprah Winfrey', authorHeadline: 'Media Executive | Philanthropist | You Get a Car', connectionDegree: '3rd+', timeAgo: '6h ago', visibility: 'public',
    content: 'I asked ChatGPT to write my grocery list and it gave me a 3-paragraph motivational speech about the transformative power of choosing organic kale.\n\nI just wanted eggs.\n\nWe are not the same, AI.',
    image: null, likes: 456789, likedBy: null, comments: 23456, reposts: 9876, type: 'regular', reactions: ['👍', '😂', '❤️'],
    topComments: [
      { authorId: 'user-sama', authorName: 'Sam Altman', authorHeadline: 'CEO @ OpenAI', content: 'we\'re working on making grocery lists less existential. fix coming in 2-3 weeks. also unrelated but has anyone at Cursor posted a job listing recently? just curious. no reason.', likes: 145678, replies: 5678 },
      { authorId: 'user-cardi', authorName: 'Cardi B', authorHeadline: 'Artist | Entrepreneur | Political Commentator (self-appointed)', content: 'OKURRR I asked AI to write my taxes and it said I owe negative money?? I\'m keeping it', likes: 98765, replies: 4567 },
    ],
  },
  { id: 'post-nicole', authorId: 'user-nicole', authorName: 'Nicole Zhang', authorHeadline: 'Marketing', connectionDegree: '1st', timeAgo: '6h ago', visibility: 'public',
    content: 'Hot take: "awareness" is just what people say when they don\'t want to be measured.\n\nEvery campaign I ship has a name, an owner, a sales partner, and a very real number attached to it.\n\nIf we can\'t connect the dots to revenue, we\'re not doing GTM. We\'re doing theater.',
    image: null, likes: 478, likedBy: null, comments: 67, reposts: 34, type: 'regular', topComments: [] },
  { id: 'post-3', authorId: 'user-3', authorName: 'Alex Rivera', authorHeadline: 'Developer Advocate @ DevToolsCo', connectionDegree: '1st', timeAgo: '6h ago', visibility: 'public',
    content: 'Quick poll: What\'s your biggest productivity killer in 2025?',
    image: null, likes: 89, likedBy: null, comments: 67, reposts: 34, type: 'poll',
    pollOptions: [ { text: 'Too many meetings', percentage: 58 }, { text: 'Context switching', percentage: 24 }, { text: 'Slack notifications', percentage: 12 }, { text: 'Other (tell me in comments)', percentage: 6 } ],
    pollVotes: 4891, pollTimeLeft: '2 days left', topComments: [] },
  { id: 'post-lee', authorId: 'user-lee', authorName: 'Lee', authorHeadline: 'Enablement & Ops', connectionDegree: '1st', timeAgo: '7h ago', visibility: 'public',
    content: '"We\'ll fix it in the process" is my favorite genre of workplace fiction.',
    image: null, likes: 389, likedBy: null, comments: 52, reposts: 28, type: 'regular', topComments: [] },
  { id: 'post-swift', authorId: 'user-swift', authorName: 'Taylor Swift', authorHeadline: '14x Grammy Winner | Eras Tour | Re-Recording Everything', connectionDegree: '3rd+', timeAgo: '8h ago', visibility: 'public',
    content: 'Excited to announce I\'m re-recording all of my LinkedIn posts (Sarah\'s Version).\n\nEvery comment, every like, every "congrats on the new role!" — but this time I own the engagement metrics.\n\nFirst up: "Thrilled to announce I\'m starting a new chapter (Sarah\'s Version) (From the Vault)"',
    image: null, likes: 1234567, likedBy: null, comments: 89012, reposts: 45678, type: 'regular', reactions: ['👍', '❤️', '😂', '🎉'],
    topComments: [
      { authorId: 'user-kelce', authorName: 'Travis Kelce', authorHeadline: 'Tight End @ Kansas City Chiefs | New Heights Podcast', content: 'Babe you don\'t have LinkedIn', likes: 567890, replies: 23456 },
      { authorId: 'user-bezos', authorName: 'Jeff Bezos', authorHeadline: 'Founder @ Amazon | Blue Origin | Washington Post', content: 'At Amazon we also believe in owning your content. That\'s why we own everything. Including the cloud this post is stored on.', likes: 87654, replies: 6789 },
    ],
  },
  { id: 'post-alex-d', authorId: 'user-alex-d', authorName: 'Alex DeMarco', authorHeadline: 'Sales', connectionDegree: '1st', timeAgo: '8h ago', visibility: 'public',
    content: 'I stopped asking "Is now a good time?" on cold calls.\n\nNow I open with:\n"I know this is out of the blue. If we\'re not helpful in the first 60 seconds, hang up on me."\n\nFunny thing: when you respect people\'s time that aggressively, they usually give you more of it.',
    image: null, likes: 567, likedBy: null, comments: 78, reposts: 45, type: 'regular', topComments: [] },
  { id: 'post-shaq', authorId: 'user-shaq', authorName: 'Shaquille O\'Neal', authorHeadline: 'Analyst @ TNT | Investor | DJ Diesel | Big Aristotle', connectionDegree: '3rd+', timeAgo: '9h ago', visibility: 'public',
    content: 'A founder pitched me yesterday. His deck was 47 slides. I told him: if you can\'t explain it to me in the time it takes to eat a chicken wing, I\'m out.\n\nHe explained it in one sentence.\n\nI invested.\n\nThe chicken wing was also excellent.',
    image: null, likes: 345678, likedBy: null, comments: 12345, reposts: 6789, type: 'regular', reactions: ['👍', '😂'],
    topComments: [
      { authorId: 'user-bezos', authorName: 'Jeff Bezos', authorHeadline: 'Founder @ Amazon | Blue Origin | Washington Post', content: 'At Amazon the rule was 6-page memos. But I respect the chicken wing framework. Very customer-centric.', likes: 67890, replies: 3456 },
    ],
  },
  { id: 'post-mahomes', authorId: 'user-mahomes', authorName: 'Patrick Mahomes', authorHeadline: 'QB @ Kansas City Chiefs | 3x Super Bowl Champion', connectionDegree: '3rd+', timeAgo: '4h ago', visibility: 'public',
    content: 'Tough game tonight. Not the outcome we wanted. But I\'m already studying film for next season.\n\nAlso, does anyone know how to update a LinkedIn headline? Asking for a friend who needs to remove a number.',
    image: null, likes: 567890, likedBy: null, comments: 45678, reposts: 12345, type: 'regular', reactions: ['👍', '❤️'],
    topComments: [
      { authorId: 'user-kelce', authorName: 'Travis Kelce', authorHeadline: 'Tight End @ Kansas City Chiefs | New Heights Podcast', content: 'We\'ll be back. Also I\'m retiring. Also I\'m not retiring. Check the podcast Wednesday.', likes: 234567, replies: 12345 },
      { authorId: 'user-drake', authorName: 'Drake', authorHeadline: 'Artist | OVO | Professional Sports Curse', content: 'For the record I did NOT wear a Chiefs jersey this time. You\'re welcome.', likes: 123456, replies: 8901 },
    ],
  },
  { id: 'post-hanna', authorId: 'user-hanna', authorName: 'Hanna Wintz', authorHeadline: 'Sales', connectionDegree: '1st', timeAgo: '10h ago', visibility: 'public',
    content: 'This week I lost a deal I "should have" won.\n\nOld me would have blamed price, timing, procurement, literally anything.\nNew me pulled the transcript, color-coded my mistakes, and turned it into a personal playbook.\n\nYou either let losses define you or refine you. I\'m choosing the second.',
    image: null, likes: 345, likedBy: null, comments: 56, reposts: 23, type: 'regular', topComments: [] },
  { id: 'post-5', authorId: 'user-5', authorName: 'James Wright', authorHeadline: 'Tech Journalist @ The Verge', connectionDegree: '3rd+', timeAgo: '10h ago', visibility: 'public',
    content: 'This is going to reshape the entire industry. Required reading for anyone in tech.',
    image: null, likes: 612, likedBy: null, comments: 89, reposts: 201, type: 'article',
    article: { title: 'The End of SaaS As We Know It', source: 'theverge.com', readTime: '8 min read', thumbnail: '[ARTICLE THUMBNAIL]' },
    topComments: [] },
  { id: 'post-trevor', authorId: 'user-trevor', authorName: 'Trevor Cotta', authorHeadline: 'Sales', connectionDegree: '1st', timeAgo: '12h ago', visibility: 'public',
    content: 'Obsessed with this idea lately: you don\'t rise to the level of your quota, you fall to the level of your systems.\n\nMy "system" used to be vibes and last-minute sprints.\nNow it\'s:\n- 10 targeted outreaches before 10am\n- 3 pipeline-advancing actions before lunch\n- Zero excuses after 4pm\n\nFunny how predictable "luck" becomes when your habits get boring.',
    image: null, likes: 423, likedBy: null, comments: 67, reposts: 34, type: 'regular', topComments: [] },
  { id: 'post-timcook', authorId: 'user-timcook', authorName: 'Tim Cook', authorHeadline: 'CEO @ Apple', connectionDegree: '2nd', timeAgo: '6h ago', visibility: 'public',
    content: 'Good morning. I woke up at 3:45 AM, exercised for an hour, reviewed global supply chain metrics, and approved a product that won\'t ship for 3 years.\n\nIt\'s 6 AM.\n\nWhat have you done today?',
    image: null, likes: 456789, likedBy: null, comments: 34567, reposts: 12345, type: 'regular', reactions: ['👍', '😂'],
    topComments: [
      { authorId: 'user-zuck', authorName: 'Mark Zuckerberg', authorHeadline: 'CEO @ Meta | Father | MMA Enthusiast | Chain Collector', content: 'I also woke up at 3:45 AM. To feed the cattle on my ranch. We are building the future of agriculture. And also the metaverse. Mostly the cattle thing right now though.', likes: 198765, replies: 8765 },
      { authorId: 'user-elonmusk', authorName: 'Elon Musk', authorHeadline: 'Technoking of Tesla | Chief Tweeter Emeritus | DOGE', content: 'I don\'t sleep.', likes: 345678, replies: 45678 },
    ],
  },
  { id: 'post-8', authorId: 'user-14', authorName: 'Sofia Rodriguez', authorHeadline: 'UX Researcher @ Figma', connectionDegree: '2nd', timeAgo: '12h ago', visibility: 'public',
    content: 'We just published our annual UX trends report. Key findings:\n\n73% of users abandon apps with more than 3 onboarding screens\nDark mode is now expected, not a nice-to-have\nAccessibility failures cost companies $6.9B annually\nAI-powered interfaces increase task completion by 40%\n\nFull report in comments',
    image: null, likes: 1845, likedBy: null, comments: 267, reposts: 445, type: 'regular', topComments: [] },
];

// --- News ---
export const news = [
  { id: 'news-1', title: 'Tech layoffs slow as AI hiring surges', timeAgo: '4h ago', readers: 52000 },
  { id: 'news-2', title: 'Remote work debate heats up again', timeAgo: '6h ago', readers: 41000 },
  { id: 'news-3', title: 'New startup raises $500M for AI chips', timeAgo: '2h ago', readers: 28000 },
  { id: 'news-4', title: 'Google announces quantum breakthrough', timeAgo: '8h ago', readers: 35000 },
  { id: 'news-5', title: 'Congress considers new data privacy bill', timeAgo: '1d ago', readers: 19000 },
];

// --- Games ---
export const games = [
  { id: 'game-1', emoji: '🟩', name: 'Zip', number: 329, subtitle: '101 connections played' },
  { id: 'game-2', emoji: '🔢', name: 'Mini Sudoku', number: 182, subtitle: 'The classic, made mini' },
  { id: 'game-3', emoji: '🎵', name: 'Tango', number: 490, subtitle: 'Harmonize the grid' },
  { id: 'game-4', emoji: '👑', name: 'Queens', number: 650, subtitle: '56 connections played' },
];

// --- Messages ---
export const messages = [
  { id: 'msg-1', senderId: 'user-8', senderName: 'Tom Bradley', preview: 'Hey Sarah, loved your talk at React Conf! Would love to...', timeAgo: '10 min ago', unread: true },
  { id: 'msg-2', senderId: 'user-9', senderName: 'Emily Watson', preview: 'Quick question about the API redesign - are we still...', timeAgo: '1h ago', unread: true },
  { id: 'msg-3', senderId: null, senderName: 'Recruiting @ Stripe', preview: 'Hi Sarah, I came across your profile and was impressed by...', timeAgo: '3h ago', unread: false },
  { id: 'msg-4', senderId: null, senderName: 'Dev Team Chat', preview: 'Mike: pushed the fix, can someone review?', timeAgo: '5h ago', unread: true, unreadCount: 4 },
  { id: 'msg-5', senderId: 'user-12', senderName: 'Lisa Chen', preview: 'Thanks for the referral! I got the interview', timeAgo: '1d ago', unread: false },
];

// --- Jobs ---
export const jobs = [
  { id: 'job-1', title: 'Staff Engineer', company: 'Anthropic', location: 'San Francisco, CA', salary: '$280k-$350k', postedAgo: '2d ago', applicants: 47, connectionsAtCompany: 5, easyApply: true },
  { id: 'job-2', title: 'Principal Engineer', company: 'Stripe', location: 'Remote (US)', salary: '$300k-$400k', postedAgo: '1w ago', applicants: 112, connectionsAtCompany: 3, easyApply: false },
  { id: 'job-3', title: 'Engineering Manager', company: 'Figma', location: 'San Francisco, CA', salary: '$250k-$320k', postedAgo: '3d ago', applicants: 89, connectionsAtCompany: 8, easyApply: true },
  { id: 'job-4', title: 'Senior Frontend Engineer', company: 'Vercel', location: 'Remote', salary: '$200k-$280k', postedAgo: '1d ago', applicants: 34, connectionsAtCompany: 2, easyApply: true },
  { id: 'job-5', title: 'ML Platform Lead', company: 'OpenAI', location: 'San Francisco, CA', salary: '$350k-$500k', postedAgo: '5d ago', applicants: 203, connectionsAtCompany: 4, easyApply: false },
];

// --- Notifications ---
export const notifications = [
  { id: 'notif-1', text: 'Marcus Johnson endorsed you for React', timeAgo: '1h ago', type: 'endorsement' },
  { id: 'notif-2', text: 'Priya Sharma commented on your post', timeAgo: '2h ago', type: 'comment' },
  { id: 'notif-3', text: '47 people viewed your profile this week', timeAgo: '3h ago', type: 'profileView' },
  { id: 'notif-4', text: 'Alex Rivera sent you a connection request', timeAgo: '5h ago', type: 'connectionRequest' },
  { id: 'notif-5', text: 'Your post was featured in React Developers group', timeAgo: '1d ago', type: 'featured' },
  { id: 'notif-6', text: 'Nina Okafor started a new position', timeAgo: '1d ago', type: 'jobChange' },
];

// --- People You May Know ---
export const suggestedConnections = [
  { id: 'user-brian', name: 'Brian McCarthy', headline: 'New Hire | Father of 5 | Follically Challenged', mutualConnections: 14, avatar: null },
  { id: 'user-tomer', name: 'Tomer', headline: 'Engineering', mutualConnections: 12, avatar: null },
  { id: 'user-14', name: 'Sofia Rodriguez', headline: 'UX Researcher @ Figma', mutualConnections: 7, avatar: null },
  { id: 'user-diggory', name: 'Diggory Rycroft', headline: 'Sales Engineering / GTM', mutualConnections: 9, avatar: null },
];

// --- Groups ---
export const groups = [
  { id: 'group-1', name: 'React Developers', members: 45000 },
  { id: 'group-2', name: 'Women in Tech', members: 120000 },
  { id: 'group-3', name: 'Bay Area Startups', members: 18000 },
];

// --- Saved Items ---
export const savedItems = [
  { id: 'saved-1', title: '"How I Landed My Dream Job"', savedAgo: '2 days ago', type: 'post' },
  { id: 'saved-2', title: 'Software Engineer @ Stripe', savedAgo: '1 week ago', type: 'job' },
  { id: 'saved-3', title: '"The Future of AI"', savedAgo: '1 week ago', type: 'post' },
];

// --- Events ---
export const events = [
  { id: 'event-1', name: 'React Conf 2025', date: 'Feb 15' },
  { id: 'event-2', name: 'SF Tech Meetup', date: 'Feb 20' },
];

// --- Promoted Content ---
export const promoted = {
  title: 'Cursor - The AI Code Editor',
  description: 'Build software faster with AI. Try free.',
  image: '[AD IMAGE]',
  url: '#',
};
