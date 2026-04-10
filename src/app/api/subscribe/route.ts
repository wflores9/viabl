import { NextRequest, NextResponse } from 'next/server'
export async function POST(req:NextRequest) {
  try { const {email} = await req.json(); console.log('subscribe:',email); return NextResponse.json({success:true}) }
  catch { return NextResponse.json({success:true}) }
}
