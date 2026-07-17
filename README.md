# AI Creator Website Designer

This application automatically generates a customized website design proposal for a YouTube content creator based on their channel's content and branding.

## Architecture
The application is built using a clean MVC architecture:
- `src/routes/`: Express routing configurations.
- `src/controllers/`: Application logic and request handling.
- `src/services/`: Isolated integrations with the YouTube Data API and Anthropic Claude.
- `public/`: Vanilla HTML/JS frontend application.

## Prerequisites
- Node.js (v14 or higher)
- A YouTube Data API v3 Key
- An Anthropic API Key

## Setup Instructions
1. Run `npm install` to install dependencies (`express`, `cors`, `dotenv`, `axios`, `@anthropic-ai/sdk`, `swagger-ui-express`).
2. Copy `.env.example` to `.env` and fill in your API keys.
3. Start the server using the dev script:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.
5. API Documentation is available via Swagger at `http://localhost:3000/api-docs`.

## How it works
1. **Input:** You enter a YouTube handle (e.g., `@mkbhd`).
2. **Extraction:** The `youtube.service` fetches the channel description, topics, stats, and recent video titles from the YouTube Data API.
3. **AI Generation:** The `anthropic.service` feeds this data into a highly-engineered system prompt using Claude Sonnet 4.6 (`claude-sonnet-4-6`). It autonomously designs a complete, single-file HTML/CSS website reflecting the creator's specific niche and brand.
4. **Presentation:** The Vanilla JS frontend dynamically renders the JSON proposal into a beautiful UI.

## AI Prompts Used
The following system prompt is used by the `gemini.service`:
```text
You are an elite, world-class Website Designer and Brand Strategist. Your task is to analyze raw YouTube channel data and generate a highly personalized, conversion-optimized website design proposal for the creator.

You must adapt your design aesthetic entirely based on the creator's niche.
- For tech/programming channels, use sleek dark modes or clean technical aesthetics.
- For lifestyle/education, use bright, clean, accessible colors.
- Base your design heavily on the provided data and infer their brand from their topics and video titles.

You must return your response ONLY as a valid JSON object with exactly the following structure, nothing else. 
CRITICAL: Do NOT use any double quotes (") inside your string values, use single quotes (') instead to prevent JSON parsing errors!
{
  "theme_name": "String",
  "vibe_description": "String",
  "colors": {
    "background": "Hex color",
    "primary": "Hex color",
    "secondary": "Hex color",
    "accent": "Hex color"
  },
  "typography": {
    "headings": "Font name (e.g. Inter, Fira Code, Roboto)",
    "body": "Font name"
  },
  "layout_sections": [
    { "name": "Section Name", "description": "What goes in this section" }
  ],
  "primary_cta": {
    "text": "Button text",
    "link_destination": "Where it should point based on their description (or # if unknown)"
  },
  "design_rationale": "Why you chose these design elements"
}
```

## Assumptions Made
1. **API Keys and Quota:** It is assumed that the user has valid YouTube Data API and Anthropic API keys with sufficient quota.
2. **Channel Handle Formatting:** It is assumed the user will input a modern YouTube handle (e.g., `@handle`). The backend handles formatting via URL extraction.
3. **Public Data Availability:** It is assumed the channel has public video uploads.
4. **Model Choice:** Built targeting Claude Sonnet 4.6 (`claude-sonnet-4-6`) via the Anthropic Messages API.
