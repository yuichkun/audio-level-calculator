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

function createSlider(id: number): HTMLDivElement {
  const sliderGroup = document.createElement('div');
  sliderGroup.className = 'slider-group';

  const sliderHeader = document.createElement('div');
  sliderHeader.className = 'slider-header';

  const label = document.createElement('label');
  label.htmlFor = `slider${id}`;
  label.textContent = `Level ${id}`;

  const dbValue = document.createElement('span');
  dbValue.className = 'db-value';
  dbValue.textContent = '-6 dB';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = `slider${id}`;
  slider.min = '-60';
  slider.max = '0';
  slider.value = '-6';
  slider.step = '0.1';
  slider.className = 'level-slider';

  sliderHeader.appendChild(label);
  sliderHeader.appendChild(dbValue);
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

    // Add event listeners to the new slider
    const slider = newSlider.querySelector('input');
    const dbValue = newSlider.querySelector('.db-value');
    if (slider && dbValue) {
      slider.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        dbValue.textContent = `${target.value} dB`;
        updateResults();
      });
    }
  });

  // Initial slider event listener
  const initialSlider = document.getElementById('slider1') as HTMLInputElement;
  const initialDbValue = document.querySelector('.db-value');
  if (initialSlider && initialDbValue) {
    initialSlider.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      initialDbValue.textContent = `${target.value} dB`;
      updateResults();
    });
  }

  // Initial calculation
  updateResults();
}); 