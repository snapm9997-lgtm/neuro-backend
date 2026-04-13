import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const FAL_API_KEY = process.env.FAL_API_KEY;

app.get('/', (req, res) => {
  res.send('✅ Neuro Backend v2.1 — Fal.ai Flux работает');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Промпт обязателен" });
  if (!FAL_API_KEY) return res.status(500).json({ error: "FAL_API_KEY не настроен" });

  try {
    const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: prompt + ", highly detailed, realistic, nsfw, 18+, adult content",
        image_size: "portrait_9_16",
        num_inference_steps: 4,
        guidance_scale: 3.5,
        sync: true
      })
    });

    const data = await response.json();

    if (data.images && data.images[0]?.url) {
      return res.json({
        success: true,
        imageUrl: data.images[0].url
      });
    } else {
      return res.status(500).json({ error: "Fal.ai не вернул изображение" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ошибка соединения с Fal.ai" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Backend запущен'));
