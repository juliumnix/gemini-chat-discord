export interface MemoryProps {
  role: RoleTypes;
  parts: string;
}

export type RoleTypes = "user" | "model";

export class MemoryDatabase {
  private static instance: MemoryDatabase;
  private localDatabase: Map<string, MemoryProps[]>;

  private constructor() {
    this.localDatabase = new Map<string, MemoryProps[]>();
  }

  public static getInstance(): MemoryDatabase {
    if (!MemoryDatabase.instance) {
      MemoryDatabase.instance = new MemoryDatabase();
    }
    return MemoryDatabase.instance;
  }

  public createNewHistory(id: string, prompt: string) {
    const initialContext: MemoryProps[] = [
      { role: "user", parts: prompt },
      { role: "model", parts: "Olá, certo!" },
    ];
    this.localDatabase.set(id, initialContext);
  }

  public setNewHistory(id: string, content: MemoryProps) {
    const database = this.getHistoryById(id);
    if (database) {
      const newData = [...database, content];
      this.localDatabase.set(id, newData);
      return;
    }
    const newData = [content];
    this.localDatabase.set(id, newData);
  }

  public getHistoryById(id: string) {
    return this.localDatabase.get(id);
  }
}
