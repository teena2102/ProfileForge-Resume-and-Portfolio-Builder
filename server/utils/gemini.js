// import { GoogleGenAI } from '@google/genai';

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// /**
//  * Improve a resume section using Gemini AI
//  */
// export const improveResumeSection = async (section, content, jobTitle = '') => {
//     const prompts = {
//         summary: `You are a professional resume writer. Improve the following professional summary for a ${jobTitle || 'professional'}. Make it more impactful, concise (3-4 sentences), and ATS-friendly. Return ONLY the improved text, no explanations.\n\nOriginal:\n${content}`,
//         experience: `You are a professional resume writer. Improve the following job description using strong action verbs, quantified achievements where possible, and bullet-point format. Make it ATS-friendly for a ${jobTitle || 'professional'} role. Return ONLY the improved text.\n\nOriginal:\n${content}`,
//         skills: `You are a professional resume writer. Given these skills: ${content}\nSuggest additional relevant skills and organize them for a ${jobTitle || 'professional'} resume. Return a comma-separated list of skills only.`,
//         project: `You are a professional resume writer. Improve the following project description to be more impactful and technical. Return ONLY the improved description.\n\nOriginal:\n${content}`,
//     };

//     const prompt = prompts[section] || `Improve this resume content professionally:\n${content}`;

//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: prompt,
//     });

//     return response.text;
// };

// /**
//  * Parse resume text (from PDF) into structured data using Gemini
//  */
// export const parseResumeFromText = async (text) => {
//     const prompt = `You are a resume parser. Extract structured information from the following resume text and return ONLY a valid JSON object with this exact structure (use empty strings/arrays for missing fields):
// {
//   "personal_info": {
//     "full_name": "",
//     "email": "",
//     "phone": "",
//     "location": "",
//     "linkedin": "",
//     "website": "",
//     "profession": ""
//   },
//   "professional_summary": "",
//   "experience": [
//     {
//       "company": "",
//       "position": "",
//       "start_date": "",
//       "end_date": "",
//       "description": "",
//       "is_current": false
//     }
//   ],
//   "education": [
//     {
//       "institution": "",
//       "degree": "",
//       "field": "",
//       "graduation_date": "",
//       "gpa": ""
//     }
//   ],
//   "skills": [],
//   "project": [
//     {
//       "name": "",
//       "type": "",
//       "description": ""
//     }
//   ]
// }

// Resume Text:
// ${text.substring(0, 6000)}`;

//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: prompt,
//     });

//     const raw = response.text;
//     // Extract JSON from response
//     const jsonMatch = raw.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) throw new Error('Failed to parse resume data from AI response');
//     return JSON.parse(jsonMatch[0]);
// };

import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in .env");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Improve a resume section using Gemini AI
 */
export const improveResumeSection = async (section, content, jobTitle = "") => {
  const prompts = {
    summary: `You are a professional resume writer. Improve the following professional summary for a ${jobTitle || "professional"}. Make it more impactful, concise (3-4 sentences), and ATS-friendly. Return ONLY the improved text.\n\nOriginal:\n${content}`,

    experience: `You are a professional resume writer. Improve the following job description using strong action verbs, quantified achievements where possible, and bullet-point format. Make it ATS-friendly for a ${jobTitle || "professional"} role. Return ONLY the improved text.\n\nOriginal:\n${content}`,

    skills: `You are a professional resume writer. Given these skills: ${content}\nSuggest additional relevant skills and organize them for a ${jobTitle || "professional"} resume. Return a comma-separated list of skills only.`,

    project: `You are a professional resume writer. Improve the following project description to be more impactful and technical. Return ONLY the improved description.\n\nOriginal:\n${content}`,
  };

  const prompt =
    prompts[section] || `Improve this resume content professionally:\n${content}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
};

/**
 * Parse resume text
 */
export const parseResumeFromText = async (text) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: text,
  });

  return response.text;
};