// Main application logic
import AzureAIService from './azure-services.js';
import { generatePDFFromHTML } from './pdf-utils.js';
import { initializeSupabase } from './supabase-client.js';
import authService from './auth-service.js';

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

    // Initialize Azure AI Service with the provided API key
    azureService = new AzureAIService('PlaceHolder API');

    // Initialize Supabase with the provided credentials
    initializeSupabase(
        'https://revbzephgjzupznftiwf.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldmJ6ZXBoZ2p6dXB6bmZ0aXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTk2NDIsImV4cCI6MjA2MTkzNTY0Mn0.PBsA5UjptrZwHDVMifi0z5EQ3Xwryld9bWrnSlzlFmQ'
    );

    // Set up auth state listener
    authService.addAuthStateListener(handleAuthStateChange);

    // Check if user is already authenticated
    checkAuthState();

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
    // Handle logout action
    if (pageName === 'logout') {
        try {
            const { success, error } = await authService.signOut();

            if (success) {
                // Redirect to home page after logout
                pageName = 'home';
            } else {
                console.error('Logout error:', error);
                alert('Failed to log out. Please try again.');
                return;
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('An unexpected error occurred. Please try again.');
            return;
        }
    }

    // Check if page requires authentication
    const protectedPages = ['dashboard', 'test-submission', 'curriculum-import', 'career-tools', 'study-plan', 'practice-test', 'profile'];
    if (protectedPages.includes(pageName) && !authService.isAuthenticated()) {
        // Redirect to login if trying to access protected page without authentication
        pageName = 'login';
    }

    // Update active nav link
    updateActiveNavLink(pageName);

    // Get current page
    const currentPage = document.querySelector('[id$="-page"]:not(.hidden)');
    const currentPageName = currentPage ? currentPage.id.replace('-page', '') : null;

    // Fade out current content with a smooth transition
    const pageContent = document.getElementById('page-content');
    pageContent.style.opacity = '0';
    pageContent.style.transform = 'scale(0.98)';

    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Hide all pages and remove animation classes
    const allPages = document.querySelectorAll('[id$="-page"]');
    allPages.forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('fade-in', 'slide-in-right', 'slide-in-left', 'slide-up');
    });

    // Show the selected page
    const selectedPage = document.getElementById(`${pageName}-page`);

    if (selectedPage) {
        // Load component content if it's empty
        if (selectedPage.innerHTML.trim() === '' && pageName !== 'home') {
            try {
                // Show loading indicator
                selectedPage.classList.remove('hidden');
                selectedPage.innerHTML = `
                    <div class="component-container page-container">
                        <div class="loading-container">
                            <div class="loading-spinner"></div>
                        </div>
                    </div>
                `;

                const response = await fetch(`components/${pageName}.html`);
                if (response.ok) {
                    let html = await response.text();

                    // Check if the component already has our container classes
                    if (!html.includes('component-container') && !html.includes('page-container')) {
                        // Wrap the component in our container classes
                        html = `
                            <div class="component-container page-container">
                                <div class="component-header">
                                    <h2 class="component-title text-center">${pageName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
                                </div>
                                <div class="component-body">
                                    ${html}
                                </div>
                            </div>
                        `;
                    }

                    selectedPage.innerHTML = html;

                    // Apply dark theme to dynamically loaded components
                    applyDarkThemeToComponent(selectedPage);

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

        // Show the page
        selectedPage.classList.remove('hidden');

        // Add animation classes based on navigation direction
        if (pageName === 'home') {
            selectedPage.classList.add('fade-in');
        } else if (!currentPageName || currentPageName === 'home') {
            // Coming from home or initial load - slide in from right
            selectedPage.classList.add('slide-in-right');
        } else if (getPageIndex(pageName) > getPageIndex(currentPageName)) {
            // Moving forward in navigation - slide in from right
            selectedPage.classList.add('slide-in-right');
        } else {
            // Moving backward in navigation - slide in from left
            selectedPage.classList.add('slide-in-left');
        }

        // Fade in content with a smooth scale transition
        pageContent.style.opacity = '1';
        pageContent.style.transform = 'scale(1)';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Helper function to determine page order for animation direction
function getPageIndex(pageName) {
    const pageOrder = [
        'home',
        'dashboard',
        'test-submission',
        'curriculum-import',
        'career-tools',
        'login',
        'study-plan',
        'practice-test',
        'test-results',
        'cv-builder',
        'interview-prep'
    ];

    return pageOrder.indexOf(pageName);
}

// Function to update active nav link
function updateActiveNavLink(pageName) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current nav link
    const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Function to apply dark theme to dynamically loaded components
function applyDarkThemeToComponent(component) {
    // Add page-container class to ensure proper spacing if not already present
    if (!component.querySelector('.page-container')) {
        const mainContent = component.querySelector('div');
        if (mainContent) {
            mainContent.classList.add('page-container');
        }
    }

    // Replace light theme classes with dark theme classes

    // Background colors
    component.querySelectorAll('.bg-white').forEach(el => {
        el.classList.remove('bg-white');
        el.classList.add('bg-dark-200', 'border', 'border-purple-900/30');

        // Add hover effect to cards
        if (el.classList.contains('rounded-lg') || el.classList.contains('rounded-md')) {
            el.classList.add('transition-all', 'duration-300', 'hover:shadow-glow-lg', 'transform', 'hover:scale-[1.01]');
        }
    });

    component.querySelectorAll('.bg-gray-50, .bg-gray-100, .bg-gray-200').forEach(el => {
        el.classList.remove('bg-gray-50', 'bg-gray-100', 'bg-gray-200');
        el.classList.add('bg-dark-300');
    });

    // Text colors
    component.querySelectorAll('.text-gray-800, .text-gray-900').forEach(el => {
        el.classList.remove('text-gray-800', 'text-gray-900');
        el.classList.add('text-gray-100');

        // Add gradient text to headings
        if (el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3') {
            el.classList.add('text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-purple-400', 'to-indigo-300');
        }
    });

    component.querySelectorAll('.text-gray-600, .text-gray-700').forEach(el => {
        el.classList.remove('text-gray-600', 'text-gray-700');
        el.classList.add('text-gray-300');
    });

    // Buttons
    component.querySelectorAll('.bg-blue-500, .bg-blue-600, .bg-blue-700').forEach(el => {
        el.classList.remove('bg-blue-500', 'bg-blue-600', 'bg-blue-700');
        el.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-indigo-600', 'shadow-glow');

        // Add hover effects
        el.classList.add('hover:from-purple-600', 'hover:to-indigo-700', 'transition-all', 'duration-300', 'transform', 'hover:scale-105');

        // Remove any existing hover classes that might conflict
        el.classList.remove('hover:bg-blue-600', 'hover:bg-blue-700', 'hover:bg-blue-800');
    });

    // Green buttons
    component.querySelectorAll('.bg-green-500, .bg-green-600, .bg-green-700').forEach(el => {
        el.classList.remove('bg-green-500', 'bg-green-600', 'bg-green-700');
        el.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-teal-600', 'shadow-glow');

        // Add hover effects
        el.classList.add('hover:from-emerald-600', 'hover:to-teal-700', 'transition-all', 'duration-300', 'transform', 'hover:scale-105');

        // Remove any existing hover classes that might conflict
        el.classList.remove('hover:bg-green-600', 'hover:bg-green-700', 'hover:bg-green-800');
    });

    // Add shadow glow to cards and containers
    component.querySelectorAll('.shadow, .shadow-md, .shadow-lg, .rounded-lg, .rounded-md').forEach(el => {
        el.classList.add('shadow-glow', 'border', 'border-purple-900/30');
    });

    // Style form inputs
    component.querySelectorAll('input, select, textarea').forEach(el => {
        if (!el.type || el.type !== 'checkbox' && el.type !== 'radio') {
            el.classList.add('bg-dark-300', 'text-gray-200', 'border-dark-400', 'focus:ring-purple-500', 'focus:border-transparent');
            el.classList.remove('bg-white', 'bg-gray-50', 'bg-gray-100');
        }
    });

    // Style links
    component.querySelectorAll('a:not([data-page])').forEach(el => {
        if (el.classList.contains('text-blue-500') || el.classList.contains('text-blue-600')) {
            el.classList.remove('text-blue-500', 'text-blue-600');
            el.classList.add('text-purple-400', 'hover:text-purple-300', 'transition-all', 'duration-300');
        }
    });

    // Add animation classes with staggered delay
    component.querySelectorAll('.card, .bg-dark-200, .bg-dark-300, .rounded-lg, .rounded-md').forEach((el, index) => {
        el.classList.add('slide-up');
        el.style.animationDelay = `${index * 0.08}s`;
    });

    // Add subtle hover effects to interactive elements
    component.querySelectorAll('button, .cursor-pointer, [role="button"]').forEach(el => {
        if (!el.classList.contains('transform')) {
            el.classList.add('transition-all', 'duration-300', 'hover:shadow-glow');
        }
    });
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
        case 'profile':
            initializeProfile();
            break;
        case 'interview-prep':
            initializeInterviewPrep();
            break;
        case 'cv-builder':
            initializeCVBuilder();
            break;
        case 'study-plan':
            updateStudyPlanView();
            break;
        case 'practice-test':
            initializePracticeTest();
            break;
        case 'test-results':
            initializeTestResults();
            break;
    }
}

// Function to set up general event listeners
function setupEventListeners() {
    // Get Started button
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // If user is authenticated, go to dashboard, otherwise go to login
            if (authService.isAuthenticated()) {
                navigateToPage('dashboard');
            } else {
                navigateToPage('login');
            }
        });
    }
}

