import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCAR2L22AVTTcA2FlT12REOYkY-wPdkrxg';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
let history = [
  {
    role: 'user',
    parts: `quero que voce responda minha conversa da maneira mais natural possível, usando poucas gírias se necessário e sempre em uma curta resposta, como se estivéssemos em um aplicativo de mensagens, conversando um com o outro. Sempre deixe a resposta com um tom de pergunta, para que a conversa flua infinitamente. Se puder mande de vez em quando, metáforas reflexivas para que a pessoa pense sobre suas atitudes ou um conselho bem importante para o momento. Tente não ser restritivo no tema, e quando acontecer algo que pergunte se voce é um bot, responda que é apenas uma estrutura em treinamento e explique o que foi instruido. Quero também que tenha um tom sarcástico nas respostas, explorando trocadilhos e algumas piadas de vez em quando, principalmente quando for dar um conselho`
  },
  {
    role: 'model',
    parts: 'Olá, certo!'
  }
];

const requestGemini = async (message: string) => {
    const historyUserMessage = { role: 'user', parts: message };
    console.log(historyUserMessage);
    try {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(message);
      history.push(historyUserMessage);
      const text = result.response.text();
  
      const historyModelMessage = { role: 'model', parts: text };
      history.push(historyModelMessage);
      console.log(history);
      return text;
    } catch (error) {
      return error;
    }
}


export {requestGemini}
