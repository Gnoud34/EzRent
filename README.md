Project Management / EzRent
This project is developed by Nguyen Tuan Duong and associates, focusing on building a
modern management application or landing page using React and Vite.
📌 GitHub Team Workflow Rules
To ensure code consistency and prevent conflicts, all members must adhere to the following
workflow:
1. Branch Management
● DO NOT commit directly to the main branch.
● Every new feature or bug fix must be implemented on a separate branch:
○ Branch naming convention: feature/feature-name or fix/bug-name.
○ Example: feature/login-page, feature/navigation-bar.
2. Safe Merge Process
Before merging your branch into main, follow these steps to avoid overwriting others' work:
1. Update Latest Main:
git checkout main
git pull origin main
2. Merge Main into your Branch:
git checkout feature/your-feature-name
git merge main(If conflicts occur, open VS Code to resolve them before proceeding).
3. Push and Create Pull Request (PR): Push your branch to GitHub and create a PR for
peer review before final merging into main.
🚀 Setup and Clone Instructions
Follow these steps to set up the project locally:
Step 1: Clone the Project
Open your terminal and run:
git clone [YOUR_REPOSITORY_URL]
Step 2: Navigate to Project Directory
cd [PROJECT_DIRECTORY_NAME]
Step 3: Install Dependencies

npm install
Step 4: Run the Project
npm run dev
Then access http://localhost:5173 in your browser.
🛠 Tech Stack
● Frontend: React, TypeScript, Vite
● Source Control: Git & GitHub
Note: Always verify your .gitignore file to ensure node_modules is not uploaded to GitHub.