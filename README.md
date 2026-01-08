# LeadFlow Dashboard

**Professional Lead Generation and Management Platform**

A modern, responsive dashboard for sales teams, marketing professionals, and business development specialists to track lead activity, call metrics, meeting schedules, and sales performance.

![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## Features

- **Real-time Statistics** - Monitor total leads, calls made, meetings scheduled, and conversion rates
- **Interactive Charts** - Visualize lead activity, conversion rates, and lead source distribution with dynamic time-period filtering
- **Meeting Schedule** - Interactive calendar with click-to-expand meeting details and month navigation
- **Recent Activities** - Track latest lead interactions with status indicators
- **Alert Management** - Track and manage sales alerts with priority levels
- **Dark/Light Theme** - Seamless theme switching with persistent preferences
- **Lead Notes** - Document and review lead interactions and follow-up tasks
- **Data Export** - Export dashboard data in CSV or JSON formats
- **Responsive Design** - Fully responsive layout optimized for desktop, tablet, and mobile devices
- **Mobile Navigation** - Hamburger menu for consolidated navigation on mobile and tablet devices
- **Smooth Animations** - Polished UI with Framer Motion animations

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
| [Vitest](https://vitest.dev/) | 4.0.16 | Testing framework |
| [ESLint](https://eslint.org/) | 9.39.1 | Code linting |

---

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ethara-AI/leadflow-dashboard.git
   cd leadflow-dashboard
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
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run test` | Run test suite in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:ui` | Run tests with UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |

---

## Components

### Layout Components

#### `<Dashboard />`
The main dashboard container that orchestrates all components and manages global state including theme, time periods, modals, and data.

#### `<Header />`
Application header featuring:
- Logo with page refresh functionality
- Dark/Light mode toggle
- Refresh data button
- Notes modal trigger
- Export menu (CSV/JSON)
- Hamburger menu for mobile/tablet devices with consolidated actions

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
  title="Total Leads"
  value="1,247"
  icon={<Users />}
  subValue="+24"
  subText="new this week"
  accent="bg-emerald-100"
  subValueVariant="positive" // "positive" | "negative" | "warning" | "neutral"
/>
```

#### `<StatCards />`
Grid container that renders multiple StatCard components with lead metrics data including Total Leads, Calls Made, Meetings, and Conversion Rate.

```jsx
<StatCards leadData={object} activityData={array} />
```

---

### Chart Components

#### `<LeadActivityChart />`
Composed chart displaying lead activity levels and engagement metrics over time.

```jsx
<LeadActivityChart
  data={array}
  timePeriod="week" // "week" | "month" | "year"
  setTimePeriod={function}
/>
```

#### `<ConversionRateChart />`
Visualizes conversion rate metrics with area chart representation.

```jsx
<ConversionRateChart
  data={array}
  timePeriod="week"
  setTimePeriod={function}
/>
```

#### `<LeadSourceChart />`
Displays lead source distribution data using pie/donut chart visualization with:
- Title displayed first
- Time period selector below title
- Pie chart in the middle
- Legend with complete source names and percentages below the chart

```jsx
<LeadSourceChart
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

#### `<ChartErrorBoundary />`
Error boundary specific to chart components for graceful error handling.

---

### Meeting and Activity Components

#### `<MeetingScheduleCard />`
Interactive calendar card for viewing and managing meeting schedules featuring:
- Calendar view with month navigation
- Click-to-expand meeting details below specific date rows
- List view toggle showing all meetings for current month
- Dynamic meeting count per month
- Support for past and future months

```jsx
<MeetingScheduleCard meetings={array} />
```

#### `<RecentLeadActivities />`
Panel displaying recent lead interactions with status indicators and timestamps.

```jsx
<RecentLeadActivities activities={array} />
```

---

### Alert Components

#### `<AlertsPanel />`
Panel displaying lead alerts with management dropdown for adding/clearing alerts. Features improved padding and spacing between alert items.

```jsx
<AlertsPanel
  alerts={array}
  onAddAlert={function}
  onClearAlerts={function}
/>
```

#### `<AlertsModal />`
Modal component for displaying and managing alerts in an expanded view.

```jsx
<AlertsModal
  isOpen={boolean}
  onClose={function}
  alerts={array}
  onAddAlert={function}
  onClearAlerts={function}
/>
```

#### `<AlertItem />`
Individual alert display with type-based styling (info, warning, error) and enhanced spacing.

#### `<AlertDropdown />`
Dropdown menu for adding new alerts and bulk operations.

---

### Modal Components

#### `<NotesModal />`
Full-featured modal for creating and viewing lead notes and follow-up tasks.

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
Generic modal wrapper for footer content sections with proper mobile visibility and scrolling support.

```jsx
<FooterModal
  isOpen={boolean}
  onClose={function}
  title="Modal Title"
>
  {children}
</FooterModal>
```

#### `<ProductModalContent />`
Content component for the Product information modal.

#### `<ResourcesModalContent />`
Content component for the Resources and Community modal.

#### `<CompanyModalContent />`
Content component for the Company and Legal modal.

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

#### `<ErrorBoundary />`
React error boundary component for graceful error handling.

#### `<withErrorBoundary />`
Higher-order component for wrapping components with error boundary.

---

### Dashboard Sub-Components

#### `<DashboardCharts />`
Container component for organizing and rendering all chart components.

#### `<DashboardContent />`
Main content area component for the dashboard layout.

#### `<DashboardHeader />`
Header section specific to the dashboard view.

#### `<DashboardModals />`
Container component managing all modal states and rendering.

---

## Theme System

LeadFlow uses a centralized theme management system via React Context.

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

Theme preferences are automatically persisted to `localStorage` under the key `leadflow-theme`.

---

## Custom Hooks

| Hook | Purpose |
|------|---------|
| `useTheme` | Access theme context (isDark, toggleTheme, setDarkMode) |
| `useThemeSafe` | Safe theme hook with fallback for use outside ThemeProvider |
| `useGlobalStyles` | Inject global theme-dependent styles |
| `useAlerts` | Manage alert state and operations |
| `useNotes` | Manage notes state and operations |
| `useModals` | Manage modal open/close states |
| `useChartPeriods` | Manage time period selection for charts |
| `useChartStyles` | Provide consistent chart styling based on theme |
| `useLeadData` | Fetch and manage dashboard lead data |
| `useScrollLock` | Lock body scroll when modals are open |

---

## Context

| Context | Purpose |
|---------|---------|
| `ThemeContext` | Provides theme state across the application |
| `DashboardContext` | Provides dashboard state and actions |
| `useDashboard` | Hook to access DashboardContext |

---

## Project Structure

```
leadflow-dashboard/
├── .github/               # GitHub configuration
│   └── workflows/         # CI/CD workflows
├── public/                # Static assets
├── src/
│   ├── api/              # API client and services
│   │   ├── client.js     # HTTP client configuration
│   │   ├── index.js      # API exports
│   │   └── leads.js      # Lead-related API calls
│   ├── assets/           # Images and SVGs
│   ├── components/       # React components
│   │   ├── charts/       # Chart-specific components
│   │   │   ├── ChartErrorBoundary.jsx
│   │   │   └── index.js
│   │   ├── dashboard/    # Dashboard sub-components
│   │   │   ├── DashboardCharts.jsx
│   │   │   ├── DashboardContent.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── DashboardModals.jsx
│   │   │   └── index.js
│   │   ├── AlertDropdown.jsx
│   │   ├── AlertItem.jsx
│   │   ├── AlertsModal.jsx
│   │   ├── AlertsPanel.jsx
│   │   ├── ChartComponents.jsx
│   │   ├── CompanyModalContent.jsx
│   │   ├── ConversionRateChart.jsx
│   │   ├── CustomTooltip.jsx
│   │   ├── dashboard.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Footer.jsx
│   │   ├── FooterModal.jsx
│   │   ├── Header.jsx
│   │   ├── LeadActivityChart.jsx
│   │   ├── LeadSourceChart.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── LoadingSkeleton.jsx
│   │   ├── MeetingScheduleCard.jsx
│   │   ├── NotesModal.jsx
│   │   ├── ProductModalContent.jsx
│   │   ├── RecentLeadActivities.jsx
│   │   ├── ResourcesModalContent.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatCards.jsx
│   │   ├── TimePeriodButtons.jsx
│   │   ├── WelcomeMessage.jsx
│   │   └── withErrorBoundary.jsx
│   ├── config/           # Application configuration
│   │   ├── animations.js # Animation settings
│   │   ├── env.js        # Environment configuration
│   │   ├── index.js      # Config exports
│   │   └── storage.js    # Storage keys configuration
│   ├── constants/        # Application constants
│   │   ├── animations.js # Animation constants
│   │   ├── chartData.js  # Chart configuration data
│   │   ├── index.js      # Constants exports
│   │   ├── mockData.js   # Mock data for development
│   │   ├── storage.js    # Storage constants
│   │   └── typography.js # Typography constants
│   ├── context/          # React Context providers
│   │   ├── DashboardContext.jsx
│   │   ├── index.js
│   │   └── useDashboard.js
│   ├── data/             # Data layer
│   │   └── mocks/        # Mock data files
│   ├── hooks/            # Custom React hooks
│   │   ├── index.js
│   │   ├── ThemeContext.js
│   │   ├── ThemeProvider.jsx
│   │   ├── useAlerts.js
│   │   ├── useChartPeriods.js
│   │   ├── useChartStyles.js
│   │   ├── useGlobalStyles.js
│   │   ├── useLeadData.js
│   │   ├── useModals.js
│   │   ├── useNotes.js
│   │   ├── useScrollLock.js
│   │   ├── useTheme.jsx
│   │   ├── useThemeSafe.js
│   │   └── withTheme.jsx
│   ├── test/             # Test utilities
│   │   ├── setup.js      # Test setup configuration
│   │   └── test-utils.jsx # Testing utilities
│   ├── App.jsx           # Root application component
│   ├── chartUtils.js     # Chart styling utilities
│   ├── index.css         # Global styles
│   ├── main.jsx          # Application entry point
│   └── utils.js          # Utility functions
├── .gitignore            # Git ignore rules
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── LICENSE               # MIT License
├── package.json          # Project dependencies
├── PROMPT.md             # Project specification
├── README.md             # Project documentation
├── vite.config.js        # Vite configuration
└── vitest.config.js      # Vitest configuration
```

---

## Mobile and Tablet Support

LeadFlow Dashboard is fully optimized for mobile and tablet devices:

- **Hamburger Menu** - All action buttons consolidated into a single menu on small screens
- **Responsive Modals** - Modals adjust to viewport with proper scrolling and safe area support
- **Touch Scrolling** - Smooth scrolling behavior with `-webkit-overflow-scrolling: touch`
- **Scroll Lock** - Background scroll prevention when hamburger menu is open
- **Hidden Tagline** - Logo tagline hidden on mobile to save space
- **Adaptive Layouts** - Grid layouts adjust from 4 columns on desktop to 2 columns on mobile

---

## Testing

LeadFlow uses Vitest with React Testing Library for unit and integration testing.

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Test files are co-located with their components using the `.test.jsx` or `.test.js` suffix.

---

## Contributing

We welcome contributions from the community! Here is how you can help:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/leadflow-dashboard.git
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
4. Run tests:
   ```bash
   npm run test:run
   ```
5. Build to verify production readiness:
   ```bash
   npm run build
   ```

### Submitting Changes

1. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add new lead tracking feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

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
- Write tests for new components and features

### Reporting Issues

- Use GitHub Issues to report bugs or request features
- Include clear reproduction steps for bugs
- Provide screenshots or recordings when helpful

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Links

- **Homepage**: [https://components.ethara.ai/leadflow-dashboard](https://components.ethara.ai/leadflow-dashboard)
- **Repository**: [https://github.com/Ethara-AI/leadflow-dashboard](https://github.com/Ethara-AI/leadflow-dashboard)
- **Issues**: [https://github.com/Ethara-AI/leadflow-dashboard/issues](https://github.com/Ethara-AI/leadflow-dashboard/issues)

---

Built for sales and business development professionals.

**Copyright 2026 LeadFlow. All rights reserved.**