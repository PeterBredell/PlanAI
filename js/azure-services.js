// Azure services integration
import PracticeTestGenerator from './practice-test-generator.js';

class AzureAIService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.cognitive.microsoft.com/';
        this.isInitialized = true;
        console.log('Azure AI Service initialized');

        // Azure OpenAI configuration
        this.openAIEndpoint = 'https://api.openai.com/v1/';
        this.openAIModel = 'gpt-4';

        // Interview preparation data
        this.interviewData = {
            currentQuestion: 0,
            questions: [],
            answers: [],
            feedback: [],
            results: null
        };

        // Curriculum data
        this.curriculumData = {
            currentCurriculum: null,
            studyPlans: {}
        };

        // Initialize practice test generator
        this.practiceTestGenerator = new PracticeTestGenerator();
    }

    async generateStudyPlan(testResults, duration) {
        // In a real implementation, this would connect to Azure OpenAI
        // to generate a personalized study plan based on test results and desired duration

        console.log('Generating study plan for', duration, 'weeks');

        // Simulate API call delay
        await this.simulateApiCall();

        // Return a mock study plan
        return {
            subject: testResults.subject,
            duration: duration,
            weeklyPlans: this.generateMockWeeklyPlans(testResults, duration),
            recommendedResources: this.generateMockResources(testResults.subject),
            aiGeneratedFeedback: this.generateMockFeedback(testResults)
        };
    }

    async generatePracticeTest(curriculum) {
        // In a real implementation, this would connect to Azure OpenAI
        // to generate practice tests based on curriculum data

        console.log('Generating practice test for', curriculum.subject);

        // Simulate API call delay
        await this.simulateApiCall();

        // Extract topics from the curriculum
        const topics = curriculum.topics ? curriculum.topics.map(topic => topic.name) : [];

        // Generate questions using our practice test generator
        const questions = this.practiceTestGenerator.generateQuestions(curriculum.subject, topics);

        // Return a practice test with AI-generated questions
        return {
            subject: curriculum.subject,
            questions: questions,
            timeLimit: 30, // minutes
            totalPoints: questions.length * 10
        };
    }

    async processCurriculum(curriculumData) {
        // In a real implementation, this would use Azure Document Intelligence
        // to extract and process the curriculum data from the uploaded file

        console.log('Processing curriculum for', curriculumData.subject);

        // Simulate API call delay
        await this.simulateApiCall();

        // Store the curriculum data
        this.curriculumData.currentCurriculum = {
            subject: curriculumData.subject,
            year: curriculumData.year,
            fileName: curriculumData.fileName,
            uploadDate: new Date().toISOString(),
            topics: this.generateMockCurriculumTopics(curriculumData.subject)
        };

        return this.curriculumData.currentCurriculum;
    }

    async generateCurriculumStudyPlan(curriculumId, duration, additionalNotes = '') {
        // In a real implementation, this would call Azure OpenAI
        // to generate a personalized study plan based on the curriculum and desired duration

        console.log('Generating curriculum-based study plan for', duration, 'weeks');

        // Simulate API call delay
        await this.simulateApiCall();

        // Check if we have the curriculum data
        if (!this.curriculumData.currentCurriculum) {
            throw new Error('No curriculum data available. Please process a curriculum first.');
        }

        // Construct a prompt for the AI
        const prompt = `Generate a ${duration}-week study plan based on the following curriculum:
        Subject: ${this.curriculumData.currentCurriculum.subject}
        Academic Year: ${this.curriculumData.currentCurriculum.year}
        Topics: ${this.curriculumData.currentCurriculum.topics.map(topic => topic.name).join(', ')}

        Additional Notes: ${additionalNotes}

        The study plan should include weekly focus areas, daily tasks, and recommended resources.`;

        // In a real implementation, we would send this prompt to Azure OpenAI
        // For now, generate a mock study plan
        const weeklyPlans = this.generateCurriculumWeeklyPlans(this.curriculumData.currentCurriculum, duration);

        // Extract all topics for resource generation
        const allTopics = this.curriculumData.currentCurriculum.topics.map(topic => topic.name);

        const studyPlan = {
            id: `sp-${Date.now()}`,
            curriculumId: curriculumId,
            subject: this.curriculumData.currentCurriculum.subject,
            duration: duration,
            creationDate: new Date().toISOString(),
            weeklyPlans: weeklyPlans,
            recommendedResources: this.generateMockResources(this.curriculumData.currentCurriculum.subject, allTopics),
            aiGeneratedFeedback: this.generateCurriculumFeedback(this.curriculumData.currentCurriculum, additionalNotes)
        };

        // Store the study plan
        this.curriculumData.studyPlans[studyPlan.id] = studyPlan;

        return studyPlan;
    }

    async provideFeedback(testSubmission) {
        // In a real implementation, this would analyze the test submission
        // and provide detailed feedback using Azure AI services

        console.log('Providing feedback for test submission');

        // Simulate API call delay
        await this.simulateApiCall();

        // Return mock feedback
        return {
            overallScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
            strengths: this.generateMockStrengths(testSubmission.subject),
            areasForImprovement: this.generateMockAreasForImprovement(testSubmission.subject),
            recommendedFocus: this.generateMockRecommendedFocus(testSubmission.subject)
        };
    }

    // Helper methods to generate mock data

    generateMockWeeklyPlans(testResults, duration) {
        const weeks = [];

        for (let i = 1; i <= duration; i++) {
            weeks.push({
                week: i,
                focus: `Week ${i} focus area`,
                dailyTasks: [
                    { day: 'Monday', task: 'Review core concepts (1 hour)' },
                    { day: 'Tuesday', task: 'Practice problems (1 hour)' },
                    { day: 'Wednesday', task: 'Watch tutorial videos (45 minutes)' },
                    { day: 'Thursday', task: 'Group study session (1 hour)' },
                    { day: 'Friday', task: 'Practice test (30 minutes)' },
                    { day: 'Weekend', task: 'Review and reflect on progress' }
                ]
            });
        }

        return weeks;
    }

    generateMockCurriculumTopics(subject) {
        const topicsBySubject = {
            math: [
                { name: 'Algebra', subtopics: ['Linear Equations', 'Quadratic Equations', 'Functions', 'Inequalities'] },
                { name: 'Geometry', subtopics: ['Triangles', 'Circles', 'Polygons', 'Coordinate Geometry'] },
                { name: 'Calculus', subtopics: ['Limits', 'Derivatives', 'Integrals', 'Applications'] },
                { name: 'Statistics', subtopics: ['Probability', 'Data Analysis', 'Hypothesis Testing', 'Regression'] },
                { name: 'Trigonometry', subtopics: ['Right Triangles', 'Unit Circle', 'Trigonometric Functions', 'Identities'] }
            ],
            science: [
                { name: 'Physics', subtopics: ['Mechanics', 'Electricity', 'Magnetism', 'Thermodynamics', 'Optics'] },
                { name: 'Chemistry', subtopics: ['Atomic Structure', 'Chemical Bonding', 'Reactions', 'Organic Chemistry'] },
                { name: 'Biology', subtopics: ['Cell Biology', 'Genetics', 'Ecology', 'Evolution', 'Physiology'] },
                { name: 'Earth Science', subtopics: ['Geology', 'Meteorology', 'Oceanography', 'Astronomy'] },
                { name: 'Scientific Method', subtopics: ['Observation', 'Hypothesis', 'Experimentation', 'Analysis'] }
            ],
            english: [
                { name: 'Literature', subtopics: ['Fiction', 'Poetry', 'Drama', 'Literary Analysis'] },
                { name: 'Grammar', subtopics: ['Parts of Speech', 'Sentence Structure', 'Punctuation', 'Usage'] },
                { name: 'Composition', subtopics: ['Essay Writing', 'Research Papers', 'Creative Writing', 'Rhetoric'] },
                { name: 'Vocabulary', subtopics: ['Word Origins', 'Context Clues', 'Word Relationships', 'Academic Vocabulary'] },
                { name: 'Reading Comprehension', subtopics: ['Main Idea', 'Supporting Details', 'Inference', 'Author\'s Purpose'] }
            ],
            history: [
                { name: 'Ancient Civilizations', subtopics: ['Mesopotamia', 'Egypt', 'Greece', 'Rome'] },
                { name: 'Middle Ages', subtopics: ['Feudalism', 'Byzantine Empire', 'Islamic World', 'Crusades'] },
                { name: 'Renaissance and Reformation', subtopics: ['Art and Culture', 'Scientific Revolution', 'Religious Changes', 'Exploration'] },
                { name: 'Modern History', subtopics: ['Industrial Revolution', 'World Wars', 'Cold War', 'Globalization'] },
                { name: 'Historical Methods', subtopics: ['Primary Sources', 'Historiography', 'Chronology', 'Historical Analysis'] }
            ],
            computer_science: [
                { name: 'Programming Fundamentals', subtopics: ['Variables', 'Control Structures', 'Functions', 'Data Structures'] },
                { name: 'Algorithms', subtopics: ['Sorting', 'Searching', 'Recursion', 'Complexity Analysis'] },
                { name: 'Web Development', subtopics: ['HTML/CSS', 'JavaScript', 'Frameworks', 'Backend Development'] },
                { name: 'Databases', subtopics: ['SQL', 'Database Design', 'Normalization', 'Query Optimization'] },
                { name: 'Computer Systems', subtopics: ['Operating Systems', 'Networks', 'Computer Architecture', 'Security'] }
            ],
            other: [
                { name: 'Topic 1', subtopics: ['Subtopic 1.1', 'Subtopic 1.2', 'Subtopic 1.3', 'Subtopic 1.4'] },
                { name: 'Topic 2', subtopics: ['Subtopic 2.1', 'Subtopic 2.2', 'Subtopic 2.3', 'Subtopic 2.4'] },
                { name: 'Topic 3', subtopics: ['Subtopic 3.1', 'Subtopic 3.2', 'Subtopic 3.3', 'Subtopic 3.4'] },
                { name: 'Topic 4', subtopics: ['Subtopic 4.1', 'Subtopic 4.2', 'Subtopic 4.3', 'Subtopic 4.4'] },
                { name: 'Topic 5', subtopics: ['Subtopic 5.1', 'Subtopic 5.2', 'Subtopic 5.3', 'Subtopic 5.4'] }
            ]
        };

        return topicsBySubject[subject] || topicsBySubject.other;
    }

    generateCurriculumWeeklyPlans(curriculum, duration) {
        const weeks = [];
        const topics = curriculum.topics;

        // Distribute topics across weeks
        const topicsPerWeek = Math.ceil(topics.length / duration);

        for (let i = 1; i <= duration; i++) {
            const weekTopics = topics.slice((i - 1) * topicsPerWeek, i * topicsPerWeek);
            const focusTopic = weekTopics.length > 0 ? weekTopics[0].name : `Week ${i} topics`;
            const subtopics = weekTopics.flatMap(topic => topic.subtopics || []);

            weeks.push({
                week: i,
                focus: `${focusTopic} and related concepts`,
                topics: weekTopics.map(t => t.name),
                dailyTasks: [
                    { day: 'Monday', task: `Introduction to ${focusTopic} (1 hour)` },
                    { day: 'Tuesday', task: subtopics.length > 0 ? `Study ${subtopics[0]} (1 hour)` : 'Practice problems (1 hour)' },
                    { day: 'Wednesday', task: subtopics.length > 1 ? `Study ${subtopics[1]} (45 minutes)` : 'Watch tutorial videos (45 minutes)' },
                    { day: 'Thursday', task: subtopics.length > 2 ? `Study ${subtopics[2]} (1 hour)` : 'Group study session (1 hour)' },
                    { day: 'Friday', task: 'Practice test on weekly topics (30 minutes)' },
                    { day: 'Weekend', task: 'Review and reflect on weekly progress' }
                ]
            });
        }

        return weeks;
    }

    generateCurriculumFeedback(curriculum, additionalNotes) {
        const subjectFeedback = {
            math: `This study plan focuses on mastering key mathematical concepts from your curriculum. I've organized the topics to build progressively on your knowledge, starting with foundational concepts and moving to more advanced applications. Each week includes a mix of theory, practice problems, and self-assessment to ensure comprehensive understanding.`,

            science: `Your science curriculum has been organized into a structured study plan that balances theoretical knowledge with practical applications. The plan emphasizes understanding scientific principles, conducting experiments, and analyzing results. Regular self-assessment will help you track your progress and identify areas that need additional focus.`,

            english: `This English study plan is designed to develop your skills in reading, writing, and literary analysis. I've balanced grammar and vocabulary work with literature study and composition practice. The plan includes regular writing exercises to help you apply what you've learned and develop your unique voice.`,

            history: `Your history curriculum has been transformed into a chronological study plan that helps you understand the connections between historical events and their significance. The plan emphasizes primary source analysis, historical context, and developing critical thinking about historical narratives.`,

            computer_science: `This computer science study plan balances theoretical concepts with practical programming experience. Each week builds on previous knowledge, with regular coding exercises to reinforce learning. The plan is designed to develop both your technical skills and problem-solving abilities.`,

            other: `I've created a comprehensive study plan based on your curriculum. The plan is structured to provide a balanced approach to learning, with a mix of theory, practice, and self-assessment. Each week builds on previous knowledge to ensure steady progress throughout the duration of the plan.`
        };

        // Add personalization based on additional notes if provided
        const personalization = additionalNotes ?
            `\n\nBased on your additional notes, I've incorporated ${additionalNotes.substring(0, 50)}... into the study plan to address your specific needs and goals.` : '';

        return subjectFeedback[curriculum.subject] + personalization;
    }

    generateMockResources(subject, topics = []) {
        // Base resources by subject
        const resourcesBySubject = {
            math: [
                { type: 'Book', title: 'Advanced Mathematics', author: 'John Smith' },
                { type: 'Website', title: 'Khan Academy', url: 'https://www.khanacademy.org/math' },
                { type: 'Video', title: 'Calculus Fundamentals', url: 'https://www.youtube.com/results?search_query=calculus+fundamentals' }
            ],
            science: [
                { type: 'Book', title: 'Modern Physics', author: 'Jane Doe' },
                { type: 'Website', title: 'NASA Education', url: 'https://www.nasa.gov/education' },
                { type: 'Video', title: 'Chemistry Basics', url: 'https://www.youtube.com/results?search_query=chemistry+basics' }
            ],
            english: [
                { type: 'Book', title: 'English Grammar', author: 'Emily Johnson' },
                { type: 'Website', title: 'Grammarly', url: 'https://www.grammarly.com' },
                { type: 'Video', title: 'Essay Writing Tips', url: 'https://www.youtube.com/results?search_query=essay+writing+tips' }
            ],
            history: [
                { type: 'Book', title: 'World History: Patterns of Interaction', author: 'Roger B. Beck' },
                { type: 'Website', title: 'History.com', url: 'https://www.history.com/' },
                { type: 'Video', title: 'Crash Course History', url: 'https://www.youtube.com/results?search_query=crash+course+history' }
            ],
            computer_science: [
                { type: 'Book', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen' },
                { type: 'Website', title: 'W3Schools', url: 'https://www.w3schools.com/' },
                { type: 'Video', title: 'CS50 Lectures', url: 'https://www.youtube.com/results?search_query=cs50+lectures' }
            ]
        };

        // Topic-specific resources
        const topicResources = {
            // Math topics
            'Algebra': [
                { type: 'Interactive', title: 'Algebra Practice', url: 'https://www.khanacademy.org/math/algebra' },
                { type: 'Video', title: 'Algebra Explained', url: 'https://www.youtube.com/results?search_query=algebra+explained' }
            ],
            'Geometry': [
                { type: 'Interactive', title: 'Geometry Tools', url: 'https://www.geogebra.org/' },
                { type: 'Video', title: 'Geometry Fundamentals', url: 'https://www.youtube.com/results?search_query=geometry+fundamentals' }
            ],
            'Calculus': [
                { type: 'Interactive', title: 'Calculus Visualized', url: 'https://www.desmos.com/calculator' },
                { type: 'Video', title: 'Calculus Made Easy', url: 'https://www.youtube.com/results?search_query=calculus+made+easy' }
            ],
            'Statistics': [
                { type: 'Interactive', title: 'Statistics Tools', url: 'https://www.statcrunch.com/' },
                { type: 'Video', title: 'Statistics Explained', url: 'https://www.youtube.com/results?search_query=statistics+explained' }
            ],
            'Trigonometry': [
                { type: 'Interactive', title: 'Trigonometry Practice', url: 'https://www.mathsisfun.com/algebra/trigonometry.html' },
                { type: 'Video', title: 'Trigonometry Basics', url: 'https://www.youtube.com/results?search_query=trigonometry+basics' }
            ],

            // Science topics
            'Physics': [
                { type: 'Interactive', title: 'Physics Simulations', url: 'https://phet.colorado.edu/en/simulations/category/physics' },
                { type: 'Video', title: 'Physics Explained', url: 'https://www.youtube.com/results?search_query=physics+explained' }
            ],
            'Chemistry': [
                { type: 'Interactive', title: 'Chemistry Experiments', url: 'https://www.chemistryworld.com/' },
                { type: 'Video', title: 'Chemistry Basics', url: 'https://www.youtube.com/results?search_query=chemistry+basics' }
            ],
            'Biology': [
                { type: 'Interactive', title: 'Biology Visualized', url: 'https://www.biointeractive.org/' },
                { type: 'Video', title: 'Biology Crash Course', url: 'https://www.youtube.com/results?search_query=biology+crash+course' }
            ],

            // English topics
            'Literature': [
                { type: 'Interactive', title: 'Literature Analysis', url: 'https://www.sparknotes.com/' },
                { type: 'Video', title: 'Literature Explained', url: 'https://www.youtube.com/results?search_query=literature+explained' }
            ],
            'Grammar': [
                { type: 'Interactive', title: 'Grammar Practice', url: 'https://www.grammarly.com/' },
                { type: 'Video', title: 'Grammar Rules', url: 'https://www.youtube.com/results?search_query=english+grammar+rules' }
            ],
            'Composition': [
                { type: 'Interactive', title: 'Writing Tools', url: 'https://www.hemingwayapp.com/' },
                { type: 'Video', title: 'Essay Writing Tips', url: 'https://www.youtube.com/results?search_query=essay+writing+tips' }
            ],

            // History topics
            'Ancient Civilizations': [
                { type: 'Interactive', title: 'Ancient History Maps', url: 'https://www.ancient.eu/map/' },
                { type: 'Video', title: 'Ancient Civilizations', url: 'https://www.youtube.com/results?search_query=ancient+civilizations' }
            ],
            'Modern History': [
                { type: 'Interactive', title: 'Modern History Timeline', url: 'https://www.timetoast.com/' },
                { type: 'Video', title: 'Modern History Explained', url: 'https://www.youtube.com/results?search_query=modern+history+explained' }
            ],

            // Computer Science topics
            'Programming Fundamentals': [
                { type: 'Interactive', title: 'Coding Practice', url: 'https://www.codecademy.com/' },
                { type: 'Video', title: 'Programming Basics', url: 'https://www.youtube.com/results?search_query=programming+basics' }
            ],
            'Algorithms': [
                { type: 'Interactive', title: 'Algorithm Visualizer', url: 'https://visualgo.net/' },
                { type: 'Video', title: 'Algorithm Explained', url: 'https://www.youtube.com/results?search_query=algorithms+explained' }
            ],
            'Web Development': [
                { type: 'Interactive', title: 'Web Dev Practice', url: 'https://www.freecodecamp.org/' },
                { type: 'Video', title: 'Web Development Tutorial', url: 'https://www.youtube.com/results?search_query=web+development+tutorial' }
            ]
        };

        // Start with base resources
        let resources = [...(resourcesBySubject[subject] || resourcesBySubject.math)];

        // Add topic-specific resources if topics are provided
        if (topics && topics.length > 0) {
            topics.forEach(topic => {
                if (topicResources[topic]) {
                    resources = [...resources, ...topicResources[topic]];
                }
            });
        }

        // Limit to a reasonable number of resources
        return resources.slice(0, 6);
    }

    generateMockFeedback(testResults) {
        return `Based on your test results, I recommend focusing on improving your understanding of core concepts.
        Your calculation skills are strong, but you need to work on applying these skills to word problems.
        The study plan I've created emphasizes practice with application-based problems.`;
    }

    generateMockQuestions(curriculum) {
        const questions = [];
        const numQuestions = 10;

        for (let i = 1; i <= numQuestions; i++) {
            questions.push({
                id: i,
                text: `Question ${i}: This is a sample question for ${curriculum.subject}.`,
                options: [
                    { id: 'a', text: 'Option A' },
                    { id: 'b', text: 'Option B' },
                    { id: 'c', text: 'Option C' },
                    { id: 'd', text: 'Option D' }
                ],
                correctAnswer: String.fromCharCode(97 + Math.floor(Math.random() * 4)) // Random correct answer (a, b, c, or d)
            });
        }

        return questions;
    }

    generateMockStrengths(subject) {
        const strengthsBySubject = {
            math: ['Algebraic manipulation', 'Geometric reasoning', 'Basic calculus'],
            science: ['Scientific method understanding', 'Data analysis', 'Conceptual knowledge'],
            english: ['Grammar usage', 'Vocabulary', 'Reading comprehension']
        };

        return strengthsBySubject[subject] || strengthsBySubject.math;
    }

    generateMockAreasForImprovement(subject) {
        const areasBySubject = {
            math: ['Word problems', 'Advanced calculus', 'Statistical analysis'],
            science: ['Experimental design', 'Scientific writing', 'Complex problem-solving'],
            english: ['Essay structure', 'Critical analysis', 'Creative writing']
        };

        return areasBySubject[subject] || areasBySubject.math;
    }

    generateMockRecommendedFocus(subject) {
        const focusBySubject = {
            math: 'Focus on applying mathematical concepts to real-world problems',
            science: 'Work on connecting theoretical knowledge with practical applications',
            english: 'Practice writing structured essays with clear arguments'
        };

        return focusBySubject[subject] || focusBySubject.math;
    }

    // Utility method to simulate API call delay
    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    // CV Builder methods

    async generateCVSummary(userData) {
        console.log('Generating CV summary with Azure AI');

        // In a real implementation, this would call Azure OpenAI
        // to generate a professional summary based on the user's experience and skills

        await this.simulateApiCall();

        // Construct a prompt for the AI
        const prompt = `Generate a professional summary for a CV with the following details:
        - Education: ${userData.education.map(edu => `${edu.degree} at ${edu.school}`).join(', ')}
        - Experience: ${userData.experience.map(exp => `${exp.title} at ${exp.company}`).join(', ')}
        - Skills: ${userData.skills}

        The summary should be concise, professional, and highlight key strengths.`;

        // In a real implementation, we would send this prompt to Azure OpenAI
        // For now, return a mock response
        return this.generateMockCVSummary(userData);
    }

    async suggestSkills(experience) {
        console.log('Suggesting skills based on experience with Azure AI');

        // In a real implementation, this would call Azure OpenAI
        // to suggest relevant skills based on the user's experience

        await this.simulateApiCall();

        // Construct a prompt for the AI
        const prompt = `Based on the following job experience, suggest relevant professional skills:
        ${experience.map(exp => `- ${exp.title} at ${exp.company}: ${exp.description}`).join('\n')}

        Return a list of 10-15 relevant skills that would strengthen this person's CV.`;

        // In a real implementation, we would send this prompt to Azure OpenAI
        // For now, return mock skills
        return this.generateMockSkills(experience);
    }

    async generateFullCV(userData) {
        console.log('Generating full CV with Azure AI');

        // In a real implementation, this would call Azure Document Intelligence
        // to format and generate a professional CV document

        await this.simulateApiCall();

        // For now, return a formatted HTML representation
        return this.generateMockCVHTML(userData);
    }

    // Mock methods for CV generation

    generateMockCVSummary(userData) {
        const summaries = [
            `Dedicated and results-driven professional with experience in ${userData.experience[0]?.title || 'various roles'}. Strong academic background with a ${userData.education[0]?.degree || 'degree'} from ${userData.education[0]?.school || 'a reputable institution'}. Skilled in ${userData.skills.split(',').slice(0, 3).join(', ') || 'various areas'}, with a proven track record of delivering high-quality results.`,

            `Motivated and detail-oriented ${userData.experience[0]?.title || 'professional'} with a passion for excellence. Graduated with a ${userData.education[0]?.degree || 'degree'} and possessing ${userData.experience.length} years of relevant experience. Adept at problem-solving and collaboration, with expertise in ${userData.skills.split(',').slice(0, 3).join(', ') || 'multiple disciplines'}.`,

            `Innovative and adaptable professional with a strong foundation in ${userData.education[0]?.degree || 'education'} and practical experience as a ${userData.experience[0]?.title || 'professional'}. Combines technical knowledge with excellent communication skills to deliver outstanding results. Proficient in ${userData.skills.split(',').slice(0, 3).join(', ') || 'various skills'} with a commitment to continuous improvement.`
        ];

        // Return a random summary
        return summaries[Math.floor(Math.random() * summaries.length)];
    }

    generateMockSkills(experience) {
        // Base skills that are generally useful
        const baseSkills = [
            'Communication', 'Teamwork', 'Problem Solving', 'Time Management',
            'Critical Thinking', 'Adaptability', 'Leadership', 'Organization'
        ];

        // Technical skills based on common job titles
        const technicalSkillsByTitle = {
            'developer': ['JavaScript', 'HTML/CSS', 'React', 'Node.js', 'Python', 'Git', 'API Integration', 'Database Management'],
            'engineer': ['Project Management', 'CAD Software', 'Technical Documentation', 'Quality Assurance', 'Process Improvement'],
            'designer': ['UI/UX Design', 'Adobe Creative Suite', 'Wireframing', 'Prototyping', 'Visual Communication'],
            'manager': ['Team Leadership', 'Strategic Planning', 'Budget Management', 'Performance Evaluation', 'Stakeholder Communication'],
            'analyst': ['Data Analysis', 'Research', 'Report Writing', 'Statistical Methods', 'Business Intelligence Tools'],
            'marketing': ['Social Media Marketing', 'Content Creation', 'SEO/SEM', 'Market Research', 'Campaign Management'],
            'teacher': ['Curriculum Development', 'Student Assessment', 'Classroom Management', 'Educational Technology', 'Differentiated Instruction']
        };

        // Collect relevant technical skills based on job titles
        let relevantSkills = [...baseSkills];

        experience.forEach(exp => {
            const title = exp.title.toLowerCase();

            // Check if any key in technicalSkillsByTitle is contained in the job title
            Object.keys(technicalSkillsByTitle).forEach(key => {
                if (title.includes(key)) {
                    relevantSkills = [...relevantSkills, ...technicalSkillsByTitle[key]];
                }
            });
        });

        // Remove duplicates and return a random selection of skills
        const uniqueSkills = [...new Set(relevantSkills)];
        const shuffled = uniqueSkills.sort(() => 0.5 - Math.random());

        // Return 10-15 skills
        return shuffled.slice(0, Math.floor(Math.random() * 6) + 10);
    }

    generateMockCVHTML(userData) {
        // Create a simple HTML representation of the CV
        return `
        <div class="cv-document">
            <div class="cv-header">
                <h1 class="text-2xl font-bold">${userData.personalInfo.fullName}</h1>
                <p>${userData.personalInfo.email} | ${userData.personalInfo.phone} | ${userData.personalInfo.location}</p>
            </div>

            <div class="cv-section mt-6">
                <h2 class="text-xl font-bold border-b pb-1 mb-3">Professional Summary</h2>
                <p>${userData.summary}</p>
            </div>

            <div class="cv-section mt-6">
                <h2 class="text-xl font-bold border-b pb-1 mb-3">Experience</h2>
                ${userData.experience.map(exp => `
                    <div class="mb-4">
                        <div class="flex justify-between">
                            <h3 class="font-bold">${exp.title}</h3>
                            <span>${exp.startDate} - ${exp.endDate}</span>
                        </div>
                        <p class="font-semibold">${exp.company}</p>
                        <p class="mt-1">${exp.description}</p>
                    </div>
                `).join('')}
            </div>

            <div class="cv-section mt-6">
                <h2 class="text-xl font-bold border-b pb-1 mb-3">Education</h2>
                ${userData.education.map(edu => `
                    <div class="mb-4">
                        <div class="flex justify-between">
                            <h3 class="font-bold">${edu.degree}</h3>
                            <span>${edu.startDate} - ${edu.endDate}</span>
                        </div>
                        <p class="font-semibold">${edu.school}</p>
                        ${edu.description ? `<p class="mt-1">${edu.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>

            <div class="cv-section mt-6">
                <h2 class="text-xl font-bold border-b pb-1 mb-3">Skills</h2>
                <div class="flex flex-wrap gap-2">
                    ${userData.skills.split(',').map(skill => `
                        <span class="bg-gray-200 px-2 py-1 rounded">${skill.trim()}</span>
                    `).join('')}
                </div>
            </div>
        </div>
        `;
    }

    // Interview Preparation methods

    async generateInterviewQuestions(interviewSetup) {
        console.log('Generating interview questions with Azure AI');

        try {
            // In a real implementation, this would call Azure OpenAI
            // to generate interview questions based on the job position, experience level, and interview type

            await this.simulateApiCall();

            // Construct a prompt for the AI
            const prompt = `Generate ${interviewSetup.questionCount} interview questions for a ${interviewSetup.experienceLevel} ${interviewSetup.position} position.
            The interview type is ${interviewSetup.interviewType}.
            Skills to focus on: ${interviewSetup.skills}`;

            // In a real implementation, we would send this prompt to Azure OpenAI
            // For now, return mock questions
            const questions = this.generateMockInterviewQuestions(interviewSetup);

            // Verify that questions were generated
            if (!questions || questions.length === 0) {
                throw new Error('Failed to generate interview questions');
            }

            // Store the questions in the interview data
            this.interviewData.questions = questions;
            this.interviewData.currentQuestion = 0;
            this.interviewData.answers = [];
            this.interviewData.feedback = [];
            this.interviewData.results = null;

            return questions;
        } catch (error) {
            console.error('Error generating interview questions:', error);
            throw new Error('Failed to generate interview questions. Please try again.');
        }
    }

    async evaluateAnswer(questionIndex, answer) {
        console.log('Evaluating interview answer with Azure AI');

        // In a real implementation, this would call Azure OpenAI
        // to evaluate the answer and provide feedback

        await this.simulateApiCall();

        // Get the current question
        const question = this.interviewData.questions[questionIndex];

        // Construct a prompt for the AI
        const prompt = `Evaluate the following answer to the interview question: "${question.text}"

        Answer: "${answer}"

        Provide feedback on the content, delivery, and areas for improvement.`;

        // In a real implementation, we would send this prompt to Azure OpenAI
        // For now, return mock feedback
        const feedback = this.generateMockAnswerFeedback(question, answer);

        // Store the answer and feedback
        this.interviewData.answers[questionIndex] = answer;
        this.interviewData.feedback[questionIndex] = feedback;

        return feedback;
    }

    async generateInterviewResults() {
        console.log('Generating interview results with Azure AI');

        // In a real implementation, this would call Azure OpenAI
        // to analyze all answers and provide overall feedback and recommendations

        await this.simulateApiCall();

        // Construct a prompt for the AI
        const prompt = `Analyze the following interview answers and provide overall feedback:

        ${this.interviewData.questions.map((q, i) => `
        Question: "${q.text}"
        Answer: "${this.interviewData.answers[i] || 'Skipped'}"
        `).join('\n')}

        Provide overall performance score, strengths, areas for improvement, and recommendations.`;

        // In a real implementation, we would send this prompt to Azure OpenAI
        // For now, return mock results
        const results = this.generateMockInterviewResults();

        // Store the results
        this.interviewData.results = results;

        return results;
    }

    // Mock methods for Interview Preparation

    generateMockInterviewQuestions(interviewSetup) {
        const questionCount = parseInt(interviewSetup.questionCount);
        const questions = [];

        // Technical questions for software/tech roles
        const technicalQuestions = [
            "Explain the concept of object-oriented programming and its key principles.",
            "What is the difference between a stack and a queue? When would you use each?",
            "Describe the process of debugging a complex issue in your code.",
            "How do you ensure your code is maintainable and scalable?",
            "Explain the concept of API design and best practices you follow.",
            "What is your approach to testing code? What types of tests do you write?",
            "Describe a challenging technical problem you've solved recently.",
            "How do you stay updated with the latest technologies and industry trends?",
            "Explain the concept of version control and how you use it in your workflow.",
            "What is your experience with cloud services and infrastructure?",
            "How do you optimize database queries for performance?",
            "Explain the concept of asynchronous programming and when you would use it.",
            "What security considerations do you take into account when developing software?",
            "How do you handle error and exception handling in your code?",
            "Describe your experience with CI/CD pipelines and deployment automation."
        ];

        // Behavioral questions
        const behavioralQuestions = [
            "Tell me about a time when you had to work under pressure to meet a deadline.",
            "Describe a situation where you had to collaborate with a difficult team member.",
            "How do you prioritize tasks when you have multiple deadlines?",
            "Tell me about a time when you had to learn a new technology or skill quickly.",
            "Describe a project where you demonstrated leadership skills.",
            "How do you handle feedback and criticism?",
            "Tell me about a time when you made a mistake and how you handled it.",
            "How do you approach problem-solving in your work?",
            "Describe a situation where you had to make a difficult decision with limited information.",
            "How do you handle conflicts within a team?",
            "Tell me about a time when you went above and beyond in your role.",
            "How do you adapt to changing requirements or priorities?",
            "Describe your approach to mentoring or helping junior team members.",
            "Tell me about a time when you had to persuade others to adopt your idea or approach.",
            "How do you maintain work-life balance in demanding roles?"
        ];

        // Select questions based on interview type
        let selectedQuestions = [];

        if (interviewSetup.interviewType === 'technical') {
            selectedQuestions = [...technicalQuestions];
        } else if (interviewSetup.interviewType === 'behavioral') {
            selectedQuestions = [...behavioralQuestions];
        } else {
            // Mixed interview - alternate between technical and behavioral
            for (let i = 0; i < Math.max(technicalQuestions.length, behavioralQuestions.length); i++) {
                if (i < technicalQuestions.length) selectedQuestions.push(technicalQuestions[i]);
                if (i < behavioralQuestions.length) selectedQuestions.push(behavioralQuestions[i]);
            }
        }

        // Shuffle the questions
        selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());

        // Take the required number of questions
        for (let i = 0; i < Math.min(questionCount, selectedQuestions.length); i++) {
            questions.push({
                id: i + 1,
                text: selectedQuestions[i],
                type: technicalQuestions.includes(selectedQuestions[i]) ? 'technical' : 'behavioral'
            });
        }

        return questions;
    }

    generateMockAnswerFeedback(question, answer) {
        // Check if the answer is empty or too short
        if (!answer || answer.trim().length < 20) {
            return {
                score: 30,
                content: "Your answer is too brief. In an interview, it's important to provide detailed responses that showcase your knowledge and experience.",
                delivery: "Consider expanding your answer with specific examples and details.",
                improvement: "Try using the STAR method (Situation, Task, Action, Result) to structure your answers, especially for behavioral questions.",
                positives: ["You attempted to answer the question"],
                negatives: ["Answer is too brief", "Lacks specific examples", "Doesn't showcase your skills"]
            };
        }

        // Generate random feedback based on answer length and question type
        const answerLength = answer.length;
        const isDetailedAnswer = answerLength > 200;
        const isTechnicalQuestion = question.type === 'technical';

        // Base score between 60-95 based on answer length
        let score = Math.min(60 + Math.floor(answerLength / 20), 95);

        // Randomize a bit
        score = Math.max(60, Math.min(95, score + (Math.random() * 10 - 5)));

        // Feedback templates
        const contentFeedback = [
            "Your answer demonstrates good knowledge of the subject matter.",
            "You provided a comprehensive response that addresses the key aspects of the question.",
            "Your answer shows a solid understanding of the concepts involved.",
            "You've covered the main points well in your response."
        ];

        const deliveryFeedback = [
            "Your response is well-structured and easy to follow.",
            "You communicated your thoughts clearly and concisely.",
            "Your answer flows logically from one point to the next.",
            "You presented your ideas in a coherent and organized manner."
        ];

        const improvementFeedback = isTechnicalQuestion ? [
            "Consider including more specific technical examples to strengthen your answer.",
            "You could enhance your response by mentioning specific technologies or methodologies you've used.",
            "Adding more details about your problem-solving approach would make your answer more compelling.",
            "Try to quantify your achievements or the impact of your work when possible."
        ] : [
            "Using more specific examples from your experience would strengthen your answer.",
            "Try to follow the STAR method more closely to structure your behavioral responses.",
            "Adding more context about the challenges you faced would make your story more impactful.",
            "Consider highlighting the lessons learned or skills developed from the experience you described."
        ];

        const positives = [
            "Clear communication",
            "Good structure",
            "Relevant examples",
            "Demonstrated knowledge",
            "Logical reasoning",
            "Problem-solving approach",
            "Technical accuracy",
            "Self-awareness"
        ];

        const negatives = [
            "Could provide more specific examples",
            "Could be more concise in some areas",
            "Technical details could be more precise",
            "Could highlight achievements more clearly",
            "Could demonstrate more strategic thinking",
            "Could show more leadership qualities",
            "Could better quantify impact"
        ];

        // Select random feedback elements
        const selectedContentFeedback = contentFeedback[Math.floor(Math.random() * contentFeedback.length)];
        const selectedDeliveryFeedback = deliveryFeedback[Math.floor(Math.random() * deliveryFeedback.length)];
        const selectedImprovementFeedback = improvementFeedback[Math.floor(Math.random() * improvementFeedback.length)];

        // Select 2-3 positives
        const shuffledPositives = [...positives].sort(() => 0.5 - Math.random());
        const selectedPositives = shuffledPositives.slice(0, 2 + Math.floor(Math.random() * 2));

        // Select 1-2 negatives
        const shuffledNegatives = [...negatives].sort(() => 0.5 - Math.random());
        const selectedNegatives = shuffledNegatives.slice(0, 1 + Math.floor(Math.random() * 2));

        return {
            score: score,
            content: selectedContentFeedback + (isDetailedAnswer ? " You provided good detail in your response." : " Consider adding more detail to strengthen your answer."),
            delivery: selectedDeliveryFeedback,
            improvement: selectedImprovementFeedback,
            positives: selectedPositives,
            negatives: selectedNegatives
        };
    }

    generateMockInterviewResults() {
        // Calculate overall score based on individual answer scores
        let totalScore = 0;
        let answeredQuestions = 0;

        for (let i = 0; i < this.interviewData.feedback.length; i++) {
            if (this.interviewData.feedback[i]) {
                totalScore += this.interviewData.feedback[i].score;
                answeredQuestions++;
            }
        }

        const overallScore = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 70;

        // Generate strengths and areas for improvement
        const strengths = [
            "Clear communication of ideas and concepts",
            "Good technical knowledge in key areas",
            "Structured approach to answering questions",
            "Ability to provide relevant examples",
            "Demonstrated problem-solving skills",
            "Showed enthusiasm and passion for the field",
            "Good understanding of industry best practices",
            "Balanced technical and soft skills in responses"
        ];

        const improvements = [
            "Provide more specific examples from past experience",
            "Elaborate more on technical implementations",
            "Structure answers more consistently using frameworks like STAR",
            "Quantify achievements and impact more clearly",
            "Demonstrate more strategic thinking in responses",
            "Show more leadership qualities in behavioral examples",
            "Be more concise in some responses",
            "Highlight unique skills and perspectives more effectively"
        ];

        // Select random strengths and improvements based on score
        const strengthCount = Math.floor(overallScore / 20) + 1; // 1-5 strengths
        const improvementCount = 6 - strengthCount; // 1-5 improvements

        const shuffledStrengths = [...strengths].sort(() => 0.5 - Math.random());
        const shuffledImprovements = [...improvements].sort(() => 0.5 - Math.random());

        const selectedStrengths = shuffledStrengths.slice(0, strengthCount);
        const selectedImprovements = shuffledImprovements.slice(0, improvementCount);

        // Generate recommendations
        let recommendations = "";

        if (overallScore >= 85) {
            recommendations = "You performed excellently in this interview! Your responses were clear, detailed, and showcased your skills effectively. To further improve, focus on quantifying your achievements more and highlighting your unique value proposition. You're well-prepared for real interviews.";
        } else if (overallScore >= 70) {
            recommendations = "You performed well in this interview. Your responses demonstrated good knowledge and communication skills. To improve, work on providing more specific examples and structuring your answers more consistently. Practice a few more mock interviews to refine your approach.";
        } else {
            recommendations = "You have a solid foundation but need more practice before real interviews. Focus on structuring your answers using the STAR method for behavioral questions and providing more detailed technical explanations for technical questions. Consider preparing a list of specific examples from your experience that highlight your skills and achievements.";
        }

        return {
            overallScore: overallScore,
            strengths: selectedStrengths,
            improvements: selectedImprovements,
            recommendations: recommendations,
            questionCount: this.interviewData.questions.length,
            answeredCount: answeredQuestions
        };
    }
}

export default AzureAIService;