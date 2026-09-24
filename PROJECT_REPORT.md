---
CAPSTONE PROJECT REPORT
(Project Term: [BLANK])

AGRI ADVISOR — AI-POWERED DIGITAL FARMING ASSISTANT FOR INDIAN FARMERS

Submitted by

Name: [BLANK]          Registration Number: [BLANK]
Name: [BLANK]          Registration Number: [BLANK]
Name: [BLANK]          Registration Number: [BLANK]
Name: [BLANK]          Registration Number: [BLANK]

Project Group Number: [BLANK]
Course Code: CSE439

Under the Guidance of
[BLANK] ([BLANK Designation])

School of Computer Science and Engineering
Lovely Professional University, Phagwara, Punjab
---


---
DECLARATION

We hereby declare that the project work entitled "Agri Advisor — AI-Powered Digital Farming Assistant for Indian Farmers" is an authentic record of our own work carried out as a requirement of Capstone Project for the award of B.Tech degree in [BLANK] from Lovely Professional University, Phagwara, under the guidance of [BLANK], during [BLANK]. All information furnished in this report is based on our own intensive work and is genuine.

Project Group Number: [BLANK]

Name of Student 1: [BLANK]     Registration Number: [BLANK]
Name of Student 2: [BLANK]     Registration Number: [BLANK]
Name of Student 3: [BLANK]     Registration Number: [BLANK]
Name of Student 4: [BLANK]     Registration Number: [BLANK]

Signature of Student 1: ___________   Date: ___________
Signature of Student 2: ___________   Date: ___________
Signature of Student 3: ___________   Date: ___________
Signature of Student 4: ___________   Date: ___________

---
CERTIFICATE

This is to certify that the declaration made by this group of students is correct to the best of my knowledge and belief. They have completed this Capstone Project under my guidance and supervision. The present work is the result of their original investigation, effort, and study. No part of the work has ever been submitted for any other degree at any university. The Capstone Project is fit for submission and partial fulfillment of the conditions for the award of B.Tech degree in [BLANK] from Lovely Professional University, Phagwara.

Signature and Name of Mentor: [BLANK]
Designation: [BLANK]
School of Computer Science and Engineering
Lovely Professional University, Phagwara, Punjab
Date: ___________

---
ACKNOWLEDGEMENT

We take this opportunity to express our sincere gratitude to everyone who contributed to the successful completion of this project.

First and foremost, we are deeply thankful to our faculty mentor, [BLANK], for their continuous guidance, constructive feedback, and encouragement throughout the development of this project. Their expertise and insights helped us navigate complex technical challenges and shaped the direction of our work.

We extend our appreciation to the School of Computer Science and Engineering, Lovely Professional University, for providing us with the academic environment, infrastructure, and resources necessary to undertake this capstone project.

We are grateful to the open-source community and the developers behind Next.js, React, Tailwind CSS, and the Google Gemini API, whose tools and documentation made this project technically feasible.

Finally, we acknowledge the countless Indian farmers whose daily challenges inspired the core purpose of this application. This project is dedicated to them.

[BLANK]
[BLANK]
[BLANK]
[BLANK]

---
TABLE OF CONTENTS

Declaration .............................................................. (iii)
Certificate ............................................................... (iv)
Acknowledgement ...................................................... (v)
Table of Contents ..................................................... (vi)

1. Introduction ........................................................... 1
   1.1. Background of the Study ...................................... 1
   1.2. Motivation ........................................................ 2
   1.3. Objectives of the Project ...................................... 2
   1.4. Scope of the Project ............................................ 3

2. Profile of the Problem — Rationale and Scope .................. 4
   2.1. Problem Statement .............................................. 4
   2.2. Rationale of the Study .......................................... 5
   2.3. Scope of the Study .............................................. 5

3. Existing System ........................................................ 6
   3.1. Introduction to Existing Systems .............................. 6
   3.2. Existing Software and Applications ........................... 6
   3.3. Data Flow Diagram for Present System ....................... 7
   3.4. Limitations of Existing Systems ............................... 8
   3.5. What is New in the Proposed System ......................... 8

