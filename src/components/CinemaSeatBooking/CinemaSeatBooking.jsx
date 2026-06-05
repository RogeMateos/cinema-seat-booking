import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import SeatMap from '../SeatMap';
import SeatLegend from '../SeatLegend';
import BookingModal from '../BookingModal';

const DEFAULT_LAYOUT = {
  rows: 10,
  seatsPerRow: 12,
  aislePositions: [3, 9],
};

const DEFAULT_SEAT_TYPES = {
  regular: { price: 9.99,  rows: [0, 1, 2, 3, 4] },
  premium: { price: 12.99, rows: [5, 6, 7] },
  vip:     { price: 16.99, rows: [8, 9] },
};

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

function CinemaSeatBooking({
  layout = DEFAULT_LAYOUT,
  seatTypes = DEFAULT_SEAT_TYPES,
  bookedSeats = [],
  currency = '£',
  onBookingComplete = () => {},
  title = 'Cinema Hall Booking',
  subtitle = 'Select your seats',
}) {
  const [seats, setSeats] = useState(() => buildInitialSeats(layout, bookedSeats, seatTypes));
  const [modal, setModal] = useState({ isOpen: false, bookingData: null });

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

  const handleCloseModal = () => setModal({ isOpen: false, bookingData: null });

  const handleBooking = () => {
    if (selectedSeats.length === 0) return;

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

    onBookingComplete(bookingData);
    setModal({ isOpen: true, bookingData });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            {title}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600">{subtitle}</p>
        </div>

        <SeatMap
          seats={seats}
          layout={layout}
          currency={currency}
          onSeatClick={handleSeatClick}
        />

        <SeatLegend seatTypes={seatTypes} currency={currency} />

        {/* Booking Summary */}
        <div className="flex justify-center mb-4 sm:mb-6 px-2">
          <div className="w-full max-w-md bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Booking Summary</h3>

            {selectedSeats.length === 0 ? (
              <div className="flex flex-col gap-1 pt-2">
                <p className="text-sm font-medium text-gray-700">No seats selected yet</p>
                <p className="text-xs text-gray-400">
                  Click as many seats as you need above, then confirm your booking below.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 mb-2">
                  Add more seats above or confirm your selection below.
                </p>
                <div className="divide-y divide-gray-200">
                  {selectedSeats.map((s) => (
                    <div key={s.id} className="flex justify-between items-center py-1.5 text-sm">
                      <span className="font-medium text-gray-900">Seat {s.id}</span>
                      <span className="text-gray-500 capitalize">{s.type}</span>
                      <span className="font-semibold text-gray-800">
                        {currency}{s.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-700">
                    Total ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {currency}{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Booking */}
        <div className="flex justify-center mt-4 sm:mt-8 px-2">
          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
            className={`w-full max-w-md px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 ${
              selectedSeats.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95'
            }`}
          >
            {selectedSeats.length === 0
              ? 'Select seats above to continue'
              : `Confirm Booking — ${currency}${totalPrice.toFixed(2)}`}
          </button>
        </div>

        {/* Start Over */}
        {hasBookedSeats && (
          <div className="flex justify-center mt-3 px-2">
            <button
              onClick={handleReset}
              className="w-full max-w-md px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-500 font-semibold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 transition-all duration-200"
            >
              Start Over — Clear all seats
            </button>
          </div>
        )}

      </div>

      <BookingModal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        bookingData={modal.bookingData}
        currency={currency}
      />
    </div>
  );
}

CinemaSeatBooking.propTypes = {
  layout: PropTypes.shape({
    rows: PropTypes.number.isRequired,
    seatsPerRow: PropTypes.number.isRequired,
    aislePositions: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  seatTypes: PropTypes.objectOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
      rows: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ),
  bookedSeats: PropTypes.arrayOf(PropTypes.string),
  currency: PropTypes.string,
  onBookingComplete: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default CinemaSeatBooking;
