import React, { useEffect, useState, useRef } from 'react';
import './App.css';

import Visualizer from './Visualizer.tsx';

type CustomWave = { wave: OscillatorType, amp: number, detune: number };
type KeyProps = {
    keyName: string;
    audioFile: string;
    speed: number;
    isPlaying: boolean;
    setIsPlaying: (key: string, value: boolean) => void;
    keyStructs: any;
    waveType: OscillatorType;
    customWaves: CustomWave[];
    gain: number;
    audioContext: AudioContext;
    detune: number;
    oscillator1: OscillatorNode;
    oscillator2: OscillatorNode;
    setOscillator1: (osc: any) => void;
    setOscillator2: (osc: any) => void;
    setAnalyser: (analyzer: AnalyserNode) => void;
    generalGain: GainNode;
}

const Key = (props: KeyProps) => {

    const {
        keyName,
        audioFile,
        speed,
        setIsPlaying,
        keyStructs,
        waveType,
        customWaves,
        gain,
        audioContext,
        detune,
        setOscillator1,
        setOscillator2,
        setAnalyser,
        generalGain
    } = props;

    const [pressed, setPressed] = useState(false);
    const [osc1, _setOsc1] = useState();
    const [osc2, _setOsc2] = useState()

    const [analyser, _setAnalyser] = useState();

    const setOsc1 = (osc: OscillatorNode | undefined) => {
        _setOsc1(osc);
        setOscillator1(osc);
    }

    const setOsc2 = (osc: OscillatorNode | undefined) => {
        _setOsc2(osc);
        setOscillator2(osc);
    }

    const masterGain = audioContext.createGain();

    //  useEffect(() => {
    //     const analyser = audioContext.createAnalyser();

    //     // let merger = audioContext.createChannelMerger();
    //     // analyser.connect(merger, 0, 0);
    //     // osc1.connect()

    //     osc1.connect(analyser)
    //     analyser.connect(masterGain);
    //     masterGain.connect(audioContext.destination);
    //     setAnalyser(analyser);
    //     _setAnalyser(analyser)
    // }, [osc1])

    const customWave = () => {

        const osc1 = new OscillatorNode(audioContext, {
            frequency: 440 * speed,
            type: customWaves[0].wave,
            detune: (customWaves[0].detune - 50) * 2
        })
        const osc2 = new OscillatorNode(audioContext, {
            frequency: 440 * speed,
            type: customWaves[1].wave,
            detune: (customWaves[1].detune - 50) * 2
        })

        // TODO dedupe
        const gain1 = audioContext.createGain();
        gain1.gain.setValueAtTime(customWaves[0].amp / 100, audioContext.currentTime); // Volume for sine wave

        const gain2 = audioContext.createGain();
        gain2.gain.setValueAtTime(customWaves[1].amp / 100, audioContext.currentTime); // Volume for square wave

        osc1.connect(gain1);
        gain1.connect(generalGain);

        osc2.connect(gain2);
        gain2.connect(generalGain);

        playAudio(osc1, 0)
        playAudio(osc2, 1)
    }

    const playAudio = (newOsc: OscillatorNode, ind: number) => {
        newOsc.detune.setValueAtTime((newOsc.detune.value) + ((detune - 50) * 1.5), audioContext.currentTime);

        const analyser = audioContext.createAnalyser();
        // const analyserGain = audioContext.createGain();
        // masterGain.connect(analyser);
        // analyser.connect(analyserGain);
        // analyserGain.connect(generalGain);
        
        generalGain.gain.setValueAtTime(gain, audioContext.currentTime);
        generalGain.connect(analyser);
        generalGain.connect(audioContext.destination); 

        newOsc.start(audioContext.currentTime)
        if (ind === 0) {
            setOsc1(newOsc);
        } else {
            setOsc2(newOsc);
        };

        setAnalyser(analyser);
        _setAnalyser(analyser)
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const key = e.key;
        if (!pressed && key === keyName) {
            if (waveType !== 'custom') {
                const oscillator = new OscillatorNode(audioContext, {
                    frequency: 440 * speed,
                    type: waveType
                });
                oscillator.connect(generalGain);
                playAudio(oscillator, 0);
            } else {
                customWave();
            }
            setIsPlaying(key, true);
            setPressed(true);
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        const key = e.key;
        if (key === keyName) {
            osc1?.disconnect();
            osc2?.disconnect();
            analyser?.disconnect();
            setOsc1(undefined);
            setOsc2(undefined);
            setIsPlaying(e.key, false);
            setPressed(false);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    });

    let buttonKey = `${keyName} ${pressed}`;
    let classNames = `key ${keyName 
        + ' ' + (pressed ? 'pressed' : '') 
        + ' ' + keyStructs[keyName]?.color}`

    useEffect(() => {
        buttonKey = keyName + ' ' + pressed;
        classNames = `key ${keyName 
        + ' ' + (pressed ? 'pressed' : '') 
        + ' ' + keyStructs[keyName]?.color}`
    }, [keyStructs, pressed])

    return (
        <div>
            <button 
                key={buttonKey} 
                className={classNames}
                >
                {keyName}
                    {/* {analyser && (
                        <Visualizer
                            audioContext={audioContext}
                            osc1={osc1}
                            osc2={osc2}
                            analyser={analyser}
                            />
                    )} */}
            </button>
        </div>
    );
}

export default Key;