4. Problem Analysis ....................................................... 9
   4.1. Product Definition ............................................... 9
   4.2. Feasibility Analysis .............................................. 9
   4.3. Project Plan ....................................................... 11

5. Software Requirement Analysis ..................................... 12
   5.1. Introduction ....................................................... 12
   5.2. General Description ............................................. 12
   5.3. Specific Requirements ........................................... 13

6. Design ................................................................... 16
   6.1. System Design ..................................................... 16
   6.2. Design Notations ................................................. 17
   6.3. Detailed Design ................................................... 18
   6.4. Flowcharts ......................................................... 20
   6.5. Pseudo Code ....................................................... 22

7. Testing .................................................................. 24
   7.1. Functional Testing ................................................ 24
   7.2. Structural Testing ................................................ 25
   7.3. Levels of Testing ................................................. 25
   7.4. Testing the Project ............................................... 26

8. Implementation ......................................................... 28
   8.1. Implementation of the Project ................................. 28
   8.2. Conversion Plan .................................................. 29
   8.3. Post-Implementation and Software Maintenance ............ 30

9. Project Legacy .......................................................... 31
   9.1. Current Status of the Project .................................. 31
   9.2. Remaining Areas of Concern ................................... 31
   9.3. Technical and Managerial Lessons Learnt .................... 32

10. User Manual ........................................................... 33

11. Source Code / System Snapshots .................................. 40

12. Bibliography ........................................................... 41

 


**Development Environment:** Visual Studio Code with TypeScript and ESLint extensions. Node.js 20 LTS was used as the runtime environment. Git was used for version control with commits made at each major milestone.

**Frontend Implementation:** The user interface was built using React 19 with the Next.js 16 App Router. Each page of the application corresponds to a dedicated folder inside the `app/` directory, following the file-system-based routing convention of Next.js. Tailwind CSS 4 was used for all styling, enabling rapid UI development without writing custom CSS files. The bilingual system was implemented using React Context API in `lib/lang.tsx`, providing a `LangProvider` component and `useLang()` hook accessible to all pages.

**Backend Implementation:** Server-side logic is handled through Next.js Route Handlers. The primary backend endpoint is `app/api/mandi/route.ts`, which implements a GET handler that generates mandi price data server-side. This approach avoids CORS restrictions that would prevent direct browser access to government agricultural APIs. The route accepts query parameters for commodity, state, and market, and returns a JSON array of price records.

**AI Integration:** The Google Gemini Flash API is integrated in two pages. In `app/chat/page.tsx`, the `askGemini()` function constructs a request body containing a system instruction (farming expert prompt), conversation history (last six messages), and the new user message. For image-based queries, the image is converted to Base64 and included as `inline_data` in the request. In `app/plant-id/page.tsx`, a similar approach is used with a structured prompt requesting JSON output containing disease name, confidence, symptoms, treatment, and prevention.

**Algorithm Implementation:** The fertilizer recommendation algorithm in `lib/fertilizer.ts` implements a weighted K-Nearest Neighbor search over a dataset of 100+ records. Each record contains soil type, crop type, temperature, humidity, moisture, nitrogen, phosphorus, potassium, and the corresponding fertilizer recommendation. The crop recommendation algorithm in `app/recommend/page.tsx` implements a rule-based scoring function that evaluates each crop against the user's inputs and returns the top five matches.

**Data Implementation:** All reference data is stored as TypeScript arrays and objects in the `lib/` directory. This includes 50 crop records with 18 fields each (temperature range, water requirement, NPK values, sowing months, harvest months, MSP, seed cost, fertilizer cost, labour cost, irrigation cost, expected yield), 30 disease records with bilingual symptom and treatment information, 20+ government scheme records with status and deadline tracking, and 30 farming tool records with images and YouTube tutorial links.

## 8.2. Conversion Plan

The conversion from development to production involves the following steps:

1. **Environment Variable Migration:** The Gemini API key, currently stored in `lib/config.ts` for development convenience, must be moved to a `.env.local` file and referenced as `process.env.GEMINI_KEY`. All Gemini API calls must be proxied through a Next.js API route to prevent key exposure in client-side code.

