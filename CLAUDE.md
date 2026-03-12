# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cinema seat booking application built with React 19, Vite 7, and Tailwind CSS 4. The application features a highly configurable cinema seating component with support for multiple seat types, pricing tiers, and booking management.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## Architecture

### Component Design Pattern

The application follows a **single configurable component** architecture:

- **CinemaSeatBooking** (`src/components/CinemaSeatBooking/CinemaSeatBooking.jsx`): Core component that handles all seat booking logic
  - Highly configurable via props (layout, seatTypes, bookedSeats, etc.)
  - Self-contained state management using React hooks
  - No external state management library

### State Management Strategy

State is managed locally within CinemaSeatBooking using:
- `useState` for seats array and selectedSeats
- `useMemo` for initialization (seats structure created from layout/seatTypes props)
- `useCallback` for memoized helper functions (getSeatType)
- Immutable state updates for all seat modifications

### Seat Data Structure

Each seat object contains:
```js
{
  id: 'A1',           // Seat identifier (row letter + number)
  row: 'A',           // Row letter
  seat: 1,            // Seat number
  type: 'regular',    // Seat type (regular, premium, vip)
  price: 9.99,        // Price for this seat
  color: 'blue',      // Display color from COLORS array
  status: 'available', // Status: 'available' | 'booked'
  selected: false     // Selection state
}
```

### Configuration Props Pattern

CinemaSeatBooking accepts configuration through:
- **layout**: Define rows, seatsPerRow, and aislePositions
- **seatTypes**: Map seat types to prices and row ranges
- **bookedSeats**: Array of pre-booked seat IDs (e.g., ['C2', 'D5'])
- **onBookingComplete**: Callback invoked with booking data when booking completes

## Key Conventions

### Color Mapping
Seat types are automatically assigned colors from `COLORS` array in order:
1. First seat type → blue
2. Second seat type → purple
3. Third seat type → yellow
4. Fourth seat type → green

### Seat ID Format
Seats use alphanumeric IDs: `{RowLetter}{SeatNumber}` (e.g., 'A1', 'B12', 'J5')
- Rows: Letters A-Z (based on layout.rows)
- Seats: Numbers 1-N (based on layout.seatsPerRow)

### Immutable State Updates
All state modifications use immutable patterns:
- Use `.map()` to create new arrays when updating seats
- Spread operators for object updates
- Never mutate state directly

## Styling System

Uses Tailwind CSS 4 with:
- Responsive design via sm:/md:/lg: breakpoints
- Dynamic class composition via template strings
- Color classes mapped through `getColorClass()` helper
- Seat styling changes based on state (available/selected/booked)

## PropTypes Validation

Component uses PropTypes for runtime prop validation. When adding new props or modifying prop shapes, update the PropTypes definition at the bottom of CinemaSeatBooking.jsx.

## GitHub Actions

The repository includes automated workflows:
- **ai-review-fixed.yml**: Claude AI code review on PRs
- **simple-code-review.yml**: Backup review workflow
- **deploy.yml**: Deployment workflow

## Testing Approach

To test the booking component locally:
1. Modify `bookedSeats` prop in App.jsx to test pre-booked seats
2. Adjust `layout` or `seatTypes` in App.jsx to test different configurations
3. Check console output from `handleBookingComplete` callback for booking data structure
