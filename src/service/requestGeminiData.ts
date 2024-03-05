import { GoogleGenerativeAI } from "@google/generative-ai";
import { MemoryDatabase, MemoryProps } from "../database/memoryDatabase";

const API_KEY = "AIzaSyCAR2L22AVTTcA2FlT12REOYkY-wPdkrxg";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
const database = MemoryDatabase.getInstance();

const requestGemini = async (message: string, id: string): Promise<string> => {
  const historyUserMessage: MemoryProps = { role: "user", parts: message };
  const historyData = database.getHistoryById(id);

  try {
    const chat = model.startChat({ history: historyData });
    const result = await chat.sendMessage(message);
    database.setNewHistory(id, historyUserMessage);
    const text = result.response.text();

    const historyModelMessage: MemoryProps = { role: "model", parts: text };
    database.setNewHistory(id, historyModelMessage);
    console.log(database)
    return text;
  } catch (error) {
    return `Ocorreu um erro - ${error}`;
  }
};

export { requestGemini };
