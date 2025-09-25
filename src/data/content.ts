// Sample video and game content with embedded data for offline use

export const videos = [
  {
    id: 'photosynthesis',
    title: 'How Plants Make Food',
    subject: 'science',
    duration: '5:30',
    difficulty: 'Easy',
    icon: '🌱',
    description: 'Learn about the amazing process of photosynthesis and how plants convert sunlight into energy.',
    videoUrl: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...' // Placeholder - in real app, use actual video URLs
  },
  {
    id: 'geometry',
    title: 'Fun with Shapes',
    subject: 'mathematics',
    duration: '7:15',
    difficulty: 'Medium',
    icon: '📐',
    description: 'Explore different geometric shapes and learn about their properties, angles, and relationships.',
    videoUrl: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...'
  },
  {
    id: 'circuits',
    title: 'Electric Circuits',
    subject: 'technology',
    duration: '6:45',
    difficulty: 'Medium',
    icon: '⚡',
    description: 'Understand how electric circuits work and learn about current, voltage, and resistance.',
    videoUrl: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...'
  },
  {
    id: 'bridges',
    title: 'Building Bridges',
    subject: 'engineering',
    duration: '8:20',
    difficulty: 'Hard',
    icon: '🌉',
    description: 'Discover the engineering principles behind bridge construction and different bridge designs.',
    videoUrl: 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC...'
  }
];

export const games = [
  {
    id: 'math-quiz',
    title: 'Math Quiz Challenge',
    subject: 'mathematics',
    difficulty: 'Easy',
    icon: '🧮',
    questions: [
      {
        question: 'What is 15 + 27?',
        options: ['40', '42', '44', '46'],
        correct: 1,
        explanation: '15 + 27 = 42. When adding, align the numbers and add each column from right to left.'
      },
      {
        question: 'What is the area of a rectangle with length 8 and width 5?',
        options: ['13', '26', '40', '45'],
        correct: 2,
        explanation: 'Area of rectangle = length × width = 8 × 5 = 40 square units.'
      },
      {
        question: 'Which number is prime?',
        options: ['15', '21', '17', '25'],
        correct: 2,
        explanation: '17 is prime because it can only be divided by 1 and itself without remainder.'
      },
      {
        question: 'What is 144 ÷ 12?',
        options: ['11', '12', '13', '14'],
        correct: 1,
        explanation: '144 ÷ 12 = 12. Division is the opposite of multiplication: 12 × 12 = 144.'
      },
      {
        question: 'What is 25% of 80?',
        options: ['15', '20', '25', '30'],
        correct: 1,
        explanation: '25% of 80 = 0.25 × 80 = 20. You can also think of it as 80 ÷ 4 = 20.'
      }
    ]
  },
  {
    id: 'science-lab',
    title: 'Virtual Science Lab',
    subject: 'science',
    difficulty: 'Medium',
    icon: '🧪',
    questions: [
      {
        question: 'What gas do plants absorb during photosynthesis?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
        correct: 1,
        explanation: 'Plants absorb carbon dioxide from the air and use it with water and sunlight to make glucose.'
      },
      {
        question: 'What is the chemical symbol for water?',
        options: ['H2O', 'CO2', 'NaCl', 'O2'],
        correct: 0,
        explanation: 'H2O represents water - 2 hydrogen atoms bonded to 1 oxygen atom.'
      },
      {
        question: 'Which planet is closest to the Sun?',
        options: ['Venus', 'Earth', 'Mercury', 'Mars'],
        correct: 2,
        explanation: 'Mercury is the closest planet to the Sun, with extremely hot days and cold nights.'
      },
      {
        question: 'What type of energy does a moving car have?',
        options: ['Potential', 'Kinetic', 'Chemical', 'Nuclear'],
        correct: 1,
        explanation: 'Kinetic energy is the energy of motion. Moving objects have kinetic energy.'
      },
      {
        question: 'What is the hardest natural substance?',
        options: ['Gold', 'Iron', 'Diamond', 'Quartz'],
        correct: 2,
        explanation: 'Diamond is the hardest natural substance, made of carbon atoms arranged in a crystal structure.'
      }
    ]
  },
  {
    id: 'pattern-game',
    title: 'Pattern Master',
    subject: 'mathematics',
    difficulty: 'Hard',
    icon: '🎨',
    questions: [
      {
        question: 'What comes next in the sequence: 2, 4, 8, 16, ?',
        options: ['24', '32', '30', '20'],
        correct: 1,
        explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32.'
      },
      {
        question: 'Complete the pattern: 1, 1, 2, 3, 5, 8, ?',
        options: ['11', '13', '15', '10'],
        correct: 1,
        explanation: 'This is the Fibonacci sequence where each number is the sum of the two preceding ones: 5+8=13.'
      },
      {
        question: 'What is the next number: 100, 81, 64, 49, ?',
        options: ['36', '40', '25', '30'],
        correct: 0,
        explanation: 'These are perfect squares in reverse: 10², 9², 8², 7², 6² = 36.'
      },
      {
        question: 'Complete: 3, 6, 12, 24, ?',
        options: ['36', '48', '42', '30'],
        correct: 1,
        explanation: 'Each number is doubled: 3×2=6, 6×2=12, 12×2=24, 24×2=48.'
      }
    ]
  },
  {
    id: 'coding-game',
    title: 'Code Builder',
    subject: 'technology',
    difficulty: 'Medium',
    icon: '💻',
    questions: [
      {
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Management Language'],
        correct: 0,
        explanation: 'HTML stands for Hyper Text Markup Language, used to create web pages.'
      },
      {
        question: 'Which symbol is used for comments in Python?',
        options: ['//', '/*', '#', '<!--'],
        correct: 2,
        explanation: 'In Python, the # symbol is used to create single-line comments.'
      },
      {
        question: 'What is a variable in programming?',
        options: ['A fixed number', 'A storage location with a name', 'A type of loop', 'A programming language'],
        correct: 1,
        explanation: 'A variable is a storage location with an associated name that contains data.'
      },
      {
        question: 'What does CSS control in web development?',
        options: ['Database connections', 'Server logic', 'Visual styling', 'User authentication'],
        correct: 2,
        explanation: 'CSS (Cascading Style Sheets) controls the visual styling and layout of web pages.'
      }
    ]
  }
];