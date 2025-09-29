# React Patterns Reference - Teaching Guide

## 🎯 PURPOSE
Use this file to explain patterns correctly and show where they're used in real apps.

---

## PATTERN 1: State Management

### Single Source of Truth
**What:** Keep all data in one place, calculate the rest
**Example:** Store `seats`, calculate `selectedSeats` from it
**Use in:**
- Shopping carts
- User preferences
- Dashboard filters

**Teach:** "Don't duplicate data - derive it!"

---

### Lifting State Up
**What:** Move shared state to parent component
**Example:** Selected seats in parent, individual seats get props
**Use in:**
- Multi-step forms
- Filtered lists
- Collaborative features

**Teach:** "Share state = lift it up to parent"

---

### Immutable Updates
**What:** Never change state directly, always create new
**Example:** `setSeats([...prevSeats, newSeat])` NOT `seats.push(newSeat)`
**Use in:**
- All React state
- Redux/state management
- Complex data

**Teach:** "React needs new objects to detect changes"

---

## PATTERN 2: Performance

### useMemo
**What:** Cache expensive calculations
**Example:** `useMemo(() => initializeSeats(), [layout])`
**Use in:**
- Heavy calculations
- Large data processing
- Expensive rendering

**Teach:** "Only recalculate when dependencies change"

---

### useCallback
**What:** Keep same function reference across renders
**Example:** `useCallback((id) => handleClick(id), [seats])`
**Use in:**
- Props passed to children
- Effect dependencies
- Performance optimization

**Teach:** "Prevents child components from re-rendering unnecessarily"

---

### React.memo
**What:** Skip re-render if props haven't changed
**Example:** `React.memo(SeatComponent)`
**Use in:**
- Pure components
- List items
- Expensive renders

**Teach:** "Component only updates when its props change"

---

## PATTERN 3: Component Design

### Composition
**What:** Build complex UI from simple pieces
**Example:** `<Cinema><SeatMap /><Summary /></Cinema>`
**Use in:**
- All UI building
- Component libraries
- Reusable systems

**Teach:** "Like LEGO - combine simple pieces for complex results"

---

### Props Interface
**What:** Clear contract of what component needs
**Example:** `{ layout, seatTypes, onBookingComplete }`
**Use in:**
- All reusable components
- Team development
- Component libraries

**Teach:** "Props are the component's requirements document"

---

### Single Responsibility
**What:** Each component does ONE thing well
**Example:** `SeatMap` renders, `BookingSummary` calculates
**Use in:**
- All components
- Refactoring
- Team projects

**Teach:** "If you can't describe it in one sentence, it's too big"

---

## PATTERN 4: Accessibility

### Semantic HTML
**What:** Use correct HTML elements
**Example:** `<button>` not `<div onClick>`
**Use in:**
- All interfaces
- Screen readers
- Keyboard navigation

**Teach:** "Use HTML as designed - it's accessible by default"

---

### ARIA Labels
**What:** Describe elements for screen readers
**Example:** `aria-label="Seat A5, Premium, $25"`
**Use in:**
- Interactive elements
- Complex UIs
- Custom components

**Teach:** "Help screen readers describe your UI"

---

### Keyboard Navigation
**What:** Everything works with keyboard
**Example:** Tab, Enter, Space, Arrow keys
**Use in:**
- All interactive UIs
- Accessibility compliance
- Power users

**Teach:** "Some users can't use a mouse - keyboard must work"

---

## 🚀 REAL-WORLD EXAMPLES

### E-commerce
- Product configuration → Same state patterns
- Shopping cart → Same selection logic
- Checkout flow → Same form patterns

### Dashboards
- Data visualization → Same rendering patterns
- Filters → Same state management
- Real-time updates → Same optimization

### Booking Systems
- Seat selection → This exact project!
- Calendar booking → Similar patterns
- Resource reservation → Same logic

---

## 📚 TEACHING CHECKLIST

When explaining a pattern, always include:
- ✅ What it is
- ✅ Why we use it
- ✅ Where else it's used
- ✅ Common mistakes
- ✅ Real company examples