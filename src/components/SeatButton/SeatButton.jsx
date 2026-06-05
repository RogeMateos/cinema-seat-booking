import PropTypes from 'prop-types';
import { getColorClass } from '../../utils/colorUtils';

const BASE = 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 m-px sm:m-0.5 rounded-t-lg border-2 transition-all duration-200 flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold';

function getClassName(seat) {
  if (seat.status === 'booked') {
    return `${BASE} bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed`;
  }
  if (seat.selected) {
    return `${BASE} bg-green-500 border-green-600 text-white scale-110`;
  }
  const { bg, border, text } = getColorClass(seat.color);
  return `${BASE} ${bg} ${border} ${text} cursor-pointer hover:scale-105`;
}

function SeatButton({ seat, seatNumber, currency, onClick }) {
  const isBooked = seat.status === 'booked';
  const label = `Seat ${seat.id} — ${seat.type} — ${currency}${seat.price} — ${
    isBooked ? 'Booked' : seat.selected ? 'Selected' : 'Available'
  }`;

  return (
    <button
      className={getClassName(seat)}
      title={label}
      aria-label={label}
      aria-pressed={seat.selected}
      disabled={isBooked}
      onClick={onClick}
    >
      {seatNumber}
    </button>
  );
}

SeatButton.propTypes = {
  seat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
  }).isRequired,
  seatNumber: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SeatButton;
