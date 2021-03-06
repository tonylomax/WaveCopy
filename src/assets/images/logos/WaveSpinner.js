import Svg, {Path, Defs, Polygon, SvgXml, SvgCss} from 'react-native-svg';
import React, {useState} from 'react';
import {View} from 'react-native';

export default function WaveSpinner({style}) {
  const xml = `
  <svg width="153px" height="148px" viewBox="0 0 153 148" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">

 <path id="Path" d="M134.6 111.58 C118.405 136.176 88.865 148.43 60.016 142.52 31.166 136.611 8.823 113.728 3.604 84.745 -1.615 55.763 11.342 26.524 36.317 10.921 61.293 -4.681 93.253 -3.501 117.01 13.9 107.87 10.19 81.62 0.84 64.19 7.78 64.19 7.78 83.26 10.34 93.26 21.54 93.26 21.54 71.39 13.72 57.44 20.13 57.44 20.13 75.36 26.35 81.82 32.23 61.378 28.952 41.211 39.494 32.236 58.151 23.261 76.807 27.61 99.144 42.93 113.07 L42.93 113.07 C47.051 116.823 51.813 119.804 56.99 121.87 82.626 134.026 113.012 129.993 134.59 111.57" fill="#2a306c" fill-opacity="1" stroke="none">
<animateTransform attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from="0 72 72"
                          to="360 79 79"
                          dur="5s"

                          repeatCount="indefinite"/> </path>

 <path id="Path-1" d="M150.28 67.54 C150.28 88.887 138.012 108.333 118.747 117.524 99.483 126.716 76.65 124.018 60.058 110.589 71.856 117.03 86.118 117.032 97.916 110.595 109.714 104.158 117.431 92.165 118.4 78.76 118.78 43.69 80.06 36.92 77.2 36.46 L77.03 36.46 C93.91 33.55 104.2 37.23 104.2 37.23 98.2 27.71 83.48 22.11 83.48 22.11 94.39 20.73 110.86 26.99 110.86 26.99 106.34 17.83 93.6 12.19 93.6 12.19 L94.93 12.19 C109.618 12.187 123.706 18.021 134.092 28.407 144.479 38.794 150.313 52.881 150.31 67.57" fill="#2a306c" fill-opacity="1" stroke="none"> <animateTransform attributeName="transform"
                          attributeType="XML"
                          type="rotate"
                          from="0 72 72"
                          to="360 77 77"
                          dur="5s"
                          repeatCount="indefinite"/></path>
</svg>
`;

  return <SvgCss xml={xml} width="50%" height="100%" />;
}
