# PlanAI - AI-Powered Educational Planning Assistant

<div align="center">
  <p><em>Your personalized AI companion for educational success</em></p>
</div>

## 📚 Overview

PlanAI is a sophisticated, AI-powered educational planning platform designed to revolutionize how students organize their studies, prepare for examinations, and plan their educational journey. By leveraging cutting-edge artificial intelligence technologies, PlanAI provides personalized assistance tailored to each student's unique learning style, strengths, weaknesses, and educational goals.

Our mission is to democratize access to high-quality educational planning and resources, making personalized learning accessible to students worldwide regardless of their socioeconomic background or geographical location.

## ✨ Key Features

### 🎯 Personalized Study Plans
- **AI-Generated Learning Paths**: Submit your test results for comprehensive AI analysis
- **Adaptive Learning Algorithms**: Receive customized study plans that adapt to your progress
- **Weakness Identification**: Pinpoint specific areas needing improvement based on test performance
- **Strength Reinforcement**: Build upon your existing knowledge foundations
- **Time Management Optimization**: Get realistic study schedules based on your availability and learning pace

### 📝 Practice Test Generation
- **Curriculum-Aligned Tests**: Generate practice tests perfectly aligned with your specific curriculum
- **Difficulty Progression**: Adaptive difficulty levels that increase as your proficiency improves
- **Question Variety**: Multiple question formats including multiple-choice, short answer, and essay prompts
- **Real-Time Feedback**: Immediate assessment and explanations for incorrect answers
- **Performance Analytics**: Track your improvement over time with detailed metrics

### 📋 Curriculum Import
- **Seamless Integration**: Import your school or university curriculum with ease
- **Format Flexibility**: Support for various file formats including PDF, DOCX, and CSV
- **Intelligent Parsing**: Automatic extraction of key topics, learning objectives, and assessment criteria
- **Custom Curriculum Builder**: Create and modify curriculum elements to suit your needs
- **Resource Recommendations**: Get suggested learning materials based on your curriculum

### 💼 Career Tools
- **AI-Powered CV Builder**: Create professional, ATS-optimized resumes tailored to your target industry
- **Interview Preparation**: Practice with simulated technical interviews specific to your field
- **Skill Gap Analysis**: Identify skills needed for your desired career path
- **Job Market Insights**: Receive up-to-date information on industry trends and requirements
- **Career Path Visualization**: Map potential career trajectories based on your educational background

### 🔐 Secure Authentication
- **Supabase Integration**: Robust user authentication and data storage
- **Profile Management**: Personalized user profiles with customizable settings
- **Data Privacy**: End-to-end encryption for all sensitive information
- **Cross-Device Synchronization**: Access your data securely from any device
- **Role-Based Access Control**: Different permission levels for students, educators, and administrators

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup for improved accessibility and SEO
- **Tailwind CSS**: Utility-first CSS framework for responsive, modern UI design
- **JavaScript (ES6+)**: Modern JavaScript for interactive user experiences
- **Component-Based Architecture**: Modular design for maintainability and scalability

### Backend & Authentication
- **Supabase**: Open-source Firebase alternative providing:
  - User authentication with email/password
  - PostgreSQL database for data storage
  - Row-level security for data protection
  - Real-time subscriptions

### AI Integration
- **Azure AI Services**: Powering the intelligent features of PlanAI:
  - Natural Language Processing for curriculum analysis
  - Machine Learning for personalized recommendations
  - Cognitive Services for content generation
  - Custom AI models for educational assessment

### Development & Deployment
- **Version Control**: Git for source code management
- **Development Server**: Python's built-in HTTP server for local development
- **Responsive Design**: Mobile-first approach ensuring compatibility across all devices
- **Progressive Web App (PWA)**: Installable on devices with offline capabilities

## 🗂️ Project Structure

```
PlanAI/
├── components/                  # HTML components for different pages
│   ├── career-tools.html        # Career development tools interface
│   ├── curriculum-import.html   # Curriculum import functionality
│   ├── dashboard.html           # User dashboard with overview and metrics
│   ├── login.html               # Authentication interface
│   ├── practice-test.html       # Practice test environment
│   ├── profile.html             # User profile management
│   ├── study-plan.html          # Personalized study plan view
│   ├── test-submission.html     # Test submission and analysis interface
│   ├── cv-builder.html          # CV creation and editing tool
│   └── interview-prep.html      # Interview preparation module
│
├── js/                          # JavaScript files
│   ├── azure-services.js        # Azure AI integration services
│   ├── auth-service.js          # Authentication service using Supabase
│   ├── supabase-client.js       # Supabase client configuration
│   ├── pdf-utils.js             # PDF generation utilities
│   └── main.js                  # Main application logic and routing
│
├── styles/                      # CSS styles
│   └── main.css                 # Global styles and Tailwind utilities
│
├── assets/                      # Static assets
│   ├── images/                  # Images and icons
│   └── fonts/                   # Custom font files
│
├── index.html                   # Main HTML entry point
├── README.md                    # Project documentation
└── LICENSE                      # MIT License
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic understanding of web technologies
- Node.js and npm (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PeterBredell/PlanAI.git
   cd PlanAI
   ```

