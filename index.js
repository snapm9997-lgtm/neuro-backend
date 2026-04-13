import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

console.log('Бэкенд запущен ✅');

// Тестовый маршрут
app.get('/', (req, res) => {
  res.send('Neuro Backend работает! Готов к генерации 18+');
});

// Основной маршрут для генерации изображений
app.post('/generate', (req, res) => {
  const { prompt, userId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Промпт обязателен" });
  }

  console.log(`Генерация для пользователя ${userId || 'unknown'}: ${prompt}`);

  // Пока используем заглушку (Perchance подключим позже)
  const imageUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 200) + 100}/600/850`;

  res.json({
    success: true,
    imageUrl: imageUrl,
    message: "Изображение сгенерировано (тестовый режим)"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
