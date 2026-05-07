const { getModel } = require('../../config/gemini');
const { ApiError } = require('../../utils/ApiResponse');

// Helper — send prompt to Gemini and get text back
const askGemini = async (prompt) => {
    try {
        const model = getModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        throw new ApiError(500, `Gemini API error: ${error.message}`);
    }
};

// Improve writing — make it cleaner and more engaging
const improveWriting = async (content) => {
    if (!content || content.trim().length < 20) {
        throw new ApiError(400, 'Content must be at least 20 characters');
    }

    const prompt = `
You are a professional blog editor. Improve the following blog content to make it 
cleaner, more engaging, and professional. Keep the same meaning and tone.
Return only the improved content, nothing else.

Content:
${content}
  `.trim();

    const improved = await askGemini(prompt);
    return { original: content, improved };
};

// Fix grammar and spelling only
const fixGrammar = async (content) => {
    if (!content || content.trim().length < 10) {
        throw new ApiError(400, 'Content must be at least 10 characters');
    }

    const prompt = `
Fix all grammar, spelling, and punctuation errors in the following text.
Do not change the meaning, style, or structure. 
Return only the corrected text, nothing else.

Text:
${content}
  `.trim();

    const fixed = await askGemini(prompt);
    return { original: content, fixed };
};

// Summarize a long blog post
const summarizePost = async (content) => {
    if (!content || content.trim().length < 100) {
        throw new ApiError(400, 'Content must be at least 100 characters to summarize');
    }

    const prompt = `
Summarize the following blog post in 3-5 clear sentences.
The summary should capture the main points and be easy to read.
Return only the summary, nothing else.

Blog post:
${content}
  `.trim();

    const summary = await askGemini(prompt);
    return { summary };
};

// Generate title suggestions from content
const generateTitles = async (content) => {
    if (!content || content.trim().length < 50) {
        throw new ApiError(400, 'Content must be at least 50 characters');
    }

    const prompt = `
Generate 5 compelling and SEO-friendly blog post title suggestions 
based on the following content. Make them catchy and engaging.
Return only a numbered list of 5 titles, nothing else.

Content:
${content}
  `.trim();

    const response = await askGemini(prompt);

    // Parse numbered list into array
    const titles = response
        .split('\n')
        .filter((line) => line.match(/^\d+\./))
        .map((line) => line.replace(/^\d+\.\s*/, '').trim());

    return { titles };
};

// Generate excerpt from content
const generateExcerpt = async (content) => {
    if (!content || content.trim().length < 50) {
        throw new ApiError(400, 'Content must be at least 50 characters');
    }

    const prompt = `
Write a compelling 2-3 sentence excerpt for the following blog post.
It should hook the reader and make them want to read more.
Return only the excerpt, nothing else.

Content:
${content}
  `.trim();

    const excerpt = await askGemini(prompt);
    return { excerpt: excerpt.trim() };
};

// Generate tag suggestions from content
const generateTags = async (content) => {
    if (!content || content.trim().length < 50) {
        throw new ApiError(400, 'Content must be at least 50 characters');
    }

    const prompt = `
Suggest 5 relevant tags for the following blog post.
Tags should be short, lowercase, and relevant to the content.
Return only a comma-separated list of tags, nothing else.
Example format: javascript, nodejs, backend, api, tutorial

Content:
${content}
  `.trim();

    const response = await askGemini(prompt);

    const tags = response
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
        .slice(0, 5);

    return { tags };
};

// Continue writing — generate next paragraph
const continueWriting = async (content) => {
    if (!content || content.trim().length < 50) {
        throw new ApiError(400, 'Content must be at least 50 characters');
    }

    const prompt = `
You are a professional blog writer. Continue writing the following blog post 
by adding the next 1-2 paragraphs. Match the existing tone and style.
Return only the new paragraphs, nothing else.

Existing content:
${content}
  `.trim();

    const continuation = await askGemini(prompt);
    return { continuation: continuation.trim() };
};

// Check content for tone — is it professional, casual, technical?
const analyzeTone = async (content) => {
    if (!content || content.trim().length < 50) {
        throw new ApiError(400, 'Content must be at least 50 characters');
    }

    const prompt = `
Analyze the tone and writing style of the following blog post.
Return a JSON object with these fields only, no extra text:
{
  "tone": "one of: professional, casual, technical, inspirational, educational",
  "readabilityLevel": "one of: beginner, intermediate, advanced",
  "sentiment": "one of: positive, neutral, negative",
  "feedback": "one short sentence of constructive feedback"
}

Content:
${content}
  `.trim();

    const response = await askGemini(prompt);

    try {
        const clean = response.replace(/```json|```/g, '').trim();
        const analysis = JSON.parse(clean);
        return { analysis };
    } catch {
        return { analysis: { raw: response } };
    }
};

module.exports = {
    improveWriting,
    fixGrammar,
    summarizePost,
    generateTitles,
    generateExcerpt,
    generateTags,
    continueWriting,
    analyzeTone,
};