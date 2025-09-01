import {GeoBounds} from './types';

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
