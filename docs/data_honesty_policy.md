# TrendLens Data Honesty Policy & Regulatory Disclosures

## Commitment to Transparency

Unlike conventional retail trading tools that advertise misleading "win rates" or "guaranteed target prices", TrendLens operates under strict statistical honesty:

1. **Uncertainty Over False Precision**:
   Financial markets contain high degrees of stochastic noise. A forecast is mathematically flawed if expressed as a single target point. TrendLens exclusively outputs probability bands (50% Interquartile Range and 90% Confidence Interval).

2. **Mandatory Disclaimer Banners**:
   Every estimation view must prominently display:
   > *"Estimates may be wrong and are not investment advice. The range shows uncertainty, not a guarantee."*

3. **Sample / Simulated Data Transparency**:
   Whenever running with sample or historical playback data:
   - A persistent yellow/amber **"Sample data mode"** pill badge is rendered in the global navigation header.
   - All charts carry an explicit watermark: `"Illustrative sample data — not live market data."`

4. **Historical Auditability**:
   No prediction may be deleted or modified retroactively. Predictions that fall outside the 50% or 90% bands are logged and calculated transparently to provide true calibration metrics.
