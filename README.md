# EnergyLab

A responsive web app for estimating device energy use and electricity costs, with a side-by-side device comparison.

## Features

- Daily and period energy consumption and cost estimates
- Two-device comparison under the same usage conditions
- Last 10 calculations saved in browser storage
- Explained formulas and example devices

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server 8080` in this directory.

No build step or backend is required. GitHub Pages serves the root of the `main` branch.

## Calculations

`Daily kWh = power (W) / 1000 × hours per day`

`Period cost = daily kWh × days × electricity rate`

Power and price values are examples. Choose Turkish lira (TRY, default), US dollars (USD), or euros (EUR). Enter the electricity rate in the selected currency; no exchange-rate conversion is performed. History retains the currency selected when each calculation was saved. Calculations assume constant power; actual consumption and tariffs may differ. Saved calculations stay in the user's browser. System fonts are used if Google Fonts is unavailable.
