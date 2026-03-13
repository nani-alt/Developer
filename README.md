# LifeLink Blood Donor Finder (English)

A lightweight, single-page web app to help communities quickly connect blood donors with patients in urgent need.

## Features

- Donor registration form (name, phone, city, blood group, availability, last donation, notes).
- Smart donor search/filter (name, blood group, city, availability).
- Emergency request submission (patient, required group, hospital, city, contact).
- Real-time dashboard stats:
  - Total donors
  - Currently available donors
  - Open emergency requests
- Blood compatibility quick-reference panel.
- Local persistence using browser `localStorage`.
- Fully English UI.

## Run locally

No install needed.

```bash
python3 -m http.server 4173
```

Then open: `http://localhost:4173`

## Tech

- HTML5
- CSS3
- Vanilla JavaScript
