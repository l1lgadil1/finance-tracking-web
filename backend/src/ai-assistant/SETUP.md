# AqshaTracker AI Assistant Setup

## Configuration

### OpenAI API Key

The AI Assistant requires an OpenAI API key to function properly. Follow these steps to set it up:

1. **Obtain an API key**
   - Create an account at [OpenAI Platform](https://platform.openai.com)
   - Navigate to your API keys section
   - Create a new API key

2. **Configure your environment**
   - Add the following to your `.env` file in the backend root:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```

3. **Restart the application**
   - Restart your NestJS application for the changes to take effect

### Supported Models

The AI Assistant uses OpenAI's GPT-4o model by default, but you can modify this in the code to use other models:

```typescript
// Inside ai-assistant.service.ts
const completion = await this.openai.chat.completions.create({
  model: 'gpt-4o', // Change to 'gpt-3.5-turbo' or others as needed
  messages: formattedMessages,
  temperature: 0.7,
  max_tokens: 1000,
});
```

### Error Handling

The service includes built-in error handling for common issues:

- Missing API key
- API connection failures
- Invalid responses

Check your backend logs if you encounter issues, as they will contain specific error messages.

## Testing

To verify your AI Assistant is working:

1. Start your backend server
2. Call the chat endpoint:
   ```
   POST /api/ai-assistant/chat
   {
     "message": "How much did I spend last month?"
   }
   ```
3. You should receive a response from the AI

For more detailed API usage, see the README.md file in this directory. 