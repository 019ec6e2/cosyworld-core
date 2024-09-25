import AnthropicService from '../anthropic.mjs';

(async () => {
    // Initialize the service with the desired model
    const service = new AnthropicService();

    // Define the system prompt
    const systemPrompt = 'You are a knowledgeable assistant that provides concise answers.';

    // Define the conversation messages
    const messages = [
        { role: 'user', content: "Hello, can you tell me who wrote 'Pride and Prejudice'?" },
        { role: 'assistant', content: "Certainly! 'Pride and Prejudice' was written by Jane Austen." },
        { role: 'user', content: 'Thanks! What other famous novels did she write?' }
    ];

    try {
        // Call the chat method with the system prompt and messages
        const response = await service.chat({ systemPrompt, messages });
        console.log('Assistant:', response);
    } catch (error) {
        console.error('Error:', error);
    }
})();
