import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer'
import type { AnalysisResult } from '@/types'

Font.register({
  family: 'DM Mono',
  src: 'https://fonts.gstatic.com/s/dmmono/v14/aFTR7PB1QTsUX8KYth-orYataIf4.woff2',
})

const s = StyleSheet.create({
  page:        { backgroundColor:'#0e0c0a', color:'#f2ede8', fontFamily:'DM Mono', padding:48, fontSize:10 },
  accentLine:  { height:2, backgroundColor:'#d4ff00', marginBottom:4 },
  header:      { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 },
  logo:        { fontSize:28, color:'#d4ff00', letterSpacing:4 },
  meta:        { fontSize:8, color:'#5a544d', letterSpacing:2, textTransform:'uppercase', marginTop:4 },
  scoreBlock:  { alignItems:'flex-end' },
  scoreNum:    { fontSize:72, color:'#d4ff00', lineHeight:1 },
  verdictBadge:{ fontSize:10, letterSpacing:3, padding:'4 12', marginTop:4 },
  divider:     { height:1, backgroundColor:'#2e2a25', marginVertical:16 },
  sectionLbl:  { fontSize:7, letterSpacing:3, textTransform:'uppercase', color:'#5a544d', marginBottom:8 },
  bodyText:    { fontSize:9, color:'#8a8178', lineHeight:1.7 },
  twoCol:      { flexDirection:'row', gap:16, marginBottom:4 },
  col:         { flex:1, backgroundColor:'#1a1714', padding:16 },
  card:        { backgroundColor:'#1a1714', padding:16, marginBottom:4 },
  meterRow:    { flexDirection:'row', alignItems:'center', marginBottom:7 },
  meterLabel:  { fontSize:8, color:'#5a544d', width:120 },
  meterTrack:  { flex:1, height:2, backgroundColor:'#3a3530' },
  meterFill:   { height:2 },
  meterVal:    { fontSize:8, width:24, textAlign:'right' },
  riskDot:     { width:5, height:5, borderRadius:3, backgroundColor:'#f97316', marginTop:4, marginRight:8 },
  stepNum:     { fontSize:16, color:'#d4ff00', width:28 },
  stepText:    { flex:1, fontSize:9, color:'#8a8178', lineHeight:1.65 },
  tag:         { backgroundColor:'#201d19', padding:'3 8', fontSize:8, color:'#8a8178', marginRight:4, marginBottom:4 },
  footer:      { position:'absolute', bottom:32, left:48, right:48, flexDirection:'row', justifyContent:'space-between' },
  footerText:  { fontSize:7, color:'#5a544d', letterSpacing:1 },
})

function meterColor(v: number) {
  return v >= 70 ? '#22c55e' : v >= 45 ? '#eab308' : '#ef4444'
}

function verdictBg(v: string) {
  return v === 'GO' ? '#16a34a' : v === 'MAYBE' ? '#d97706' : '#dc2626'
}

interface Props { result: AnalysisResult; analysisId: string }

