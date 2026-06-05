import { useEffect } from 'react';
import PropTypes from 'prop-types';

function BookingModal({ isOpen, onClose, bookingData, currency = '£' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !bookingData) return null;

  const { seats, totalPrice } = bookingData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Green header strip */}
        <div className="bg-green-500 px-6 pt-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2
            id="modal-title"
            className="text-2xl font-bold text-white"
          >
            Booking Confirmed!
          </h2>
          <p className="text-green-100 text-sm mt-1">
            Your seats have been reserved successfully.
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Seat breakdown */}
          <div className="divide-y divide-gray-100 mb-6">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <span className="font-semibold text-gray-900 w-16">
                  Seat {seat.id}
                </span>
                <span className="capitalize text-gray-500 flex-1 text-center">
                  {seat.type}
                </span>
                <span className="font-semibold text-gray-800 w-16 text-right">
                  {currency}{seat.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-6">
            <span className="text-sm font-bold text-gray-700">
              Total paid
            </span>
            <span className="text-2xl font-bold text-green-600">
              {currency}{totalPrice.toFixed(2)}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            autoFocus
            className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold text-base transition-all duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

BookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingData: PropTypes.shape({
    seats: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
    totalPrice: PropTypes.number.isRequired,
  }),
  currency: PropTypes.string,
};

export default BookingModal;
