import { supabaseAdmin } from './client'
import type { IdeaInput } from '@/types'

export async function createIdea(input: IdeaInput): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('ideas')
    .insert({
      idea_text:  input.ideaText,
      industry:   input.industry  || null,
      target:     input.target    || null,
      model:      input.model     || null,
      geography:  input.geography || null,
      stage:      input.stage     || null,
      budget:     input.budget    || null,
      notes:      input.notes     || null,
    })
    .select('id')
    .single()

  if (error) throw new Error(`createIdea: ${error.message}`)
  return data.id as string
}
