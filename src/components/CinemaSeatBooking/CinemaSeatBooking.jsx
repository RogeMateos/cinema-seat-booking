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
    <div className="w-full h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">Cinema Seat Booking</h1>
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