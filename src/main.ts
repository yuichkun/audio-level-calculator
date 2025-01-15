import './style.css'

type MeasurementType = 'rms' | 'peak';

function dbToLinear(db: number): number {
  return 10 ** (db / 20);
}

function linearToDb(linear: number): number {
  return 20 * Math.log10(linear);
}

function combineRMS(rmsValues: number[]): number {
  // Convert dB to linear scale
  const linearValues = rmsValues.map(dbToLinear);

  // Combine in linear scale (root mean square)
  const combinedLinear = Math.sqrt(linearValues.reduce((sum, value) => sum + value ** 2, 0));

  // Convert back to dB
  return linearToDb(combinedLinear);
}

function combinePeak(peakValues: number[]): number {
  // Convert dB to linear scale
  const linearValues = peakValues.map(dbToLinear);

  // Simple sum for peak (assuming perfect phase alignment)
  const combinedLinear = linearValues.reduce((sum, value) => sum + value, 0);

  // Convert back to dB
  return linearToDb(combinedLinear);
}

document.addEventListener('DOMContentLoaded', () => {
  const calculateButton = document.getElementById('calculate');
  const rmsInput = document.getElementById('rms-values') as HTMLInputElement;
  const resultsDiv = document.getElementById('results');

  if (!calculateButton || !rmsInput || !resultsDiv) {
    console.error('Required DOM elements not found');
    return;
  }

  calculateButton.addEventListener('click', () => {
    const input = rmsInput.value;
    const dbValues = input.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));

    if (dbValues.length === 0) {
      resultsDiv.textContent = 'Please enter valid dB values.';
      return;
    }

    const rmsResult = combineRMS(dbValues);
    const peakResult = combinePeak(dbValues);

    const results = [
      `Combined RMS: ${rmsResult.toFixed(2)} dB`,
      `Combined Peak: ${peakResult.toFixed(2)} dB`
    ];

    resultsDiv.innerHTML = results.join('<br>');
  });
}); 