import { describe, it, expect } from 'vitest';
import { determinePosition } from '../helpers'; 
import { Placement } from '../types';

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
      { placement: 'top', ref: { refTop: 5 }, popper: { popperHeight: 20 }, offset: 0, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: 0 }, description: 'Pushed to top viewport edge' },
      { placement: 'top', ref: { refTop: 25 }, popper: { popperHeight: 20 }, offset: 10, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: 0 }, description: 'Pushed to top viewport edge by offset' },
      // Left edge
      { placement: 'left', ref: { refLeft: 5 }, popper: { popperWidth: 20 }, offset: 0, expected: { x: 0, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Pushed to left viewport edge' },
      { placement: 'left', ref: { refLeft: 25 }, popper: { popperWidth: 20 }, offset: 10, expected: { x: 0, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Pushed to left viewport edge by offset' },
      // Bottom edge
      { placement: 'bottom', ref: { refTop: defaultWindow.windowHeight - 5 - defaultReference.refHeight }, popper: { popperHeight: 20 }, offset: 0, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: defaultWindow.windowHeight - 20 }, description: 'Pushed to bottom viewport edge' },
      { placement: 'bottom', ref: { refTop: defaultWindow.windowHeight - defaultReference.refHeight - 25 }, popper: { popperHeight: 20 }, offset: 10, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: defaultWindow.windowHeight - 20 }, description: 'Pushed to bottom viewport edge by offset' },
      // Right edge
      { placement: 'right', ref: { refLeft: defaultWindow.windowWidth - 5 - defaultReference.refWidth }, popper: { popperWidth: 20 }, offset: 0, expected: { x: defaultWindow.windowWidth - 20, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Pushed to right viewport edge' },
      { placement: 'right', ref: { refLeft: defaultWindow.windowWidth - defaultReference.refWidth - 25 }, popper: { popperWidth: 20 }, offset: 10, expected: { x: defaultWindow.windowWidth - 20, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Pushed to right viewport edge by offset' },
    
      // Popper larger than viewport
      { placement: 'top', popper: { popperHeight: defaultWindow.windowHeight + 100 }, expected: { x: defaultReference.refLeft + defaultReference.refWidth / 2 - defaultPopper.popperWidth / 2, y: 0}, description: 'Popper taller than viewport, aligns top' },
      { placement: 'left', popper: { popperWidth: defaultWindow.windowWidth + 100 }, expected: { x: 0, y: defaultReference.refTop + defaultReference.refHeight / 2 - defaultPopper.popperHeight / 2 }, description: 'Popper wider than viewport, aligns left' },
    
      // Test alignment clipping when primary placement is fine but alignment pushes it out
      // Example: 'left-end' where ref is high, popper is tall
      { placement: 'left-end', ref: { refTop: 10, refHeight: 50 }, popper: { popperHeight: 100 }, offset: 0, 
        expected: { x: defaultReference.refLeft - defaultPopper.popperWidth - 0, y: 0 /* clips to 0 as refTop(10)+refHeight(50)-popperHeight(100) = -40 -> clipped to 0 */ }, 
        description: 'left-end, popper bottom clipped by viewport top'
      },
       // Example: 'right-start' where ref is low, popper is tall
      { placement: 'right-start', ref: { refTop: defaultWindow.windowHeight - 60, refHeight: 50 }, popper: { popperHeight: 100 }, offset: 0, 
        expected: { x: defaultReference.refLeft + defaultReference.refWidth + 0, y: defaultWindow.windowHeight - 100 /* clips to bottom as refTop(940) -> clipped to 900 */ }, 
        description: 'right-start, popper top clipped by viewport bottom'
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
});
