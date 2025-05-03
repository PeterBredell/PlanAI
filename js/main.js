// Main application logic
import AzureAIService from './azure-services.js';

// Initialize Azure AI Service
let azureService;

// Store current user data
const userData = {
    currentSubject: 'math',
    testResults: null,
    studyPlan: null,
    practiceTest: null,
    cvData: {
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: ''
        },
        education: [],
        experience: [],
        skills: '',
        summary: ''
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    console.log('PlanAI initialized');

    // Initialize Azure AI Service (we'll use a placeholder API key for now)
    azureService = new AzureAIService('placeholder-api-key');

    // Set up navigation
    setupNavigation();

    // Set up event listeners
    setupEventListeners();
});

// Function to handle navigation between pages
function setupNavigation() {
    const navLinks = document.querySelectorAll('[data-page]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('data-page');
            navigateToPage(pageName);
        });
    });
}

// Function to navigate to a specific page
async function navigateToPage(pageName) {
    // Hide all pages
    const allPages = document.querySelectorAll('[id$="-page"]');
    allPages.forEach(page => page.classList.add('hidden'));

    // Show the selected page
    const selectedPage = document.getElementById(`${pageName}-page`);

    if (selectedPage) {
        selectedPage.classList.remove('hidden');

        // Load component content if it's empty
        if (selectedPage.innerHTML.trim() === '' && pageName !== 'home') {
            try {
                const response = await fetch(`components/${pageName}.html`);
                if (response.ok) {
                    const html = await response.text();
                    selectedPage.innerHTML = html;

                    // Initialize component-specific functionality
                    initializeComponent(pageName);
                } else {
                    selectedPage.innerHTML = '<p class="text-red-500">Error loading component</p>';
                }
            } catch (error) {
                console.error('Error loading component:', error);
                selectedPage.innerHTML = '<p class="text-red-500">Error loading component</p>';
            }
        }
    }
}

// Function to initialize component-specific functionality
function initializeComponent(componentName) {
    switch (componentName) {
        case 'dashboard':
            initializeDashboard();
            break;
        case 'test-submission':
            initializeTestSubmission();
            break;
        case 'curriculum-import':
            initializeCurriculumImport();
            break;
        case 'career-tools':
            initializeCareerTools();
            break;
        case 'login':
            initializeLogin();
            break;
    }
}

// Function to set up general event listeners
function setupEventListeners() {
    // Get Started button
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            navigateToPage('dashboard');
        });
    }
}

// Component-specific initializations
function initializeDashboard() {
    const viewStudyPlanBtn = document.getElementById('viewStudyPlan');
    const createPracticeTestBtn = document.getElementById('createPracticeTest');
    const careerToolsBtn = document.getElementById('careerTools');

    if (viewStudyPlanBtn) {
        viewStudyPlanBtn.addEventListener('click', () => {
            // Show study plan (to be implemented)
            alert('Study plan feature coming soon!');
        });
    }

    if (createPracticeTestBtn) {
        createPracticeTestBtn.addEventListener('click', () => {
            navigateToPage('test-submission');
        });
    }

    if (careerToolsBtn) {
        careerToolsBtn.addEventListener('click', () => {
            navigateToPage('career-tools');
        });
    }
}

function initializeTestSubmission() {
    const testSubmissionForm = document.getElementById('testSubmissionForm');

    if (testSubmissionForm) {
        testSubmissionForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const subject = document.getElementById('subject').value;
            const testFile = document.getElementById('testFile').files[0];

            if (!testFile) {
                alert('Please select a test file to upload');
                return;
            }

            // Update user data
            userData.currentSubject = subject;
            userData.testResults = {
                subject: subject,
                fileName: testFile.name,
                submissionDate: new Date().toISOString()
            };

            // Show loading message
            alert(`Test for ${subject} submitted for analysis. You'll receive your study plan shortly.`);

            try {
                // Generate study plan using Azure AI
                const studyPlan = await azureService.generateStudyPlan(userData.testResults, 4); // 4-week plan
                userData.studyPlan = studyPlan;

                // Navigate to study plan page
                await navigateToPage('study-plan');
                updateStudyPlanView();
            } catch (error) {
                console.error('Error generating study plan:', error);
                alert('There was an error generating your study plan. Please try again.');
                navigateToPage('dashboard');
            }
        });
    }
}

