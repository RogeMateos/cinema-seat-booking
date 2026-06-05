export const DEFAULT_LAYOUT = {
  rows: 10,
  seatsPerRow: 12,
  aislePositions: [3, 9],
};

export const DEFAULT_SEAT_TYPES = {
  regular: { price: 9.99,  rows: [0, 1, 2, 3, 4] },
  premium: { price: 12.99, rows: [5, 6, 7] },
  vip:     { price: 16.99, rows: [8, 9] },
};
