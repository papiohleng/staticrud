const axios = require('axios');

exports.handler = async function(event, context) {
    try {
        const response = await axios.get(
            'https://script.google.com/macros/s/AKfycby7927j4Y-ViFhJR3X5lv4zrXiokXmzmCJRhyhQqei2tI1hW5ahOegYLwMOAIO0j6VstQ/exec'
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
            },
            body: response.data
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Error fetching the page: ' + error.message
        };
    }
};
