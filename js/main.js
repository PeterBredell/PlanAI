// Main application logic
import AzureAIService from './azure-services.js';

// Initialize Azure AI Service
let azureService;

// Store current user data
const userData = {
    currentSubject: 'math',
    testResults: null,
    studyPlan: null,
    practiceTest: null
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
        startCVBuilderBtn.addEventListener('click', () => {
            alert('CV Builder will be available soon!');
        });
    }

    if (startInterviewPrepBtn) {
        startInterviewPrepBtn.addEventListener('click', () => {
            alert('Interview Preparation will be available soon!');
        });
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