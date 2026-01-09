import { GoogleGenerativeAI } from '@google/generative-ai'

const STORAGE_KEY = 'smb-coaching-gemini-key'
const MODEL_KEY = 'smb-coaching-gemini-model'

export const aiService = {
    // Save key to local storage
    setKey: (key: string) => {
        localStorage.setItem(STORAGE_KEY, key)
    },

    // Get key from local storage
    getKey: () => {
        return localStorage.getItem(STORAGE_KEY)
    },

    // Remove key
    removeKey: () => {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(MODEL_KEY)
    },

    // Check if key is present
    hasKey: () => {
        return !!localStorage.getItem(STORAGE_KEY)
    },

    // Validate the key by ASKING Google what models are available
    validateKey: async (key: string): Promise<{ isValid: boolean, error?: string, workingModel?: string }> => {
        try {
            // 1. Fetch available models directly from API
            // We use fetch because the SDK doesn't expose ListModels easily in browser
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`)

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(`API Error ${response.status}: ${errData?.error?.message || response.statusText}`)
            }

            const data = await response.json()

            if (!data.models || !Array.isArray(data.models)) {
                throw new Error("Invalid response from Google API (No models found)")
            }

            // 2. Find the first model that supports 'generateContent'
            // We prioritize flash, then pro, then anything else
            const validModels = data.models.filter((m: any) =>
                m.supportedGenerationMethods &&
                m.supportedGenerationMethods.includes('generateContent') &&
                m.name.includes('gemini')
            )

            if (validModels.length === 0) {
                throw new Error("Your API Key is valid, but has no access to 'generateContent' models. Access might be restricted.")
            }

            // Priority Sort: Flash -> Pro -> others
            validModels.sort((a: any, b: any) => {
                const aName = a.name.toLowerCase()
                const bName = b.name.toLowerCase()
                if (aName.includes('flash') && !bName.includes('flash')) return -1
                if (!aName.includes('flash') && bName.includes('flash')) return 1
                return 0
            })

            // 3. Pick the winner
            const bestModelName = validModels[0].name.replace('models/', '') // Remove 'models/' prefix if present

            // 4. Test it just to be sure
            const genAI = new GoogleGenerativeAI(key)
            const model = genAI.getGenerativeModel({ model: bestModelName })
            await model.generateContent("Hello")

            // 5. Save it
            localStorage.setItem(MODEL_KEY, bestModelName)

            return { isValid: true, workingModel: bestModelName }

        } catch (e: any) {
            console.warn("Validation failed:", e)
            return { isValid: false, error: e.message || "Unknown error during validation" }
        }
    },

    // Main generation function
    generate: async (prompt: string): Promise<string> => {
        const key = localStorage.getItem(STORAGE_KEY)
        if (!key) {
            throw new Error("No API Key found. Please add your Gemini API Key in Settings.")
        }

        // Use dynamically discovered model
        const savedModel = localStorage.getItem(MODEL_KEY)

        // Fallback if somehow model isn't saved but key is (shouldn't happen if validated)
        const modelName = savedModel || "gemini-1.5-flash"

        try {
            const genAI = new GoogleGenerativeAI(key)
            const model = genAI.getGenerativeModel({ model: modelName })

            const result = await model.generateContent(prompt)
            const response = await result.response
            return response.text()
        } catch (error) {
            console.error("AI Generation Error", error)
            throw error
        }
    }
}
