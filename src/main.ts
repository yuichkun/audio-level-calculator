import './style.css'

function combineRMS(rmsValues: number[]): number {
  // Convert dB to linear scale
  const linearValues = rmsValues.map(rms => 10 ** (rms / 20));

  // Combine in linear scale
  const combinedLinear = Math.sqrt(linearValues.reduce((sum, value) => sum + value ** 2, 0));

  // Convert back to dB
  return 20 * Math.log10(combinedLinear);
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
    const rmsArray = input.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));

    if (rmsArray.length === 0) {
      resultsDiv.textContent = 'Please enter valid RMS values.';
      return;
    }

    const combinedRMS = combineRMS(rmsArray);
    resultsDiv.textContent = `Combined RMS: ${combinedRMS.toFixed(2)} dB`;
  });
}); 