2. **Configure Supabase (for development)**
   - Create a Supabase account at [supabase.com](https://supabase.com)
   - Create a new project and note your project URL and anon key
   - Update the Supabase configuration in `js/supabase-client.js`
   - Run the SQL scripts in the Supabase SQL editor to set up the database schema

3. **Start a local development server**
   ```bash
   # Using Python's built-in HTTP server
   python -m http.server 8000

   # OR using Node.js with http-server (if installed)
   npx http-server -p 8000
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Register a new account or use the demo credentials

### Usage Guide

1. **Account Creation and Login**
   - Register with your email and password
   - Verify your email address through the confirmation link
   - Log in to access your personalized dashboard

2. **Setting Up Your Profile**
   - Complete your profile information
   - Set your educational goals and preferences
   - Specify your available study time and schedule

3. **Importing Your Curriculum**
   - Navigate to the Curriculum Import page
   - Upload your curriculum documents or select from our database
   - Review the extracted topics and learning objectives

4. **Submitting Test Results**
   - Go to the Test Submission page
   - Upload your completed test or exam
   - Provide additional context about the test if needed
   - Submit for AI analysis

5. **Using Your Study Plan**
   - Access your personalized study plan from the dashboard
   - Review the recommended topics and resources
   - Track your progress as you complete study sessions
   - Update your plan as needed based on new test results

6. **Taking Practice Tests**
   - Navigate to the Practice Test section
   - Select the subject and difficulty level
   - Complete the test within the allocated time
   - Review your results and explanations for incorrect answers

7. **Using Career Tools**
   - Build your CV using the AI-powered CV builder
   - Practice for interviews with the interview preparation module
   - Analyze your skills and identify areas for improvement
   - Explore potential career paths based on your education

## 📊 Data Model

### User Management
- **Users**: Authentication and profile information
- **Profiles**: Extended user information and preferences
- **Settings**: User-specific application settings

### Educational Content
- **Study Plans**: Personalized learning paths
- **Weekly Plans**: Detailed weekly study schedules
- **Daily Tasks**: Specific learning activities
- **Test Submissions**: Uploaded test results and analysis
- **Curriculum Imports**: Imported educational curricula
- **Practice Tests**: Generated tests and user responses

### Career Development
- **User CVs**: Resume data and formatting preferences
- **Interview Preparations**: Practice interview questions and responses
- **Skill Assessments**: User skill evaluations and recommendations

## 🔒 Security Features

- **Authentication**: Secure email/password authentication via Supabase
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Row-Level Security**: Database policies ensuring users can only access their own data
- **Input Validation**: Comprehensive validation to prevent injection attacks
- **Session Management**: Secure handling of user sessions with automatic expiration
- **CORS Configuration**: Properly configured Cross-Origin Resource Sharing
- **Content Security Policy**: Protection against XSS and data injection attacks

## 🧪 Testing

### Manual Testing Procedures
1. **Functionality Testing**: Verify all features work as expected
2. **Usability Testing**: Ensure intuitive user experience across different user types
3. **Compatibility Testing**: Check functionality across browsers and devices
4. **Performance Testing**: Evaluate loading times and resource usage
5. **Security Testing**: Validate authentication and data protection measures

### Automated Testing (Future Implementation)
- Unit tests for JavaScript functions
- Integration tests for component interactions
- End-to-end tests for critical user flows
- Accessibility tests for WCAG compliance

## 🔄 Continuous Improvement

PlanAI follows an iterative development approach with regular updates based on:
- User feedback and feature requests
- Educational research and best practices
- Advancements in AI and machine learning technologies
- Performance metrics and usage patterns
- Security enhancements and vulnerability patching

## 🔮 Future Enhancements

### Short-term Roadmap (3-6 months)
- **Enhanced Analytics Dashboard**: Detailed insights into learning patterns and progress
- **Collaborative Study Groups**: Create and join study groups with peers
- **Content Recommendation Engine**: AI-powered learning resource suggestions
- **Offline Mode**: Full functionality without internet connection
- **Dark/Light Theme Toggle**: User interface appearance preferences

### Long-term Vision (6-12 months)
- **Mobile Applications**: Native iOS and Android apps
- **Integration with LMS Platforms**: Connect with popular Learning Management Systems
- **AI Tutoring**: Interactive AI tutoring sessions for difficult concepts
- **Gamification Elements**: Achievement badges, streaks, and rewards
- **Parent/Teacher Portal**: Monitoring and guidance tools for educators and parents
- **Blockchain Credentials**: Verifiable educational achievements and certifications

### Research Initiatives
- **Learning Pattern Analysis**: Research into effective study techniques
- **Predictive Performance Models**: AI models to predict academic performance
- **Personalization Algorithms**: Advanced algorithms for learning style adaptation
- **Educational Equity**: Tools to address disparities in educational access


<div align="center">
  <p>Made with ❤️ by the PlanAI Team</p>
  <p>© 2025 PlanAI. All rights reserved.</p>
</div>
