// Practice Test Generator
class PracticeTestGenerator {
    constructor() {
        // Question templates by subject
        this.questionsBySubject = {
            math: [
                {
                    text: "Solve for x: 2x + 5 = 15",
                    options: [
                        { id: 'a', text: 'x = 5' },
                        { id: 'b', text: 'x = 10' },
                        { id: 'c', text: 'x = -5' },
                        { id: 'd', text: 'x = 7.5' }
                    ],
                    correctAnswer: 'a'
                },
                {
                    text: "What is the derivative of f(x) = x²?",
                    options: [
                        { id: 'a', text: 'f\'(x) = x' },
                        { id: 'b', text: 'f\'(x) = 2x' },
                        { id: 'c', text: 'f\'(x) = 2' },
                        { id: 'd', text: 'f\'(x) = x²' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "If a triangle has sides of length 3, 4, and 5, what is its area?",
                    options: [
                        { id: 'a', text: '6 square units' },
                        { id: 'b', text: '7.5 square units' },
                        { id: 'c', text: '10 square units' },
                        { id: 'd', text: '12 square units' }
                    ],
                    correctAnswer: 'a'
                },
                {
                    text: "What is the value of sin(30°)?",
                    options: [
                        { id: 'a', text: '0' },
                        { id: 'b', text: '0.5' },
                        { id: 'c', text: '1' },
                        { id: 'd', text: '√3/2' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "Simplify: (3x² + 2x - 1) - (x² - 2x + 3)",
                    options: [
                        { id: 'a', text: '2x² + 4x - 4' },
                        { id: 'b', text: '4x² + 0x - 4' },
                        { id: 'c', text: '2x² + 4x + 2' },
                        { id: 'd', text: '4x² + 4x - 4' }
                    ],
                    correctAnswer: 'a'
                }
            ],
            science: [
                {
                    text: "What is the chemical formula for water?",
                    options: [
                        { id: 'a', text: 'H₂O' },
                        { id: 'b', text: 'CO₂' },
                        { id: 'c', text: 'O₂' },
                        { id: 'd', text: 'H₂O₂' }
                    ],
                    correctAnswer: 'a'
                },
                {
                    text: "Which of the following is NOT a type of electromagnetic radiation?",
                    options: [
                        { id: 'a', text: 'X-rays' },
                        { id: 'b', text: 'Microwaves' },
                        { id: 'c', text: 'Sound waves' },
                        { id: 'd', text: 'Gamma rays' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "What is the main function of mitochondria in a cell?",
                    options: [
                        { id: 'a', text: 'Protein synthesis' },
                        { id: 'b', text: 'Energy production' },
                        { id: 'c', text: 'Cell division' },
                        { id: 'd', text: 'Waste removal' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "Which law of motion states that for every action, there is an equal and opposite reaction?",
                    options: [
                        { id: 'a', text: 'First law' },
                        { id: 'b', text: 'Second law' },
                        { id: 'c', text: 'Third law' },
                        { id: 'd', text: 'Fourth law' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "What is the pH of a neutral solution?",
                    options: [
                        { id: 'a', text: '0' },
                        { id: 'b', text: '7' },
                        { id: 'c', text: '10' },
                        { id: 'd', text: '14' }
                    ],
                    correctAnswer: 'b'
                }
            ],
            english: [
                {
                    text: "Which of the following is a proper noun?",
                    options: [
                        { id: 'a', text: 'city' },
                        { id: 'b', text: 'London' },
                        { id: 'c', text: 'beautiful' },
                        { id: 'd', text: 'quickly' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "What is the past tense of 'go'?",
                    options: [
                        { id: 'a', text: 'goed' },
                        { id: 'b', text: 'gone' },
                        { id: 'c', text: 'went' },
                        { id: 'd', text: 'going' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "Which of the following sentences contains a metaphor?",
                    options: [
                        { id: 'a', text: 'The sky is blue.' },
                        { id: 'b', text: 'She is as quiet as a mouse.' },
                        { id: 'c', text: 'He is a lion in battle.' },
                        { id: 'd', text: 'The car is fast.' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "What is the main purpose of a thesis statement in an essay?",
                    options: [
                        { id: 'a', text: 'To introduce the topic' },
                        { id: 'b', text: 'To state the main argument or claim' },
                        { id: 'c', text: 'To summarize the conclusion' },
                        { id: 'd', text: 'To list supporting evidence' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "Which of the following is NOT a type of poem?",
                    options: [
                        { id: 'a', text: 'Sonnet' },
                        { id: 'b', text: 'Haiku' },
                        { id: 'c', text: 'Limerick' },
                        { id: 'd', text: 'Paragraph' }
                    ],
                    correctAnswer: 'd'
                }
            ],
            history: [
                {
                    text: "In which year did World War II end?",
                    options: [
                        { id: 'a', text: '1939' },
                        { id: 'b', text: '1942' },
                        { id: 'c', text: '1945' },
                        { id: 'd', text: '1950' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "Who was the first President of the United States?",
                    options: [
                        { id: 'a', text: 'Thomas Jefferson' },
                        { id: 'b', text: 'George Washington' },
                        { id: 'c', text: 'Abraham Lincoln' },
                        { id: 'd', text: 'John Adams' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "Which ancient civilization built the pyramids at Giza?",
                    options: [
                        { id: 'a', text: 'Romans' },
                        { id: 'b', text: 'Greeks' },
                        { id: 'c', text: 'Egyptians' },
                        { id: 'd', text: 'Mayans' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "What event marked the beginning of World War I?",
                    options: [
                        { id: 'a', text: 'The assassination of Archduke Franz Ferdinand' },
                        { id: 'b', text: 'The bombing of Pearl Harbor' },
                        { id: 'c', text: 'The fall of the Berlin Wall' },
                        { id: 'd', text: 'The signing of the Treaty of Versailles' }
                    ],
                    correctAnswer: 'a'
                },
                {
                    text: "Which document begins with 'We the People'?",
                    options: [
                        { id: 'a', text: 'The Declaration of Independence' },
                        { id: 'b', text: 'The Constitution of the United States' },
                        { id: 'c', text: 'The Gettysburg Address' },
                        { id: 'd', text: 'The Emancipation Proclamation' }
                    ],
                    correctAnswer: 'b'
                }
            ],
            computer_science: [
                {
                    text: "What does HTML stand for?",
                    options: [
                        { id: 'a', text: 'Hyper Text Markup Language' },
                        { id: 'b', text: 'High Tech Machine Learning' },
                        { id: 'c', text: 'Hyper Transfer Markup Language' },
                        { id: 'd', text: 'Home Tool Markup Language' }
                    ],
                    correctAnswer: 'a'
                },
                {
                    text: "Which of the following is NOT a programming language?",
                    options: [
                        { id: 'a', text: 'Java' },
                        { id: 'b', text: 'Python' },
                        { id: 'c', text: 'Microsoft Excel' },
                        { id: 'd', text: 'C++' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "What is the time complexity of binary search?",
                    options: [
                        { id: 'a', text: 'O(1)' },
                        { id: 'b', text: 'O(n)' },
                        { id: 'c', text: 'O(log n)' },
                        { id: 'd', text: 'O(n²)' }
                    ],
                    correctAnswer: 'c'
                },
                {
                    text: "Which data structure operates on a LIFO (Last In, First Out) principle?",
                    options: [
                        { id: 'a', text: 'Queue' },
                        { id: 'b', text: 'Stack' },
                        { id: 'c', text: 'Tree' },
                        { id: 'd', text: 'Graph' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "What does SQL stand for?",
                    options: [
                        { id: 'a', text: 'Structured Query Language' },
                        { id: 'b', text: 'Simple Question Language' },
                        { id: 'c', text: 'Standard Query Logic' },
                        { id: 'd', text: 'System Quality Level' }
                    ],
                    correctAnswer: 'a'
                }
            ]
        };
        
        // Topic-specific questions
        this.topicQuestions = {
            'Algebra': [
                {
                    text: "Solve the equation: 3(x - 2) = 15",
                    options: [
                        { id: 'a', text: 'x = 5' },
                        { id: 'b', text: 'x = 7' },
                        { id: 'c', text: 'x = 9' },
                        { id: 'd', text: 'x = 11' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "Factor the expression: x² - 9",
                    options: [
                        { id: 'a', text: '(x - 3)(x + 3)' },
                        { id: 'b', text: '(x - 9)(x + 1)' },
                        { id: 'c', text: '(x - 3)²' },
                        { id: 'd', text: '(x - 3)(x - 3)' }
                    ],
                    correctAnswer: 'a'
                }
            ],
            'Calculus': [
                {
                    text: "What is the integral of 2x?",
                    options: [
                        { id: 'a', text: 'x² + C' },
                        { id: 'b', text: '2x² + C' },
                        { id: 'c', text: 'x² + 2 + C' },
                        { id: 'd', text: 'x² - x + C' }
                    ],
                    correctAnswer: 'a'
                },
                {
                    text: "What is the derivative of sin(x)?",
                    options: [
                        { id: 'a', text: 'cos(x)' },
                        { id: 'b', text: '-sin(x)' },
                        { id: 'c', text: 'tan(x)' },
                        { id: 'd', text: '-cos(x)' }
                    ],
                    correctAnswer: 'a'
                }
            ],
            'Physics': [
                {
                    text: "What is the formula for force?",
                    options: [
                        { id: 'a', text: 'F = ma' },
                        { id: 'b', text: 'F = mv' },
                        { id: 'c', text: 'F = mg' },
                        { id: 'd', text: 'F = m/a' }
                    ],
                    correctAnswer: 'a'
                },
                {
                    text: "What is the SI unit of electric current?",
                    options: [
                        { id: 'a', text: 'Volt' },
                        { id: 'b', text: 'Watt' },
                        { id: 'c', text: 'Ampere' },
                        { id: 'd', text: 'Ohm' }
                    ],
                    correctAnswer: 'c'
                }
            ],
            'Grammar': [
                {
                    text: "Which of the following is a conjunction?",
                    options: [
                        { id: 'a', text: 'quickly' },
                        { id: 'b', text: 'but' },
                        { id: 'c', text: 'happy' },
                        { id: 'd', text: 'above' }
                    ],
                    correctAnswer: 'b'
                },
                {
                    text: "Which sentence uses the correct form of the verb?",
                    options: [
                        { id: 'a', text: 'She don\'t like ice cream.' },
                        { id: 'b', text: 'They was at the store.' },
                        { id: 'c', text: 'He doesn\'t want to go.' },
                        { id: 'd', text: 'We is going to the park.' }
                    ],
                    correctAnswer: 'c'
                }
            ]
        };
    }
    
    // Generate questions based on subject and topics
    generateQuestions(subject, topics = []) {
        // Start with base questions for the subject
        let allQuestions = [...(this.questionsBySubject[subject] || this.questionsBySubject.math)];
        
        // Add topic-specific questions if topics are provided
        if (topics && topics.length > 0) {
            topics.forEach(topic => {
                if (this.topicQuestions[topic]) {
                    allQuestions = [...allQuestions, ...this.topicQuestions[topic]];
                }
            });
        }
        
        // Assign unique IDs to questions
        return allQuestions.map((question, index) => ({
            ...question,
            id: index + 1
        }));
    }
}

export default PracticeTestGenerator;
