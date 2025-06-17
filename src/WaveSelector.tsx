import React from 'react';

const WaveSelector = (props) => {
    const { waves, waveType, setWaveType, customizable, detune, setDetune } = props;

    return (
        <div className="selector">
            <div className="waves">
                {Object.keys(waves).map(wave => {
                    if (wave !== 'custom' || customizable) {
                        return (
                        <button
                            key={wave}
                            className={`${wave} wave ${wave === waveType ? 'pressed' : ''}`}
                            onClick={() => setWaveType(wave)}
                            >
                            <img src={waves[wave]?.icon} className={`${wave}-logo`} alt={`${wave}`} />
                        </button> 
                        )
                    }
                })}
            </div>
            {detune && (
                <div className="detune">
                    <input id="detune" name="detune" type="range" className="vranger slider" onChange={(e) => setDetune(e.target.value)} value={detune} />
                    <label for="detune" onClick={() => setDetune(50)}>Detune</label>
                </div>
            )}
        </div>
    )
};

export default WaveSelector;