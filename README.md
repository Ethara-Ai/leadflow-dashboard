# ZOOLAB Dashboard

**Professional Zoo Animal Monitoring and Management System**

A modern, responsive dashboard for zoo staff, veterinarians, and wildlife conservation specialists to monitor animal activity, feeding schedules, and health alerts.

![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Features

- **Real-time Statistics** — Monitor animal population, environmental temperature, and humidity levels
- **Interactive Charts** — Visualize animal activity, feeding efficiency, and diet distribution with dynamic time-period filtering
- **Alert Management** — Track and manage zoo-wide alerts with severity levels
- **Dark/Light Theme** — Seamless theme switching with persistent preferences
- **Animal Observation Notes** — Document and review animal behavior and health observations
- **Data Export** — Export dashboard data in CSV or JSON formats
- **Responsive Design** — Fully responsive layout optimized for desktop, tablet, and mobile devices
- **Smooth Animations** — Polished UI with Framer Motion animations

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 19.2.0 | UI component library |
| [Vite](https://vitejs.dev/) | 7.2.4 | Build tool and development server |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.18 | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | 12.24.1 | Animation library |
| [Recharts](https://recharts.org/) | 3.6.0 | Charting library |
| [Lucide React](https://lucide.dev/) | 0.562.0 | Icon library |
| [ESLint](https://eslint.org/) | 9.39.1 | Code linting |

---

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/zoolab-dashboard.git
   cd zoolab-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## Components

### Layout Components

#### `<ZoolabDashboard />`
The main dashboard container that orchestrates all components and manages global state including theme, time periods, modals, and data.

#### `<Header />`
Application header featuring:
- Logo with page refresh functionality
- Dark/Light mode toggle
- Refresh data button
- Notes modal trigger
- Export menu (CSV/JSON)

```jsx
<Header
  isLoading={boolean}
  onToggleDarkMode={function}
  onRefresh={function}
  onOpenNotes={function}
  onExportCSV={function}
  onExportJSON={function}
/>
```

#### `<Footer />`
Application footer with branding, navigation links (Product, Resources, Company), and copyright information.

```jsx
<Footer
  onOpenProductModal={function}
  onOpenResourcesModal={function}
  onOpenCompanyModal={function}
/>
```

---

### Statistics Components

#### `<StatCard />`
Reusable card component for displaying individual statistics with icon, value, and trend indicator.

```jsx
<StatCard
  title="Animal Population"
  value="1,247"
  icon={<Users />}
  subValue="+12"
  subText="from last week"
  accent="bg-blue-100"
  subValueVariant="positive" // "positive" | "negative" | "warning" | "neutral"
/>
```

#### `<StatCards />`
Grid container that renders multiple StatCard components with zoo metrics data.

```jsx
<StatCards zooData={object} activityData={array} />
```

---

### Chart Components

#### `<AnimalActivityChart />`
Composed chart displaying animal activity levels and feeding completion rates over time.

```jsx
<AnimalActivityChart
  data={array}
  timePeriod="week" // "week" | "month" | "year"
  setTimePeriod={function}
/>
```

#### `<FeedingEfficiencyChart />`
Visualizes feeding efficiency metrics with area chart representation.

```jsx
<FeedingEfficiencyChart
  data={array}
  timePeriod="week"
  setTimePeriod={function}
/>
```

#### `<DietDistributionChart />`
Displays diet composition data using pie/donut chart visualization.

```jsx
<DietDistributionChart
  data={array}
  timePeriod="week"
  setTimePeriod={function}
/>
```

#### `<TimePeriodButtons />`
Shared button group for selecting chart time periods (Week, Month, Year).

```jsx
<TimePeriodButtons
  currentPeriod="week"
  onPeriodChange={function}
/>
```

#### `<CustomTooltip />`
Theme-aware tooltip component for chart data points.

---

### Alert Components

#### `<AlertsPanel />`
Panel displaying zoo alerts with management dropdown for adding/clearing alerts.

```jsx
<AlertsPanel
  alerts={array}
  onAddAlert={function}
  onClearAlerts={function}
/>
```

#### `<AlertItem />`
Individual alert display with type-based styling (info, warning, error).

#### `<AlertDropdown />`
Dropdown menu for adding new alerts and bulk operations.

---

### Modal Components

#### `<NotesModal />`
Full-featured modal for creating and viewing animal observation notes.

```jsx
<NotesModal
  isOpen={boolean}
  onClose={function}
  notes={array}
  onSaveNote={function}
  onDeleteNote={function}
/>
```

#### `<FooterModal />`
Generic modal wrapper for footer content sections.

```jsx
<FooterModal
  isOpen={boolean}
  onClose={function}
  title="Modal Title"
>
  {children}
</FooterModal>
```

---

### Feedback Components

#### `<LoadingScreen />`
Animated full-screen loading indicator shown during initial app load.

#### `<LoadingSkeleton />`
Skeleton placeholder displayed while dashboard content is loading.

#### `<WelcomeMessage />`
Dismissible welcome banner for first-time users.

#### `<ErrorMessage />`
Error display component with retry functionality.

```jsx
<ErrorMessage error="Error message string" />
```

---

## Theme System

ZOOLAB uses a centralized theme management system via React Context.

### Theme Provider

Wrap your application with `ThemeProvider` to enable theme features:

```jsx
import ThemeProvider from './hooks/ThemeProvider';

<ThemeProvider defaultDarkMode={false}>
  <App />
</ThemeProvider>
```

### Using Theme in Components

```jsx
import useTheme from './hooks/useTheme';

const MyComponent = () => {
  const { isDark, toggleTheme, setDarkMode } = useTheme();
  
  return (
    <div className={isDark ? 'bg-slate-800' : 'bg-white'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### Theme Persistence

Theme preferences are automatically persisted to `localStorage` under the key `antlab-theme`.

---

## Project Structure

```
zoolab-dashboard/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and SVGs
│   ├── components/        # React components
│   │   ├── AlertDropdown.jsx
│   │   ├── AlertItem.jsx
│   │   ├── AlertsPanel.jsx
│   │   ├── AnimalActivityChart.jsx
│   │   ├── ChartComponents.jsx
│   │   ├── CustomTooltip.jsx
│   │   ├── DietDistributionChart.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── FeedingEfficiencyChart.jsx
│   │   ├── Footer.jsx
│   │   ├── FooterModal.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── NotesModal.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatCards.jsx
│   │   ├── TimePeriodButtons.jsx
│   │   ├── WelcomeMessage.jsx
│   │   └── ZoolabDashboard.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── ThemeContext.js
│   │   ├── ThemeProvider.jsx
│   │   ├── useGlobalStyles.js
│   │   ├── useTheme.jsx
│   │   └── withTheme.jsx
│   ├── App.jsx            # Root application component
│   ├── chartUtils.js      # Chart styling utilities
│   ├── constants.js       # Application constants and mock data
│   ├── index.css          # Global styles
│   ├── main.jsx           # Application entry point
│   └── utils.js           # Utility functions
├── index.html             # HTML template
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/zoolab-dashboard.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**
   ```bash
   npm install
   ```

### Development Workflow

1. Make your changes in the feature branch
2. Ensure code passes linting:
   ```bash
   npm run lint
   ```
3. Test your changes locally:
   ```bash
   npm run dev
   ```
4. Build to verify production readiness:
   ```bash
   npm run build
   ```

### Submitting Changes

1. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add new animal tracking feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` — New features
   - `fix:` — Bug fixes
   - `docs:` — Documentation changes
   - `style:` — Code style changes (formatting, etc.)
   - `refactor:` — Code refactoring
   - `test:` — Adding or updating tests
   - `chore:` — Maintenance tasks

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** against the `main` branch

### Code Style Guidelines

- Use functional components with hooks
- Follow the existing component structure and naming conventions
- Ensure components support both light and dark themes
- Add JSDoc comments for component props
- Use Tailwind CSS for styling
- Keep components small and focused on a single responsibility

### Reporting Issues

- Use GitHub Issues to report bugs or request features
- Include clear reproduction steps for bugs
- Provide screenshots or recordings when helpful

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.


---

Made with care for wildlife conservation

**Copyright 2025 ZOOLAB. All rights reserved.**
