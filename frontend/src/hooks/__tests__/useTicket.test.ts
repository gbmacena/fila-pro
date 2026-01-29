import { renderHook, act } from "@testing-library/react";
import { useTicket } from "../useTicket";

jest.mock("@/services/tickets", () => ({
  ticketService: {
    createTicket: jest.fn(),
  },
}));

jest.mock("@/lib/config", () => ({
  STORAGE_KEYS: {
    TOKEN: "token",
  },
}));

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as unknown as Storage;

describe("useTicket", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("mock-token");
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useTicket());

    expect(result.current.ticket).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should reset state", () => {
    const { result } = renderHook(() => useTicket());

    act(() => {
      result.current.reset();
    });

    expect(result.current.ticket).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
