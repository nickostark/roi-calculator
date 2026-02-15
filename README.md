# Private Transcription ROI Calculator

ROI calculator for self-hosted transcription workflows. Calculates break-even analysis, API cost avoidance, and privacy benefits across therapy, legal, consulting, education, and content creation use cases.

Read full article including deep-dive analysis on Substack 
**[Stop Inviting Fireflies to Your Client Calls: Save $228/Year and Keep Your Calls Privat](https://substack.com/...)**

## Scenarios

- **Content Creator** - Voice memos → polished content
- **Consulting Firm** - Client calls → documented insights & CRM stuff
- **Private Practice** - Session notes without typing
- **Legal Team** - Privileged calls → secure transcripts & action items
- **Education Business** - Course content → materials

Each scenario models time savings, API cost avoidance (Whisper + Claude/GPT-4), VPS hosting costs, and break-even timeline.

## Assumptions
API costs at 0.025/min (Whisper, Claude Sonnet/GPT-4), 5-hour setup, ~$15/month VPS hosting
Your actual savings will vary based on call volume, audio quality, and hourly rate.

## Setup

```bash
npm install
npm run dev
```

## Licence
MIT

