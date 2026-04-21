import { QuiverAI } from '@quiverai/sdk'

export async function generateLogos(
  businessName: string,
  industry: string,
  primaryColor: string,
  accentColor: string,
  tagline: string
): Promise<string[]> {
  if (!process.env.QUIVER_API_KEY) return []

  try {
    const quiver = new QuiverAI({ bearerAuth: process.env.QUIVER_API_KEY })

    const prompts = [
      `Minimalist wordmark logo for "${businessName}", ${industry} company. Clean sans-serif typography, primary color ${primaryColor}. White background. Professional, modern, no gradients.`,
      `Bold geometric icon + wordmark logo for "${businessName}". Abstract symbol representing ${industry}. Color: ${primaryColor} with ${accentColor} accent. Minimal, scalable SVG.`,
      `Modern monogram or lettermark logo for "${businessName}". Single letter or initials. ${industry} brand. ${primaryColor} on white. Ultra clean, corporate.`,
    ]

    const svgs = await Promise.all(
      prompts.map(async (prompt) => {
        try {
          const result = await quiver.createSVGs.generateSVG({
            model: 'arrow-1.1',
            prompt,
            n: 1,
            temperature: 0.8,
            instructions: `SVG logo only. No text outside the logo. Viewbox 200x200. Clean paths. Brand color ${primaryColor}.`
          })
          // Extract SVG string from response
          const content = (result as any)?.result?.data?.[0]?.svg || ''
          return typeof content === 'string' ? content : ''
        } catch (err) {
          console.warn('[quiver] logo generation failed:', err)
          return ''
        }
      })
    )

    return svgs.filter(Boolean)
  } catch (err) {
    console.warn('[quiver] logos failed:', err)
    return []
  }
}