// Function to update the study plan view with data
function updateStudyPlanView() {
    const studyPlanSubject = document.getElementById('study-plan-subject');
    const aiFeedback = document.getElementById('ai-feedback');
    const weeklyPlansElement = document.getElementById('weekly-plans');
    const recommendedResourcesElement = document.getElementById('recommended-resources');

    if (!userData.studyPlan) return;

    // Update subject
    if (studyPlanSubject) {
        studyPlanSubject.textContent = userData.studyPlan.subject;
    }

    // Update AI feedback
    if (aiFeedback) {
        aiFeedback.textContent = userData.studyPlan.aiGeneratedFeedback;
    }

    // Update weekly plans (if we had dynamic data)
    if (weeklyPlansElement && userData.studyPlan.weeklyPlans) {
        // In a real implementation, we would dynamically generate the weekly plans here
        console.log('Weekly plans data:', userData.studyPlan.weeklyPlans);
    }

    // Update recommended resources (if we had dynamic data)
    if (recommendedResourcesElement && userData.studyPlan.recommendedResources) {
        // In a real implementation, we would dynamically generate the resources here
        console.log('Recommended resources:', userData.studyPlan.recommendedResources);
    }

    // Set up back button
    const backButton = document.getElementById('back-to-dashboard');
    if (backButton) {
        backButton.addEventListener('click', () => {
            navigateToPage('dashboard');
        });
    }

    // Set up practice test button
    const generatePracticeTestBtn = document.getElementById('generate-practice-test');
    if (generatePracticeTestBtn) {
        generatePracticeTestBtn.addEventListener('click', async () => {
            try {
                // Generate practice test
                const practiceTest = await azureService.generatePracticeTest({
                    subject: userData.currentSubject
                });
                userData.practiceTest = practiceTest;

                // Navigate to practice test page
                await navigateToPage('practice-test');
                initializePracticeTest();
            } catch (error) {
                console.error('Error generating practice test:', error);
                alert('There was an error generating your practice test. Please try again.');
            }
        });
    }
}

// Function to initialize the practice test
function initializePracticeTest() {
    const testSubject = document.getElementById('test-subject');
    const questionsContainer = document.getElementById('questions-container');
    const submitTestBtn = document.getElementById('submit-test');
    const backToDashboardBtn = document.getElementById('back-to-dashboard');

    if (!userData.practiceTest) return;

    // Update subject
    if (testSubject) {
        testSubject.textContent = userData.practiceTest.subject;
    }

    // In a real implementation, we would dynamically generate the questions here
    if (questionsContainer && userData.practiceTest.questions) {
        console.log('Practice test questions:', userData.practiceTest.questions);
        // We're using static questions for this demo
    }

    // Set up timer
    const timerElement = document.getElementById('timer');
    let timeLeft = userData.practiceTest.timeLimit * 60; // Convert minutes to seconds

    if (timerElement) {
        const timer = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('Time is up! Your test will be submitted automatically.');
                submitTest();
            }

            timeLeft--;
        }, 1000);
    }

    // Set up back button
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
                navigateToPage('dashboard');
            }
        });
    }

    // Set up submit button
    if (submitTestBtn) {
        submitTestBtn.addEventListener('click', submitTest);
    }

    // Function to submit the test
    function submitTest() {
        // In a real implementation, we would collect all answers and submit them
        alert('Test submitted successfully! You will receive feedback shortly.');
        navigateToPage('dashboard');
    }
}

function initializeCurriculumImport() {
    const curriculumImportForm = document.getElementById('curriculumImportForm');

    if (curriculumImportForm) {
        curriculumImportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const curriculumFile = document.getElementById('curriculumFile').files[0];
            const curriculumYear = document.getElementById('curriculumYear').value;

            if (!curriculumFile) {
                alert('Please select a curriculum file to upload');
                return;
            }

            // Simulate file upload and processing
            alert(`Curriculum for ${curriculumYear} imported successfully!`);

            // Navigate to dashboard
            setTimeout(() => {
                navigateToPage('dashboard');
            }, 1500);
        });
    }
}

