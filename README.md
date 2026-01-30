# Dota 2 Counter Picker

A modern, premium-designed web application for Dota 2 players to find hero and item counters.

## Features

- 🦸 **Hero Database**: Browse all Dota 2 heroes with their abilities and attributes
- ⚔️ **Counter Picking**: Select enemy heroes and get instant recommendations for the best counter picks
- 🎒 **Item Counters**: Discover which items are most effective against specific hero compositions
- 📊 **Strategic Insights**: Understand why certain heroes and items counter others

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Vanilla CSS with custom design system
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Data Storage**: JSON (expandable to Firebase)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd dota
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
dota/
├── public/
│   └── dota-logo.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   ├── heroes.json
│   │   ├── items.json
│   │   └── counters.json
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Heroes.jsx
│   │   ├── HeroDetail.jsx
│   │   ├── Items.jsx
│   │   └── CounterPicker.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Data Structure

### Heroes (heroes.json)
Each hero contains:
- Basic info (name, id, image URLs)
- Primary attribute and attack type
- Roles (Carry, Support, Nuker, etc.)
- Base stats (STR, AGI, INT, growth rates)
- Abilities with descriptions
- Counter relationships

### Items (items.json)
Each item contains:
- Name, cost, image
- Category (consumables, weapons, armor, etc.)
- Attributes and effects
- Counter hero types

### Counters (counters.json)
Counter relationships with:
- Hero-to-hero counters
- Item counters for each hero
- Reasoning for why counters work

## Expanding the Data

The JSON files in `src/data/` contain sample data. To add more heroes:

1. Fetch hero data from the OpenDota API:
```javascript
fetch('https://api.opendota.com/api/heroes')
```

2. Hero images are available from Steam CDN:
```
https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/{hero_name}.png
```

## Future Enhancements

- [ ] Firebase integration for real-time data
- [ ] User accounts and saved picks
- [ ] Match history analysis
- [ ] Pro player build recommendations
- [ ] Mobile app version

## License

This project is for educational purposes. Dota 2 and all related properties are trademarks of Valve Corporation.
