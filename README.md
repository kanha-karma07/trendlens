# TrendLens 📈

> **Short-horizon stock price estimation web app for Indian equities (NSE/BSE)**

TrendLens provides disciplined, probability-based short-horizon price estimation (5m, 15m, 30m) designed with strict data honesty, anti-leakage time-series modeling, and dark navy fintech aesthetics.

---

## 🏛️ The 10 Non-Negotiable Rules

1. **Data Honesty**: No fake accuracy, no guaranteed returns, no "live" claims unless provider supports it. Demo/sample data carries the mandatory label: `"Illustrative sample data — not live market data."` A **"Sample data mode"** badge appears in the top bar in demo mode.
2. **Probability Ranges, Never Guarantees**: Forecasts are **ALWAYS** displayed as an uncertainty range (**50% and 90% confidence bands**), accompanied by generated-at timestamp, horizon, model name/version, and a data-freshness badge. Mandatory risk disclosure:
   > *"Estimates may be wrong and are not investment advice. The range shows uncertainty, not a guarantee."*
3. **Strict Horizons**: 5, 15, and 30 minutes. 60-minute is disabled and labeled as *"later"*. Input candles default to 5-minute (1-minute optional).
4. **No Data Leakage**: Features use **only** candles $\le$ forecast time $t_0$. Time-based splits only, never random shuffle. Embargo gap $\ge$ horizon between train and validation/test. The holdout test set is evaluated exactly once.
5. **Mandatory Baseline**: Every model is benchmarked against a naive last-price baseline. A candidate model is deemed "better than baseline" only if it wins consistently across walk-forward folds.
6. **Append-Only Prediction History**: Predictions are immutable. Every forecast row starts in `Pending` state and is subsequently resolved by an asynchronous evaluation job against real settled candles.
7. **Cached & Decoupled Access**: User page views never directly query the third-party market data provider. They read exclusively from the database/cache. Background schedulers ingest data.
8. **Unified Provider Adapter**: All external market data flows through a strict single interface: `get_candles(symbol, interval, start, end)`.
9. **Zero Committed Secrets**: Secrets and API keys are managed exclusively via environment variables (`.env`, never committed to git).
10. **Fintech Design Language**: Dark navy design system with curated colors:
    - Background: `#0A1128`
    - Card: `#101A36`
    - Raised Card: `#15213F`
    - Border: `#223059`
    - Primary Blue: `#3B82F6`
    - Teal: `#14D9C0`
    - Green (Bullish/Up): `#22C55E`
    - Red (Bearish/Down): `#F5586B`
    - Amber (Warning/Neutral): `#F5B84B`
    - Typography: Inter with tabular figures for currency prices, 16px card radius, 10px control radius.

---

## 📁 Repository Structure

```
stock_predictor/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions (lint, typecheck, build, test)
├── docs/
│   ├── architecture.md          # Architectural decisions & adapter specs
│   └── data_honesty_policy.md   # Non-negotiable honesty guidelines
├── tools/
│   └── setup_dev.py             # Dev environment check & onboarding script
├── frontend/                    # React (Vite) + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # PublicLayout, AppLayout (sidebar + tabs)
│   │   │   └── ui/              # Button, Card, Chip, SegmentedControl, RiskNotice...
│   │   ├── pages/               # 12 application screen placeholders
│   │   ├── App.tsx              # Application entry & router configuration
│   │   ├── index.css            # Tailwind directives & Inter typography
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/                     # Python 3.11+, FastAPI, SQLAlchemy 2.x, Pydantic v2
│   ├── app/
│   │   ├── core/                # Config, logging, security
│   │   └── main.py              # FastAPI app & /health endpoint
│   ├── tests/
│   │   └── test_health.py       # Health check test
│   ├── pyproject.toml
│   └── requirements.txt
├── docker-compose.yml           # Postgres 16, Redis 7, Backend, Frontend
├── .env.example                 # Environment configuration template
└── .gitignore                   # Ignore rules for node, python, secrets
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Run with Docker Compose
```bash
docker compose up --build
```
- **Frontend**: http://localhost:5173
- **Backend API & Swagger**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 4. Run Locally without Docker
#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
