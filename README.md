# Concept Video Finder - Chrome Extension

**Concept Video Finder** is a premium, AI-powered Google Chrome extension that allows users to seamlessly discover the most relevant educational YouTube videos for any highlighted concept. By integrating Google's Gemini Flash model, the extension provides context-aware video recommendations and concise explanations natively within the browser's side panel.

## 🎥 Demonstration Video

[Watch the Demo on YouTube Here](https://youtu.be/xyiTv79b52g) *(Replace the '#' with your actual YouTube video link)*

## ✨ Features

- **Context-Aware Highlights**: Highlight any text on any webpage (or PDF opened in Chrome) and right-click to instantly analyze the concept.
- **Gemini Powered Insights**: Uses the Gemini API to identify the core educational concept and provide a simple, easy-to-understand summary.
- **Smart Video Recommendations**: Automatically fetches the 3 most highly-relevant YouTube video titles along with a direct, dynamic YouTube search pipeline.
- **Safety First**: strict adherence to educational guidelines. The AI intelligently blocks obnoxious, derogatory, or invalid queries.
- **Modern UI/UX**: Built using Chrome's native Side Panel API, featuring a premium glassmorphic design, smooth animations, and a dark mode aesthetic that doesn't obstruct your reading.
- **Dynamic Model Loading**: Includes built-in support to query Google APIs for authorized models and securely store API keys locally.

## 🚀 Installation & Setup

1. **Clone or Download the Repository:**
   Download the extension files to your local machine.

2. **Acquire a Gemini API Key:**
   - Go to [Google AI Studio](https://aistudio.google.com/).
   - Sign in and create a new API Key. *(Note: Ensure billing is enabled if you are in a region without a free tier).*

3. **Load the Extension into Chrome:**
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Toggle **Developer mode** on in the top-right corner.
   - Click **Load unpacked** and select the folder containing this extension's files (`Assignment 2`).

4. **Configure the Extension:**
   - Right-click the newly added Concept Video Finder puzzle piece icon in your Chrome toolbar.
   - Click **Options**.
   - Input your Gemini API Key.
   - Click **Load My Models** to fetch your authorized models, select one (e.g., `Gemini 1.5 Pro` or `Gemini 1.5 Flash Latest`), and click **Save Settings**.

## 🛠️ Usage

1. Open any article, blog post, or online document.
2. Highlight a complex term or educational concept (e.g., "Theta in Options trading").
3. Right-click the selection and click **Find Video for "[concept]"**.
4. The Chrome Side Panel will elegantly slide open, analyze the topic, and present your personalized learning resources!

## 📂 Project Structure

- `manifest.json`: Configuration for Manifest V3 permissions and setup.
- `background.js`: Service worker managing the context menu and side panel triggers.
- `options.html / .js / .css`: Configuration page for securely managing the Gemini API key and model selection.
- `sidepanel.html / .js / .css`: Core UI and Gemini API integration logic.
- `icons/`: Custom vector-styled extension icons.

## 📝 License

This project was developed as part of an academic assignment. Feel free to use and modify the code!