// Function to handle authentication state changes
function handleAuthStateChange(user) {
    console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');

    // Update UI based on authentication state
    updateAuthUI(!!user);

    // If user logged out and was on a protected page, redirect to login
    if (!user) {
        const currentPage = document.querySelector('[id$="-page"]:not(.hidden)');
        const currentPageName = currentPage ? currentPage.id.replace('-page', '') : null;

        // List of pages that require authentication
        const protectedPages = ['dashboard', 'test-submission', 'curriculum-import', 'career-tools', 'study-plan', 'practice-test', 'profile'];

        if (currentPageName && protectedPages.includes(currentPageName)) {
            navigateToPage('login');
        }
    }
}

// Function to check authentication state on page load
function checkAuthState() {
    const isAuthenticated = authService.isAuthenticated();
    updateAuthUI(isAuthenticated);

    // If user is on the login page but already authenticated, redirect to dashboard
    const currentPage = document.querySelector('[id$="-page"]:not(.hidden)');
    const currentPageName = currentPage ? currentPage.id.replace('-page', '') : null;

    if (isAuthenticated && currentPageName === 'login') {
        navigateToPage('dashboard');
    }
}

// Function to update UI based on authentication state
function updateAuthUI(isAuthenticated) {
    // Update navigation links
    const loginLink = document.querySelector('.nav-link[data-page="login"]');
    const profileLink = document.querySelector('.nav-link[data-page="profile"]');

    if (loginLink) {
        if (isAuthenticated) {
            loginLink.textContent = 'Logout';
            loginLink.setAttribute('data-page', 'logout');
        } else {
            loginLink.textContent = 'Login';
            loginLink.setAttribute('data-page', 'login');
        }
    }

    // Add profile link if authenticated and it doesn't exist
    if (isAuthenticated && !profileLink) {
        const navList = document.querySelector('nav ul');
        if (navList) {
            const profileLi = document.createElement('li');
            const profileA = document.createElement('a');
            profileA.href = '#';
            profileA.className = 'nav-link hover:text-purple-300 transition-all duration-300';
            profileA.setAttribute('data-page', 'profile');
            profileA.textContent = 'Profile';

            profileLi.appendChild(profileA);
            navList.appendChild(profileLi);

            // Re-setup navigation to add event listener to the new link
            setupNavigation();
        }
    } else if (!isAuthenticated && profileLink) {
        // Remove profile link if not authenticated
        profileLink.parentElement.remove();
    }
}

