import { useState, useMemo } from 'react';

const COLORS = ['blue', 'purple', 'yellow', 'green'];

function buildInitialSeats(layout, bookedSeats, seatTypes) {
  return Array.from({ length: layout.rows }, (_, row) => {
    const rowLetter = String.fromCharCode(65 + row);
    let colorIndex = 0;
    let type = 'regular';
    let color = COLORS[0];
    let price = seatTypes.regular?.price || 0;

    for (const [t, config] of Object.entries(seatTypes)) {
      if (config.rows.includes(row)) {
        type = t;
        color = COLORS[colorIndex % COLORS.length];
        price = config.price;
        break;
      }
      colorIndex++;
    }

    return Array.from({ length: layout.seatsPerRow }, (_, i) => {
      const id = `${rowLetter}${i + 1}`;
      return {
        id,
        row: rowLetter,
        seat: i + 1,
        type,
        price,
        color,
        status: bookedSeats.includes(id) ? 'booked' : 'available',
        selected: false,
      };
    });
  });
}

export function useSeatSelection({ layout, seatTypes, bookedSeats }) {
  const [seats, setSeats] = useState(() => buildInitialSeats(layout, bookedSeats, seatTypes));

  const selectedSeats = useMemo(() => seats.flat().filter((s) => s.selected), [seats]);
  const hasBookedSeats = useMemo(() => seats.flat().some((s) => s.status === 'booked'), [seats]);
  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + s.price, 0),
    [selectedSeats]
  );

  const handleSeatClick = (rowIndex, seatIndex) => {
    setSeats((prev) =>
      prev.map((row, rIdx) =>
        rIdx === rowIndex
          ? row.map((s, sIdx) => (sIdx === seatIndex ? { ...s, selected: !s.selected } : s))
          : row
      )
    );
  };

  const handleReset = () => setSeats(buildInitialSeats(layout, [], seatTypes));

  const confirmBooking = () => {
    if (selectedSeats.length === 0) return null;

    const bookingData = {
      seats: selectedSeats.map(({ id, type, price }) => ({ id, type, price })),
      totalPrice,
      seatIds: selectedSeats.map((s) => s.id),
      timestamp: new Date().toISOString(),
    };

    setSeats((prev) =>
      prev.map((row) =>
        row.map((seat) =>
          selectedSeats.some((s) => s.id === seat.id)
            ? { ...seat, status: 'booked', selected: false }
            : seat
        )
      )
    );

    return bookingData;
  };

  return { seats, selectedSeats, hasBookedSeats, totalPrice, handleSeatClick, handleReset, confirmBooking };
}
