# PlanAI - Educational Planning Assistant

PlanAI is an AI-powered educational planning application designed to help students organize their studies, prepare for tests, and plan their educational journey with personalized assistance.

## Features

- **Personalized Study Plans**: Submit your tests and receive AI-generated study plans tailored to improve your scores.
- **Practice Test Generation**: Generate practice tests based on your curriculum to prepare for upcoming exams.
- **Curriculum Import**: Import your curriculum to customize your learning experience.
- **Career Tools**: Build your CV and practice for technical interviews with AI-powered tools.

## Technology Stack

- **Frontend**: HTML, Tailwind CSS, JavaScript
- **AI Integration**: Microsoft Co-Pilot (personality) and Azure AI services
- **Deployment**: Static web hosting with Python's built-in HTTP server (for development)

## Project Structure

```
PlanAI/
├── components/           # HTML components for different pages
│   ├── career-tools.html
│   ├── curriculum-import.html
│   ├── dashboard.html
│   ├── login.html
│   ├── practice-test.html
│   ├── study-plan.html
│   └── test-submission.html
├── js/                   # JavaScript files
│   ├── azure-services.js # Azure AI integration
│   └── main.js           # Main application logic
├── styles/               # CSS styles
│   └── main.css
└── index.html            # Main HTML file
```

## Getting Started

1. Clone the repository
2. Start a local web server:
   ```
   python -m http.server 8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

## Future Enhancements

- User authentication with Azure AD
- Real-time feedback on practice tests
- Mobile application
- Integration with school management systems
- Advanced analytics for tracking progress

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
