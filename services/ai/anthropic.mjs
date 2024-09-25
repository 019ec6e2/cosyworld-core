import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

export default class AnthropicService {
    constructor(model = 'claude-3-5-sonnet-20240620') {
        this.model = model;
        this.apiKey = process.env.ANTHROPIC_API_KEY;
        this.client = new Anthropic(this.apiKey);
    }

    async chat({ systemPrompt, messages }) {
        const conversation = [
            {
                role: 'user',
                content: 'conversation continues'
            },
            ...messages
        ];

        const preparedMessages = conversation.reduce((acc, message, index) => {
            if (index === 0 || message.role !== acc[acc.length - 1].role) {
                acc.push({
                    role: message.role,
                    content: message.content
                });
            } else {
                acc[acc.length - 1].content += `\n\n${message.role}: ${message.content}`;
            }
            return acc;
        }, []);

        console.log('----');
        console.log('preparedMessages', preparedMessages);
        console.log('----');

        const response = await this.client.messages.create({
            model: this.model,
            messages: preparedMessages,
            system: systemPrompt,
            max_tokens: 512,
            temperature: 0.7,
            top_p: 0.9,
            top_k: 50
        });

        return response.content[0].text;
    }
}
