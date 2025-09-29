import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

// Color constants for different seat types
const COLORS = ['blue', 'purple', 'yellow', 'green'];

/**
 * CinemaSeatBooking Component
 * A highly scalable and configurable component for booking cinema seats
 *
 * @param {Object} props - Component props
 * @param {Object} props.layout - Cinema layout configuration
 * @param {number} props.layout.rows - Total number of rows in the cinema
 * @param {number} props.layout.seatsPerRow - Number of seats in each row
 * @param {number[]} props.layout.aislePositions - Array of aisle positions (e.g., [3, 9] creates aisles after seats 3 and 9)
 * @param {Object} props.seatTypes - Configuration for different seat types with pricing
 * @param {Object} props.seatTypes.regular - Regular seat configuration
 * @param {number} props.seatTypes.regular.price - Price for regular seats
 * @param {number[]} props.seatTypes.regular.rows - Row indices for regular seats (0-based)
 * @param {Object} props.seatTypes.premium - Premium seat configuration
 * @param {number} props.seatTypes.premium.price - Price for premium seats
 * @param {number[]} props.seatTypes.premium.rows - Row indices for premium seats (0-based)
 * @param {Object} props.seatTypes.vip - VIP seat configuration
 * @param {number} props.seatTypes.vip.price - Price for VIP seats
 * @param {number[]} props.seatTypes.vip.rows - Row indices for VIP seats (0-based)
 * @param {string[]} props.bookedSeats - Array of pre-reserved seat IDs (e.g., ['A5', 'B3', 'C10'])
 * @param {string} props.currency - Currency symbol to display (default: '₹')
 * @param {Function} props.onBookingComplete - Callback function triggered when booking is completed
 * @param {Object} props.onBookingComplete.selectedSeats - Array of selected seat IDs
 * @param {number} props.onBookingComplete.totalPrice - Total price of selected seats
 * @param {string} props.onBookingComplete.currency - Currency used
 * @param {string} props.title - Main heading text for the cinema hall (default: 'Cinema Hall Booking')
 * @param {string} props.subtitle - Subtitle text instructing users (default: 'Select your seats')
 */
