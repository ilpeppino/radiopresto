# Podcastfy Local Service

This service exposes a minimal HTTP wrapper around `podcastfy`:

- `POST /generate` accepts `{ topic, sources, prompt }`
- returns `{ script }`

## Run

1. Create a Python environment and install dependencies:

```bash
cd services/podcastfy_api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configure the API keys required by your Podcastfy setup (for example OpenAI/Google keys used by the selected model/TTS).

3. Start the service:

```bash
cd /Volumes/DevSSD/projects/radiopresto
npm run dev:podcastfy
```

Service URL: `http://localhost:8000`

## Connect Radio Presto backend

Set in `.env.local` (project root):

```env
PODCASTFY_ENDPOINT_URL="http://localhost:8000/generate"
```

Then restart:

```bash
npm run dev:api
```