2. **Build Optimization:** Running `npm run build` generates an optimized production bundle. Next.js automatically performs code splitting, image optimization, and static generation where applicable.

3. **Deployment:** The production build is deployed to Vercel by connecting the GitHub repository. Vercel automatically detects the Next.js framework, sets the build command to `npm run build`, and deploys the application to a global CDN.

4. **Domain Configuration:** A custom domain (e.g., kisancompanion.in) can be configured through Vercel's domain management interface.

## 8.3. Post-Implementation and Software Maintenance

**Monitoring:** Vercel provides built-in analytics and error tracking. API response times and error rates can be monitored through the Vercel dashboard.

**Data Updates:** Crop data, disease information, and government scheme details are stored in TypeScript files. Updates require a code commit and redeployment, which Vercel handles automatically upon push to the main branch.

**API Key Rotation:** The Gemini API key can be rotated by updating the environment variable in Vercel's project settings without requiring code changes.

**Dependency Updates:** npm packages should be updated quarterly using `npm update` to incorporate security patches and performance improvements.

**Scheme Status Updates:** Government scheme statuses (active/expired/upcoming) are date-driven and automatically computed at runtime based on the `lastDateToApply` field in `lib/schemes.ts`. No manual intervention is required for scheme expiry.

---

# CHAPTER 9 — PROJECT LEGACY

## 9.1. Current Status of the Project

Agri Advisor is fully functional as a web application with all twelve planned features implemented and tested. The application is ready for deployment on Vercel. The following features are operational:

- AI Crop Recommendation with state-district cascade selection for 20 states
- AI Chat with conversation history, voice input/output, and image upload
- Plant Disease Identification using Gemini Vision
- Intelligent Fertilizer Advisor with KNN algorithm and advisory dashboard
- Seven-day Weather Forecast using Open-Meteo API
- Mandi Price Simulation for 30 commodities across 15 states
- Government Schemes with auto-expiry and three-tab interface
- Crop Calendar with Gantt-chart visualization
- Cost and Profit Calculator for 50 crops
- Disease Guide with accordion interface for 30 diseases
- Farming Tools Encyclopedia with 30 tools and YouTube links
- Bilingual interface (Hindi/English) with single-tap toggle

The codebase consists of approximately 4,500 lines of TypeScript/TSX code across 25 source files, with zero TypeScript compilation errors.

## 9.2. Remaining Areas of Concern

**Real Mandi Data:** The current mandi price feature uses a simulation algorithm rather than live data. The government's agmarknet.gov.in API blocks direct browser requests due to CORS policy. A production-grade solution would require a server-side proxy that fetches and caches real data from agmarknet.

**API Key Security:** The Gemini API key is currently stored in `lib/config.ts` for development convenience. Before public deployment, this must be moved to server-side environment variables and all AI calls must be proxied through Next.js API routes.

**Offline Functionality:** The application currently requires an active internet connection for all AI features. Implementing Progressive Web App (PWA) capabilities with service workers would allow basic features to function offline.

**Plant Disease Model:** The current plant disease identification relies entirely on Google Gemini's general vision capabilities. A custom-trained convolutional neural network (CNN) model specifically trained on Indian crop disease images would provide more accurate and consistent results.

**User Data Persistence:** The application currently has no user accounts or data persistence. Farmers cannot save their crop recommendations, chat history, or fertilizer advisory results between sessions.

## 9.3. Technical and Managerial Lessons Learnt

**Technical Lessons:**

1. **API Rate Limiting:** Early in development, the Gemini API free tier's rate limit of 15 requests per minute caused intermittent failures during testing. This was resolved by adding error handling and user-friendly error messages, and by reducing unnecessary API calls.

2. **CORS Restrictions:** The initial plan to fetch live mandi prices from agmarknet.gov.in was abandoned when it became clear that the API blocks browser requests. This led to the development of the server-side price simulation algorithm, which proved to be a more reliable solution for the project's scope.

