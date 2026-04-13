import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Neuro Backend работает! Готов к генерации 18+ через Perchance');
});

// Главный маршрут генерации через Perchance
app.post('/generate', async (req, res) => {
  const { prompt, userId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Промпт обязателен" });
  }

  console.log(`[Perchance] Генерация для ${userId || 'unknown'}: ${prompt}`);

  try {
    // Простой способ через Perchance (неофициальный, но работает)
    // Мы используем их основной генератор с промптом
    const encodedPrompt = encodeURIComponent(prompt + " , highly detailed, nsfw");
    
    // Perchance возвращает страницу, но мы можем дать прямую ссылку на генерацию
    // Более надёжный вариант — использовать публичный редирект/прокси, но для теста:
    const imageUrl = `https://perchance.org/ai-text-to-image-generator?prompt=${encodedPrompt}`;

    res.json({
      success: true,
      imageUrl: imageUrl,           // Прямая ссылка на генератор с промптом
      message: "Perchance генерирует изображение...",
      note: "Нажми на ссылку — изображение появится"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      error: "Ошибка при обращении к Perchance" 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Perchance Backend запущен на порту ${PORT}`);
});
