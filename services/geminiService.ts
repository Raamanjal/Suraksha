import { GoogleGenAI, Type } from "@google/genai";
import { Resource } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

interface Location {
  lat: number;
  lon: number;
}

export const findLocalResources = async (query: string, location?: Location): Promise<Resource[]> => {
  try {
    let contents = `Based on the following user query, find relevant emergency resources in India. Query: "${query}". Provide the name, address, and contact number for each resource.`;

    if (location) {
        contents = `Based on the user query "${query}" and their current location (latitude: ${location.lat}, longitude: ${location.lon}), find relevant emergency resources in India. Prioritize results near the user's location. Provide the name, address, and contact number for each resource.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: "The name of the place, e.g., 'City Hospital'."
              },
              address: {
                type: Type.STRING,
                description: "The full address of the resource."
              },
              phone: {
                type: Type.STRING,
                description: "The contact phone number of the resource."
              },
            },
            required: ["name", "address", "phone"]
          }
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as Resource[];
  } catch (error) {
    console.error("Error fetching resources from Gemini API:", error);
    throw new Error("Failed to fetch local resources. Please try again.");
  }
};
