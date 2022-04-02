export const textToSpeech = (text: string) => {
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.lang = 'fr-FR';
  synth.speak(utterThis);
};