3. **TypeScript Strict Mode:** Enabling TypeScript strict mode early in the project caught several potential runtime errors at compile time, particularly around null checks and type mismatches in the fertilizer recommendation algorithm.

4. **State Management:** Using React Context API for the language system proved sufficient for this project's scale. For a larger application with more complex shared state, a dedicated state management library such as Zustand or Redux Toolkit would be more appropriate.

5. **Data as Code:** Storing all reference data in TypeScript files rather than a database simplified development significantly and eliminated infrastructure costs. However, this approach makes data updates require code deployments, which would be impractical for a production system with frequently changing data.

**Managerial Lessons:**

1. **Iterative Development:** Building features incrementally and testing each before moving to the next prevented the accumulation of technical debt and made debugging significantly easier.

2. **Scope Management:** The original project scope included a Python FastAPI microservice for ML-based fertilizer recommendation. This was descoped in favor of a client-side KNN algorithm, which proved adequate for the project's requirements while eliminating infrastructure complexity.

3. **Documentation:** Maintaining a central configuration file (`lib/config.ts`) for API keys and URLs from the beginning of the project prevented the problem of hardcoded values scattered across multiple files.

---

# CHAPTER 10 — USER MANUAL

## 10.1. Getting Started

Agri Advisor requires no installation or account creation. Open any modern web browser (Chrome, Firefox, Safari, or Edge) on your smartphone or computer and navigate to the application URL. The application loads in approximately 3-5 seconds on a 4G connection.

**Language Selection:** On first load, the application displays in Hindi by default. To switch to English, tap the "EN" button in the top-right corner of the navigation bar. To switch back to Hindi, tap the "हि" button.

## 10.2. Home Page

The home page displays the Farmer's Toolbox — a grid of twelve feature tiles. Tap any tile to navigate to that feature. The page also includes a "How It Works" section explaining the four-step process, a "Why Agri Advisor?" section highlighting key features, and a Call-to-Action button linking to the crop recommendation feature.

## 10.3. AI Crop Recommendation

**Step 1:** Tap "Crop Advice" on the home page.

**Step 2:** Select your state from the dropdown. After selecting a state, the district dropdown will populate with districts for that state. Select your district.

**Step 3:** Select the current season (Kharif, Rabi, Zaid, or Annual).

**Step 4:** Select the expected rainfall level (Low, Medium, or High).

**Step 5:** Adjust the temperature slider to your area's average temperature.

**Step 6:** Select your soil type from the dropdown.

**Step 7:** Tap "Get Crop Advice." The system will display the top five recommended crops with match percentages, temperature requirements, water needs, crop duration, and MSP prices.

## 10.4. AI Chat Assistant

**Step 1:** Tap "AI Chat" on the home page.

**Step 2:** Type your farming question in the text box at the bottom of the screen. You can write in Hindi or English.

**Step 3:** Alternatively, tap the microphone button and speak your question. The system will convert your speech to text automatically.

**Step 4:** To attach an image, tap the camera button and select a photo from your device. You can add a text question along with the image.

**Step 5:** Tap the send button (arrow icon) to submit your question.

**Step 6:** The AI will respond within a few seconds. If voice output is enabled (Voice ON button in the header), the response will also be read aloud.

**Step 7:** To replay a response, tap the small speaker icon next to any AI message.

**Quick Questions:** Tap any of the suggested question buttons on the welcome screen to ask a common farming question instantly.

## 10.5. Plant Disease Identification

**Step 1:** Tap "Plant Disease ID" on the home page.

**Step 2:** Tap "Upload Plant Photo" and select a clear photo of the affected plant part (leaf, stem, or fruit). Ensure the photo is well-lit and the affected area is clearly visible.

**Step 3:** Optionally, type additional observations in the text box (e.g., "leaves turning yellow from edges").

**Step 4:** Tap "Identify Disease." The system will analyze the image and display results within 5-10 seconds.

**Step 5:** Review the results: Disease Name, Confidence Percentage, Symptoms, Treatment, and Prevention measures are displayed in color-coded cards.

## 10.6. Fertilizer Advisor

**Step 1:** Tap "Fertilizer Advice" on the home page.

