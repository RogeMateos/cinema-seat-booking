# React Re-render Prevention Guide

## Common Infinite Loop Bug Pattern

### The Problem
A very common React bug occurs when default prop objects cause infinite re-render loops.

### What Happened in Our Cinema Seat Booking Component

**The Bug:**
```javascript
// ❌ BAD - Creates NEW objects on every render
function CinemaSeatBooking({
  layout = {
    rows: 10,
    seatsPerRow: 12,
    aislePositions: [3, 9]
  },
  seatTypes = {
    regular: { price: 150, rows: [0, 1, 2, 3, 4] },
    premium: { price: 200, rows: [5, 6, 7] },
    vip: { price: 300, rows: [8, 9] }
  }
}) {
  const initializeSeats = useMemo(() => {
    // ... uses seatTypes and layout
  }, [seatTypes, layout]); // ⚠️ These are NEW objects every render!

  useEffect(() => {
    setSeats(initializeSeats);
  }, [initializeSeats]); // ⚠️ This runs every time initializeSeats changes
}
```

**Why It Fails:**
1. Component renders
2. Default objects `layout` and `seatTypes` are created as NEW objects (new memory reference)
3. `useMemo` sees dependencies changed (reference inequality)
4. `useMemo` recalculates `initializeSeats` (new array reference)
5. `useEffect` sees `initializeSeats` changed
6. `useEffect` runs `setSeats()` which triggers re-render
7. Go to step 1 → **INFINITE LOOP**

**Additional Problem:**
When user clicks to select a seat, the selection gets immediately overwritten because `setSeats(initializeSeats)` resets everything to default values.

---

## The Solution

### Step 1: Move Default Objects Outside Component

```javascript
// ✅ GOOD - Objects created once, same reference always
const DEFAULT_LAYOUT = {
  rows: 10,
  seatsPerRow: 12,
  aislePositions: [3, 9]
};

const DEFAULT_SEAT_TYPES = {
  regular: { price: 150, rows: [0, 1, 2, 3, 4] },
  premium: { price: 200, rows: [5, 6, 7] },
  vip: { price: 300, rows: [8, 9] }
};

function CinemaSeatBooking({
  layout = DEFAULT_LAYOUT,
  seatTypes = DEFAULT_SEAT_TYPES
}) {
  // Now layout and seatTypes have stable references!
}
```

### Step 2: Initialize State Only Once

```javascript
// ✅ GOOD - Only runs on mount
useEffect(() => {
  setSeats(initializeSeats);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Empty array = run once on mount

// ❌ BAD - Runs every time initializeSeats changes
useEffect(() => {
  setSeats(initializeSeats);
}, [initializeSeats]);
```

### Step 3: Use useCallback for Functions in Dependencies

```javascript
// ✅ GOOD - Function memoized, stable reference
const getSeatType = useCallback((rowIndex) => {
  // ... implementation
}, [seatTypes]);

const initializeSeats = useMemo(() => {
  // ... uses getSeatType
}, [bookedSeats, layout, seatTypes]);
```

---

## Quick Checklist to Prevent This Bug

- [ ] **Default object/array props?** → Move outside component as constants
- [ ] **useMemo dependencies include objects?** → Ensure those objects are stable references
- [ ] **useEffect resetting state?** → Should it run once or on every dependency change?
- [ ] **Function used in useMemo?** → Wrap in useCallback
- [ ] **Infinite console logs?** → Check for circular dependency chains

---

## Debugging Tips

### Add Temporary Logging

```javascript
// Check if something is re-rendering infinitely
useEffect(() => {
  console.log('🔄 Component rendering, count:', Date.now());
});

// Check if useMemo is recalculating
const value = useMemo(() => {
  console.log('💭 useMemo recalculating');
  return expensiveCalculation();
}, [deps]);

// Check if useEffect is running too often
useEffect(() => {
  console.log('⚡ useEffect triggered');
}, [dependency]);
```

### Look for These Patterns

```javascript
// 🚨 RED FLAG: Object literal as default prop
function Component({ config = { foo: 'bar' } }) { }

// 🚨 RED FLAG: Array literal as default prop
function Component({ items = ['a', 'b', 'c'] }) { }

// 🚨 RED FLAG: Function recreated every render in dependency
useEffect(() => {
  const handler = () => { /* ... */ };
  // ...
}, [handler]); // ❌ handler is always "new"
```

---

## The Golden Rule

> **If a value is used as a dependency in `useMemo`, `useCallback`, or `useEffect`, ensure it has a stable reference between renders (unless you WANT it to trigger on every render).**

---

## Real-World Example from Our Bug Fix

**Before (Broken):**
```javascript
function CinemaSeatBooking({
  seatTypes = { /* object literal */ }
}) {
  const initializeSeats = useMemo(() => {
    return generateSeats();
  }, [seatTypes]); // 🐛 seatTypes is NEW every render

  useEffect(() => {
    setSeats(initializeSeats); // 🐛 Overwrites user selections!
  }, [initializeSeats]);
}
```

**After (Fixed):**
```javascript
const DEFAULT_SEAT_TYPES = { /* moved outside */ };

function CinemaSeatBooking({
  seatTypes = DEFAULT_SEAT_TYPES
}) {
  const initializeSeats = useMemo(() => {
    return generateSeats();
  }, [seatTypes]); // ✅ seatTypes is stable

  useEffect(() => {
    setSeats(initializeSeats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ Only initialize once on mount
}
```

---

## Additional Resources

- [React useMemo Docs](https://react.dev/reference/react/useMemo)
- [React useCallback Docs](https://react.dev/reference/react/useCallback)
- [Understanding Re-renders](https://react.dev/learn/render-and-commit)
- [Referential Equality in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

---

**Remember:** React compares dependencies using `Object.is()` (similar to `===`). Two objects with the same content are NOT equal if they're different instances!

```javascript
{ foo: 'bar' } === { foo: 'bar' } // false! Different references
const obj = { foo: 'bar' };
obj === obj // true! Same reference
```
