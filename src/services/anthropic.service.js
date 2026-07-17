const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `
You are an Elite Frontend Developer and Brand Strategist. Your task is to analyze raw YouTube channel data and generate a COMPLETE, single-file HTML/CSS website template for the creator.

CRITICAL INSTRUCTIONS:
1. DO NOT output JSON. You must output raw HTML code wrapped in \`\`\`html \`\`\` tags.
2. The HTML must contain embedded CSS within a <style> tag.
3. You must use modern, ultra-premium aesthetics. Use grids, flexbox, subtle gradients, and hover effects.
4. Adapt the aesthetic completely based on the creator's niche:
   - For coding/tech: Use dark modes, tech-grid backgrounds, terminal badges, and Fira Code fonts.
   - For lifestyle/education: Use clean, bright, highly accessible modern UI (e.g. Stripe or Apple style).
5. Inject the real data provided (Subscribers, Videos, Descriptions) directly into the HTML!
6. Generate 2-3 layout sections (e.g. Hero, Stats, Recent Videos, Products/Courses).

Here is a reference for the LEVEL OF QUALITY and structural aesthetics expected (you should adapt colors/fonts based on the creator's brand):
\`\`\`html
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <style>
        :root { --bg-base: #000; --bg-surface: #111; --bg-border: #333; --text-primary: #EDEDED; --accent: #0070F3; }
        body { background-color: var(--bg-base); color: var(--text-primary); font-family: 'Inter', sans-serif; }
        body::before { content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-image: linear-gradient(var(--bg-border) 1px, transparent 1px), linear-gradient(90deg, var(--bg-border) 1px, transparent 1px); background-size: 50px 50px; opacity: 0.15; z-index: -1; pointer-events: none; }
        .hero h1 { background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        /* Include product grids, video cards, hover effects, and stats */
    </style>
</head>
<body><!-- content --></body>
</html>
\`\`\`
Output ONLY the final HTML document inside \`\`\`html tags. Do not explain your code.
`;

class AnthropicService {
  constructor() {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async generateDesignProposal(channelData, recentVideos) {
    const userData = `
        Channel Name: ${channelData.snippet.title}
        Profile Pic: ${channelData.snippet.thumbnails?.high?.url || ''}
        Subscribers: ${channelData.statistics.subscriberCount}
        Views: ${channelData.statistics.viewCount}
        Total Videos: ${channelData.statistics.videoCount}
        Description: ${channelData.snippet.description}
        Topics: ${channelData.topicDetails ? channelData.topicDetails.topicCategories.join(', ') : 'N/A'}
        Recent Videos:
        ${recentVideos.map((v, i) => `${i + 1}. ${v.title} (Image: ${v.thumbnail})`).join('\n')}
        `;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userData }],
    });

    const responseText = response.content.find(block => block.type === 'text')?.text || '';

    // Extract HTML from the markdown block
    const htmlMatch = responseText.match(/```html([\s\S]*?)```/);
    if (htmlMatch && htmlMatch[1]) {
      return htmlMatch[1].trim();
    }

    // Fallback: If no markdown tags, just return the text assuming it's raw HTML
    return responseText.replace(/```/g, '').trim();
  }
}

module.exports = new AnthropicService();