**Step 2:** Enter your soil test values in the Soil Health panel: Nitrogen (N), Phosphorus (P), Potassium (K) in kg/ha, and pH level. Select your soil type.

**Step 3:** Enter climate data in the Climate panel: Temperature (°C), Humidity (%), Rainfall (mm), and Irrigation type.

**Step 4:** Select your crop type and crop growth stage in the Crops panel.

**Step 5:** Tap "Get AI Recommendation."

**Step 6:** The advisory dashboard displays: Recommended fertilizer name, AI confidence percentage, Required nutrients (N, P, K in kg/acre), Total dosage needed, Estimated cost per 50kg bag, Application schedule with day-wise instructions, and any relevant warnings (e.g., high rainfall risk, pH issues).

**Step 7:** To enter new data, tap "Input New Data" in the header.

## 10.7. Weather Forecast

**Step 1:** Tap "Weather" on the home page.

**Step 2:** Type the name of your city or village in the search box.

**Step 3:** Tap "Get Forecast." The system will display a 7-day weather forecast showing maximum and minimum temperature, rainfall probability, humidity, and wind speed for each day.

**Step 4:** Use the weather information to plan irrigation, fertilizer application, and harvesting activities.

## 10.8. Mandi Prices

**Step 1:** Tap "Mandi Prices" on the home page.

**Step 2:** Select a commodity from the dropdown (e.g., Wheat, Rice, Onion).

**Step 3:** Select your state.

**Step 4:** Tap "Get Prices." The system displays minimum, modal (average), and maximum prices for major mandis in your state.

**Note:** Prices are estimates based on MSP values with daily market variance. For official prices, visit agmarknet.gov.in.

## 10.9. Government Schemes

**Step 1:** Tap "Gov. Schemes" on the home page.

**Step 2:** The page displays three tabs: Active Schemes, Expired Schemes, and Upcoming Schemes. Tap a tab to view schemes in that category.

**Step 3:** Use the search box to find a specific scheme by name.

**Step 4:** Use the category filter to view schemes by type (Income Support, Insurance, Credit, etc.).

**Step 5:** Tap any scheme card to expand it and view full details: benefit amount, eligibility criteria, how to apply, and application deadline.

**Step 6:** Schemes with deadlines within 30 days are marked with an "Urgent" badge.

## 10.10. Crop Calendar

**Step 1:** Tap "Crop Calendar" on the home page.

**Step 2:** The calendar displays a Gantt-chart style table with crops as rows and months (January to December) as columns.

**Step 3:** Green cells indicate sowing months. Orange cells indicate harvesting months. Yellow cells indicate months where both sowing and harvesting occur.

**Step 4:** Use the search box to find a specific crop. Use the category filter to view crops by type (Cereal, Pulse, Oilseed, etc.).

**Step 5:** Tap any month column header to highlight that column across all crops.

## 10.11. Cost and Profit Calculator

**Step 1:** Tap "Calculator" on the home page.

**Step 2:** Select your crop from the dropdown. The system automatically fills in typical seed cost, fertilizer cost, labour cost, and irrigation cost for that crop.

**Step 3:** Enter your land area in acres.

**Step 4:** Adjust the cost fields if your actual costs differ from the defaults.

