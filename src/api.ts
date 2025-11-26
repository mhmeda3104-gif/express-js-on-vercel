import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // استدعاء OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "حلل هذه الصورة لبشرة الوجه بشكل طبي ومنظم واعطني النتيجة كنص واحد.",
              },
              {
                type: "input_image",
                image_url: image, // هذا هو الـ dataURL القادم من Shopify
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    const text =
      data?.choices?.[0]?.message?.content ||
      "لم أستطع تحليل الصورة، حاول مرة أخرى.";

    return res.json({ result: text });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
