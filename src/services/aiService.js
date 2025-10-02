import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, MAX_SCORES } from '../utils/constants';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const generateQuestion = async (difficulty, category, previousQuestions = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // More specific topics for Full Stack (React + Node.js)
    const topics = {
      Easy: {
        react: [
          'JSX syntax and usage',
          'useState hook basics',
          'Props and component communication',
          'Conditional rendering in React',
          'Lists and keys in React',
          'Event handling in React'
        ],
        node: [
          'Node.js event loop basics',
          'require vs import in Node.js',
          'NPM and package.json',
          'Creating a basic Express server',
          'HTTP methods (GET, POST, PUT, DELETE)',
          'Environment variables in Node.js'
        ]
      },
      Medium: {
        react: [
          'useEffect hook and cleanup',
          'Context API for state management',
          'Custom hooks creation',
          'React component lifecycle',
          'Controlled vs uncontrolled components',
          'React Router navigation'
        ],
        node: [
          'Express middleware implementation',
          'RESTful API design principles',
          'JWT authentication basics',
          'MongoDB with Mongoose',
          'Error handling in Express',
          'CORS and security basics'
        ]
      },
      Hard: {
        react: [
          'Performance optimization with useMemo and useCallback',
          'Code splitting and lazy loading',
          'Server-side rendering vs client-side rendering',
          'State management patterns (Redux, Zustand)',
          'React testing strategies',
          'Advanced TypeScript with React'
        ],
        node: [
          'Microservices architecture design',
          'WebSocket implementation for real-time features',
          'Database indexing and query optimization',
          'Caching strategies (Redis)',
          'Load balancing and horizontal scaling',
          'Security best practices (SQL injection, XSS prevention)'
        ]
      }
    };

    // Use the specified category
    const categoryTopics = topics[difficulty][category];
    const topic = categoryTopics[Math.floor(Math.random() * categoryTopics.length)];

    // Build the previous questions text
    const previousQuestionsText = previousQuestions.length > 0
      ? `\n\nIMPORTANT - Already asked questions (DO NOT repeat these or similar variations):\n${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    const technologyName = category === 'react' ? 'React.js' : 'Node.js';

    const prompt = `You are conducting a technical interview for a Full Stack Developer position (React.js + Node.js).

Generate ONE unique ${difficulty} level technical question about ${technologyName}, specifically focusing on: "${topic}"

CRITICAL REQUIREMENTS:
- Focus ONLY on ${technologyName} (${category === 'react' ? 'Frontend/React' : 'Backend/Node.js'})
- The question MUST be about: ${topic}
- Make it practical and relevant to real-world development
- ${difficulty === 'Easy' ? 'Ask about fundamental concepts, basic usage, or simple scenarios (answerable in 20 seconds)' : ''}
- ${difficulty === 'Medium' ? 'Ask about intermediate concepts, best practices, or problem-solving scenarios (answerable in 60 seconds)' : ''}
- ${difficulty === 'Hard' ? 'Ask about advanced concepts, system design, optimization, or complex scenarios (answerable in 120 seconds)' : ''}
- Make it SPECIFIC and TECHNICAL (not generic)
- The question should test actual coding knowledge
- DO NOT ask for code writing, ask for explanation or approach
- DO NOT repeat any of the previously asked questions
${previousQuestionsText}

Examples of good ${technologyName} questions:
${category === 'react' ? `Easy: "Explain what the useState hook does in React and when you would use it."
Medium: "How does the useEffect hook's dependency array work? What happens if you omit it?"
Hard: "How would you optimize a React component that renders a list of 10,000 items? Discuss virtualization."` : `Easy: "What is the purpose of middleware in Express.js? Give a simple example."
Medium: "How would you implement JWT-based authentication in an Express.js API?"
Hard: "Design a rate-limiting system for a Node.js API to prevent abuse. What strategies would you use?"`}

Return ONLY the question text (one clear, specific question), nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let question = response.text().trim();

    // Clean up the question
    question = question.replace(/^["']|["']$/g, ''); // Remove quotes
    question = question.replace(/^Question:\s*/i, ''); // Remove "Question:" prefix
    question = question.trim();

    // Validate the question isn't too similar to previous ones
    const isTooSimilar = previousQuestions.some(prevQ => {
      const similarity = calculateSimilarity(question.toLowerCase(), prevQ.toLowerCase());
      return similarity > 0.6; // More than 60% similar
    });

    if (isTooSimilar && previousQuestions.length < 5) {
      console.log('Question too similar, regenerating...');
      return generateQuestion(difficulty, category, previousQuestions); // Regenerate with same category
    }

    return question;
  } catch (error) {
    console.error('Error generating question:', error);
    
    // Enhanced fallback questions - category specific
    const fallbackQuestions = {
      Easy: {
        react: [
          'What is the Virtual DOM in React and why is it useful?',
          'Explain the difference between props and state in React.',
          'What is JSX in React and how is it different from regular JavaScript?',
          'How do you handle events in React? Give an example.',
          'What are React keys and why are they important when rendering lists?',
          'Explain what a React component is and the difference between functional and class components.'
        ],
        node: [
          'What is npm and what is the purpose of the package.json file?',
          'How do you create a basic Express.js server? Explain the main components.',
          'What are the different HTTP methods and when would you use each one?',
          'Explain what middleware is in Express.js with a simple example.',
          'How does the Node.js event loop work in simple terms?',
          'What is the difference between require and import in Node.js?'
        ]
      },
      Medium: {
        react: [
          'Explain the useEffect hook in React. What is the cleanup function and when is it called?',
          'What is the Context API in React and when would you use it instead of prop drilling?',
          'What are React hooks rules and why are they important?',
          'What is the difference between useCallback and useMemo in React?',
          'How do controlled components work in React forms?',
          'Explain React Router and how you would set up routing in a React application.'
        ],
        node: [
          'How would you implement JWT-based authentication in a Node.js API?',
          'Explain the difference between SQL and NoSQL databases. Which would you use for a chat application?',
          'How do you handle errors in Express.js? Describe error handling middleware.',
          'Explain how CORS works and how you would configure it in an Express application.',
          'What is Mongoose and how does it help when working with MongoDB?',
          'How would you structure a RESTful API in Node.js? What are the best practices?'
        ]
      },
      Hard: {
        react: [
          'How would you implement server-side rendering (SSR) in a React application and what are the trade-offs?',
          'Explain your approach to optimizing a React application that experiences slow rendering with large datasets.',
          'How would you implement code splitting and lazy loading in a React application?',
          'Design a state management solution for a complex React application. Compare Redux, Context API, and Zustand.',
          'How would you test React components? Discuss unit testing, integration testing, and end-to-end testing.',
          'Explain how React\'s reconciliation algorithm works and how you can optimize re-renders.'
        ],
        node: [
          'Design a scalable e-commerce system architecture using Node.js. How would you handle high traffic?',
          'How would you implement real-time functionality in a Node.js application? Discuss WebSocket vs polling.',
          'Describe how you would architect a microservices-based backend for a food delivery app using Node.js.',
          'How would you implement rate limiting and caching strategies in a high-traffic Node.js API?',
          'Explain your approach to database query optimization in a Node.js application experiencing performance issues.',
          'Design a secure authentication system with refresh tokens. How would you prevent common security vulnerabilities?'
        ]
      }
    };

    // Use category-specific fallback
    const categoryFallbacks = fallbackQuestions[difficulty][category];
    
    // Filter out already asked questions
    const availableFallbacks = categoryFallbacks.filter(
      fb => !previousQuestions.some(pq => calculateSimilarity(fb.toLowerCase(), pq.toLowerCase()) > 0.5)
    );

    if (availableFallbacks.length > 0) {
      return availableFallbacks[Math.floor(Math.random() * availableFallbacks.length)];
    }

    // If all fallbacks used, return a random one
    return categoryFallbacks[Math.floor(Math.random() * categoryFallbacks.length)];
  }
};
// Decide which category (React/Node) to ask next
export const getNextCategory = (difficulty, askedQuestions) => {
  if (difficulty === "Easy") {
    const reactAsked = askedQuestions.some(q => q.category === "react" && q.difficulty === "Easy");
    const nodeAsked = askedQuestions.some(q => q.category === "node" && q.difficulty === "Easy");

    if (!reactAsked) return "react"; // First Easy = React
    if (!nodeAsked) return "node";   // Second Easy = Node
  }

  // For Medium/Hard → random choice
  return Math.random() > 0.5 ? "react" : "node";
};
// Wrapper to generate a question with controlled order
export const generateControlledQuestion = async (difficulty, askedQuestions = []) => {
  const category = getNextCategory(difficulty, askedQuestions);

  const question = await generateQuestion(
    difficulty,
    category,
    askedQuestions.map(q => q.question) // pass already asked questions
  );

  return {
    question,
    difficulty,
    category
  };
};

// Helper function to calculate similarity between two strings
const calculateSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

// Levenshtein distance algorithm
const getEditDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export const scoreAnswer = async (question, answer, difficulty) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const maxScore = MAX_SCORES[difficulty];

    const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Question (${difficulty} level): ${question}

Candidate's Answer: ${answer}

Evaluate this answer and provide:
1. A score out of ${maxScore} points
2. Brief feedback (2-3 sentences)

Scoring criteria:
- Technical accuracy (40%)
- Completeness of answer (30%)
- Clarity and communication (20%)
- Practical understanding (10%)

For ${difficulty} level:
${difficulty === 'Easy' ? '- Basic understanding and correct concepts are most important' : ''}
${difficulty === 'Medium' ? '- Look for deeper understanding and practical application' : ''}
${difficulty === 'Hard' ? '- Expect comprehensive answers with trade-offs and real-world considerations' : ''}

Return your response in this exact format:
SCORE: [number]
FEEDBACK: [your feedback]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    const feedbackMatch = text.match(/FEEDBACK:\s*(.+)/is);

    const score = scoreMatch ? Math.min(parseInt(scoreMatch[1]), maxScore) : 0;
    const feedback = feedbackMatch ? feedbackMatch[1].trim() : 'Answer evaluated.';

    return { score, feedback };
  } catch (error) {
    console.error('Error scoring answer:', error);
    
    // Fallback scoring logic
    const words = answer.trim().split(/\s+/).length;
    const maxScore = MAX_SCORES[difficulty];
    
    let score = 0;
    if (words >= 10) score += maxScore * 0.3;
    if (words >= 30) score += maxScore * 0.3;
    if (words >= 50) score += maxScore * 0.2;
    
    const hasKeywords = answer.toLowerCase().includes('because') || 
                        answer.toLowerCase().includes('example') ||
                        answer.toLowerCase().includes('implement') ||
                        answer.toLowerCase().includes('use');
    if (hasKeywords) score += maxScore * 0.2;

    return {
      score: Math.round(Math.min(score, maxScore)),
      feedback: 'Answer received and evaluated.'
    };
  }
};

