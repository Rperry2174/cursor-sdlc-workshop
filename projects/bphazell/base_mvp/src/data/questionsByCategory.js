const questionsByCategory = {
  General: [
    {
      prompt: "Which planet is known as the Red Planet?",
      choices: ["Earth", "Mars", "Venus", "Jupiter"],
      answer: "Mars",
    },
    {
      prompt: "How many minutes are in one hour?",
      choices: ["30", "45", "60", "90"],
      answer: "60",
    },
    {
      prompt: "What is 9 x 7?",
      choices: ["56", "63", "72", "81"],
      answer: "63",
    },
  ],
  Tech: [
    {
      prompt: "What does CSS stand for?",
      choices: [
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Creative Style System",
        "Colorful Style Syntax",
      ],
      answer: "Cascading Style Sheets",
    },
    {
      prompt: "Which language runs in the browser?",
      choices: ["Java", "C#", "JavaScript", "Python"],
      answer: "JavaScript",
    },
    {
      prompt: "Which company created React?",
      choices: ["Google", "Meta", "Microsoft", "Apple"],
      answer: "Meta",
    },
  ],
  Sports: [
    {
      prompt: "How many players are on a soccer team on the field?",
      choices: ["9", "10", "11", "12"],
      answer: "11",
    },
    {
      prompt: "In basketball, how many points is a free throw worth?",
      choices: ["1", "2", "3", "4"],
      answer: "1",
    },
    {
      prompt: "Which sport uses a racket and shuttlecock?",
      choices: ["Tennis", "Squash", "Badminton", "Table Tennis"],
      answer: "Badminton",
    },
  ],
};

export default questionsByCategory;