function initializeCareerTools() {
    const startCVBuilderBtn = document.getElementById('startCVBuilder');
    const startInterviewPrepBtn = document.getElementById('startInterviewPrep');

    if (startCVBuilderBtn) {
        startCVBuilderBtn.addEventListener('click', async () => {
            // Navigate to CV builder page
            await navigateToPage('cv-builder');
            initializeCVBuilder();
        });
    }

    if (startInterviewPrepBtn) {
        startInterviewPrepBtn.addEventListener('click', async () => {
            // Navigate to interview prep page
            await navigateToPage('interview-prep');
            initializeInterviewPrep();
        });
    }
}

// Function to initialize the Interview Preparation
function initializeInterviewPrep() {
    console.log('Initializing Interview Preparation');

    // Get form elements
    const interviewSetupForm = document.getElementById('interview-setup-form');
    const backToCareerToolsBtn = document.getElementById('back-to-career-tools');
    const interviewSession = document.getElementById('interview-session');
    const interviewResults = document.getElementById('interview-results');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const skipQuestionBtn = document.getElementById('skip-question');
    const nextQuestionBtn = document.getElementById('next-question');
    const returnToCareerToolsBtn = document.getElementById('return-to-career-tools');
    const startNewInterviewBtn = document.getElementById('start-new-interview');

    // Set up back button
    if (backToCareerToolsBtn) {
        backToCareerToolsBtn.addEventListener('click', () => {
            navigateToPage('career-tools');
        });
    }

    // Set up interview setup form
    if (interviewSetupForm) {
        interviewSetupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const position = document.getElementById('job-position').value;
            const experienceLevel = document.getElementById('experience-level').value;
            const interviewType = document.getElementById('interview-type').value;
            const skills = document.getElementById('skills').value;
            const duration = document.getElementById('interview-duration').value;

            // Calculate number of questions based on duration
            const questionCount = Math.floor(parseInt(duration) / 2);

            // Create interview setup object
            const interviewSetup = {
                position,
                experienceLevel,
                interviewType,
                skills,
                questionCount
            };

            try {
                // Generate interview questions
                await generateInterviewQuestions(interviewSetup);

                // Show interview session
                interviewSetupForm.closest('.grid').classList.add('hidden');
                interviewSession.classList.remove('hidden');

                // Display first question
                displayCurrentQuestion();
            } catch (error) {
                console.error('Error generating interview questions:', error);
                alert('There was an error generating interview questions. Please try again.');
            }
        });
    }

    // Set up submit answer button
    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', async () => {
            const answerInput = document.getElementById('answer');
            const answer = answerInput.value.trim();

            if (!answer) {
                alert('Please provide an answer or click "Skip Question".');
                return;
            }

            try {
                // Evaluate answer
                const feedback = await evaluateAnswer(azureService.interviewData.currentQuestion, answer);

                // Display feedback
                displayFeedback(feedback);

                // Disable submit button
                submitAnswerBtn.disabled = true;
                skipQuestionBtn.disabled = true;

                // Show feedback section
                document.getElementById('feedback-section').classList.remove('hidden');
            } catch (error) {
                console.error('Error evaluating answer:', error);
                alert('There was an error evaluating your answer. Please try again.');
            }
        });
    }

    // Set up skip question button
    if (skipQuestionBtn) {
        skipQuestionBtn.addEventListener('click', () => {
            // Move to next question without submitting answer
            moveToNextQuestion();
        });
    }

    // Set up next question button
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', () => {
            // Move to next question
            moveToNextQuestion();
        });
    }

    // Set up return to career tools button
    if (returnToCareerToolsBtn) {
        returnToCareerToolsBtn.addEventListener('click', () => {
            navigateToPage('career-tools');
        });
    }

    // Set up start new interview button
    if (startNewInterviewBtn) {
        startNewInterviewBtn.addEventListener('click', () => {
            // Reset interview
            resetInterview();
        });
    }

    // Helper functions

    async function generateInterviewQuestions(interviewSetup) {
        // Call Azure AI to generate interview questions
        return await azureService.generateInterviewQuestions(interviewSetup);
    }

    async function evaluateAnswer(questionIndex, answer) {
        // Call Azure AI to evaluate answer
        return await azureService.evaluateAnswer(questionIndex, answer);
    }

    function displayCurrentQuestion() {
        const currentQuestion = azureService.interviewData.currentQuestion;
        const totalQuestions = azureService.interviewData.questions.length;

        // Update question counter
        document.getElementById('question-counter').textContent = `${currentQuestion + 1}/${totalQuestions}`;

        // Display question
        document.getElementById('interview-question').innerHTML = `
            <p class="text-lg font-medium">${azureService.interviewData.questions[currentQuestion].text}</p>
            <p class="text-sm text-gray-500 mt-2">Question type: ${azureService.interviewData.questions[currentQuestion].type}</p>
        `;

        // Clear answer input
        document.getElementById('answer').value = '';

        // Hide feedback section
        document.getElementById('feedback-section').classList.add('hidden');

        // Enable submit and skip buttons
        document.getElementById('submit-answer').disabled = false;
        document.getElementById('skip-question').disabled = false;
    }

    function displayFeedback(feedback) {
        const feedbackContent = document.getElementById('feedback-content');

        // Create feedback HTML
        const feedbackHTML = `
            <div class="mb-4">
                <div class="flex items-center mb-2">
                    <div class="w-full bg-gray-200 rounded-full h-4">
                        <div class="bg-blue-600 h-4 rounded-full" style="width: ${feedback.score}%"></div>
                    </div>
                    <span class="ml-4 font-semibold">${feedback.score}%</span>
                </div>
            </div>

            <div class="mb-4">
                <h4 class="font-semibold mb-2">Content</h4>
                <p class="text-gray-700">${feedback.content}</p>
            </div>

            <div class="mb-4">
                <h4 class="font-semibold mb-2">Delivery</h4>
                <p class="text-gray-700">${feedback.delivery}</p>
            </div>

            <div class="mb-4">
                <h4 class="font-semibold mb-2">Areas for Improvement</h4>
                <p class="text-gray-700">${feedback.improvement}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 class="font-semibold mb-2">Strengths</h4>
                    <ul class="list-disc list-inside text-gray-700">
                        ${feedback.positives.map(positive => `<li>${positive}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-2">Areas to Work On</h4>
                    <ul class="list-disc list-inside text-gray-700">
                        ${feedback.negatives.map(negative => `<li>${negative}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        feedbackContent.innerHTML = feedbackHTML;
    }

    function moveToNextQuestion() {
        const currentQuestion = azureService.interviewData.currentQuestion;
        const totalQuestions = azureService.interviewData.questions.length;

        // Check if this is the last question
        if (currentQuestion === totalQuestions - 1) {
            // Interview complete - show results
            completeInterview();
        } else {
            // Move to next question
            azureService.interviewData.currentQuestion++;
            displayCurrentQuestion();
        }
    }

    async function completeInterview() {
        try {
            // Generate interview results
            const results = await azureService.generateInterviewResults();

            // Hide interview session
            interviewSession.classList.add('hidden');

            // Show interview results
            interviewResults.classList.remove('hidden');

            // Update results UI
            document.getElementById('performance-bar').style.width = `${results.overallScore}%`;
            document.getElementById('performance-score').textContent = `${results.overallScore}%`;

            // Update strengths list
            const strengthsList = document.getElementById('strengths-list');
            strengthsList.innerHTML = results.strengths.map(strength => `<li>${strength}</li>`).join('');

            // Update improvements list
            const improvementsList = document.getElementById('improvements-list');
            improvementsList.innerHTML = results.improvements.map(improvement => `<li>${improvement}</li>`).join('');

            // Update recommendations
            document.getElementById('recommendations').textContent = results.recommendations;
        } catch (error) {
            console.error('Error generating interview results:', error);
            alert('There was an error generating your interview results. Please try again.');
        }
    }

    function resetInterview() {
        // Hide results
        interviewResults.classList.add('hidden');

        // Show setup form
        interviewSetupForm.closest('.grid').classList.remove('hidden');

        // Reset form
        interviewSetupForm.reset();
    }
}

// Function to initialize the CV Builder
function initializeCVBuilder() {
    console.log('Initializing CV Builder');

    // Get form elements
    const cvBuilderForm = document.getElementById('cv-builder-form');
    const addEducationBtn = document.getElementById('add-education');
    const addExperienceBtn = document.getElementById('add-experience');
    const suggestSkillsBtn = document.getElementById('suggest-skills');
    const generateSummaryBtn = document.getElementById('generate-summary');
    const previewCVBtn = document.getElementById('preview-cv');
    const backToCareerToolsBtn = document.getElementById('back-to-career-tools');

    // Education and experience counters
    let educationCount = 1;
    let experienceCount = 1;

    // Set up back button
    if (backToCareerToolsBtn) {
        backToCareerToolsBtn.addEventListener('click', () => {
            navigateToPage('career-tools');
        });
    }

    // Add education entry
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', () => {
            educationCount++;
            const educationContainer = document.getElementById('education-container');

            const newEducationEntry = document.createElement('div');
            newEducationEntry.className = 'education-entry border-b pb-4 mb-4';
            newEducationEntry.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 mb-2" for="school-name-${educationCount}">School/University</label>
                        <input type="text" id="school-name-${educationCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" for="degree-${educationCount}">Degree/Certificate</label>
                        <input type="text" id="degree-${educationCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" for="edu-start-date-${educationCount}">Start Date</label>
                        <input type="month" id="edu-start-date-${educationCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" for="edu-end-date-${educationCount}">End Date</label>
                        <input type="month" id="edu-end-date-${educationCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-gray-700 mb-2" for="edu-description-${educationCount}">Description</label>
                        <textarea id="edu-description-${educationCount}" class="w-full p-2 border rounded" rows="3"></textarea>
                    </div>
                </div>
                <button type="button" class="remove-education text-red-600 hover:underline mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Remove
                </button>
            `;

            educationContainer.appendChild(newEducationEntry);

            // Add event listener to remove button
            const removeBtn = newEducationEntry.querySelector('.remove-education');
            removeBtn.addEventListener('click', () => {
                educationContainer.removeChild(newEducationEntry);
            });
        });
    }

    // Add experience entry
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', () => {
            experienceCount++;
            const experienceContainer = document.getElementById('experience-container');

            const newExperienceEntry = document.createElement('div');
            newExperienceEntry.className = 'experience-entry border-b pb-4 mb-4';
            newExperienceEntry.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-gray-700 mb-2" for="company-name-${experienceCount}">Company</label>
                        <input type="text" id="company-name-${experienceCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" for="job-title-${experienceCount}">Job Title</label>
                        <input type="text" id="job-title-${experienceCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" for="exp-start-date-${experienceCount}">Start Date</label>
                        <input type="month" id="exp-start-date-${experienceCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2" for="exp-end-date-${experienceCount}">End Date</label>
                        <input type="month" id="exp-end-date-${experienceCount}" class="w-full p-2 border rounded" required>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-gray-700 mb-2" for="job-description-${experienceCount}">Description</label>
                        <textarea id="job-description-${experienceCount}" class="w-full p-2 border rounded" rows="3" placeholder="Describe your responsibilities and achievements..."></textarea>
                    </div>
                </div>
                <button type="button" class="remove-experience text-red-600 hover:underline mt-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Remove
                </button>
            `;

            experienceContainer.appendChild(newExperienceEntry);

            // Add event listener to remove button
            const removeBtn = newExperienceEntry.querySelector('.remove-experience');
            removeBtn.addEventListener('click', () => {
                experienceContainer.removeChild(newExperienceEntry);
            });
        });
    }

    // Suggest skills with AI
    if (suggestSkillsBtn) {
        suggestSkillsBtn.addEventListener('click', async () => {
            // Collect experience data
            const experience = collectExperienceData();

            if (experience.length === 0) {
                alert('Please add at least one experience entry to generate skill suggestions.');
                return;
            }

            suggestSkillsBtn.textContent = 'Generating suggestions...';
            suggestSkillsBtn.disabled = true;

            try {
                // Call Azure AI to suggest skills
                const suggestedSkills = await azureService.suggestSkills(experience);

                // Display suggested skills
                const suggestedSkillsContainer = document.getElementById('suggested-skills-container');
                const suggestedSkillsElement = document.getElementById('suggested-skills');

                suggestedSkillsElement.innerHTML = '';
                suggestedSkills.forEach(skill => {
                    const skillElement = document.createElement('span');
                    skillElement.className = 'bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-blue-200';
                    skillElement.textContent = skill;

                    // Add click event to add skill to the skills input
                    skillElement.addEventListener('click', () => {
                        const skillsInput = document.getElementById('skills');
                        const currentSkills = skillsInput.value.trim();

                        if (currentSkills) {
                            skillsInput.value = currentSkills + ', ' + skill;
                        } else {
                            skillsInput.value = skill;
                        }
                    });

                    suggestedSkillsElement.appendChild(skillElement);
                });

                suggestedSkillsContainer.classList.remove('hidden');
            } catch (error) {
                console.error('Error suggesting skills:', error);
                alert('There was an error generating skill suggestions. Please try again.');
            } finally {
                suggestSkillsBtn.textContent = 'Suggest Skills with AI';
                suggestSkillsBtn.disabled = false;
            }
        });
    }

    // Generate summary with AI
    if (generateSummaryBtn) {
        generateSummaryBtn.addEventListener('click', async () => {
            // Collect all CV data
            const cvData = collectCVData();

            if (!validateCVData(cvData)) {
                alert('Please fill in all required fields before generating a summary.');
                return;
            }

            generateSummaryBtn.textContent = 'Generating summary...';
            generateSummaryBtn.disabled = true;

            try {
                // Call Azure AI to generate summary
                const summary = await azureService.generateCVSummary(cvData);

                // Update summary field
                const summaryInput = document.getElementById('summary');
                summaryInput.value = summary;

                // Update user data
                userData.cvData = cvData;
                userData.cvData.summary = summary;
            } catch (error) {
                console.error('Error generating summary:', error);
                alert('There was an error generating your summary. Please try again.');
            } finally {
                generateSummaryBtn.textContent = 'Generate Summary with AI';
                generateSummaryBtn.disabled = false;
            }
        });
    }

    // Preview CV
    if (previewCVBtn) {
        previewCVBtn.addEventListener('click', async () => {
            console.log('Preview CV button clicked');

            // Collect all CV data
            const cvData = collectCVData();

            if (!validateCVData(cvData)) {
                alert('Please fill in all required fields before previewing your CV.');
                return;
            }

            // Update summary if empty
            if (!cvData.summary.trim()) {
                try {
                    const summary = await azureService.generateCVSummary(cvData);
                    cvData.summary = summary;
                    document.getElementById('summary').value = summary;
                } catch (error) {
                    console.error('Error generating summary:', error);
                }
            }

            // Update user data
            userData.cvData = cvData;

            try {
                // Generate CV HTML
                const cvHTML = await azureService.generateFullCV(cvData);

                // Show preview modal
                const previewModal = document.getElementById('cv-preview-modal');
                const previewContent = document.getElementById('cv-preview-content');

                if (!previewModal || !previewContent) {
                    console.error('Modal elements not found:', { previewModal, previewContent });
                    alert('There was an error displaying the CV preview. Please try again.');
                    return;
                }

                console.log('Setting modal content and displaying');

                // Set content and show modal
                previewContent.innerHTML = cvHTML;
                previewModal.style.display = 'flex';
                previewModal.classList.remove('hidden');

                // Set up close button - remove any existing event listeners first
                const closePreviewBtn = document.getElementById('close-preview');
                if (closePreviewBtn) {
                    // Clone and replace to remove existing event listeners
                    const newCloseBtn = closePreviewBtn.cloneNode(true);
                    closePreviewBtn.parentNode.replaceChild(newCloseBtn, closePreviewBtn);

                    // Add new event listener
                    newCloseBtn.addEventListener('click', () => {
                        console.log('Close button clicked');
                        previewModal.classList.add('hidden');
                        previewModal.style.display = 'none';
                    });
                }

                // Set up download button - remove any existing event listeners first
                const downloadCVBtn = document.getElementById('download-cv');
                if (downloadCVBtn) {
                    // Clone and replace to remove existing event listeners
                    const newDownloadBtn = downloadCVBtn.cloneNode(true);
                    downloadCVBtn.parentNode.replaceChild(newDownloadBtn, downloadCVBtn);

                    // Add new event listener
                    newDownloadBtn.addEventListener('click', () => {
                        alert('In a real implementation, this would generate a PDF file of your CV using Azure Document Intelligence.');
                        previewModal.classList.add('hidden');
                        previewModal.style.display = 'none';
                    });
                }

                // Add click event to close modal when clicking outside the content
                previewModal.addEventListener('click', (e) => {
                    if (e.target === previewModal) {
                        previewModal.classList.add('hidden');
                        previewModal.style.display = 'none';
                    }
                });
            } catch (error) {
                console.error('Error generating CV preview:', error);
                alert('There was an error generating your CV preview. Please try again.');
            }
        });
    }

    // Submit form
    if (cvBuilderForm) {
        cvBuilderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect all CV data
            const cvData = collectCVData();

            if (!validateCVData(cvData)) {
                alert('Please fill in all required fields before generating your CV.');
                return;
            }

            // Update user data
            userData.cvData = cvData;

            try {
                // In a real implementation, this would save the CV to the user's account
                // and generate a downloadable PDF using Azure Document Intelligence

                alert('Your CV has been generated successfully! In a real implementation, you would be able to download it as a PDF.');

                // Navigate back to career tools
                navigateToPage('career-tools');
            } catch (error) {
                console.error('Error generating CV:', error);
                alert('There was an error generating your CV. Please try again.');
            }
        });
    }

    // Helper functions

    function collectEducationData() {
        const education = [];
        const educationEntries = document.querySelectorAll('.education-entry');

        educationEntries.forEach((entry, index) => {
            const entryNumber = index + 1;
            const school = document.getElementById(`school-name-${entryNumber}`)?.value;
            const degree = document.getElementById(`degree-${entryNumber}`)?.value;
            const startDate = document.getElementById(`edu-start-date-${entryNumber}`)?.value;
            const endDate = document.getElementById(`edu-end-date-${entryNumber}`)?.value;
            const description = document.getElementById(`edu-description-${entryNumber}`)?.value;

            if (school && degree) {
                education.push({
                    school,
                    degree,
                    startDate,
                    endDate,
                    description
                });
            }
        });

        return education;
    }

    function collectExperienceData() {
        const experience = [];
        const experienceEntries = document.querySelectorAll('.experience-entry');

        experienceEntries.forEach((entry, index) => {
            const entryNumber = index + 1;
            const company = document.getElementById(`company-name-${entryNumber}`)?.value;
            const title = document.getElementById(`job-title-${entryNumber}`)?.value;
            const startDate = document.getElementById(`exp-start-date-${entryNumber}`)?.value;
            const endDate = document.getElementById(`exp-end-date-${entryNumber}`)?.value;
            const description = document.getElementById(`job-description-${entryNumber}`)?.value;

            if (company && title) {
                experience.push({
                    company,
                    title,
                    startDate,
                    endDate,
                    description
                });
            }
        });

        return experience;
    }

    function collectCVData() {
        return {
            personalInfo: {
                fullName: document.getElementById('full-name')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                location: document.getElementById('location')?.value || ''
            },
            education: collectEducationData(),
            experience: collectExperienceData(),
            skills: document.getElementById('skills')?.value || '',
            summary: document.getElementById('summary')?.value || ''
        };
    }

    function validateCVData(cvData) {
        // Check personal info
        if (!cvData.personalInfo.fullName || !cvData.personalInfo.email || !cvData.personalInfo.phone) {
            return false;
        }

        // Check education
        if (cvData.education.length === 0) {
            return false;
        }

        // Check experience
        if (cvData.experience.length === 0) {
            return false;
        }

        return true;
    }
}

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.getElementById('register-link');
    const registerForm = document.getElementById('register-form');
    const registerFormElement = document.getElementById('registerForm');

    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.toggle('hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // In a real app, we would authenticate with Azure AD or another service
            console.log(`Login attempt: ${email} with password length: ${password.length}`);

            // Simple validation
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }

            // Simulate successful login
            alert('Login successful!');
            navigateToPage('dashboard');
        });
    }

    if (registerFormElement) {
        registerFormElement.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            // Simple validation
            if (!name || !email || !password) {
                alert('Please fill in all required fields');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            // In a real app, we would register the user with Azure AD or another service
            console.log(`Registration: ${name}, ${email} with password length: ${password.length}`);

            // Simulate successful registration
            alert('Registration successful! You can now log in.');
            registerForm.classList.add('hidden');
        });
    }
}