function CinemaSeatBooking({
  layout = {
    rows: 10,
    seatsPerRow: 12,
    aislePositions: [3, 9]
  },
  seatTypes = {
    regular: {
      price: 150,
      rows: [0, 1, 2, 3, 4]
    },
    premium: {
      price: 200,
      rows: [5, 6, 7]
    },
    vip: {
      price: 300,
      rows: [8, 9]
    }
  },
  bookedSeats = [],
  currency = '₹',
  onBookingComplete = () => {},
  title = 'Cinema Hall Booking',
  subtitle = 'Select your seats'
}) {
  // State management
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  /**
   * Helper function to get Tailwind color classes based on color name
   * @param {string} color - Color name (blue, purple, yellow, green)
   * @returns {Object} - Object with background, border, and text color classes
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
   * @param {number} rowIndex - The row index to check
   * @returns {Object} - Seat type information including type, color, price, and config
   */
  const getSeatType = (rowIndex) => {
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
  };

  /**
   * Initialize seats data structure
   * Creates a 2D array of seat objects with unique IDs and properties
   */
  const initializeSeats = useMemo(() => {
    const seatsArray = [];

    for (let row = 0; row < layout.rows; row++) {
      const rowSeats = [];
      const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
      const { type, color, price } = getSeatType(row);

      for (let seat = 1; seat <= layout.seatsPerRow; seat++) {
        const seatId = `${rowLetter}${seat}`;
        const isBooked = bookedSeats.includes(seatId);
        // Temporarily mark some seats as selected for testing
        const isSelected = seatId === 'A5' || seatId === 'B3';

        rowSeats.push({
          id: seatId,
          row: rowLetter,
          seat: seat,
          type: type,
          price: price,
          color: color,
          status: isBooked ? 'booked' : 'available',
          selected: isSelected
        });
      }

      seatsArray.push(rowSeats);
    }

    return seatsArray;
  }, [bookedSeats, layout, seatTypes]);

  // Update seats state when initializeSeats changes
  useEffect(() => {
    setSeats(initializeSeats);
  }, [initializeSeats]);

  /**
   * Get appropriate className for seat based on its state
   * @param {Object} seat - Seat object with type, status, selected properties
   * @returns {string} - Complete className string for the seat
   */
  const getSeatClassName = (seat) => {
    // Base classes for all seats
    const baseClasses = 'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 m-0.5 rounded-t-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-bold';

    // If seat is booked
    if (seat.status === 'booked') {
      return `${baseClasses} bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed`;
    }

    // If seat is selected
    if (seat.selected) {
      return `${baseClasses} bg-green-500 border-green-600 text-white transform scale-110`;
    }

    // Available seat - use seat type color with hover effect
    const colorClasses = getColorClass(seat.color);
    return `${baseClasses} ${colorClasses.bg} ${colorClasses.border} ${colorClasses.text} hover:scale-105`;
  };

  /**
   * Render a section of seats in a row
   * @param {Array} seatRow - Array of seat objects for the row
   * @param {number} startIndex - Start index of the section
   * @param {number} endIndex - End index of the section
   * @param {number} rowIndex - Row index for key generation
   * @returns {JSX.Element[]} - Array of seat elements
   */
  const renderSeatSection = (seatRow, startIndex, endIndex, rowIndex) => {
    return seatRow.slice(startIndex, endIndex).map((seat, index) => {
      const seatNumber = startIndex + index + 1;
      const seatInfo = `Seat ${seat.id} - ${seat.type} - ${currency}${seat.price}`;
      const statusText = seat.status === 'booked' ? 'Booked' : seat.selected ? 'Selected' : 'Available';
      const ariaLabel = `${seatInfo} - ${statusText}`;

      return (
        <div
          key={seat.id}
          className={getSeatClassName(seat)}
          title={seatInfo}
          aria-label={ariaLabel}
          role="button"
          tabIndex={seat.status === 'booked' ? -1 : 0}
        >
          {seatNumber}
        </div>
      );
    });
  };

  // Log props for testing
  useEffect(() => {
    console.log('=== CinemaSeatBooking Props ===');
    console.log('Layout:', layout);
    console.log('Seat Types:', seatTypes);
    console.log('Booked Seats:', bookedSeats);
    console.log('Currency:', currency);
    console.log('Title:', title);
    console.log('Subtitle:', subtitle);
    console.log('OnBookingComplete:', typeof onBookingComplete);
    console.log('===============================');
  }, [layout, seatTypes, bookedSeats, currency, title, subtitle, onBookingComplete]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Main Container - Centered with max width */}
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
          {/* Screen visual - curved gradient */}
          <div className="w-full max-w-4xl mb-4">
            <div className="h-2 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 rounded-t-full shadow-lg transform perspective-1000"
                 style={{
                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                   transform: 'perspective(400px) rotateX(-15deg)'
                 }}>
            </div>
          </div>

          {/* Screen Label */}
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
                    {/* Row Letter */}
                    <div className="w-8 text-center font-bold text-gray-600 text-sm">
                      {rowLetter}
                    </div>

                    {/* First Section - Before first aisle */}
                    <div className="flex gap-1">
                      {renderSeatSection(seatRow, 0, firstAisle, rowIndex)}
                    </div>

                    {/* First Aisle */}
                    <div className="w-6 md:w-8"></div>

                    {/* Second Section - Between aisles */}
                    <div className="flex gap-1">
                      {renderSeatSection(seatRow, firstAisle, secondAisle, rowIndex)}
                    </div>

                    {/* Second Aisle */}
                    <div className="w-6 md:w-8"></div>

                    {/* Third Section - After second aisle */}
                    <div className="flex gap-1">
                      {renderSeatSection(seatRow, secondAisle, layout.seatsPerRow, rowIndex)}
                    </div>

                    {/* Row Letter (right side) */}
                    <div className="w-8 text-center font-bold text-gray-600 text-sm">
                      {rowLetter}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// PropTypes for type checking
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