const youtubeService = require('../services/youtube.service');
const anthropicService = require('../services/anthropic.service');

class AnalyzeController {
    async analyzeChannel(req, res) {
        try {
            let { handle } = req.body;
            
            if (!handle) {
                return res.status(400).json({ error: 'YouTube handle is required.' });
            }
            
            try {
                if (handle.includes('youtube.com/')) {
                    const urlString = handle.startsWith('http') ? handle : `https://${handle}`;
                    const urlObj = new URL(urlString);
                    handle = urlObj.pathname.split('/').pop();
                }
            } catch(e) {}

            if (!handle.startsWith('@')) {
                handle = '@' + handle;
            }

            const channelData = await youtubeService.getChannelData(handle);
            const uploadsPlaylistId = channelData.contentDetails?.relatedPlaylists?.uploads;
            
            const recentVideos = await youtubeService.getRecentVideos(uploadsPlaylistId);
            
            const designHTML = await anthropicService.generateDesignProposal(channelData, recentVideos);

            res.json({
                meta: {
                    title: channelData.snippet.title,
                    profilePic: channelData.snippet.thumbnails?.high?.url || '',
                    banner: channelData.brandingSettings?.image?.bannerExternalUrl || ''
                },
                html: designHTML
            });

        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({ error: error.message || 'Failed to process request.' });
        }
    }
}

module.exports = new AnalyzeController();
