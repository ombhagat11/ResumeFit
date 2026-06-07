# ResumeFit AI Career Copilot

Production-ready MERN SaaS platform for resume/JD matching, ATS analysis, resume rewriting, interview preparation, roadmap generation, recruiter simulation, and project/certification recommendations.

## Architecture

```txt
Backend/src
  app.js                    Express app, CORS, security headers, rate limiting
  server.js                 API bootstrap
  controllers/              Auth and career analysis controllers
  middlewares/              Auth, upload, security, error handling
  models/                   User, Resume, JobDescription, Analysis, InterviewPreparation, Roadmap
  routes/                   /api/auth and /api/analyses routes
  services/geminiService.js Gemini structured JSON prompt, retries, fallback analyzer
  utils/                    Async handler, API errors, PDF parser
Frontend/src
  components/               SaaS UI cards, upload, charts, keyword table, timeline
  layouts/                  Dashboard shell with navbar/sidebar
  pages/                    Landing, dashboard, analysis, results, improvement, interview, roadmap
  features/auth             JWT cookie auth context and pages
  features/analysis         Analysis API client and export helpers
```

## Environment

### Backend `.env`

```env
PORT=3000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/resumefit
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_GENAI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.0-flash
MAX_UPLOAD_BYTES=6291456
RATE_LIMIT_MAX=180
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:3000
```

## Install and run

```bash
cd Backend && npm install
npm run dev
```

```bash
cd Frontend && npm install
npm run dev
```

> The API supports text-only analysis when upload dependencies are not installed. PDF upload requires `multer` and `pdf-parse` in `Backend/package.json`.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/get-me`
- `GET /api/health`
- `POST /api/analyses/resume-upload` multipart/text fields: `resumePdf`, `resumeText`
- `POST /api/analyses/job-description-upload` multipart/text fields: `jobDescriptionPdf`, `jobDescriptionText`, `targetRole`, `company`
- `POST /api/analyses` multipart/text fields: `resumePdf`, `jobDescriptionPdf`, `resumeText`, `jobDescriptionText`, `targetRole`, `experienceLevel`
- `GET /api/analyses`
- `GET /api/analyses/:id`
- `GET /api/analyses/:id/ats-score`
- `GET /api/analyses/:id/resume-optimization`
- `GET /api/analyses/:id/interview-preparation`
- `GET /api/analyses/:id/learning-roadmap`

## Production readiness checklist

- Gemini responses are normalized and runtime-validated before persistence.
- Text-only analysis works without upload dependencies; multipart PDF upload requires `multer` and `pdf-parse`.
- Analysis history is persisted by user and linked to Resume, JobDescription, InterviewPreparation, and Roadmap records.
- Optimized resume export generates a real browser-side PDF blob.
- Backend includes security headers, credentialed CORS, request size limits, rate limiting, and centralized error handling.

## Deployment

1. Deploy MongoDB Atlas and set `MONGO_URI`.
2. Deploy Backend to Render/Fly/Railway with Node 20+, environment variables above, and `npm start` or `node server.js`.
3. Deploy Frontend to Vercel/Netlify with `VITE_API_URL` pointing to the backend origin.
4. Set `CLIENT_URL` to the deployed frontend URL for credentialed CORS.
5. Use HTTPS in production so auth cookies are sent with `secure: true`.
