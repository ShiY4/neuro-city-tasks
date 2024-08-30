import React from 'react';
import ReactDOM from 'react-dom/client';
import Slider from './Slider/Slider.jsx';
import Canvas from './Canvas/Canvas.jsx';
import Uploader from './Uploader/Uploader.jsx';

const dom = (
  <>
    <Slider/>
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '100px'}}>
      <Canvas/>
      <Uploader/>
    </div>
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(dom);
