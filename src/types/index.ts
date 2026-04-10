export interface IdeaInput { ideaText:string; industry:string; target:string; model?:string; geography?:string; stage?:string; budget?:number; notes?:string }
export type Verdict = 'GO'|'MAYBE'|'NO'
export type Tier = 'free'|'report'|'founder_pack'|'launch_kit'
export type AnalysisStatus = 'pending'|'running'|'complete'|'failed'
export interface AnalysisMetrics { 'Market Demand':number;'Competition':number;'Revenue Potential':number;'Execution Risk':number;'Moat / Edge':number;'Customer Acquisition':number;'Regulatory':number;'Tech Feasibility':number;'Founder-Market Fit':number }
export interface Dimension { name:string; score:number; body:string; risk_level:'low'|'medium'|'high' }
export interface AnalysisResult { overall_score:number; verdict:Verdict; idea_summary:string; one_liner:string; summary:string; market_size:string; demand_signal:string; competition:string; metrics:AnalysisMetrics; revenue_models:string[]; mrr_potential:string; top_risks:string[]; next_steps:string[]; dimensions:Dimension[]; recommendations:{gtm:string[];tools:string[];first_30_days:string[]} }
export interface TierConfig { id:Tier; name:string; price:number; description:string; items:string[]; featured?:boolean }
export const TIERS: TierConfig[] = [
  { id:'free', name:'FREE', price:0, description:'Current access', items:['Score + verdict','2 of 9 dimensions','No export'] },
  { id:'report', name:'REPORT', price:19, description:'Full analysis unlocked', items:['All 9 dimensions','Risk breakdown','GTM playbook','PDF download'], featured:true },
  { id:'founder_pack', name:'FOUNDER PACK', price:79, description:'Report + brand identity', items:['All 9 dimensions','PDF download','Logo system','Color + type','Brand voice','Landing copy'] },
  { id:'launch_kit', name:'LAUNCH KIT', price:149, description:'Everything to launch', items:['Founder Pack included','Pitch deck','GTM playbook','ZenBusiness LLC','Domain recs'] },
]
export interface ViablStore { ideaText:string; industry:string; target:string; model:string; geography:string; stage:string; budget:number; notes:string; analysisId:string|null; analysisStatus:AnalysisStatus; analysisResult:AnalysisResult|null; selectedTier:Tier; paymentStatus:'idle'|'processing'|'complete'; setInput:(field:keyof IdeaInput,value:string|number)=>void; setAnalysisId:(id:string)=>void; setAnalysisStatus:(s:AnalysisStatus)=>void; setAnalysisResult:(r:AnalysisResult)=>void; setSelectedTier:(t:Tier)=>void; setPaymentStatus:(s:'idle'|'processing'|'complete')=>void; reset:()=>void }
export interface AnalysisTask { name:string; emoji:string }
export const ANALYSIS_TASKS: AnalysisTask[] = [
  {name:'Market Size & Demand',emoji:'📊'},{name:'Competitive Landscape',emoji:'🔍'},
  {name:'Moat & Differentiation',emoji:'🏰'},{name:'Execution Risk',emoji:'⚠️'},
  {name:'Monetization Potential',emoji:'💰'},{name:'Customer Acquisition',emoji:'🎯'},
  {name:'Regulatory & Legal',emoji:'⚖️'},{name:'Technical Feasibility',emoji:'⚙️'},
  {name:'Founder–Market Fit',emoji:'🧠'},
]
export const INDUSTRIES = ['Food & Beverage','Health & Wellness','Technology / SaaS','E-commerce / Retail','Real Estate','Finance / Fintech','Education','Construction / Trades','Hospitality / Travel','Professional Services','AI / ML Tools','Creator Economy','Climate / Sustainability','Manufacturing','Other']
export const BUSINESS_MODELS = [{label:'Subscription / SaaS',desc:'Recurring monthly or annual'},{label:'One-time Purchase',desc:'Pay once, own forever'},{label:'Marketplace',desc:'Take a cut of transactions'},{label:'Freemium',desc:'Free tier, paid upgrades'},{label:'Services / Agency',desc:'Billed per project or hour'},{label:'Ads / Media',desc:'Ad-supported content'}]
export const GEOGRAPHIES = ['Global','North America','Europe','APAC','LATAM','Local / Regional']
export const STAGES = [{icon:'💡',name:'Just an Idea',desc:'No code, no customers'},{icon:'🔨',name:'Building MVP',desc:'In progress or done'},{icon:'🚀',name:'Pre-Launch',desc:'Ready, no users yet'},{icon:'📈',name:'Live & Growing',desc:'Revenue or active users'},{icon:'🔄',name:'Pivoting',desc:'New direction'},{icon:'🔍',name:'Researching',desc:'Validating the idea'}]
