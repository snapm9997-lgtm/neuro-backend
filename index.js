import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const FAL_API_KEY = process.env.FAL_API_KEY || "твой_ключ_сюда"; // ← заменишь

app.get('/', (req, res) => {
  res.send('Neuro Backend v2 — Fal.ai (Flux) подключён ✅');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Промпт обязателен" });

  try {
    const response = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt + ", highly detailed, realistic, nsfw, adult, 18+",
        image_size: "landscape_16_9",
        num_inference_steps: 4,
        guidance_scale: 3.5
      })
    });

    const data = await response.json();

    if (data.images && data.images[0] && data.images[0].url) {
      res.json({
        success: true,
        imageUrl: data.images[0].url,
        message: "Flux сгенерировал изображение"
      });
    } else {
      res.status(500).json({ error: "Нет изображения в ответе" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при генерации через Fal.ai" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Fal.ai Backend запущен`));
