import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDimensions } from '../utils'; // Assuming utils.ts is in src

describe('getDimensions', () => {
  let mockReferenceEl: HTMLElement;
  let mockPopperEl: HTMLElement;

  // Store original getBoundingClientRect
  const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

  beforeEach(() => {
    // Create mock elements for each test
    mockReferenceEl = document.createElement('div');
    mockPopperEl = document.createElement('div');

    // Reset mocks for getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = vi.fn();
  });

  afterEach(() => {
    // Restore original getBoundingClientRect after all tests in this describe block
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    vi.restoreAllMocks();
  });

  it('should return correct dimensions based on getBoundingClientRect', () => {
    const refRect = {
      height: 50,
      width: 100,
      left: 10,
      top: 20,
      right: 110, // left + width
      bottom: 70, // top + height
      x: 10,
      y: 20,
      toJSON: () => JSON.stringify(this),
    };
    const popperRect = {
      height: 30,
      width: 60,
      left: 0,
      top: 0,
      right: 60,
      bottom: 30,
      x: 0,
      y: 0,
      toJSON: () => JSON.stringify(this),
    };

    (mockReferenceEl.getBoundingClientRect as ReturnType<typeof vi.fn>).mockReturnValue(refRect);
    (mockPopperEl.getBoundingClientRect as ReturnType<typeof vi.fn>).mockReturnValue(popperRect);

    const dimensions = getDimensions({ reference: mockReferenceEl, popper: mockPopperEl });

    expect(dimensions).toEqual({
      popperHeight: popperRect.height,
      popperWidth: popperRect.width,
      refHeight: refRect.height,
      refWidth: refRect.width,
      refLeft: refRect.left,
      refTop: refRect.top,
      refRight: refRect.right,
    });

    expect(mockReferenceEl.getBoundingClientRect).toHaveBeenCalledTimes(1);
    expect(mockPopperEl.getBoundingClientRect).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if elements are null or undefined', () => {
    expect(() => getDimensions({ reference: null as any, popper: mockPopperEl })).toThrow(
      'Reference or popper element is null or undefined'
    );
    expect(() => getDimensions({ reference: mockReferenceEl, popper: null as any })).toThrow(
      'Reference or popper element is null or undefined'
    );
  });

  it('should cache dimensions and call getBoundingClientRect only once per element', () => {
    const refRect = { height: 50, width: 100, left: 10, top: 20, right: 110, bottom: 70, x: 10, y: 20, toJSON: () => '' };
    const popperRect = { height: 30, width: 60, left: 0, top: 0, right: 60, bottom: 30, x: 0, y: 0, toJSON: () => '' };

    const refSpy = vi.spyOn(mockReferenceEl, 'getBoundingClientRect').mockReturnValue(refRect);
    const popperSpy = vi.spyOn(mockPopperEl, 'getBoundingClientRect').mockReturnValue(popperRect);

    // First call
    getDimensions({ reference: mockReferenceEl, popper: mockPopperEl });
    expect(refSpy).toHaveBeenCalledTimes(1);
    expect(popperSpy).toHaveBeenCalledTimes(1);

    // Second call with same elements
    getDimensions({ reference: mockReferenceEl, popper: mockPopperEl });
    expect(refSpy).toHaveBeenCalledTimes(1); // Should still be 1 due to caching
    expect(popperSpy).toHaveBeenCalledTimes(1); // Should still be 1 due to caching

    // Third call, forcing a different reference to ensure cache is not global in a wrong way
    const mockReferenceEl2 = document.createElement('div');
    const ref2Rect = { height: 10, width: 10, left: 1, top: 1, right: 11, bottom: 11, x:1, y:1, toJSON: () => '' };
    const ref2Spy = vi.spyOn(mockReferenceEl2, 'getBoundingClientRect').mockReturnValue(ref2Rect);
    
    getDimensions({ reference: mockReferenceEl2, popper: mockPopperEl });
    expect(ref2Spy).toHaveBeenCalledTimes(1);
    expect(popperSpy).toHaveBeenCalledTimes(1); // Popper was already cached, so still 1
    
    // Call again with the new reference and original popper
    getDimensions({ reference: mockReferenceEl2, popper: mockPopperEl });
    expect(ref2Spy).toHaveBeenCalledTimes(1); // Should still be 1
    expect(popperSpy).toHaveBeenCalledTimes(1); // Should still be 1
  });
});
