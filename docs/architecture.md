# TrendLens System Architecture

## Overview
TrendLens is designed to produce short-horizon estimations (5m, 15m, 30m) for Indian equities traded on the NSE and BSE.

## Core Tenets

### 1. Market Data Adapter Interface
All market data acquisition is decoupled from application handlers through a uniform adapter interface:

```python
class MarketDataAdapter(ABC):
    @abstractmethod
    async def get_candles(
        self,
        symbol: str,
        interval: str, # "1m", "5m", "15m"
        start: datetime,
        end: datetime
    ) -> pd.DataFrame:
        """
        Returns DataFrame with columns: [timestamp, open, high, low, close, volume]
        Indexed by UTC timestamp, strictly sorted ascending.
        """
        pass
```

### 2. Zero-Leakage Pipeline
1. Features are strictly computed using historical candles $\le t_0$.
2. Train, validation, and test splits are partitioned purely along the temporal dimension.
3. An embargo buffer $\ge \text{horizon}$ is enforced immediately following the training partition to avoid auto-correlated leakages into validation sets.
4. Models are compared against the naive baseline ($P_{t+h} = P_t$).

### 3. Asynchronous Data Ingestion & Caching
- User web requests **never** trigger real-time calls to third-party data providers.
- Schedulers periodically pull and cache settled candles into PostgreSQL / Redis.
- Users always read from settled storage, guaranteeing instant UI load times and deterministic behavior.

### 4. Append-Only Prediction History
Every generated forecast creates an immutable record in the database:
- `id` (UUID)
- `symbol` (e.g., RELIANCE.NS, TCS.NS)
- `generated_at` (UTC timestamp $t_0$)
- `target_time` ($t_0 + \text{horizon}$)
- `horizon_minutes` (5, 15, 30)
- `last_price` ($P_{t_0}$)
- `p50_lower`, `p50_upper`, `p90_lower`, `p90_upper`
- `model_name`, `model_version`
- `status`: `PENDING` -> resolved to `EVALUATED` once target candle settles
- `actual_price`: filled upon evaluation
- `error_abs`, `error_pct`, `hit_p50`, `hit_p90`
