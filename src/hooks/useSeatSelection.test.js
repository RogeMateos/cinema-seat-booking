import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSeatSelection } from "./useSeatSelection";

const layout = {
  rows: 2,
  seatsPerRow: 2,
  aislePositions: [1],
};

const seatTypes = {
  regular: { price: 9.99, rows: [0, 1] },
};

describe("useSeatSelection", () => {
  it("selects a seat when clicked", () => {
    const { result } = renderHook(() =>
      useSeatSelection({ layout, seatTypes, bookedSeats: [] }),
    );

    act(() => {
      result.current.handleSeatClick(0, 0);
    });

    expect(result.current.selectedSeats).toHaveLength(1);
    expect(result.current.selectedSeats[0].id).toBe("A1");
  });

  it("deselects a seat when clicked twice", () => {
    const { result } = renderHook(() =>
      useSeatSelection({ layout, seatTypes, bookedSeats: [] }),
    );

    act(() => {
      result.current.handleSeatClick(0, 0);
    });

    act(() => {
      result.current.handleSeatClick(0, 0);
    });

    expect(result.current.selectedSeats).toHaveLength(0);
  });

  it("confirmBooking returns null when no seats selected", () => {
    const { result } = renderHook(() =>
      useSeatSelection({ layout, seatTypes, bookedSeats: [] }),
    );

    const bookingData = result.current.confirmBooking();

    expect(bookingData).toBeNull();
  });

  it("confirmBooking returns booking data with correct structure", () => {
    const { result } = renderHook(() =>
      useSeatSelection({ layout, seatTypes, bookedSeats: [] }),
    );

    act(() => {
      result.current.handleSeatClick(0, 0);
    });

    const bookingData = result.current.confirmBooking();

    expect(bookingData).not.toBeNull();
    expect(bookingData.seats).toHaveLength(1);
    expect(bookingData.seats[0]).toHaveProperty("id");
    expect(bookingData.seats[0]).toHaveProperty("type");
    expect(bookingData.seats[0]).toHaveProperty("price");
    expect(bookingData).toHaveProperty("totalPrice");
    expect(bookingData).toHaveProperty("seatIds");
    expect(bookingData).toHaveProperty("timestamp");
  });

  it("marks seats as booked after confirmBooking", () => {
    const { result } = renderHook(() =>
      useSeatSelection({ layout, seatTypes, bookedSeats: [] }),
    );

    act(() => {
      result.current.handleSeatClick(0, 0);
    });

    act(() => {
      result.current.confirmBooking();
    });

    expect(result.current.selectedSeats).toHaveLength(0);
    expect(result.current.hasBookedSeats).toBe(true);
    const bookedSeat = result.current.seats[0].find((s) => s.id === "A1");
    expect(bookedSeat.status).toBe("booked");
  });
});
