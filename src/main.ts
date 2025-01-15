import './style.css'

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

function createDbInput(initialValue: string): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'db-value';
  input.value = `${initialValue} dB`;
  return input;
}

function setupSliderAndInput(slider: HTMLInputElement, dbInput: HTMLInputElement) {
  // Update slider when db input changes
  dbInput.addEventListener('blur', () => {
    const value = parseFloat(dbInput.value.replace(' dB', ''));
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, -60), 0);
      slider.value = clampedValue.toString();
      dbInput.value = `${clampedValue} dB`;
      updateResults();
    } else {
      dbInput.value = `${slider.value} dB`;
    }
  });

  // Handle enter key
  dbInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      dbInput.blur();
    }
  });

  // Select all text when focusing
  dbInput.addEventListener('focus', () => {
    dbInput.select();
  });

  // Update db input when slider changes
  slider.addEventListener('input', () => {
    dbInput.value = `${slider.value} dB`;
    updateResults();
  });
}

function createSlider(id: number): HTMLDivElement {
  const sliderGroup = document.createElement('div');
  sliderGroup.className = 'slider-group';

  const sliderHeader = document.createElement('div');
  sliderHeader.className = 'slider-header';

  const label = document.createElement('label');
  label.htmlFor = `slider${id}`;
  label.textContent = `Level ${id}`;

  const dbInput = createDbInput('-6');

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = `slider${id}`;
  slider.min = '-60';
  slider.max = '0';
  slider.value = '-6';
  slider.step = '0.1';
  slider.className = 'level-slider';

  setupSliderAndInput(slider, dbInput);

  sliderHeader.appendChild(label);
  sliderHeader.appendChild(dbInput);
  sliderGroup.appendChild(sliderHeader);
  sliderGroup.appendChild(slider);

  return sliderGroup;
}

function updateResults() {
  const sliders = document.querySelectorAll<HTMLInputElement>('.level-slider');
  const dbValues = Array.from(sliders).map(slider => parseFloat(slider.value));
  
  if (dbValues.length === 0) return;

  const rmsResult = combineRMS(dbValues);
  const peakResult = combinePeak(dbValues);

  const resultsDiv = document.getElementById('results');
  if (!resultsDiv) return;

  const results = [
    `Combined RMS: ${rmsResult.toFixed(2)} dB`,
    `Combined Peak: ${peakResult.toFixed(2)} dB`
  ];

  resultsDiv.innerHTML = results.join('<br>');
}

document.addEventListener('DOMContentLoaded', () => {
  const slidersContainer = document.getElementById('sliders-container');
  const addSliderButton = document.getElementById('add-slider');
  let sliderCount = 1;

  if (!slidersContainer || !addSliderButton) {
    console.error('Required DOM elements not found');
    return;
  }

  // Add slider button
  addSliderButton.addEventListener('click', () => {
    sliderCount++;
    const newSlider = createSlider(sliderCount);
    slidersContainer.insertBefore(newSlider, addSliderButton);
    updateResults();
  });

  // Setup initial slider
  const initialSlider = document.getElementById('slider1') as HTMLInputElement;
  const initialDbValue = document.querySelector('.db-value') as HTMLInputElement;
  if (initialSlider && initialDbValue) {
    setupSliderAndInput(initialSlider, initialDbValue);
  }

  // Initial calculation
  updateResults();
}); 