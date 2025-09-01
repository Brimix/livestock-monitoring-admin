import {LsuDeviceData} from '../../domain';

import {MAP_BOUNDS} from './constants';
import {DevicePin, GeoBounds} from './types';

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Convert Latitude/Longitude to pixel coordinates inside an image of width×height.
 * y-axis is top→down in pixels; latitude increases north→south in negative screen direction.
 */
export const latLngToXY = (
  lat: number,
  lng: number,
  bounds: GeoBounds,
  width: number,
  height: number
) => {
  const { north, south, east, west } = bounds;
  const xRatio = (lng - west) / (east - west);
  const yRatio = (north - lat) / (north - south);
  const x = xRatio * width;
  const y = yRatio * height;
  return { x, y };
};

/**
 * Get computed padding values from an element
 */
export function getPadding(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return {
    left: parseFloat(cs.paddingLeft) || 0,
    top: parseFloat(cs.paddingTop) || 0,
    right: parseFloat(cs.paddingRight) || 0,
    bottom: parseFloat(cs.paddingBottom) || 0,
  };
}

/**
 * Measure the rendered image box inside a container with object-contain
 * Accounts for letterboxing/padding created by object-contain
 */
export function measureRenderBox(outer: HTMLElement, img: HTMLImageElement) {
  const natW = img.naturalWidth || 1;
  const natH = img.naturalHeight || 1;
  const pad = getPadding(outer);

  // clientWidth/Height are the padding box; subtract padding to get content area
  const contentW = outer.clientWidth - pad.left - pad.right;
  const contentH = outer.clientHeight - pad.top - pad.bottom;

  // object-contain: scale to fit within content area, preserve aspect
  const scale = Math.min(contentW / natW, contentH / natH);
  const width = natW * scale;
  const height = natH * scale;

  // letterbox offsets (relative to outer's padding edge)
  const left = pad.left + (contentW - width) / 2;
  const top = pad.top + (contentH - height) / 2;

  return new DOMRect(left, top, width, height);
}

/**
 * Check if a device is visible within the map bounds
 */
export function isDeviceVisible(lat: number, lng: number, bounds: GeoBounds): boolean {
  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
}

export const createPinFromDevice = (device: LsuDeviceData, imageRect: DOMRect): DevicePin => {
  const {x, y} = latLngToXY(device.lat, device.lng, MAP_BOUNDS, imageRect.width, imageRect.height);
  const visible = isDeviceVisible(device.lat, device.lng, MAP_BOUNDS);
  return {device, x, y, visible};
};
