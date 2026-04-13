import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const FAL_API_KEY = process.env.FAL_API_KEY;

if (!FAL_API_KEY) {
  console.error("❌ FAL_API_KEY не найден в Environment Variables!");
}

app.get('/', (req, res) => {
  res.send('Neuro Backend v2 — Fal.ai (Flux Schnell) подключён ✅');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Промпт обязателен" });
  }

  if (!FAL_API_KEY) {
    return res.status(500).json({ error: "API ключ не настроен на сервере" });
  }

  try {
    const response = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt + ", highly detailed, realistic, nsfw, 18+, adult content",
        image_size: "portrait_9_16",   // вертикальный формат — лучше для чата
        num_inference_steps: 4,
        guidance_scale: 3.5,
        num_images: 1
      })
    });

    const data = await response.json();

    if (data.images && data.images[0] && data.images[0].url) {
      res.json({
        success: true,
        imageUrl: data.images[0].url,
        message: "Flux Schnell сгенерировал изображение"
      });
    } else {
      res.status(500).json({ error: "Не удалось получить изображение от Fal.ai" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка соединения с Fal.ai" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Fal.ai Backend запущен`);
});
