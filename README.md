# Cinema Seat Booking

An interactive cinema ticket booking application enabling users to browse available seats, select tickets by preference tier, and complete bookings seamlessly. Built with modern frontend technologies for optimal performance and user experience.

## Features

- **Interactive Seat Selection** - Click-based seat selection with visual feedback and real-time updates
- **Dynamic Pricing** - Multiple seat tiers (Regular, Premium, VIP) with automatic price calculation
- **Responsive Design** - Fully responsive interface optimized for mobile, tablet, and desktop devices
- **Accessibility** - Keyboard navigation (Enter/Space), ARIA labels, and semantic HTML
- **Configurable Cinema Layouts** - Flexible row/column configuration with customizable aisle positions
- **Booking Summary** - Real-time display of selected seats and total price
- **Smart Seat Management** - Prevent double-booking with pre-booked seat support

## Tech Stack

- **React 19** - Component-based UI library with modern hooks
- **Vite 7** - Next-generation frontend build tool with HMR (Hot Module Replacement)
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **JavaScript (ES6+)** - Modern JavaScript with arrow functions and destructuring
- **PropTypes** - Runtime prop validation for component contracts

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cinema-seat-booking

# Install dependencies
npm install
```

### Development

```bash
# Start the development server with HMR
npm run dev

# Open http://localhost:5173 in your browser
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

### Code Quality

```bash
# Run ESLint to check code quality
npm run lint
```

## Project Structure

```
src/
├── components/
│   └── CinemaSeatBooking/
│       └── CinemaSeatBooking.jsx      # Main booking component
├── App.jsx                             # Root application component
├── main.jsx                            # Application entry point
└── index.css                           # Global styles
```

## Component API

### CinemaSeatBooking Props

The `CinemaSeatBooking` component accepts the following props:

| Prop                | Type            | Default                 | Description                                |
| ------------------- | --------------- | ----------------------- | ------------------------------------------ |
| `layout`            | `Object`        | See below               | Cinema layout configuration                |
| `seatTypes`         | `Object`        | See below               | Seat type definitions with pricing         |
| `bookedSeats`       | `Array<String>` | `[]`                    | Pre-booked seat IDs (e.g., `['C2', 'D5']`) |
| `currency`          | `String`        | `'£'`                   | Currency symbol for pricing display        |
| `onBookingComplete` | `Function`      | `() => {}`              | Callback invoked when booking completes    |
| `title`             | `String`        | `'Cinema Hall Booking'` | Section title                              |
| `subtitle`          | `String`        | `'Select your seats'`   | Section subtitle                           |

### Layout Configuration

```javascript
const layout = {
  rows: 10, // Number of rows (A-J)
  seatsPerRow: 12, // Seats per row
  aislePositions: [3, 9], // Positions of aisles (splits seat sections)
};
```

### Seat Types Configuration

```javascript
const seatTypes = {
  regular: {
    price: 9.99,
    rows: [0, 1, 2, 3, 4], // Row indices (0-based)
  },
  premium: {
    price: 12.99,
    rows: [5, 6, 7],
  },
  vip: {
    price: 16.99,
    rows: [8, 9],
  },
};
```

### Booking Data Structure

When `onBookingComplete` is called, it receives:

```javascript
{
  seats: [
    {
      id: 'A1',
      type: 'regular',
      price: 9.99
    }
  ],
  totalPrice: 9.99,
  seatIds: ['A1'],
  timestamp: '2026-03-12T10:30:00.000Z'
}
```

## Usage Example

```javascript
import CinemaSeatBooking from "./components/CinemaSeatBooking/CinemaSeatBooking";

function App() {
  const handleBookingComplete = (bookingData) => {
    console.log("Booking completed:", bookingData);
    // Send booking data to backend API
  };

  return (
    <CinemaSeatBooking
      layout={{
        rows: 10,
        seatsPerRow: 12,
        aislePositions: [3, 9],
      }}
      seatTypes={{
        regular: { price: 9.99, rows: [0, 1, 2, 3, 4] },
        premium: { price: 12.99, rows: [5, 6, 7] },
        vip: { price: 16.99, rows: [8, 9] },
      }}
      bookedSeats={["C2", "C4", "D5"]}
      onBookingComplete={handleBookingComplete}
    />
  );
}
```

## Seat Coloring System

Seat types are automatically assigned colors from the palette below, in order:

| Order | Color  | Seat Type              |
| ----- | ------ | ---------------------- |
| 1st   | Blue   | First configured type  |
| 2nd   | Purple | Second configured type |
| 3rd   | Yellow | Third configured type  |
| 4th   | Green  | Fourth configured type |

Colors cycle if more than 4 seat types are defined.

## Accessibility Features

- ✅ Keyboard navigation with Enter/Space support
- ✅ ARIA labels for all interactive seats
- ✅ Screen reader friendly status text
- ✅ Semantic HTML structure
- ✅ Focus management for keyboard users
- ✅ Disabled state styling for booked seats

## Performance Optimizations

- **useMemo** - Seat initialization computed only once on mount
- **useCallback** - Memoized helper functions to prevent unnecessary re-renders
- **Immutable State Updates** - All state modifications use immutable patterns
- **CSS-in-JS Optimization** - Dynamic classes generated efficiently with Tailwind

## Architecture Decisions

### Single Component Approach

The booking interface is contained within one highly configurable component (`CinemaSeatBooking`) rather than split into multiple sub-components. This provides:

- Reduced prop drilling
- Easier state management
- Clear separation of concerns
- Maximum reusability

### Immutable State Updates

All state modifications follow immutable patterns using `.map()`, spread operators, and destructuring. This ensures:

- Predictable state changes
- Easier debugging with React DevTools
- Better performance with React's reconciliation algorithm

### Props-based Configuration

Rather than hardcoding cinema layouts, the component accepts configuration via props, enabling:

- Multiple cinema layouts in one application
- Dynamic cinema data from backend APIs
- Easy integration with booking systems

## Testing

To test the component locally:

1. **Modify `bookedSeats` prop** in `App.jsx` to test pre-booked seats
2. **Adjust `layout`** to test different cinema configurations
3. **Change `seatTypes`** to test various pricing tiers
4. **Check console output** from `handleBookingComplete` callback to verify booking data

Example test case:

```javascript
<CinemaSeatBooking
  bookedSeats={["A1", "A2", "B5"]}
  onBookingComplete={(data) => console.log(data)}
/>
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features for future iterations:

- [ ] Backend API integration for real-time seat availability
- [ ] WebSocket support for multi-user synchronization
- [ ] Payment gateway integration
- [ ] Booking confirmation emails
- [ ] Seat hold mechanism with expiration timer
- [ ] Multiple cinema support
- [ ] Admin panel for seat management
- [ ] Analytics and reporting

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Developed by Roge Mateos

## Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Bundled with [Vite](https://vitejs.dev)