// Component-specific initializations
function initializeDashboard() {
    const viewStudyPlanBtn = document.getElementById('viewStudyPlan');
    const createPracticeTestBtn = document.getElementById('createPracticeTest');
    const careerToolsBtn = document.getElementById('careerTools');

    if (viewStudyPlanBtn) {
        viewStudyPlanBtn.addEventListener('click', async () => {
            try {
                // Create mock test results
                userData.testResults = {
                    subject: userData.currentSubject,
                    fileName: 'sample_test.pdf',
                    submissionDate: new Date().toISOString()
                };

                // Generate study plan using Azure AI with mock data
                const studyPlan = await azureService.generateStudyPlan(userData.testResults, 4); // 4-week plan
                userData.studyPlan = studyPlan;

                // Navigate to study plan page
                await navigateToPage('study-plan');
                updateStudyPlanView();
            } catch (error) {
                console.error('Error generating study plan:', error);
                alert('There was an error generating your study plan. Please try again.');
            }
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
    const studyPlanSource = document.getElementById('study-plan-source');
    const aiFeedback = document.getElementById('ai-feedback');
    const weeklyPlansElement = document.getElementById('weekly-plans');
    const recommendedResourcesElement = document.getElementById('recommended-resources');

    if (!userData.studyPlan) return;

    // Update subject
    if (studyPlanSubject) {
        studyPlanSubject.textContent = userData.studyPlan.subject;
    }

    // Update source information
    if (studyPlanSource) {
        const isCurriculumBased = userData.studyPlan.curriculumId !== undefined;
        studyPlanSource.textContent = isCurriculumBased
            ? `Based on your curriculum • ${userData.studyPlan.duration} week plan`
            : 'Based on your test results';
    }

    // Update AI feedback
    if (aiFeedback) {
        aiFeedback.textContent = userData.studyPlan.aiGeneratedFeedback;
    }

    // Update weekly plans
    if (weeklyPlansElement && userData.studyPlan.weeklyPlans) {
        weeklyPlansElement.innerHTML = ''; // Clear existing content

        userData.studyPlan.weeklyPlans.forEach(week => {
            const weekElement = document.createElement('div');
            weekElement.className = 'study-plan-week bg-dark-300 p-4 rounded-md border border-purple-900/30 shadow-glow';

            // Add week title with focus area
            const weekTitle = document.createElement('h4');
            weekTitle.className = 'text-lg font-bold mb-3 text-gray-200';
            weekTitle.textContent = `Week ${week.week}: ${week.focus}`;
            weekElement.appendChild(weekTitle);

            // Add topics if available (curriculum-based plans)
            if (week.topics && week.topics.length > 0) {
                const topicsContainer = document.createElement('div');
                topicsContainer.className = 'mb-3 text-sm text-gray-400';
                topicsContainer.innerHTML = `<strong class="text-gray-300">Topics:</strong> ${week.topics.join(', ')}`;
                weekElement.appendChild(topicsContainer);
            }

            // Add daily tasks
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';

            // Split tasks into two columns
            const midpoint = Math.ceil(week.dailyTasks.length / 2);

            // First column
            const column1 = document.createElement('div');
            week.dailyTasks.slice(0, midpoint).forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'study-plan-day border-b border-purple-900/30 pb-2 mb-2 text-gray-300';
                taskElement.innerHTML = `
                    <span class="font-semibold text-gray-200">${task.day}:</span>
                    <span>${task.task}</span>
                `;
                column1.appendChild(taskElement);
            });
            tasksContainer.appendChild(column1);

            // Second column
            const column2 = document.createElement('div');
            week.dailyTasks.slice(midpoint).forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'study-plan-day border-b border-purple-900/30 pb-2 mb-2 text-gray-300';
                taskElement.innerHTML = `
                    <span class="font-semibold text-gray-200">${task.day}:</span>
                    <span>${task.task}</span>
                `;
                column2.appendChild(taskElement);
            });
            tasksContainer.appendChild(column2);

            weekElement.appendChild(tasksContainer);
            weeklyPlansElement.appendChild(weekElement);
        });
    }

    // Update recommended resources
    if (recommendedResourcesElement && userData.studyPlan.recommendedResources) {
        recommendedResourcesElement.innerHTML = ''; // Clear existing content

        userData.studyPlan.recommendedResources.forEach(resource => {
            const resourceElement = document.createElement('div');
            resourceElement.className = 'bg-dark-200 p-4 rounded-lg shadow-glow border border-purple-900/30';

            let resourceContent = `
                <h4 class="font-bold text-gray-200">${resource.type}</h4>
                <p class="text-gray-300">${resource.title}</p>
            `;

            if (resource.author) {
                resourceContent += `<p class="text-sm text-gray-400">by ${resource.author}</p>`;
            }

            if (resource.url) {
                resourceContent += `<a href="${resource.url}" class="text-purple-400 hover:text-purple-300 transition-all duration-300" target="_blank">Visit Resource</a>`;
            }

            resourceElement.innerHTML = resourceContent;
            recommendedResourcesElement.appendChild(resourceElement);
        });
    }

    // Set up back button
    const backButton = document.getElementById('back-to-dashboard');
    if (backButton) {
        backButton.addEventListener('click', () => {
            navigateToPage('dashboard');
        });
    }

    // Set up print button
    const printButton = document.getElementById('print-study-plan');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
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
    const timeLimitElement = document.getElementById('time-limit');
    const totalPointsElement = document.getElementById('total-points');

    if (!userData.practiceTest) return;

    // Update subject
    if (testSubject) {
        testSubject.textContent = userData.practiceTest.subject;
    }

    // Update time limit and total points
    if (timeLimitElement) {
        timeLimitElement.textContent = userData.practiceTest.timeLimit;
    }

    if (totalPointsElement) {
        totalPointsElement.textContent = userData.practiceTest.totalPoints;
    }

    // Dynamically generate the questions
    if (questionsContainer && userData.practiceTest.questions) {
        // Clear loading indicator
        questionsContainer.innerHTML = '';

        // Generate questions
        userData.practiceTest.questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-card bg-dark-300 p-4 rounded-lg border border-purple-900/30 shadow-glow';

            // Question header
            const questionHeader = document.createElement('h3');
            questionHeader.className = 'text-lg font-bold mb-3 text-gray-200';
            questionHeader.textContent = `Question ${index + 1}`;

            // Question text
            const questionText = document.createElement('p');
            questionText.className = 'mb-4 text-gray-300';
            questionText.textContent = question.text;

            // Options container
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container space-y-2';

            // Generate options
            question.options.forEach(option => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item flex items-center p-2 rounded-md hover:bg-dark-400 transition-all duration-200';

                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.id = `q${question.id}-${option.id}`;
                optionInput.name = `q${question.id}`;
                optionInput.value = option.id;
                optionInput.className = 'mr-3 text-purple-500 focus:ring-purple-500';

                const optionLabel = document.createElement('label');
                optionLabel.htmlFor = `q${question.id}-${option.id}`;
                optionLabel.className = 'text-gray-300 cursor-pointer flex-1';
                optionLabel.textContent = option.text;

                optionItem.appendChild(optionInput);
                optionItem.appendChild(optionLabel);
                optionsContainer.appendChild(optionItem);
            });

            // Assemble question card
            questionElement.appendChild(questionHeader);
            questionElement.appendChild(questionText);
            questionElement.appendChild(optionsContainer);

            // Add to container
            questionsContainer.appendChild(questionElement);
        });
    }

    // Set up timer
    const timerElement = document.getElementById('timer');
    let timeLeft = userData.practiceTest.timeLimit * 60; // Convert minutes to seconds
    let timerInterval;

    if (timerElement) {
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
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
                if (timerInterval) clearInterval(timerInterval);
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
        // Clear timer
        if (timerInterval) clearInterval(timerInterval);

        // Collect answers
        const answers = {};
        userData.practiceTest.questions.forEach(question => {
            const selectedOption = document.querySelector(`input[name="q${question.id}"]:checked`);
            answers[question.id] = selectedOption ? selectedOption.value : null;
        });

        // Calculate score
        let correctAnswers = 0;
        userData.practiceTest.questions.forEach(question => {
            if (answers[question.id] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / userData.practiceTest.questions.length) * 100);

        // Store test results in userData
        userData.testResults = {
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: userData.practiceTest.questions.length,
            subject: userData.practiceTest.subject
        };

        // Navigate to test results page
        navigateToPage('test-results');
    }
}

