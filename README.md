# TimeUp – Appointment booking prototype

TimeUp is a plug-in/app for personal care businesses (hair salons, spas, gyms, physical therapy centers, pilates studios, nutrition offices, dermatology clinics, tattoo shops) that centralizes and automates appointment booking with each business's specialists.

This repository contains a **clickable prototype** of the solution described in the TimeUp Project Management Plan (Guayaquil, Ecuador · September–December 2026).

## Screens

| Screen | What it shows |
| --- | --- |
| **Client booking** | The plug-in a business embeds on its website or social media. The client picks location → service → specialist (or "any available") → date & time → confirms and chooses reminder channel. A timer shows how long the booking took (goal: under 2 minutes). Busy slots are blocked, so double bookings can't happen. |
| **Reminders & follow-up** | Automated messages: booking confirmation, 24 h reminder (Confirm / Reschedule), 2 h reminder, and a post-visit follow-up with a 1–5 rating and a one-tap offer to book the next visit. |
| **Business dashboard** | One calendar for all specialists, color-coded by status, filter by specialist, live KPIs (appointments, occupancy, confirmations, no-shows) and an appointment panel to send reminders or mark confirmations / no-shows. |

## How the prototype maps to the project objectives

- **Booking in under 2 minutes** → 5-step flow with a visible booking timer.
- **80% fewer scheduling conflicts** → real-time availability, unavailable slots are disabled.
- **30% fewer no-shows** → automatic 24 h and 2 h reminders with confirm/reschedule buttons.
- **20% higher client retention** → post-visit follow-up with rating and "book next visit".
- **3+ business types** → service categories and specialist roles are configurable.
- **85% client satisfaction** → rating survey sent after each appointment.

## Run it locally

No installation or build step is needed. It is plain HTML, CSS and JavaScript.

1. Download or clone the repository.
2. Open `index.html` in your browser.

## Publish it with GitHub Pages

1. Create a new repository on GitHub and upload all files from this folder (keep the folder structure).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After about a minute the prototype is live at `https://<your-user>.github.io/<repository-name>/`.

## Project structure

```
timeup-prototype/
├── index.html          # Entry page with the screen tabs
├── css/styles.css      # All styles
├── js/utils.js         # Shared helpers, icons and specialist data
├── js/booking.js       # Screen 1 – client booking flow
├── js/messages.js      # Screen 2 – reminders and follow-up
├── js/dashboard.js     # Screen 3 – business dashboard
├── js/app.js           # Tab navigation (#booking, #messages, #dashboard)
└── assets/timeup-icon.png
```

## Notes

- "Glow Studio", its locations, staff, clients and prices are **sample data** for demonstration only.
- Availability, reminders and KPIs are simulated in the browser; there is no backend yet. In the real product they come from the business calendar, the database and the notification service (WhatsApp / SMS / Email).

## Team

| Role | Responsibilities |
| --- | --- |
| Project Manager | Scope, schedule, budget, risks and stakeholder communication |
| Software Developer | Architecture, backend, database, frontend, calendar and notifications |
| Marketing and Sales Specialist | Market research, customer acquisition, partnerships and pilot client |
