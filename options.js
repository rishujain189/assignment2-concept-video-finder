document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apikey');
  const modelSelect = document.getElementById('modelSelect');
  const saveBtn = document.getElementById('save');
  const fetchModelsBtn = document.getElementById('fetchModelsBtn');
  const statusDiv = document.getElementById('status');

  function showStatus(msg, isError=false) {
    statusDiv.style.color = isError ? '#ef4444' : 'var(--success)';
    statusDiv.textContent = msg;
    setTimeout(() => { statusDiv.textContent = ''; }, 4000);
  }

  // Load existing key & model
  chrome.storage.local.get(['geminiApiKey', 'geminiModel'], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
    if (result.geminiModel) {
      // make sure option exists or add it
      if (![...modelSelect.options].some(o => o.value === result.geminiModel)) {
        modelSelect.add(new Option(result.geminiModel, result.geminiModel));
      }
      modelSelect.value = result.geminiModel;
    }
  });

  fetchModelsBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      showStatus('Please enter an API key first.', true);
      return;
    }
    fetchModelsBtn.textContent = 'Loading...';
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      if (!response.ok) throw new Error('API Key might be invalid or quota exceeded.');
      const data = await response.json();
      
      modelSelect.innerHTML = '';
      
      // Filter models that support generation then sort
      const validModels = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
      for (const m of validModels) {
        // m.name is "models/gemini-..." we strip the "models/" prefix
        const modelId = m.name.replace('models/', '');
        const option = new Option(m.displayName || modelId, modelId);
        modelSelect.add(option);
      }
      showStatus('Successfully loaded your authorized models!');
    } catch(err) {
      showStatus(err.message, true);
    }
    fetchModelsBtn.textContent = 'Load My Models';
  });

  // Save new key & model
  saveBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    const model = modelSelect.value;
    
    if (!key) {
      showStatus('Please enter a valid API key.', true);
      return;
    }

    chrome.storage.local.set({ geminiApiKey: key, geminiModel: model }, () => {
      showStatus('Settings saved successfully!');
    });
  });
});
