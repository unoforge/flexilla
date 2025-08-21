import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CreatePopper from '../popper'; 
import * as utils from '../utils'; // To mock getDimensions
import * as helpers from '../helpers'; // To mock determinePosition
import { Placement, PopperOptions } from '../types';

// Mock the helper modules
vi.mock('../utils');
vi.mock('../helpers');

describe('CreatePopper', () => {
  let referenceEl: HTMLElement;
  let popperEl: HTMLElement;

  const mockGetDimensions = vi.mocked(utils.getDimensions);
  const mockDeterminePosition = vi.mocked(helpers.determinePosition);

  // Spies on window event listeners
  const addEventSpy = vi.spyOn(window, 'addEventListener');
  const removeEventSpy = vi.spyOn(window, 'removeEventListener');

  beforeEach(() => {
    // Create fresh elements for each test
    referenceEl = document.createElement('div');
    document.body.appendChild(referenceEl);
    popperEl = document.createElement('div');
    document.body.appendChild(popperEl);

    // Reset mocks and spies
    vi.clearAllMocks();

    // Provide default mock implementations
    mockGetDimensions.mockReturnValue({
      refHeight: 50, refWidth: 100, refLeft: 10, refTop: 20, refRight: 110,
      popperHeight: 30, popperWidth: 60,
    });
    mockDeterminePosition.mockReturnValue({ x: 5, y: 15 });
  });

  afterEach(() => {
    // Clean up elements from the body
    if (referenceEl.parentNode) referenceEl.parentNode.removeChild(referenceEl);
    if (popperEl.parentNode) popperEl.parentNode.removeChild(popperEl);
  });

  describe('Instantiation', () => {
    it('should instantiate with default options', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      // Check internal properties (if accessible, otherwise test via behavior)
      // For this test, we'll assume we can't directly access private members easily
      // So, we'll check if updatePosition uses default values later
      expect(popperInstance).toBeInstanceOf(CreatePopper);
    });

    it('should instantiate with custom options', () => {
      const options: PopperOptions = {
        placement: 'bottom-end',
        offsetDistance: 15,
        eventEffect: { disableOnResize: true, disableOnScroll: false },
        onUpdate: vi.fn(),
      };
      const popperInstance = new CreatePopper(referenceEl, popperEl, options);
      expect(popperInstance).toBeInstanceOf(CreatePopper);
      // Further behavioral tests will confirm if these options are used
    });

    it('should throw error for invalid reference element', () => {
      expect(() => new CreatePopper(null as any, popperEl)).toThrow('Invalid HTMLElement for Reference Element');
    });

    it('should throw error for invalid popper element', () => {
      expect(() => new CreatePopper(referenceEl, null as any)).toThrow('Invalid HTMLElement for Popper Element');
    });

    it('should throw error for invalid offsetDistance type', () => {
      expect(() => new CreatePopper(referenceEl, popperEl, { offsetDistance: 'wrong' as any })).toThrow('OffsetDistance must be a number');
    });
  });

  describe('updatePosition', () => {
    it('should call getDimensions and determinePosition', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      popperInstance.updatePosition();
      expect(mockGetDimensions).toHaveBeenCalledWith({ reference: referenceEl, popper: popperEl });
      expect(mockDeterminePosition).toHaveBeenCalled();
    });

    it('should set popper styles based on determinePosition result', () => {
      mockDeterminePosition.mockReturnValue({ x: 123, y: 456 });
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      popperInstance.updatePosition();
      expect(popperEl.style.getPropertyValue('--fx-popper-placement-x')).toBe('123px');
      expect(popperEl.style.getPropertyValue('--fx-popper-placement-y')).toBe('456px');
    });

    it('should call onUpdate callback if provided', () => {
      const onUpdateSpy = vi.fn();
      const options: PopperOptions = { onUpdate: onUpdateSpy, placement: 'left' };
      mockDeterminePosition.mockReturnValue({ x: 10, y: 20 });
      
      const popperInstance = new CreatePopper(referenceEl, popperEl, options);
      popperInstance.updatePosition();
      
      expect(onUpdateSpy).toHaveBeenCalledWith({ x: 10, y: 20, placement: 'left' });
    });

    it('should attach window event listeners by default', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      popperInstance.updatePosition();
      expect(addEventSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(addEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should not attach resize listener if disableOnResize is true', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl, { eventEffect: { disableOnResize: true } });
      popperInstance.updatePosition();
      expect(addEventSpy).not.toHaveBeenCalledWith('resize', expect.any(Function));
      expect(addEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should not attach scroll listener if disableOnScroll is true', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl, { eventEffect: { disableOnScroll: true } });
      popperInstance.updatePosition();
      expect(addEventSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(addEventSpy).not.toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('setOptions', () => {
    it('should update placement and offsetDistance and recalculate position', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      // Call updatePosition once to establish initial state for spies
      popperInstance.updatePosition();
      vi.clearAllMocks(); // Clear mocks after initial updatePosition

      mockDeterminePosition.mockReturnValue({ x: 77, y: 88 }); // New position for setOptions call

      const newPlacement: Placement = 'right-end';
      const newOffset = 25;
      popperInstance.setOptions({ placement: newPlacement, offsetDistance: newOffset });

      // Check if determinePosition was called with new options
      expect(mockDeterminePosition).toHaveBeenCalledWith(expect.objectContaining({
        placement: newPlacement,
        offsetDistance: newOffset,
      }));
      // Check if styles are updated
      expect(popperEl.style.getPropertyValue('--fx-popper-placement-x')).toBe('77px');
      expect(popperEl.style.getPropertyValue('--fx-popper-placement-y')).toBe('88px');
    });

     it('should re-attach window event listeners', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      popperInstance.setOptions({ placement: 'top' });
      expect(addEventSpy).toHaveBeenCalledTimes(2); // Constructor (via updatePosition) + setOptions
    });
  });

  describe('cleanupEvents', () => {
    it('should clear popper styles', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      popperInstance.updatePosition(); // Set some styles
      popperEl.style.setProperty('--fx-popper-placement-x', '10px'); // Manually ensure property exists

      popperInstance.cleanupEvents();
      expect(popperEl.style.getPropertyValue('--fx-popper-placement-x')).toBe('');
    });

    it('should remove window event listeners if they were attached', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      popperInstance.updatePosition(); // This attaches listeners
      
      vi.clearAllMocks(); // Clear spies before calling cleanup

      popperInstance.cleanupEvents();
      expect(removeEventSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeEventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should not attempt to remove listeners if disabled and not attached', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl, { eventEffect: { disableOnResize: true, disableOnScroll: true } });
      popperInstance.updatePosition(); // Listeners are not attached here
      
      vi.clearAllMocks();

      popperInstance.cleanupEvents();
      expect(removeEventSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetPosition', () => {
    it('should clear popper styles', () => {
      const popperInstance = new CreatePopper(referenceEl, popperEl);
      popperInstance.updatePosition(); // Set some styles
      popperEl.style.setProperty('--fx-popper-placement-x', '10px');

      popperInstance.resetPosition();
      expect(popperEl.style.getPropertyValue('--fx-popper-placement-x')).toBe('');
    });
  });
});
