# AI Assistant with rrWeb

This project is a minimal example that integrates a chat interface with rrWeb recording and playback capabilities.

## Features

- Configure multiple LLM API endpoints (base URL, API key, model).
- Chat with the selected configuration using an OpenAI compatible API.
- Manually record interactions on any page using rrWeb and save recordings to local storage.
- View saved recordings and play them back with `rrweb-player`.

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Navigate to `/` for chat, `/record` to create a recording and `/recordings` to play saved recordings.

