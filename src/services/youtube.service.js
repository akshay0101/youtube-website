const axios = require('axios');

class YouTubeService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
    }

    async getChannelData(handle) {
        const response = await axios.get(`${this.baseUrl}/channels`, {
            params: {
                part: 'snippet,brandingSettings,contentDetails,statistics,topicDetails',
                forHandle: handle,
                key: this.apiKey
            }
        });

        if (!response.data.items || response.data.items.length === 0) {
            throw new Error('Channel not found. Please check the handle.');
        }

        return response.data.items[0];
    }

    async getRecentVideos(playlistId, maxResults = 5) {
        if (!playlistId) return [];

        const response = await axios.get(`${this.baseUrl}/playlistItems`, {
            params: {
                part: 'snippet',
                maxResults: maxResults,
                playlistId: playlistId,
                key: this.apiKey
            }
        });

        return response.data.items.map(item => ({
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || ''
        }));
    }
}

module.exports = new YouTubeService();
