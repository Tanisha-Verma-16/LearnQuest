# AI-Powered Learning Platform

## Overview
Our AI-powered learning platform transforms online education into an engaging and dynamic experience with gamification, adaptive learning, and insightful analytics. Users can log in, track their course progress, earn points, and compete on the leaderboard with visually appealing animations.

---
![image](https://github.com/user-attachments/assets/14f2bdc8-fdc3-4016-bbe7-6e7c7206a091)


## Features

### 1️⃣ User Login & Authentication
- Dark-themed login page inspired by LeetCode.
- Floating label animation for input fields.
- Dummy authentication (username: `admin`).
- Skeleton loader effect before redirection.
- Stylish login button with hover and pulsating glow effect.

### 2️⃣ Profile Setup & Course Tracking
- **User Info Section:** Displays username, profile picture, and learning streak.
- **Course Status:**
  - Completed courses with green checkmarks.
  - Pending courses with animated progress bars.
  - AI-based recommended courses with a glowing effect.
- **Animated Tabs:** Smooth sliding transitions between 'Profile', 'Courses', and 'Leaderboard'.
- Uses JSON data to manage user profiles and course progress.

### 3️⃣ Graphical AI Insights Dashboard
- **Learning Streak Graph:** Displays consistency over the past 7 days.
- **Course Difficulty vs. Completion Rate:** Line chart representation.
- **Recommended Topics:** AI-based suggestions displayed in pill-shaped UI elements.
- Uses **Chart.js** or **Recharts** for visualization.
- Subtle entry animations for dynamic visualization.

### 4️⃣ Leaderboard with Smooth Animations
- **Dynamic ranking system** based on points earned.
- **Top 3 Highlight:** Gold, silver, and bronze glow effect for top ranks.
- **Your Rank Section:** Displays rank separately if not in the top 3.
- **Animated Score Update:** Smoothly increments score numbers with fade-in.
- **Entry Animation:** Uses **Framer Motion** or **GSAP** for transitions.

### 5️⃣ Reward System & Gamified Challenges
- Earn points for:
  - 50 points: Completing a course quiz.
  - 100 points: Playing 'Mystery Spin-the-Wheel' (animated reward spinner).
  - 250 points: Finishing a course.
  - 10 points: Maintaining a learning streak.
- Realistic spinning effect and confetti burst animation for major milestones.
- Live leaderboard updates when users earn points.

---

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Animations:** Framer Motion, GSAP
- **Charts & Graphs:** Chart.js, Recharts
- **Data Management:** JSON (Dummy Data)
- **Deployment:** Replit

---

## Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ai-learning-platform.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd ai-learning-platform
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the project:**
   ```bash
   npm start
   ```

---

## Contribution Guidelines
- Fork the repository and create a new branch.
- Follow the existing code structure and best practices.
- Submit a pull request with detailed descriptions of your changes.

---

## License
This project is licensed under the MIT License.

---

## Future Enhancements
- Integration with real authentication systems.
- AI-driven personalized course recommendations.
- Social learning features like discussion forums and peer challenges.

🚀 *Transforming learning into a fun and interactive experience!*

