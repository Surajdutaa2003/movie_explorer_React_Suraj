const GEMINI_API_KEY = 'AIzaSyBuxrgWx2-moADGp6qiRh2dKHKaaILwb4Q';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Speech recognition setup
const setupSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error('Speech recognition is not supported in this browser.');
  }
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  return recognition;
};

// Speech synthesis setup
const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    throw new Error('Speech synthesis is not supported in this browser.');
  }
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  window.speechSynthesis.speak(utterance);
  
  return new Promise((resolve) => {
    utterance.onend = resolve;
  });
};

export const getChatResponse = async (message: string, useVoice = false) => {
  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are MovieBot, a helpful assistant for movie recommendations and information. Keep responses concise and friendly. User query: ${message}`
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;

    // If voice is enabled, speak the response
    if (useVoice) {
      await speak(responseText);
    }

    return responseText;
  } catch (error) {
    console.error('Chat API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get response from chat service');
  }
};

// Function to listen for voice input
export const listenForVoiceInput = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const recognition = setupSpeechRecognition();
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    } catch (error) {
      reject(error);
    }
  });
};