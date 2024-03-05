import { MemoryDatabase, MemoryProps } from "../src/database/memoryDatabase";


describe('MemoryDatabase', () => {
  let memoryDatabase: MemoryDatabase | null;

  beforeEach(() => {
    memoryDatabase = MemoryDatabase.getInstance();
  });

  afterEach(() => {
    memoryDatabase = null
  });

  test('createNewHistory should create a new history entry in the database', () => {
    const id = '1';
    const prompt = 'Test prompt';
    memoryDatabase!.createNewHistory(id, prompt);

    const history = memoryDatabase!.getHistoryById(id);
    expect(history).toHaveLength(2); 
    expect(history![0].role).toBe('user');
    expect(history![0].parts).toBe(prompt);
    expect(history![1].role).toBe('model');
    expect(history![1].parts).toBe('Olá, certo!');
  });

  test('setNewHistory should add a new entry to an existing history in the database', () => {
    const id = '2';
    const prompt = 'Another test prompt';
    memoryDatabase!.createNewHistory(id, prompt);

    const newContent:MemoryProps  = { role: 'user', parts: 'New user message' };
    memoryDatabase!.setNewHistory(id, newContent);

    const history = memoryDatabase!.getHistoryById(id);
    expect(history).toHaveLength(3);
    expect(history![2].role).toBe('user');
    expect(history![2].parts).toBe('New user message');
  });

  

  test('getHistoryById should return null if the history does not exist', () => {
    const history = memoryDatabase!.getHistoryById('nonexistent-id');
    expect(history).toBeUndefined();
  });
});
