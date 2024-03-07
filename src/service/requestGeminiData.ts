import { GoogleGenerativeAI } from "@google/generative-ai";
import { MemoryDatabase, MemoryProps } from "../database/memoryDatabase";

const requestGemini = async (message: string, id: string): Promise<string> => {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const database = MemoryDatabase.getInstance();
  const historyUserMessage: MemoryProps = { role: "user", parts: message };
  const historyData = database.getHistoryById(id);

  try {
    const chat = model.startChat({ history: historyData });
    const result = await chat.sendMessage(message);
    database.setNewHistory(id, historyUserMessage);
    const text = result.response.text();

    const historyModelMessage: MemoryProps = { role: "model", parts: text };
    database.setNewHistory(id, historyModelMessage);
    return text;
  } catch (error) {
    return `Ocorreu um erro - ${error}`;
  }
};

export { requestGemini };
