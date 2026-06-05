const COLOR_MAP = {
  blue:   { bg: 'bg-blue-500',   border: 'border-blue-600',   text: 'text-white' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-white' },
  yellow: { bg: 'bg-yellow-400', border: 'border-yellow-500', text: 'text-gray-900' },
  green:  { bg: 'bg-green-500',  border: 'border-green-600',  text: 'text-white' },
};

export function getColorClass(color) {
  return COLOR_MAP[color] ?? COLOR_MAP.blue;
}
