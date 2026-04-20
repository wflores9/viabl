module.exports = {
  siteUrl: 'https://viabl.co',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ]
  },
  exclude: ['/api/*', '/checkout/*', '/confirm/*', '/analyzing/*'],
}
