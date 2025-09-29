# Code Standards - What Good Code Looks Like

## 🎯 PURPOSE
This file defines what professional, production-ready code should be.

---

## ✅ COMPONENT CHECKLIST

### Good Component Has:
- [ ] One clear responsibility
- [ ] Clear props interface
- [ ] Good naming (descriptive, not generic)
- [ ] Proper file organization
- [ ] Comments for complex logic

### Bad Component Has:
- ❌ Multiple responsibilities
- ❌ Unclear props
- ❌ Generic names (Component1, Thing)
- ❌ Messy organization
- ❌ No comments

**Example:**
```javascript
// ✅ GOOD
const SeatButton = ({ seat, onClick, isSelected }) => {
  // Clear purpose, clear props
};

// ❌ BAD
const Thing = ({ data }) => {
  // What does this do? What is data?
};
```

---

## 📁 FILE ORGANIZATION

### Standard Structure:
```
src/
├── components/
│   ├── SeatMap/
│   │   ├── SeatMap.jsx       # Main component
│   │   ├── SeatButton.jsx    # Sub-component
│   │   └── index.js          # Export
│   └── BookingSummary/
│       ├── BookingSummary.jsx
│       └── index.js
├── hooks/
│   └── useSeatSelection.js
├── utils/
│   └── seatCalculations.js
└── constants/
    └── seatConfig.js
```

**Why:**
- Easy to find files
- Clear component boundaries
- Scalable structure
- Industry standard

---

## 🏗️ CODE STRUCTURE

### Component Order:
```javascript
// 1. Imports
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// 2. Constants (if component-specific)
const DEFAULT_PRICE = 10;

// 3. Component
const SeatMap = ({ layout, onBookingComplete }) => {
  // 3a. State
  const [seats, setSeats] = useState([]);

  // 3b. Derived state / Memoized values
  const selectedSeats = useMemo(() =>
    seats.filter(s => s.isSelected),
    [seats]
  );

  // 3c. Event handlers
  const handleSeatClick = (seatId) => {
    // Implementation
  };

  // 3d. Effects (if any)
  useEffect(() => {
    // Side effects
  }, []);

  // 3e. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 4. PropTypes / Validation
SeatMap.propTypes = {
  layout: PropTypes.object.isRequired,
  onBookingComplete: PropTypes.func
};

// 5. Default Props
SeatMap.defaultProps = {
  onBookingComplete: () => {}
};

// 6. Export
export default SeatMap;
```

---

## 🎨 NAMING CONVENTIONS

### Components:
- **PascalCase:** `SeatMap`, `BookingSummary`
- **Descriptive:** Says what it does
- **Noun-based:** Thing, not action

### Functions:
- **camelCase:** `handleSeatClick`, `calculateTotal`
- **Verb-based:** Action word first
- **Clear purpose:** Name says what it does

### Variables:
- **camelCase:** `selectedSeats`, `totalPrice`
- **Descriptive:** Not `x`, `temp`, `data`
- **Boolean prefix:** `isSelected`, `hasError`, `canBook`

### Constants:
- **UPPER_SNAKE_CASE:** `MAX_SEATS`, `DEFAULT_LAYOUT`
- **Descriptive:** Says what value represents

**Examples:**
```javascript
// ✅ GOOD
const isAvailable = seat.status === 'available';
const handleSeatSelection = (id) => { };
const MAXIMUM_BOOKING_LIMIT = 10;

// ❌ BAD
const flag = seat.status === 'available';
const click = (id) => { };
const max = 10;
```

---

## 💬 COMMENTS & DOCUMENTATION

### When to Comment:

**DO Comment:**
- Complex algorithms
- Business logic
- Non-obvious decisions
- Workarounds
- TODOs

**DON'T Comment:**
- Obvious code
- What code does (code shows that)
- Outdated information

**Examples:**
```javascript
// ✅ GOOD
// Calculate total price with 10% discount for 5+ seats
// This matches the business rule from ticket #342
const totalPrice = seats.length >= 5
  ? basePrice * 0.9
  : basePrice;

// ❌ BAD
// Set the price
const totalPrice = basePrice;

// ❌ WORSE
// Loop through array
seats.forEach(seat => { });
```

