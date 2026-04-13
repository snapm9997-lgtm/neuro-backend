import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const FAL_API_KEY = process.env.FAL_API_KEY;

app.get('/', (req, res) => {
  res.send('Neuro Backend v2.1 — Fal.ai Flux подключён ✅');
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Промпт обязателен" });
  if (!FAL_API_KEY) return res.status(500).json({ error: "API ключ не настроен" });

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
        num_images: 1,
        sync: true   // важный параметр для прямого ответа
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Fal.ai error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.images && data.images.length > 0 && data.images[0].url) {
      res.json({
        success: true,
        imageUrl: data.images[0].url
      });
    } else {
      res.status(500).json({ error: "Fal.ai не вернул изображение" });
    }
  } catch (error) {
    console.error("Fal.ai error:", error.message);
    res.status(500).json({ 
      error: "Ошибка генерации. Попробуй другой промпт или проверь ключ." 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend запущен`));
