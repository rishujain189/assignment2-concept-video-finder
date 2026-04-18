document.addEventListener('DOMContentLoaded', () => {
  const views = {
    setup: document.getElementById('setup-view'),
    empty: document.getElementById('empty-view'),
    loading: document.getElementById('loading-view'),
    error: document.getElementById('error-view'),
    results: document.getElementById('results-view')
  };

  function showView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
  }

  document.getElementById('open-options').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  function showError(title, message) {
    document.getElementById('error-title').textContent = title;
    document.getElementById('error-message').textContent = message;
    showView('error');
  }

  function renderResults(data) {
    document.getElementById('concept-title').textContent = data.concept_title;
    document.getElementById('concept-summary').textContent = data.explanation;

    const videoList = document.getElementById('video-list');
    videoList.innerHTML = ''; // Clear existing
    
    const template = document.getElementById('video-card-template');

    data.videos.forEach(video => {
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector('.video-card');
      card.href = video.search_url;
      
      const title = clone.querySelector('.video-title');
      title.textContent = video.title;
      
      const hint = clone.querySelector('.video-hint');
      hint.textContent = video.why_helpful;

      videoList.appendChild(clone);
    });

    showView('results');
  }

  async function fetchConceptData(concept, apiKey, model) {
    showView('loading');

    const prompt = `The user highlighted the text: "${concept}". 
Your goal is to help them understand this educational or professional concept. 
CRITICAL RULE 1: If the selected text is obnoxious, derogatory, highly inappropriate, or completely nonsensical/unrelated to any form of learning/education, kindly decline and set "is_valid_concept" to false, and provide a polite "error_message".
CRITICAL RULE 2: If valid, accurately identify the core concept. Briefly explain the concept in simple terms.
CRITICAL RULE 3: Recommend exactly 3 highly relevant YouTube videos that best explain this concept. For each, give the title, explain why it's helpful, and generate a precise YouTube search URL (e.g., https://www.youtube.com/results?search_query=...).

You must return a strictly valid JSON object matching this schema:
{
  "is_valid_concept": boolean,
  "error_message": string (if invalid, explain why briefly),
  "concept_title": string (clean, capitalized name of the concept),
  "explanation": string (brief, easy to understand explanation),
  "videos": [
    {
      "title": string,
      "why_helpful": string,
      "search_url": string
    }
  ]
}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const errData = await response.json();
          if (errData.error && errData.error.message) {
            errorMsg = errData.error.message;
          } else {
            errorMsg = JSON.stringify(errData);
          }
        } catch(e) {}
        throw new Error(errorMsg);
      }

      const rawData = await response.json();
      const textResponse = rawData.candidates[0].content.parts[0].text;
      
      // Clean up markdown block if the model wraps it in ```json ... ```
      const cleanedJson = textResponse.replace(/```(?:json)?\n?/gi, '').replace(/```/gi, '').trim();
      const parsedData = JSON.parse(cleanedJson);

      if (!parsedData.is_valid_concept) {
        showError("Invalid Concept", parsedData.error_message || "The highlighted text is not suitable for an educational search.");
        return;
      }

      renderResults(parsedData);
      
    } catch (error) {
      console.error(error);
      showError("Analysis Failed", `Could not complete the analysis. Error: ${error.message}`);
    }
  }

  function initialize() {
    chrome.storage.local.get(['geminiApiKey', 'selectedConcept', 'geminiModel'], (data) => {
      if (!data.geminiApiKey) {
        showView('setup');
        return;
      }

      const modelToUse = data.geminiModel || 'gemini-2.0-flash';

      if (data.selectedConcept) {
        fetchConceptData(data.selectedConcept, data.geminiApiKey, modelToUse);
      } else {
        showView('empty');
      }
    });
  }

  // Listen for background script updating the concept
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local') {
      if (changes.geminiApiKey && changes.geminiApiKey.newValue) {
        // If API key is newly added, re-initialize
        initialize();
      }
      
      if (changes.selectedConcept && changes.selectedConcept.newValue) {
        chrome.storage.local.get(['geminiApiKey', 'geminiModel'], (data) => {
          if (data.geminiApiKey) {
            const modelToUse = data.geminiModel || 'gemini-2.0-flash';
            fetchConceptData(changes.selectedConcept.newValue, data.geminiApiKey, modelToUse);
          } else {
            showView('setup');
          }
        });
      }
    }
  });

  // Initial load
  initialize();
});
