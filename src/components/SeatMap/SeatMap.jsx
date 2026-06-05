import PropTypes from 'prop-types';
import SeatButton from '../SeatButton';

function SeatMap({ seats, layout, currency, onSeatClick }) {
  const [firstAisle, secondAisle] = layout.aislePositions;

  const renderSection = (seatRow, rowIndex, from, to) =>
    seatRow.slice(from, to).map((seat, i) => (
      <SeatButton
        key={seat.id}
        seat={seat}
        seatNumber={from + i + 1}
        currency={currency}
        onClick={() => onSeatClick(rowIndex, from + i)}
      />
    ));

  return (
    <>
      {/* Screen */}
      <div className="flex flex-col items-center mb-6 sm:mb-12">
        <div className="w-full max-w-4xl mb-4">
          <div
            className="h-2 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 rounded-t-full shadow-lg"
            style={{ transform: 'perspective(400px) rotateX(-15deg)' }}
          />
        </div>
        <div className="text-sm font-medium text-gray-500 tracking-widest">SCREEN</div>
      </div>

      {/* Seat grid */}
      <div className="flex justify-center overflow-x-auto pb-8 px-2 sm:px-0 -mx-4 sm:mx-0">
        <div className="inline-block min-w-fit px-2 sm:px-0">
          <div className="flex flex-col gap-1 sm:gap-2">
            {seats.map((seatRow, rowIndex) => {
              const rowLetter = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowLetter} className="flex items-center gap-1 sm:gap-2">
                  <div className="w-5 sm:w-8 text-center font-bold text-gray-600 text-xs sm:text-sm flex-shrink-0">
                    {rowLetter}
                  </div>

                  <div className="flex gap-0.5 sm:gap-1">
                    {renderSection(seatRow, rowIndex, 0, firstAisle)}
                  </div>

                  <div className="w-2 sm:w-4 md:w-6 flex-shrink-0" />

                  <div className="flex gap-0.5 sm:gap-1">
                    {renderSection(seatRow, rowIndex, firstAisle, secondAisle)}
                  </div>

                  <div className="w-2 sm:w-4 md:w-6 flex-shrink-0" />

                  <div className="flex gap-0.5 sm:gap-1">
                    {renderSection(seatRow, rowIndex, secondAisle, layout.seatsPerRow)}
                  </div>

                  <div className="hidden sm:block w-8 text-center font-bold text-gray-600 text-sm flex-shrink-0">
                    {rowLetter}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

SeatMap.propTypes = {
  seats: PropTypes.arrayOf(PropTypes.array).isRequired,
  layout: PropTypes.shape({
    seatsPerRow: PropTypes.number.isRequired,
    aislePositions: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  onSeatClick: PropTypes.func.isRequired,
};

export default SeatMap;
