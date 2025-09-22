# GitHub Repository Scoring API

A **NestJS backend service** that fetches GitHub repositories using the GitHub Search API and calculates a **custom popularity score** based on stars, forks, and recency of updates.

---

## 🚀 Project Overview

The objective of this project is to implement a backend application for scoring repositories on GitHub. Users can filter repositories by:

- Creation date (`createdAfter`)
- Programming language (`language`)

A **scoring algorithm** computes a popularity score for each repository based on:

- Stars
- Forks
- Recency of last update

This API allows developers to quickly find trending or high-impact repositories based on these metrics.

---

## ⚙️ Features

- Fetch repositories from GitHub with filters for:
  - `createdAfter` date
  - Programming `language`
- Returns a maximum of 100 repositories per request (GitHub Search API limitation)
- Compute a **custom popularity score**
- REST API endpoint returning repository metadata along with computed scores
- Runtime validation using DTOs
- Unit tests for services and controllers

---

## 🛠 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/umer0501/git-score
cd git-score
npm install
```

## ⚙️ Environment Setup

Before running the project, rename the environment example file:

```env
mv .env.example .env
```

## ⚙️ Configuration
The popularity score calculation uses a constants file that defines the weights for different factors.  
You can modify these values to change how the score is computed.

**File:** `src/constants/score-weights.ts`  
```ts
export const SCORE_WEIGHTS = {
  stars: 0.7,       // Weight for stars count
  forks: 0.3,       // Weight for forks count
  popularity: 0.8,  // Weight for popularity factor
  recency: 20,      // Weight for recency factor
} as const;
```
📌 Note: Adjust the numbers according to your scoring preference.
For example, increasing stars will make repositories with more stars rank higher.

## 🚀 Run and Test

Start the development server:

```bash
npm run start:dev
```

Run unit tests:

```bash
npm run test
```

## 📝 API Endpoints

### Get Repositories Score

**Endpoint: `GET /git-score/repositories/score`**  


**Query Parameters:**

| Parameter     | Type   | Description                                           |
|---------------|--------|-------------------------------------------------------|
| createdAfter  | string | Required:Fetch repositories created after this date (YYYY-MM-DD) |
| language      | string | Required:Filter repositories by programming language          |

**Example Request (HTTP):**

```http
GET /git-score/repositories/score?createdAfter=2025-01-01&language=Javascript HTTP/1.1
Host: localhost:3000

curl "http://localhost:3000/git-score/repositories/score?createdAfter=2025-01-01&language=Javascript"

```

**Example Response (JSON):**

The API returns a maximum of 100 repositories per request with their computed popularity scores.
```json
{
  "success": true,
  "meta": {
    "count": 100,
    "filters": {
      "language": "Javascript"
    }
  },
  "data": [
    {
      "name": "devtools-debugger-mcp",
      "url": "https://github.com/ScriptedAlchemy/devtools-debugger-mcp",
      "stars": 324,
      "forks": 18,
      "lastUpdated": "2025-09-21T07:52:58Z",
      "score": 19
    },
    ...
    ]
}
  