export const generateFinalSummary = async (candidateData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const totalScore = candidateData.answers.reduce((sum, a) => sum + a.score, 0);
    const maxPossible = candidateData.answers.reduce((sum, a) => sum + MAX_SCORES[a.difficulty], 0);

    const qaList = candidateData.answers.map((a, i) => 
      `Q${i + 1} (${a.difficulty} - ${a.category || 'Full Stack'}): ${a.question}\nAnswer: ${a.answer}\nScore: ${a.score}/${MAX_SCORES[a.difficulty]}`
    ).join('\n\n');

    const prompt = `You are an expert technical interviewer providing a final evaluation summary for a Full Stack Developer candidate.

Candidate: ${candidateData.name}
Total Score: ${totalScore}/${maxPossible}

Interview Questions and Answers:
${qaList}

Provide a concise professional summary (3-4 sentences) covering:
1. Overall technical competency in React.js and Node.js
2. Key strengths observed
3. Areas for improvement (if any)
4. Hiring recommendation (Strong Yes/Yes/Maybe/No)

Keep it professional, constructive, and actionable.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text().trim();

    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    
    // Fallback summary
    const totalScore = candidateData.answers.reduce((sum, a) => sum + a.score, 0);
    const maxPossible = 90;

    let performance = 'Average';
    let recommendation = 'Maybe';
    
    if (totalScore >= 70) {
      performance = 'Excellent';
      recommendation = 'Strong Yes';
    } else if (totalScore >= 55) {
      performance = 'Good';
      recommendation = 'Yes';
    } else if (totalScore < 35) {
      performance = 'Needs Improvement';
      recommendation = 'No';
    }

    return `${performance} performance with ${totalScore}/${maxPossible} points across React.js and Node.js questions. The candidate demonstrated ${totalScore >= 55 ? 'strong' : 'adequate'} technical knowledge in Full Stack development. ${totalScore >= 55 ? 'Shows good problem-solving abilities and clear communication.' : 'Would benefit from additional practice in core concepts.'} Recommendation: ${recommendation}.`;
  }
};