### Component Documentation:
```javascript
/**
 * SeatMap - Cinema seat selection interface
 *
 * Displays theater seats in a grid layout and handles seat selection.
 * Used in booking flow after movie/showtime selection.
 *
 * @param {Object} layout - Theater layout configuration
 * @param {Function} onBookingComplete - Callback when booking is confirmed
 *
 * @example
 * <SeatMap
 *   layout={theaterLayout}
 *   onBookingComplete={handleBooking}
 * />
 */
```

---

## 🚨 ERROR HANDLING

### Always Handle:
- User input
- API calls
- State updates
- Edge cases

**Examples:**
```javascript
// ✅ GOOD
const handleSeatClick = (seatId) => {
  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    console.error(`Seat ${seatId} not found`);
    return;
  }

  if (seat.status === 'occupied') {
    alert('This seat is already taken');
    return;
  }

  // Proceed with selection
};

// ❌ BAD
const handleSeatClick = (seatId) => {
  const seat = seats.find(s => s.id === seatId);
  seat.isSelected = true; // What if seat is undefined?
};
```

---

## ⚡ PERFORMANCE RULES

### Use When Needed:
- **useMemo:** Expensive calculations
- **useCallback:** Functions passed to children
- **React.memo:** Pure components re-rendering often

### Don't Over-Optimize:
- Simple calculations (adding numbers)
- First render (no re-render yet)
- Premature optimization

**Examples:**
```javascript
// ✅ GOOD - Heavy calculation
const expensiveResult = useMemo(() => {
  return seats.reduce((acc, seat) => {
    // Complex calculations
  }, []);
}, [seats]);

// ❌ BAD - Premature optimization
const sum = useMemo(() => a + b, [a, b]); // Just do: a + b
```

---

## ♿ ACCESSIBILITY STANDARDS

### Always Include:
- Semantic HTML
- ARIA labels for complex elements
- Keyboard navigation
- Focus management
- Color contrast

**Examples:**
```javascript
// ✅ GOOD
<button
  onClick={handleClick}
  aria-label={`Seat ${seatNumber}, ${seatType}, $${price}`}
  className={isSelected ? 'selected' : 'available'}
>
  {seatNumber}
</button>

// ❌ BAD
<div
  onClick={handleClick}
  className="seat"
>
  {seatNumber}
</div>
```

---

## 🎯 REACT BEST PRACTICES

### State Management:
```javascript
// ✅ GOOD - Immutable update
setSeats(prevSeats =>
  prevSeats.map(seat =>
    seat.id === id ? { ...seat, isSelected: true } : seat
  )
);

// ❌ BAD - Mutating state
seats.find(s => s.id === id).isSelected = true;
setSeats(seats);
```

### Conditional Rendering:
```javascript
// ✅ GOOD
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ BAD
{isLoading ? <Spinner /> : null}
```

### Props Spreading:
```javascript
// ✅ GOOD - Explicit props
<SeatButton
  seat={seat}
  onClick={handleClick}
  isSelected={seat.isSelected}
/>

// ⚠️ USE CAREFULLY - Spreading
<SeatButton {...seat} onClick={handleClick} />
// Only spread when you control the object structure
```

---

## 📦 IMPORTS ORGANIZATION

```javascript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 2. Internal components
import SeatButton from './SeatButton';
import BookingSummary from '../BookingSummary';

// 3. Hooks
import useSeatSelection from '@/hooks/useSeatSelection';

// 4. Utils
import { calculateTotal } from '@/utils/seatCalculations';

// 5. Constants
import { SEAT_TYPES } from '@/constants/seatConfig';

// 6. Styles
import './SeatMap.css';
```

---

## 🧪 TESTING CHECKLIST

### Every Component Should:
- [ ] Render without crashing
- [ ] Handle all prop combinations
- [ ] Handle user interactions
- [ ] Handle edge cases
- [ ] Be accessible

---

## 🚀 PRODUCTION READY CHECKLIST

Before considering code "done":
- [ ] Works as expected
- [ ] Handles errors gracefully
- [ ] Accessible to all users
- [ ] Performs well
- [ ] Well-documented
- [ ] Follows naming conventions
- [ ] No console.logs left
- [ ] No commented-out code
- [ ] Tested edge cases

---

## 💡 REMEMBER

**Good code is:**
- Easy to read
- Easy to change
- Easy to test
- Easy to debug
- Easy to delete

**If you can't explain it simply, refactor it.**