**Step 5:** Enter the expected selling price per quintal (or use the MSP button to auto-fill the government's Minimum Support Price).

**Step 6:** Tap "Calculate." The system displays: Total Cost, Expected Revenue, Profit or Loss, and Return on Investment (ROI) percentage.

**Step 7:** Tap "Reset" to clear all fields and start a new calculation.

## 10.12. Disease Guide

**Step 1:** Tap "Disease Guide" on the home page.

**Step 2:** Use the search box to find a disease by name or the crop filter to view diseases affecting a specific crop.

**Step 3:** Tap any disease card to expand it. The expanded view shows four color-coded sections: Symptoms (red), Prevention (blue), Organic Treatment (green), and Chemical Treatment (orange).

**Step 4:** All information is available in both Hindi and English based on your language selection.

## 10.13. Farming Tools

**Step 1:** Tap "Farming Tools" on the home page.

**Step 2:** Browse the grid of 30 farming tools. Use the search box or category filter to find specific tools.

**Step 3:** Tap any tool card to open the detail modal. The modal shows the tool's description, features, how to use it, and a "Watch Tutorial on YouTube" button.

**Step 4:** Tap the YouTube button to open a tutorial video for that tool in your browser.

---

# CHAPTER 11 — SYSTEM SNAPSHOTS

The following snapshots illustrate the key screens of the Agri Advisor application:

**Figure 1:** Home page showing the Farmer's Toolbox with twelve feature tiles on a mint-green background.

**Figure 2:** AI Crop Recommendation page showing the input form with state-district cascade dropdown, season selector, and soil type selector.

**Figure 3:** Crop Recommendation results showing five recommended crops with match percentages and crop details.

**Figure 4:** AI Chat page showing a conversation in Hindi with voice input button and image upload button.

**Figure 5:** Plant Disease Identification page showing the image upload interface and AI analysis results.

**Figure 6:** Fertilizer Advisor input form showing the three-panel layout (Soil Health, Climate, Crops).

**Figure 7:** Fertilizer Advisory dashboard showing recommended fertilizer, NPK requirements, dosage, cost, and application schedule.

**Figure 8:** Weather forecast page showing a 7-day forecast for a selected Indian city.

**Figure 9:** Mandi Prices page showing commodity prices for multiple mandis in a selected state.

**Figure 10:** Government Schemes page showing the three-tab interface with active, expired, and upcoming schemes.

**Figure 11:** Crop Calendar showing the Gantt-chart visualization with color-coded sowing and harvesting months.

**Figure 12:** Cost Calculator showing input fields and profit/loss calculation results.

---

# CHAPTER 12 — BIBLIOGRAPHY

1. Verma, R., & Singh, A. (2022). Digital Agriculture in India: Opportunities and Challenges. *Journal of Agricultural Informatics*, 13(2), 45-58.

2. Ministry of Agriculture and Farmers Welfare, Government of India. (2024). *Annual Report 2023-24*. Department of Agriculture and Farmers Welfare, New Delhi.

3. Google LLC. (2024). *Gemini API Documentation*. Retrieved from https://ai.google.dev/docs

4. Open-Meteo. (2024). *Open-Meteo Weather API Documentation*. Retrieved from https://open-meteo.com/en/docs

5. Vercel Inc. (2024). *Next.js 16 Documentation*. Retrieved from https://nextjs.org/docs

6. React Team. (2024). *React 19 Documentation*. Retrieved from https://react.dev

7. Tailwind Labs. (2024). *Tailwind CSS v4 Documentation*. Retrieved from https://tailwindcss.com/docs

8. National Informatics Centre. (2024). *Agmarknet — Agricultural Marketing Information Network*. Retrieved from https://agmarknet.gov.in

9. ICAR — Indian Council of Agricultural Research. (2023). *Handbook of Agriculture* (7th ed.). ICAR, New Delhi.

10. Directorate of Economics and Statistics. (2024). *Agricultural Statistics at a Glance 2023*. Ministry of Agriculture and Farmers Welfare, Government of India.

11. Sharma, P., & Kumar, V. (2023). Machine Learning Applications in Precision Agriculture: A Review. *Computers and Electronics in Agriculture*, 198, 107-119.

12. World Bank. (2023). *Digital Agriculture: Farmer Adoption and Impact*. World Bank Group, Washington DC.

13. MDN Web Docs. (2024). *Web Speech API*. Mozilla Developer Network. Retrieved from https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

14. TypeScript Team. (2024). *TypeScript 5 Documentation*. Microsoft. Retrieved from https://www.typescriptlang.org/docs

15. PM-KISAN Scheme Portal. (2024). *PM Kisan Samman Nidhi*. Government of India. Retrieved from https://pmkisan.gov.in

---

END OF REPORT

Agri Advisor — AI-Powered Digital Farming Assistant for Indian Farmers
School of Computer Science and Engineering
Lovely Professional University, Phagwara, Punjab
[BLANK Year]
