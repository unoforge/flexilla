import { describe, it, expect } from 'vitest';
import { determinePosition } from '../helpers'; 
import type { Placement } from '../types';

// Default dimensions for a spacious environment
const defaultWindow = { windowHeight: 1000, windowWidth: 1000 };
const defaultReference = { refHeight: 100, refWidth: 100, refLeft: 450, refTop: 450 }; // Centered
const defaultPopper = { popperHeight: 50, popperWidth: 50 };
const defaultOffset = 0;

type TestCase = {
  placement: Placement;
  ref?: Partial<typeof defaultReference>;
  popper?: Partial<typeof defaultPopper>;
  window?: Partial<typeof defaultWindow>;
  offset?: number;
  expected: { x: number; y: number };
  description?: string;
};

describe('determinePosition', () => {
  // --- Test Suite for Basic Placements (No Offset, Ample Space) ---
  describe('Basic Placements (Centered Ref, Ample Space, No Offset)', () => {
    const common = { ...defaultWindow, ...defaultReference, ...defaultPopper, offsetDistance: defaultOffset };
    const testCases: TestCase[] = [
      // Top
      { placement: 'top', expected: { x: common.refLeft + common.refWidth / 2 - common.popperWidth / 2, y: common.refTop - common.popperHeight - defaultOffset } },
      { placement: 'top-start', expected: { x: common.refLeft, y: common.refTop - common.popperHeight - defaultOffset } },
      { placement: 'top-middle', expected: { x: common.refLeft + common.refWidth / 2 - common.popperWidth / 2, y: common.refTop - common.popperHeight - defaultOffset } },
      { placement: 'top-end', expected: { x: common.refLeft + common.refWidth - common.popperWidth, y: common.refTop - common.popperHeight - defaultOffset } },
      // Bottom
      { placement: 'bottom', expected: { x: common.refLeft + common.refWidth / 2 - common.popperWidth / 2, y: common.refTop + common.refHeight + defaultOffset } },
      { placement: 'bottom-start', expected: { x: common.refLeft, y: common.refTop + common.refHeight + defaultOffset } },
      { placement: 'bottom-middle', expected: { x: common.refLeft + common.refWidth / 2 - common.popperWidth / 2, y: common.refTop + common.refHeight + defaultOffset } },
      { placement: 'bottom-end', expected: { x: common.refLeft + common.refWidth - common.popperWidth, y: common.refTop + common.refHeight + defaultOffset } },
      // Left
      { placement: 'left', expected: { x: common.refLeft - common.popperWidth - defaultOffset, y: common.refTop + common.refHeight / 2 - common.popperHeight / 2 } },
      { placement: 'left-start', expected: { x: common.refLeft - common.popperWidth - defaultOffset, y: common.refTop } },
      { placement: 'left-middle', expected: { x: common.refLeft - common.popperWidth - defaultOffset, y: common.refTop + common.refHeight / 2 - common.popperHeight / 2 } },
      { placement: 'left-end', expected: { x: common.refLeft - common.popperWidth - defaultOffset, y: common.refTop + common.refHeight - common.popperHeight } },
      // Right
      { placement: 'right', expected: { x: common.refLeft + common.refWidth + defaultOffset, y: common.refTop + common.refHeight / 2 - common.popperHeight / 2 } },
      { placement: 'right-start', expected: { x: common.refLeft + common.refWidth + defaultOffset, y: common.refTop } },
      { placement: 'right-middle', expected: { x: common.refLeft + common.refWidth + defaultOffset, y: common.refTop + common.refHeight / 2 - common.popperHeight / 2 } },
      { placement: 'right-end', expected: { x: common.refLeft + common.refWidth + defaultOffset, y: common.refTop + common.refHeight - common.popperHeight } },
    ];

    testCases.forEach(({ placement, expected }) => {
      it(`should position correctly for: ${placement}`, () => {
        const result = determinePosition({ ...common, placement });
        expect(result.x).toBeCloseTo(expected.x);
        expect(result.y).toBeCloseTo(expected.y);
      });
    });
  });

  // --- Test Suite for Offset Distance ---
  describe('Offset Distance', () => {
    const offset = 10;
    const common = { ...defaultWindow, ...defaultReference, ...defaultPopper, offsetDistance: offset };
    const testCases: TestCase[] = [
      { placement: 'top', expected: { x: common.refLeft + common.refWidth / 2 - common.popperWidth / 2, y: common.refTop - common.popperHeight - offset } },
      { placement: 'bottom-start', expected: { x: common.refLeft, y: common.refTop + common.refHeight + offset } },
      { placement: 'left-middle', expected: { x: common.refLeft - common.popperWidth - offset, y: common.refTop + common.refHeight / 2 - common.popperHeight / 2 } },
      { placement: 'right', expected: { x: common.refLeft + common.refWidth + offset, y: common.refTop + common.refHeight / 2 - common.popperHeight / 2 } },
    ];
    testCases.forEach(({ placement, expected }) => {
      it(`should apply offset correctly for: ${placement}`, () => {
        const result = determinePosition({ ...common, placement });
        expect(result.x).toBeCloseTo(expected.x);
        expect(result.y).toBeCloseTo(expected.y);
      });
    });
  });

  // --- Test Suite for Viewport Clipping ---
  describe('Viewport Clipping', () => {
    // Popper near edge, should be clipped
    const clippingTestCases: TestCase[] = [
      // Top edge
      { placement: 'top', ref: { refTop: 5 }, popper: { popperHeight: 20 }, offset: 0, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: 105 }, description: 'Falls back to bottom when top does not fit' },
      { placement: 'top', ref: { refTop: 25 }, popper: { popperHeight: 20 }, offset: 10, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: 135 }, description: 'Falls back to bottom when top does not fit by offset' },
      // Left edge
      { placement: 'left', ref: { refLeft: 5 }, popper: { popperWidth: 20 }, offset: 0, expected: { x: 105, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Falls back to right when left does not fit' },
      { placement: 'left', ref: { refLeft: 25 }, popper: { popperWidth: 20 }, offset: 10, expected: { x: 135, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Falls back to right when left does not fit by offset' },
      // Bottom edge
      { placement: 'bottom', ref: { refTop: defaultWindow.windowHeight - 5 - defaultReference.refHeight }, popper: { popperHeight: 20 }, offset: 0, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: 875 }, description: 'Falls back to top when bottom does not fit' },
      { placement: 'bottom', ref: { refTop: defaultWindow.windowHeight - defaultReference.refHeight - 25 }, popper: { popperHeight: 20 }, offset: 10, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: 845 }, description: 'Falls back to top when bottom does not fit by offset' },
      // Right edge
      { placement: 'right', ref: { refLeft: defaultWindow.windowWidth - 5 - defaultReference.refWidth }, popper: { popperWidth: 20 }, offset: 0, expected: { x: 875, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Falls back to left when right does not fit' },
      { placement: 'right', ref: { refLeft: defaultWindow.windowWidth - defaultReference.refWidth - 25 }, popper: { popperWidth: 20 }, offset: 10, expected: { x: 845, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Falls back to left when right does not fit by offset' },
    
      // Popper larger than viewport
      { placement: 'top', popper: { popperHeight: defaultWindow.windowHeight + 100 }, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: -650}, description: 'Popper taller than viewport stays anchored to top side' },
      { placement: 'left', popper: { popperWidth: defaultWindow.windowWidth + 100 }, expected: { x: -650, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Popper wider than viewport stays anchored to left side' },
    
      // Test alignment clipping when primary placement is fine but alignment pushes it out
      // Example: 'left-end' where ref is high, popper is tall
      { placement: 'left-end', ref: { refTop: 10, refHeight: 50 }, popper: { popperHeight: 100 }, offset: 0, 
        expected: { x: defaultReference.refLeft - defaultPopper.popperWidth - 0, y: 0 /* clips to 0 as refTop(10)+refHeight(50)-popperHeight(100) = -40 -> clipped to 0 */ }, 
        description: 'left-end, popper bottom clipped by viewport top'
      },
       // Example: 'right-start' where ref is low, popper is tall
      { placement: 'right-start', ref: { refTop: defaultWindow.windowHeight - 60, refHeight: 50 }, popper: { popperHeight: 100 }, offset: 0, 
        expected: { x: defaultReference.refLeft + defaultReference.refWidth + 0, y: 668 }, 
        description: 'right-start remains visible at the bottom edge'
      }
    ];

    clippingTestCases.forEach(({ placement, ref, popper, window: win, offset, expected, description }) => {
      it(`should clip correctly for: ${placement} (${description || 'no desc'})`, () => {
        const params = {
          ...defaultWindow,
          ...win,
          ...defaultReference,
          ...ref,
          ...defaultPopper,
          ...popper,
          offsetDistance: offset !== undefined ? offset : defaultOffset,
          placement,
        };
        const result = determinePosition(params);
        expect(result.x).toBeCloseTo(expected.x);
        expect(result.y).toBeCloseTo(expected.y);
      });
    });
  });

  // --- Test Suite for Reference element at edge cases ---
  describe('Reference Element at Viewport Edges', () => {
    const edgeOffset = 2; // Small offset from the very edge
    const smallPopper = { popperHeight: 10, popperWidth: 10 };
    const edgeTestCases: TestCase[] = [
      // Reference at top-left
      { placement: 'bottom-end', ref: { refLeft: edgeOffset, refTop: edgeOffset }, popper: smallPopper, expected: { x: edgeOffset + defaultReference.refWidth - smallPopper.popperWidth, y: edgeOffset + defaultReference.refHeight + defaultOffset } },
      { placement: 'right-end', ref: { refLeft: edgeOffset, refTop: edgeOffset }, popper: smallPopper, expected: { x: edgeOffset + defaultReference.refWidth + defaultOffset, y: edgeOffset + defaultReference.refHeight - smallPopper.popperHeight } },
      // Reference at top-right
      { placement: 'bottom-start', ref: { refLeft: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset, refTop: edgeOffset }, popper: smallPopper, expected: { x: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset, y: edgeOffset + defaultReference.refHeight + defaultOffset } },
      { placement: 'left-end', ref: { refLeft: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset, refTop: edgeOffset }, popper: smallPopper, expected: { x: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset - smallPopper.popperWidth - defaultOffset, y: edgeOffset + defaultReference.refHeight - smallPopper.popperHeight } },
      // Reference at bottom-left
      { placement: 'top-end', ref: { refLeft: edgeOffset, refTop: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset }, popper: smallPopper, expected: { x: edgeOffset + defaultReference.refWidth - smallPopper.popperWidth, y: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset - smallPopper.popperHeight - defaultOffset } },
      { placement: 'right-start', ref: { refLeft: edgeOffset, refTop: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset }, popper: smallPopper, expected: { x: edgeOffset + defaultReference.refWidth + defaultOffset, y: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset } },
       // Reference at bottom-right
      { placement: 'top-start', ref: { refLeft: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset, refTop: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset }, popper: smallPopper, expected: { x: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset, y: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset - smallPopper.popperHeight - defaultOffset } },
      { placement: 'left-start', ref: { refLeft: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset, refTop: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset }, popper: smallPopper, expected: { x: defaultWindow.windowWidth - defaultReference.refWidth - edgeOffset - smallPopper.popperWidth - defaultOffset, y: defaultWindow.windowHeight - defaultReference.refHeight - edgeOffset } },
    ];

    edgeTestCases.forEach(({ placement, ref, popper, expected, description }) => {
      it(`should position correctly for: ${placement} with ref at edge (${description || 'no desc'})`, () => {
        const params = {
          ...defaultWindow,
          ...defaultReference, // mainly for default ref width/height
          ...ref, // specific refLeft, refTop
          ...defaultPopper,
          ...popper,
          offsetDistance: defaultOffset,
          placement,
        };
        const result = determinePosition(params);
        expect(result.x).toBeCloseTo(expected.x);
        expect(result.y).toBeCloseTo(expected.y);
      });
    });
  });

  describe('Readjust Height', () => {
    it('should anchor to top when top wins the fallback for a bottom placement', () => {
      const result = determinePosition({
        ...defaultWindow,
        ...defaultReference,
        placement: 'bottom',
        popperWidth: 80,
        popperHeight: 1982,
        refWidth: 100,
        refHeight: 124,
        refLeft: 450,
        refTop: 509,
        offsetDistance: 0,
      });

      expect(result.resolvedPlacement).toBe('top');
      expect(result.y).toBe(-1473);
    });

    it('should expose a constrained maxHeight for the side that wins the fallback', () => {
      const result = determinePosition({
        ...defaultWindow,
        ...defaultReference,
        placement: 'bottom',
        popperWidth: 80,
        popperHeight: 600,
        refWidth: 100,
        refHeight: 100,
        refLeft: 450,
        refTop: 300,
        offsetDistance: 0,
        readjustHeight: true,
        minHeight: 140,
      });

      expect(result.resolvedPlacement).toBe('bottom');
      expect(result.maxHeight).toBeUndefined();
      expect(result.y).toBeCloseTo(400);
    });

    it('should not expose maxHeight when the available space is below minHeight', () => {
      const result = determinePosition({
        ...defaultWindow,
        ...defaultReference,
        placement: 'bottom',
        popperWidth: 80,
        popperHeight: 600,
        refWidth: 100,
        refHeight: 100,
        refLeft: 450,
        refTop: 100,
        offsetDistance: 0,
        readjustHeight: true,
        minHeight: 140,
      });

      expect(result.maxHeight).toBeUndefined();
    });

    it('should move left-start upward before resizing when the panel can fit in the viewport', () => {
      const result = determinePosition({
        ...defaultWindow,
        windowHeight: 800,
        ...defaultReference,
        placement: 'left-start',
        popperWidth: 120,
        popperHeight: 430,
        refWidth: 100,
        refHeight: 100,
        refLeft: 700,
        refTop: 520,
        offsetDistance: 0,
        readjustHeight: true,
        minHeight: 140,
      });

      expect(result.resolvedPlacement).toBe('left');
      expect(result.y).toBe(338);
      expect(result.maxHeight).toBeUndefined();
    });

    it('should move right-end downward before resizing when the panel can fit in the viewport', () => {
      const result = determinePosition({
        ...defaultWindow,
        ...defaultReference,
        placement: 'right-end',
        popperWidth: 120,
        popperHeight: 380,
        refWidth: 100,
        refHeight: 100,
        refLeft: 100,
        refTop: 140,
        offsetDistance: 0,
        readjustHeight: true,
        minHeight: 140,
      });

      expect(result.resolvedPlacement).toBe('right');
      expect(result.y).toBe(0);
      expect(result.maxHeight).toBeUndefined();
    });

    it('should only resize right-middle when it is taller than the viewport', () => {
      const result = determinePosition({
        ...defaultWindow,
        ...defaultReference,
        placement: 'right-middle',
        popperWidth: 120,
        popperHeight: 1200,
        refWidth: 100,
        refHeight: 100,
        refLeft: 100,
        refTop: 250,
        offsetDistance: 0,
        readjustHeight: true,
        minHeight: 140,
      });

      expect(result.resolvedPlacement).toBe('right');
      expect(result.y).toBe(0);
      expect(result.maxHeight).toBe(1000);
    });

    it('should keep following an offscreen trigger for right-start', () => {
      const result = determinePosition({
        ...defaultWindow,
        ...defaultReference,
        placement: 'right-start',
        popperWidth: 120,
        popperHeight: 500,
        refWidth: 100,
        refHeight: 100,
        refLeft: 100,
        refTop: -40,
        offsetDistance: 0,
        readjustHeight: true,
        minHeight: 140,
      });

      expect(result.resolvedPlacement).toBe('right');
      expect(result.y).toBe(-40);
      expect(result.maxHeight).toBeUndefined();
    });
  });
});
