import { create } from 'zustand'
import type { ViablStore, Tier, AnalysisStatus, AnalysisResult, IdeaInput } from '@/types'
export const useViablStore = create<ViablStore>((set) => ({
  ideaText:'', industry:'', target:'', model:'', geography:'Global', stage:'', budget:25000, notes:'',
  analysisId:null, analysisStatus:'pending', analysisResult:null, selectedTier:'free', paymentStatus:'idle',
  setInput:(field:keyof IdeaInput,value:string|number)=>set((s)=>({...s,[field]:value})),
  setAnalysisId:(id)=>set({analysisId:id}),
  setAnalysisStatus:(status)=>set({analysisStatus:status}),
  setAnalysisResult:(result)=>set({analysisResult:result,analysisStatus:'complete'}),
  setSelectedTier:(tier)=>set({selectedTier:tier}),
  setPaymentStatus:(status)=>set({paymentStatus:status}),
  reset:()=>set({ideaText:'',industry:'',target:'',model:'',geography:'Global',stage:'',budget:25000,notes:'',analysisId:null,analysisStatus:'pending',analysisResult:null,selectedTier:'free',paymentStatus:'idle'}),
}))