export function ReportPDF({ result: r, analysisId }: Props) {
  return (
    <Document title={`Viabl Report — ${r.idea_summary}`} author="Viabl.co">
      {/* ── PAGE 1: Overview ── */}
      <Page size="A4" style={s.page}>
        <View style={s.accentLine}/>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.logo}>VIABL.</Text>
            <Text style={s.meta}>Business Viability Report</Text>
            <Text style={[s.meta,{marginTop:2}]}>#{analysisId.substring(0,8).toUpperCase()} · {new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'})}</Text>
          </View>
          <View style={s.scoreBlock}>
            <Text style={s.scoreNum}>{r.overall_score}</Text>
            <View style={[s.verdictBadge,{backgroundColor:verdictBg(r.verdict)}]}>
              <Text style={{color:'#fff',fontSize:10,letterSpacing:3}}>{r.verdict}</Text>
            </View>
          </View>
        </View>

        {/* Idea summary */}
        <Text style={{fontSize:18,marginBottom:6,letterSpacing:1}}>{r.idea_summary}</Text>
        <Text style={[s.bodyText,{borderLeftWidth:2,borderLeftColor:'#d4ff00',paddingLeft:10,marginBottom:20}]}>{r.one_liner}</Text>
        <Text style={s.bodyText}>{r.summary}</Text>
        <View style={s.divider}/>

        {/* Market + Demand */}
        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.sectionLbl}>Market Size</Text>
            <Text style={s.bodyText}>{r.market_size}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.sectionLbl}>Demand Signal</Text>
            <Text style={s.bodyText}>{r.demand_signal}</Text>
          </View>
        </View>

        {/* Competition */}
        <View style={s.card}>
          <Text style={s.sectionLbl}>Competitive Landscape</Text>
          <Text style={s.bodyText}>{r.competition}</Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>viabl.co — Know Before You Build</Text>
          <Text style={s.footerText}>Not financial or legal advice · Page 1</Text>
        </View>
      </Page>

      {/* ── PAGE 2: Metrics + Revenue + Risks ── */}
      <Page size="A4" style={s.page}>
        <View style={s.accentLine}/>
        <Text style={[s.logo,{fontSize:16,marginBottom:24}]}>VIABL.</Text>

        {/* Metrics */}
        <View style={s.card}>
          <Text style={s.sectionLbl}>Analysis Metrics</Text>
          {Object.entries(r.metrics).map(([key, val]) => {
            const display = (key==='Competition'||key==='Execution Risk'||key==='Regulatory') ? 100-val : val
            const color   = meterColor(display)
            return (
              <View key={key} style={s.meterRow}>
                <Text style={s.meterLabel}>{key}</Text>
                <View style={s.meterTrack}>
                  <View style={[s.meterFill,{width:`${display}%`,backgroundColor:color}]}/>
                </View>
                <Text style={[s.meterVal,{color}]}>{display}</Text>
              </View>
            )
          })}
        </View>

        {/* Revenue + Risks */}
        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.sectionLbl}>Revenue Models</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:12}}>
              {r.revenue_models.map(m=><Text key={m} style={s.tag}>{m}</Text>)}
            </View>
            <Text style={s.sectionLbl}>MRR Potential</Text>
            <Text style={s.bodyText}>{r.mrr_potential}</Text>
          </View>
          <View style={s.col}>
            <Text style={s.sectionLbl}>Top Risks</Text>
            {r.top_risks.map((risk,i)=>(
              <View key={i} style={{flexDirection:'row',marginBottom:8}}>
                <View style={s.riskDot}/>
                <Text style={[s.bodyText,{flex:1}]}>{risk}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Next Steps */}
        <View style={s.card}>
          <Text style={s.sectionLbl}>Your Next 3 Moves</Text>
          {r.next_steps.map((step,i)=>(
            <View key={i} style={{flexDirection:'row',marginBottom:12,paddingBottom:i<2?12:0,borderBottomWidth:i<2?1:0,borderBottomColor:'#2e2a25'}}>
              <Text style={s.stepNum}>0{i+1}</Text>
              <Text style={s.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>viabl.co — Know Before You Build</Text>
          <Text style={s.footerText}>Not financial or legal advice · Page 2</Text>
        </View>
      </Page>

      {/* ── PAGE 3: Full Dimensions ── */}
      <Page size="A4" style={s.page}>
        <View style={s.accentLine}/>
        <Text style={[s.logo,{fontSize:16,marginBottom:24}]}>VIABL.</Text>
        <Text style={s.sectionLbl}>Full Dimension Analysis</Text>
        {r.dimensions.map((dim,i)=>(
          <View key={i} style={[s.card,{marginBottom:8}]}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:6}}>
              <Text style={{fontSize:10,letterSpacing:1}}>{dim.name}</Text>
              <Text style={{fontSize:14,color:meterColor(dim.score)}}>{dim.score}</Text>
            </View>
            <Text style={s.bodyText}>{dim.body}</Text>
          </View>
        ))}
        <View style={s.footer}>
          <Text style={s.footerText}>viabl.co — Know Before You Build</Text>
          <Text style={s.footerText}>Not financial or legal advice · Page 3</Text>
        </View>
      </Page>
    </Document>
  )
}
