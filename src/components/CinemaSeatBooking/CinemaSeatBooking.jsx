import { useEffect } from 'react';
import PropTypes from 'prop-types';

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

        {/* Placeholder for seats - will be added next */}
        <div className="flex justify-center">
          <div className="text-gray-400 text-sm">
            Seat selection will appear here
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