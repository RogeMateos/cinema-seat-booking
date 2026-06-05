import PropTypes from 'prop-types';
import { getColorClass } from '../../utils/colorUtils';

const COLORS = ['blue', 'purple', 'yellow', 'green'];

function SeatLegend({ seatTypes, currency }) {
  return (
    <div className="flex justify-center mt-4 sm:mt-8 mb-4 sm:mb-6 px-2">
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm w-full max-w-2xl">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {Object.entries(seatTypes).map(([type, config], index) => {
            const { bg, border } = getColorClass(COLORS[index % COLORS.length]);
            return (
              <div key={type} className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-t-lg mr-1.5 sm:mr-2 flex-shrink-0 ${bg} ${border}`} />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {type.charAt(0).toUpperCase() + type.slice(1)} ({currency}{config.price})
                </span>
              </div>
            );
          })}

          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-t-lg mr-1.5 sm:mr-2 flex-shrink-0 bg-green-500 border-green-600" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Selected</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-t-lg mr-1.5 sm:mr-2 flex-shrink-0 bg-gray-300 border-gray-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

SeatLegend.propTypes = {
  seatTypes: PropTypes.objectOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
      rows: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  currency: PropTypes.string.isRequired,
};

export default SeatLegend;
