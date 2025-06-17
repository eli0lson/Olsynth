import React, { useRef, useEffect } from 'react';


const Visualizer = (props: {
    audioContext: AudioContext, 
    osc1: OscillatorNode | undefined, 
    osc2: OscillatorNode | undefined,
    analyser: AnalyserNode | undefined,
    generalGain: GainNode
}) => {
        const { audioContext, osc1, analyser, generalGain } = props;

        // const analyser = audioContext.createAnalyser();
        // const analyserGain = audioContext.createGain();
        // const generalOsc = new OscillatorNode(audioContext);
        // generalGain.connect(analyser);
        // analyser.connect(audioContext.destination)

        const canvasRef = useRef(null);

        // generalGain.connect(generalOsc);
        // generalGain.connect(analyser);
        // analyser.connect(audioContext.destination);

        
        const drawVisualizer = () => {
            // if (osc2) {
            //     osc2.connect(analyser);
            // }
            const canvas = canvasRef.current;

            if (canvas) {
                const context = canvas.getContext('2d');
                context.lineWidth = 3;
                
                const bufferLength = analyser?.frequencyBinCount ?? 1024;
                const dataArray = new Float32Array(bufferLength);

                const draw = () => {
                    requestAnimationFrame(draw);
                    analyser?.getFloatTimeDomainData(dataArray);
                    context.clearRect(0, 0, 1000, 100);

                    context.beginPath();
                    for (let i = 0; i < bufferLength; i++) {
                        const x = (i / bufferLength) * 1000;
                        const y = (dataArray[i] + 1) * (100 / 2);
                        // if (y !== 100) {
                        //     console.log(y)
                        // }
                        if (i === 0) {
                            context.moveTo(x, y);
                        } else {
                            context.lineTo(x, y);
                        }
                    }
                    context.stroke();
                };
                draw();

                    // analyser.connect(analyserGain);
                    // analyserGain.connect(audioContext.destination);
                // } else {
                //     const dataArray = new Float32Array(1024);

                //     const draw = () => {
                //         requestAnimationFrame(draw);
                //         context.clearRect(0, 0, 1000, 100);

                //         context.beginPath();
                //         for (let i = 0; i < 1024; i++) {
                //             const x = (i / 1024) * 1000;
                //             const y = (dataArray[i] + 1) * (100 / 2);
                //             if (i === 0) {
                //                 context.moveTo(x, y);
                //             } else {
                //                 context.lineTo(x, y);
                //             }
                //         }
                //         context.stroke();
                //     };
                //     draw();
                // }
            
            }

        return <canvas ref={canvasRef} width="1000" height="100" />
    }

    useEffect(() => {
        drawVisualizer();
    }, [analyser])

    return drawVisualizer();
}

export default Visualizer;