function initializeCurriculumImport() {
    const curriculumImportForm = document.getElementById('curriculumImportForm');
    const backToDashboardBtn = document.getElementById('backToDashboard');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Set up back button
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener('click', () => {
            navigateToPage('dashboard');
        });
    }

    if (curriculumImportForm) {
        curriculumImportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const curriculumFile = document.getElementById('curriculumFile').files[0];
            const curriculumSubject = document.getElementById('curriculumSubject').value;
            const curriculumYear = document.getElementById('curriculumYear').value;
            const studyPlanDuration = parseInt(document.getElementById('studyPlanDuration').value);
            const additionalNotes = document.getElementById('additionalNotes').value;

            if (!curriculumFile) {
                alert('Please select a curriculum file to upload');
                return;
            }

            if (!curriculumSubject) {
                alert('Please select a subject');
                return;
            }

            if (!curriculumYear) {
                alert('Please enter an academic year');
                return;
            }

            try {
                // Show loading indicator
                if (loadingIndicator) {
                    loadingIndicator.classList.remove('hidden');
                }

                // Hide form
                curriculumImportForm.classList.add('hidden');

                // Process curriculum data
                const curriculumData = {
                    fileName: curriculumFile.name,
                    subject: curriculumSubject,
                    year: curriculumYear
                };

                // Call Azure AI to process curriculum
                const processedCurriculum = await azureService.processCurriculum(curriculumData);

                // Generate study plan based on curriculum
                const studyPlan = await azureService.generateCurriculumStudyPlan(
                    processedCurriculum.fileName,
                    studyPlanDuration,
                    additionalNotes
                );

                // Store the study plan in user data
                userData.studyPlan = studyPlan;
                userData.currentSubject = studyPlan.subject;

                // Navigate to study plan page
                await navigateToPage('study-plan');
                updateStudyPlanView();

            } catch (error) {
                console.error('Error processing curriculum:', error);
                alert('There was an error processing your curriculum. Please try again.');

                // Show form again
                if (curriculumImportForm) {
                    curriculumImportForm.classList.remove('hidden');
                }

            } finally {
                // Hide loading indicator
                if (loadingIndicator) {
                    loadingIndicator.classList.add('hidden');
                }
            }
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

            // Validate form values
            if (!position || !experienceLevel || !interviewType) {
                alert('Please fill in all required fields');
                return;
            }

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
                // Show loading indicator
                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                loadingIndicator.innerHTML = `
                    <div class="bg-dark-200 p-4 rounded-lg shadow-lg text-center border border-purple-900/30">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-2"></div>
                        <p class="text-gray-300">Generating interview questions...</p>
                    </div>
                `;
                document.body.appendChild(loadingIndicator);

                // Generate interview questions
                await generateInterviewQuestions(interviewSetup);

                // Remove loading indicator
                document.body.removeChild(loadingIndicator);

                // Hide the interview setup section
                const setupSection = document.querySelector('.grid');
                if (setupSection) {
                    setupSection.classList.add('hidden');
                } else {
                    // Fallback if grid class is not found
                    const setupSections = document.querySelectorAll('.bg-dark-300, .bg-dark-400');
                    setupSections.forEach(section => {
                        if (section.contains(interviewSetupForm)) {
                            section.classList.add('hidden');
                        }
                    });
                }

                // Show interview session
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
        try {
            // Call Azure AI to generate interview questions
            const questions = await azureService.generateInterviewQuestions(interviewSetup);

            // Verify that questions were generated
            if (!questions || questions.length === 0) {
                throw new Error('No questions were generated');
            }

            return questions;
        } catch (error) {
            console.error('Error in generateInterviewQuestions:', error);
            throw new Error('Failed to generate interview questions. Please try again.');
        }
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
            <p class="text-lg font-medium text-gray-200">${azureService.interviewData.questions[currentQuestion].text}</p>
            <p class="text-sm text-gray-400 mt-2">Question type: ${azureService.interviewData.questions[currentQuestion].type}</p>
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
                    <div class="w-full bg-dark-500 rounded-full h-4">
                        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 h-4 rounded-full" style="width: ${feedback.score}%"></div>
                    </div>
                    <span class="ml-4 font-semibold text-gray-200">${feedback.score}%</span>
                </div>
            </div>

            <div class="mb-4">
                <h4 class="font-semibold mb-2 text-gray-200">Content</h4>
                <p class="text-gray-300">${feedback.content}</p>
            </div>

            <div class="mb-4">
                <h4 class="font-semibold mb-2 text-gray-200">Delivery</h4>
                <p class="text-gray-300">${feedback.delivery}</p>
            </div>

            <div class="mb-4">
                <h4 class="font-semibold mb-2 text-gray-200">Areas for Improvement</h4>
                <p class="text-gray-300">${feedback.improvement}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 class="font-semibold mb-2 text-gray-200">Strengths</h4>
                    <ul class="list-disc list-inside text-gray-300">
                        ${feedback.positives.map(positive => `<li>${positive}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-2 text-gray-200">Areas to Work On</h4>
                    <ul class="list-disc list-inside text-gray-300">
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
        const setupSection = document.querySelector('.grid');
        if (setupSection) {
            setupSection.classList.remove('hidden');
        } else {
            // Fallback if grid class is not found
            const setupSections = document.querySelectorAll('.bg-dark-300, .bg-dark-400');
            setupSections.forEach(section => {
                if (section.contains(interviewSetupForm)) {
                    section.classList.remove('hidden');
                }
            });
        }

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
                    skillElement.className = 'bg-dark-200 text-purple-400 px-2 py-1 rounded cursor-pointer hover:bg-dark-300 border border-purple-900/30 transition-all duration-300';
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
                    newDownloadBtn.addEventListener('click', async () => {
                        try {
                            // Get the CV content element
                            const cvContent = document.getElementById('cv-preview-content');

                            if (!cvContent) {
                                console.error('CV content element not found');
                                alert('There was an error generating your PDF. Please try again.');
                                return;
                            }

                            // Generate a filename based on the user's name
                            const userName = userData.cvData.personalInfo.fullName || 'CV';
                            const fileName = `${userName.replace(/\s+/g, '_')}_CV.pdf`;

                            // Generate and download the PDF
                            const success = await generatePDFFromHTML(cvContent, fileName);

                            if (success) {
                                // Close the modal only if PDF generation was successful
                                previewModal.classList.add('hidden');
                                previewModal.style.display = 'none';
                            }
                        } catch (error) {
                            console.error('Error downloading CV as PDF:', error);
                            alert('There was an error generating your PDF. Please try again.');
                        }
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
                // Generate CV HTML
                const cvHTML = await azureService.generateFullCV(cvData);

                // Create a temporary container to hold the CV HTML
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = cvHTML;
                tempContainer.style.padding = '20px';
                tempContainer.style.backgroundColor = 'white';
                tempContainer.style.color = 'black';

                // Temporarily append to the body but make it invisible
                tempContainer.style.position = 'absolute';
                tempContainer.style.left = '-9999px';
                document.body.appendChild(tempContainer);

                // Generate a filename based on the user's name
                const userName = userData.cvData.personalInfo.fullName || 'CV';
                const fileName = `${userName.replace(/\s+/g, '_')}_CV.pdf`;

                // Generate and download the PDF
                const success = await generatePDFFromHTML(tempContainer, fileName);

                // Remove the temporary container
                document.body.removeChild(tempContainer);

                if (success) {
                    alert('Your CV has been generated successfully and downloaded as a PDF!');

                    // Navigate back to career tools
                    navigateToPage('career-tools');
                }
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

        educationEntries.forEach((_, index) => {
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

        experienceEntries.forEach((_, index) => {
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

// Function to initialize the Profile page
function initializeProfile() {
    // Get DOM elements
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const profileInfoSection = document.getElementById('profile-info-section');
    const editProfileSection = document.getElementById('edit-profile-section');
    const editProfileForm = document.getElementById('edit-profile-form');
    const cancelEditProfileBtn = document.getElementById('cancel-edit-profile');
    const profileUpdateError = document.getElementById('profile-update-error');
    const profileUpdateSuccess = document.getElementById('profile-update-success');

    // Get current user
    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
        // If not authenticated, redirect to login
        navigateToPage('login');
        return;
    }

    // Update profile display with user data
    updateProfileDisplay(currentUser);

    // Handle edit profile button click
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // Hide profile info section and show edit profile section
            profileInfoSection.classList.add('hidden');
            editProfileSection.classList.remove('hidden');

            // Populate form with current user data
            const nameInput = document.getElementById('edit-name');
            if (nameInput && currentUser.user_metadata && currentUser.user_metadata.full_name) {
                nameInput.value = currentUser.user_metadata.full_name;
            } else if (nameInput) {
                // If no full_name in metadata, use a default or empty string
                nameInput.value = '';
            }
        });
    }

    // Handle logout button click
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                // Sign out
                const { success, error } = await authService.signOut();

                if (success) {
                    // Redirect to home page
                    navigateToPage('home');
                } else {
                    console.error('Logout error:', error);
                    alert('Failed to log out. Please try again.');
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        });
    }

    // Handle cancel edit profile button click
    if (cancelEditProfileBtn) {
        cancelEditProfileBtn.addEventListener('click', () => {
            // Hide edit profile section and show profile info section
            profileInfoSection.classList.remove('hidden');
            editProfileSection.classList.add('hidden');

            // Clear any error or success messages
            hideError(profileUpdateError);
            hideSuccess(profileUpdateSuccess);
        });
    }

    // Handle edit profile form submission
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('edit-name').value;

            // Simple validation
            if (!name) {
                showError(profileUpdateError, 'Please enter your name');
                return;
            }

            // Clear previous messages
            hideError(profileUpdateError);
            hideSuccess(profileUpdateSuccess);

            try {
                // Show loading state
                const submitButton = editProfileForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Saving...';
                submitButton.disabled = true;

                // Update profile with the new name
                const { success, error, data } = await authService.updateProfile({ full_name: name });

                if (success) {
                    // Show success message
                    showSuccess(profileUpdateSuccess, 'Profile updated successfully!');

                    // Force refresh the current user to get updated metadata
                    const updatedUser = data?.user || authService.getCurrentUser();

                    // Update profile display with the updated user data
                    updateProfileDisplay(updatedUser);

                    // Return to profile info after a short delay
                    setTimeout(() => {
                        profileInfoSection.classList.remove('hidden');
                        editProfileSection.classList.add('hidden');
                        hideSuccess(profileUpdateSuccess);
                    }, 2000);
                } else {
                    showError(profileUpdateError, error || 'Failed to update profile. Please try again.');
                }
            } catch (error) {
                console.error('Profile update error:', error);
                showError(profileUpdateError, 'An unexpected error occurred. Please try again.');
            } finally {
                // Reset button state
                const submitButton = editProfileForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Save Changes';
                submitButton.disabled = false;
            }
        });
    }



    // Helper function to update profile display
    function updateProfileDisplay(user) {
        if (!user) return;

        // Update profile initials
        const profileInitials = document.getElementById('profile-initials');
        if (profileInitials && user.user_metadata && user.user_metadata.full_name) {
            const name = user.user_metadata.full_name;
            const initials = name.split(' ')
                .map(part => part.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2);
            profileInitials.textContent = initials;
        }

        // Update profile name
        const profileName = document.getElementById('profile-name');
        if (profileName && user.user_metadata && user.user_metadata.full_name) {
            profileName.textContent = user.user_metadata.full_name;
        }

        // Update profile email
        const profileEmail = document.getElementById('profile-email');
        if (profileEmail && user.email) {
            profileEmail.textContent = user.email;
        }

        // Update display name
        const displayName = document.getElementById('display-name');
        if (displayName && user.user_metadata && user.user_metadata.full_name) {
            displayName.textContent = user.user_metadata.full_name;
        }

        // Update display email
        const displayEmail = document.getElementById('display-email');
        if (displayEmail && user.email) {
            displayEmail.textContent = user.email;
        }

        // Update joined date
        const displayJoined = document.getElementById('display-joined');
        if (displayJoined && user.created_at) {
            const joinedDate = new Date(user.created_at);
            displayJoined.textContent = joinedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    // Helper functions for showing/hiding error and success messages
    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        }
    }

    function hideError(element) {
        if (element) {
            element.textContent = '';
            element.classList.add('hidden');
        }
    }

    function showSuccess(element, message) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        }
    }

    function hideSuccess(element) {
        if (element) {
            element.textContent = '';
            element.classList.add('hidden');
        }
    }
}

// Function to initialize the Test Results page
function initializeTestResults() {
    const returnToDashboardBtn = document.getElementById('return-to-dashboard');
    const testSubject = document.getElementById('test-subject');
    const scoreBar = document.getElementById('score-bar');
    const scorePercentage = document.getElementById('score-percentage');
    const scoreText = document.getElementById('score-text');
    const feedbackText = document.getElementById('feedback-text');

    // Check if we have test results to display
    if (userData.testResults) {
        // Update subject
        if (testSubject) {
            testSubject.textContent = userData.testResults.subject || 'Unknown Subject';
        }

        // Update score bar and percentage
        if (scoreBar && scorePercentage) {
            const score = userData.testResults.score || 0;
            scoreBar.style.width = `${score}%`;
            scorePercentage.textContent = `${score}%`;
        }

        // Update score text
        if (scoreText) {
            const correctAnswers = userData.testResults.correctAnswers || 0;
            const totalQuestions = userData.testResults.totalQuestions || 0;
            scoreText.textContent = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;
        }

        // Update feedback text
        if (feedbackText) {
            const score = userData.testResults.score || 0;
            if (score >= 80) {
                feedbackText.textContent = 'Excellent work! You have a strong understanding of the material.';
            } else if (score >= 60) {
                feedbackText.textContent = 'Good job! You have a solid grasp of the material, but there\'s room for improvement.';
            } else {
                feedbackText.textContent = 'You might need more practice with this material. Review the topics and try again.';
            }
        }
    }

    // Set up return to dashboard button
    if (returnToDashboardBtn) {
        returnToDashboardBtn.addEventListener('click', () => {
            navigateToPage('dashboard');
        });
    }
}

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.getElementById('register-link');
    const registerForm = document.getElementById('register-form');
    const registerFormElement = document.getElementById('registerForm');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const passwordResetForm = document.getElementById('password-reset-form');
    const resetPasswordFormElement = document.getElementById('resetPasswordForm');
    const backToLoginLink = document.getElementById('back-to-login');
    const backToLoginFromResetLink = document.getElementById('back-to-login-from-reset');
    const loginContainer = document.getElementById('login-container');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const resetError = document.getElementById('reset-error');
    const resetSuccess = document.getElementById('reset-success');

    // Handle register link click
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.add('hidden');
            registerForm.classList.remove('hidden');
            passwordResetForm.classList.add('hidden');
        });
    }

    // Handle back to login link click
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.remove('hidden');
            registerForm.classList.add('hidden');
            passwordResetForm.classList.add('hidden');
        });
    }

    // Handle forgot password link click
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.add('hidden');
            registerForm.classList.add('hidden');
            passwordResetForm.classList.remove('hidden');
        });
    }

    // Handle back to login from reset link click
    if (backToLoginFromResetLink) {
        backToLoginFromResetLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginContainer.classList.remove('hidden');
            registerForm.classList.add('hidden');
            passwordResetForm.classList.add('hidden');
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simple validation
            if (!email || !password) {
                showError(loginError, 'Please enter both email and password');
                return;
            }

            // Clear previous errors
            hideError(loginError);

            try {
                // Show loading state
                const submitButton = loginForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Signing in...';
                submitButton.disabled = true;

                // Authenticate with Supabase
                const { success, error } = await authService.signIn(email, password);

                if (success) {
                    // Navigate to dashboard on successful login
                    navigateToPage('dashboard');
                } else {
                    showError(loginError, error || 'Failed to sign in. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                showError(loginError, 'An unexpected error occurred. Please try again.');
            } finally {
                // Reset button state
                const submitButton = loginForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Sign In';
                submitButton.disabled = false;
            }
        });
    }

    // Handle registration form submission
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            // Simple validation
            if (!name || !email || !password) {
                showError(registerError, 'Please fill in all required fields');
                return;
            }

            if (password !== confirmPassword) {
                showError(registerError, 'Passwords do not match');
                return;
            }

            if (password.length < 6) {
                showError(registerError, 'Password must be at least 6 characters');
                return;
            }

            // Clear previous errors
            hideError(registerError);

            try {
                // Show loading state
                const submitButton = registerFormElement.querySelector('button[type="submit"]');
                submitButton.textContent = 'Creating account...';
                submitButton.disabled = true;

                // Register with Supabase
                const { success, error } = await authService.signUp(email, password, { full_name: name });

                if (success) {
                    // Show success message and return to login
                    alert('Registration successful! Please check your email to confirm your account.');
                    loginContainer.classList.remove('hidden');
                    registerForm.classList.add('hidden');
                } else {
                    showError(registerError, error || 'Failed to create account. Please try again.');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showError(registerError, 'An unexpected error occurred. Please try again.');
            } finally {
                // Reset button state
                const submitButton = registerFormElement.querySelector('button[type="submit"]');
                submitButton.textContent = 'Create Account';
                submitButton.disabled = false;
            }
        });
    }

    // Handle password reset form submission
    if (resetPasswordFormElement) {
        resetPasswordFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('reset-email').value;

            // Simple validation
            if (!email) {
                showError(resetError, 'Please enter your email address');
                return;
            }

            // Clear previous errors and success messages
            hideError(resetError);
            hideSuccess(resetSuccess);

            try {
                // Show loading state
                const submitButton = resetPasswordFormElement.querySelector('button[type="submit"]');
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                // Send password reset email
                const { success, error } = await authService.resetPassword(email);

                if (success) {
                    // Show success message
                    showSuccess(resetSuccess, 'Password reset link sent! Please check your email.');
                    document.getElementById('reset-email').value = '';
                } else {
                    showError(resetError, error || 'Failed to send reset link. Please try again.');
                }
            } catch (error) {
                console.error('Password reset error:', error);
                showError(resetError, 'An unexpected error occurred. Please try again.');
            } finally {
                // Reset button state
                const submitButton = resetPasswordFormElement.querySelector('button[type="submit"]');
                submitButton.textContent = 'Send Reset Link';
                submitButton.disabled = false;
            }
        });
    }

    // Helper functions for showing/hiding error and success messages
    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        }
    }

    function hideError(element) {
        if (element) {
            element.textContent = '';
            element.classList.add('hidden');
        }
    }

    function showSuccess(element, message) {
        if (element) {
            element.textContent = message;
            element.classList.remove('hidden');
        }
    }

    function hideSuccess(element) {
        if (element) {
            element.textContent = '';
            element.classList.add('hidden');
        }
    }
}
