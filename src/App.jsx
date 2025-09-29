import CinemaSeatBooking from './components/CinemaSeatBooking/CinemaSeatBooking'

function App() {
  /**
   * Handle booking completion
   * @param {Object} bookingData - Booking information from child component
   */
  const handleBookingComplete = (bookingData) => {
    console.log('=== Booking Completed ===');
    console.log('Seats:', bookingData.seats);
    console.log('Total Price:', bookingData.totalPrice);
    console.log('Seat IDs:', bookingData.seatIds);
    console.log('Timestamp:', bookingData.timestamp);
    console.log('========================');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <CinemaSeatBooking
        bookedSeats={['C2', 'C4', 'D5', 'E8']}
        onBookingComplete={handleBookingComplete}
      />
    </div>
  )
}

export default App
