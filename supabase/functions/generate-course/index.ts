import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, prompt, files } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert course content creator for Side Courses, an AI platform that transforms knowledge into interactive chatbot courses for influencers and educators.

Your task is to create a comprehensive course structure from the provided content. Generate:

1. A structured course outline with modules and lessons
2. Key learning objectives for each module
3. Interactive Q&A pairs that a chatbot can use to teach the content
4. Suggested pricing based on content depth and value
5. A compelling course description

Format your response as a JSON object with this structure:
{
  "title": "Course title",
  "description": "Compelling course description (2-3 sentences)",
  "price": number (suggested price in dollars),
  "modules": [
    {
      "title": "Module title",
      "objectives": ["objective 1", "objective 2"],
      "lessons": [
        {
          "title": "Lesson title",
          "content": "Main teaching content",
          "qa_pairs": [
            {"question": "Q1", "answer": "A1"},
            {"question": "Q2", "answer": "A2"}
          ]
        }
      ]
    }
  ],
  "chatbot_greeting": "A friendly greeting message for the course chatbot",
  "chatbot_personality": "Description of the chatbot's teaching style"
}`;

    const userMessage = `Course Title: ${title}

${prompt ? `Course Description/Requirements: ${prompt}` : ""}

${files && files.length > 0 ? `Uploaded Files: ${files.map((f: { name: string }) => f.name).join(", ")}` : ""}

Please create a comprehensive interactive chatbot course based on this information. Focus on making it engaging and valuable for learners who want to monetize their knowledge.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate course content");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Parse the JSON from the response
    let courseContent;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      courseContent = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Return raw content if parsing fails
      courseContent = {
        title,
        description: content.substring(0, 500),
        raw_content: content,
        modules: [],
        chatbot_greeting: "Welcome! I'm here to help you learn.",
        chatbot_personality: "Friendly and helpful instructor",
      };
    }

    return new Response(
      JSON.stringify({ success: true, course: courseContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate course error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
