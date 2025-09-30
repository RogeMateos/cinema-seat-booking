import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// Color constants for different seat types
const COLORS = ['blue', 'purple', 'yellow', 'green'];

// Default values (defined outside component to prevent recreating objects)
const DEFAULT_LAYOUT = {
  rows: 10,
  seatsPerRow: 12,
  aislePositions: [3, 9]
};

const DEFAULT_SEAT_TYPES = {
  regular: {
    price: 9.99,
    rows: [0, 1, 2, 3, 4]
  },
  premium: {
    price: 12.99,
    rows: [5, 6, 7]
  },
  vip: {
    price: 16.99,
    rows: [8, 9]
  }
};

/**
 * CinemaSeatBooking Component
 * A highly scalable and configurable component for booking cinema seats
 */
function CinemaSeatBooking({
  layout = DEFAULT_LAYOUT,
  seatTypes = DEFAULT_SEAT_TYPES,
  bookedSeats = [],
  currency = '£',
  onBookingComplete = () => {},
  title = 'Cinema Hall Booking',
  subtitle = 'Select your seats'
}) {
  // State management
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /**
   * Helper function to get Tailwind color classes based on color name
   */
  const getColorClass = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-500',
        border: 'border-blue-600',
        text: 'text-white'
      },
      purple: {
        bg: 'bg-purple-500',
        border: 'border-purple-600',
        text: 'text-white'
      },
      yellow: {
        bg: 'bg-yellow-400',
        border: 'border-yellow-500',
        text: 'text-gray-900'
      },
      green: {
        bg: 'bg-green-500',
        border: 'border-green-600',
        text: 'text-white'
      }
    };

    return colorMap[color] || colorMap.blue;
  };

  /**
   * Helper function to get seat type information for a given row
   */
  const getSeatType = useCallback((rowIndex) => {
    let colorIndex = 0;

    for (const [type, config] of Object.entries(seatTypes)) {
      if (config.rows.includes(rowIndex)) {
        return {
          type,
          color: COLORS[colorIndex % COLORS.length],
          price: config.price,
          config
        };
      }
      colorIndex++;
    }

    // Fallback for rows not specified in any seat type
    return {
      type: 'regular',
      color: COLORS[0],
      price: seatTypes.regular?.price || 0,
      config: seatTypes.regular || {}
    };
  }, [seatTypes]);

  /**
   * Initialize seats data structure
   */
  const initializeSeats = useMemo(() => {
    const seatsArray = [];

    for (let row = 0; row < layout.rows; row++) {
      const rowSeats = [];
      const rowLetter = String.fromCharCode(65 + row);
      const { type, color, price } = getSeatType(row);

      for (let seat = 1; seat <= layout.seatsPerRow; seat++) {
        const seatId = `${rowLetter}${seat}`;
        const isBooked = bookedSeats.includes(seatId);

        rowSeats.push({
          id: seatId,
          row: rowLetter,
          seat: seat,
          type: type,
          price: price,
          color: color,
          status: isBooked ? 'booked' : 'available',
          selected: false
        });
      }

      seatsArray.push(rowSeats);
    }

    return seatsArray;
  }, [bookedSeats, layout, getSeatType]);

  // Initialize seats ONLY on mount
  useEffect(() => {
    setSeats(initializeSeats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Handle seat click/selection
   */
  const handleSeatClick = (rowIndex, seatIndex) => {
    const seat = seats[rowIndex][seatIndex];

    // Guard clause: prevent clicking booked seats
    if (seat.status === 'booked') {
      return;
    }

    const isCurrentlySelected = seat.selected;

    // Update seats state immutably
    setSeats((prevSeats) => {
      return prevSeats.map((row, rIdx) => {
        if (rIdx === rowIndex) {
          return row.map((s, sIdx) => {
            if (sIdx === seatIndex) {
              return { ...s, selected: !s.selected };
            }
            return s;
          });
        }
        return row;
      });
    });

    // Update selectedSeats array
    setSelectedSeats((prevSelected) => {
      if (isCurrentlySelected) {
        return prevSelected.filter((s) => s.id !== seat.id);
      } else {
        return [...prevSelected, seat];
      }
    });
  };

  /**
   * Calculate total price of selected seats
   */
  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  /**
   * Handle booking completion
   */
  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to book.');
      return;
    }

    // Update seats state - mark selected seats as booked
    setSeats((prevSeats) => {
      return prevSeats.map((row) => {
        return row.map((seat) => {
          const isSelected = selectedSeats.some((s) => s.id === seat.id);
          if (isSelected) {
            return {
              ...seat,
              status: 'booked',
              selected: false
            };
          }
          return seat;
        });
      });
    });

    // Create booking data
    const bookingData = {
      seats: selectedSeats.map((seat) => ({
        id: seat.id,
        type: seat.type,
        price: seat.price
      })),
      totalPrice: getTotalPrice(),
      seatIds: selectedSeats.map((s) => s.id),
      timestamp: new Date().toISOString()
    };

    onBookingComplete(bookingData);

    const seatCount = selectedSeats.length;
    const total = getTotalPrice();
    alert(`Successfully booked ${seatCount} seat(s) for ${currency}${total}!`);

    setSelectedSeats([]);
  };

  /**
   * Get appropriate className for seat based on its state
   */
  const getSeatClassName = (seat) => {
    const baseClasses = 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 m-0.5 rounded-t-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-bold';

    if (seat.status === 'booked') {
      return `${baseClasses} bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed`;
    }

    if (seat.selected) {
      return `${baseClasses} bg-green-500 border-green-600 text-white transform scale-110`;
    }

    const colorClasses = getColorClass(seat.color);
    return `${baseClasses} ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text} hover:scale-105`;
  };

  /**
   * Render a section of seats in a row
   */
  const renderSeatSection = (seatRow, startIndex, endIndex, rowIndex) => {
    return seatRow.slice(startIndex, endIndex).map((seat, index) => {
      const seatNumber = startIndex + index + 1;
      const seatIndex = startIndex + index;
      const seatInfo = `Seat ${seat.id} - ${seat.type} - ${currency}${seat.price}`;
      const statusText = seat.status === 'booked' ? 'Booked' : seat.selected ? 'Selected' : 'Available';
      const ariaLabel = `${seatInfo} - ${statusText}`;
      const className = getSeatClassName(seat);

      const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSeatClick(rowIndex, seatIndex);
        }
      };

      return (
        <div
          key={seat.id}
          className={className}
          title={seatInfo}
          aria-label={ariaLabel}
          role="button"
          tabIndex={seat.status === 'booked' ? -1 : 0}
          onClick={() => handleSeatClick(rowIndex, seatIndex)}
          onKeyDown={handleKeyDown}
        >
          {seatNumber}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Cinema Screen */}
        <div className="flex flex-col items-center mb-16">
          <div className="w-full max-w-4xl mb-4">
            <div className="h-2 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 rounded-t-full shadow-lg transform perspective-1000"
                 style={{
                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                   transform: 'perspective(400px) rotateX(-15deg)'
                 }}>
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 tracking-widest">
            SCREEN
          </div>
        </div>

        {/* Seat Map */}
        <div className="flex justify-center overflow-x-auto pb-8">
          <div className="inline-block">
            <div className="flex flex-col gap-2">
              {seats.map((seatRow, rowIndex) => {
                const rowLetter = String.fromCharCode(65 + rowIndex);
                const firstAisle = layout.aislePositions[0];
                const secondAisle = layout.aislePositions[1];

                return (
                  <div key={rowLetter} className="flex items-center gap-2">
                    <div className="w-8 text-center font-bold text-gray-600 text-sm">
                      {rowLetter}
                    </div>

                    <div className="flex gap-1">
                      {renderSeatSection(seatRow, 0, firstAisle, rowIndex)}
                    </div>

                    <div className="w-6 md:w-8"></div>

                    <div className="flex gap-1">
                      {renderSeatSection(seatRow, firstAisle, secondAisle, rowIndex)}
                    </div>

                    <div className="w-6 md:w-8"></div>

                    <div className="flex gap-1">
                      {renderSeatSection(seatRow, secondAisle, layout.seatsPerRow, rowIndex)}
                    </div>

                    <div className="w-8 text-center font-bold text-gray-600 text-sm">
                      {rowLetter}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Seat Legend */}
        <div className="flex justify-center mt-8 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {Object.entries(seatTypes).map(([type, config], index) => {
                const color = COLORS[index % COLORS.length];
                const colorClasses = getColorClass(color);

                return (
                  <div key={type} className="flex items-center">
                    <div
                      className={`w-8 h-8 border-2 rounded-t-lg mr-2 ${colorClasses.bg} ${colorClasses.border}`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {type.charAt(0).toUpperCase() + type.slice(1)} ({currency}{config.price})
                    </span>
                  </div>
                );
              })}

              <div className="flex items-center">
                <div className="w-8 h-8 border-2 rounded-t-lg mr-2 bg-green-500 border-green-600"></div>
                <span className="text-sm font-medium text-gray-700">Selected</span>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-8 border-2 rounded-t-lg mr-2 bg-gray-300 border-gray-400"></div>
                <span className="text-sm font-medium text-gray-700">Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h3>

            {selectedSeats.length === 0 ? (
              <p className="text-sm text-gray-500">No seats selected</p>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Selected Seats: </span>
                  <span className="text-sm text-gray-900">
                    {selectedSeats.map((s) => s.id).join(', ')}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Number of Seats: </span>
                  <span className="text-sm text-gray-900">{selectedSeats.length}</span>
                </div>

                <div className="pt-2 border-t border-gray-300">
                  <span className="text-base font-bold text-gray-700">Total: </span>
                  <span className="text-2xl font-bold text-green-600">
                    {currency}{getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Book Now Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
            className={`
              w-full max-w-md px-8 py-4 rounded-lg font-bold text-lg
              transition-all duration-200 transform
              ${selectedSeats.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95'
              }
            `}
          >
            {selectedSeats.length === 0
              ? 'Select Seats to Book'
              : `Book ${selectedSeats.length} Seat(s) - ${currency}${getTotalPrice()}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}

CinemaSeatBooking.propTypes = {
  layout: PropTypes.shape({
    rows: PropTypes.number.isRequired,
    seatsPerRow: PropTypes.number.isRequired,
    aislePositions: PropTypes.arrayOf(PropTypes.number).isRequired
  }),
  seatTypes: PropTypes.shape({
    regular: PropTypes.shape({
      price: PropTypes.number.isRequired,
      rows: PropTypes.arrayOf(PropTypes.number).isRequired
    }),
    premium: PropTypes.shape({
      price: PropTypes.number.isRequired,
      rows: PropTypes.arrayOf(PropTypes.number).isRequired
    }),
    vip: PropTypes.shape({
      price: PropTypes.number.isRequired,
      rows: PropTypes.arrayOf(PropTypes.number).isRequired
    })
  }),
  bookedSeats: PropTypes.arrayOf(PropTypes.string),
  currency: PropTypes.string,
  onBookingComplete: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default CinemaSeatBooking;