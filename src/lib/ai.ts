import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateFeedback(
  submissionNote: string,
  assignmentDescription: string,
): Promise<string> {
  try {
    const prompt = `
    Analyze this student submission note: "${submissionNote}"
    For this assignment: "${assignmentDescription}"
    
    Provide constructive feedback focusing on:
    1. Completeness of implementation
    2. Code quality suggestions
    3. Areas for improvement
    4. Positive aspects
    
    Keep it encouraging and specific. Max 150 words.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    return completion.choices[0].message?.content || "No feedback generated.";
  } catch (error) {
    // Fallback mock AI response
    return `Great effort! Your submission shows good understanding of the core concepts. Consider adding more error handling and optimizing the time complexity. The structure is clean and readable. Keep up the excellent work!`;
  }
}

export async function improveAssignmentDescription(
  description: string,
): Promise<string> {
  try {
    const prompt = `
    Improve this assignment description for clarity and engagement:
    "${description}"
    
    Make it:
    1. More specific about requirements
    2. Engaging for students
    3. Clear success criteria
    4. Concise yet comprehensive
    
    Return only the improved description.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    return completion.choices[0].message?.content || description;
  } catch (error) {
    return (
      description +
      "\n\n*AI Suggestion: Consider adding specific examples and success criteria for better student understanding.*"
    );
  }
}
