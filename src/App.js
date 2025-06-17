import React, { useState, useEffect } from 'react';
import './App.css';

import Key from './Key.tsx';
import WaveSelector from './WaveSelector.tsx';
import Vizualizer from './Visualizer.tsx';

import sawtooth from './static/waves/sawtooth.svg';
import sine from './static/waves/sine.svg';
import square from './static/waves/square.svg';
import triangle from './static/waves/triangle.svg';
import miscWave from './static/waves/miscWave.svg';

import initialKeyStructs from './static/initialKeyStructs.js';

function App() {

  // const topKeys = {'w', 'e', 't', 'y', 'u', 'o', 'p'};
  const keys = ['a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k', 'o', 'l', 'p', ';'];

  const waves = {
    'sine': { icon: sine }, 
    'sawtooth': { icon: sawtooth }, 
    'square': { icon: square }, 
    'triangle': { icon: triangle },
    'custom': { icon: miscWave }
  };
  
  for (let i = 0; i < keys.length; i+=1) {
    initialKeyStructs[keys[i]] = {
      ...initialKeyStructs[keys[i]],
      isPlaying: false
    }
  }

  const [keyStructs, setKeyStructs] = useState(initialKeyStructs) // { speed: number, isPlaying: boolean }
  const [waveType, setWaveType] = useState('sine');
  
  const [customWave1, setCustomWave1] = useState('sine');
  const [customWave2, setCustomWave2] = useState('sine');

  const [amp1, setAmp1] = useState(50);
  const [amp2, setAmp2] = useState(50);

  const [detune1, setDetune1] = useState(50);
  const [detune2, setDetune2] = useState(50);

  const audioContext = new AudioContext();

  const [oscillator1, setOscillator1] = useState(new OscillatorNode(audioContext));
  const [oscillator2, setOscillator2] = useState(new OscillatorNode(audioContext));

  const [analyser, setAnalyser] = useState(undefined)

  const [gain, setGain] = useState(50);
  const [detune, setDetune] = useState(50);

  const setIsPlaying = (key, value) => {
    let newKeyStructs = keyStructs;
    newKeyStructs[key] = {
      ...keyStructs[key],
      isPlaying: value
    };
    // console.log(key, value, newKeyStructs[key], newKeyStructs)
    setKeyStructs(newKeyStructs);
  };

  const generalGain = audioContext.createGain();

  const keyComponents = 
    keys.map(key => {
      return (
        <div key={`${key} ${waveType}`}>
          <Key 
            keyName={key} 
            speed={keyStructs[key]?.speed ?? 1} 
            isPlaying={keyStructs[key]?.isPlaying ?? false}
            setIsPlaying={setIsPlaying}
            keyStructs={keyStructs}
            waveType={waveType}
            customWaves={[
              { wave: customWave1, amp: amp1, detune: detune1 }, 
              { wave: customWave2, amp: amp2, detune: detune2 }
            ]}
            gain={gain / 100}
            audioContext={audioContext}
            detune={detune}
            setOscillator1={setOscillator1}
            setOscillator2={setOscillator2}
            setAnalyser={setAnalyser}
            generalGain={generalGain}
            />
        </div>
      )
    }
  );

  return (
    <div className="App">
      <header className="App-header">
        <div className={`editor ${waveType === 'custom' ? 'visible' : ''}`}>
          <div className="wave-edit">
            <h1>Wave 1</h1>
            <input className='individualGain' type="range" onChange={(e) => {
              setAmp1(e.target.value);
              setAmp2(100 - e.target.value);
            }} value={amp1}></input>
            <WaveSelector 
              waves={waves} 
              waveType={customWave1} 
              setWaveType={setCustomWave1}
              detune={detune1}
              setDetune={setDetune1}
            />
          </div>
          <div className="wave-edit">
            <h1>Wave 2</h1>
            <input className='individualGain' type="range" onChange={(e) => {
              setAmp2(e.target.value);
              setAmp1(100 - e.target.value)
            }} value={amp2}></input>
            <WaveSelector 
              waves={waves} 
              waveType={customWave2} 
              setWaveType={setCustomWave2}
              detune={detune2}
              setDetune={setDetune2}
            />
          </div>
        </div>

        <div className="mainSelector">
          <WaveSelector 
            waves={waves}
            waveType={waveType}
            setWaveType={setWaveType}
            customizable={true}
            detune={detune}
            setDetune={setDetune}
          />
        </div>

        <Vizualizer
          audioContext={audioContext}
          osc1={oscillator1}
          osc2={oscillator2}
          analyser={analyser}
          generalGain={generalGain}
        />

        <div className="mainGain">
          <label for="gain" onClick={() => setGain(50)}>Gain</label>
          <input id="gain" name="gain" type="range" onChange={(e) => setGain(e.target.value)} value={gain}></input>
        </div>

        <div className="keyboard">
          {keyComponents}
        </div>
      </header>
    </div>
  );
}

export default App;
