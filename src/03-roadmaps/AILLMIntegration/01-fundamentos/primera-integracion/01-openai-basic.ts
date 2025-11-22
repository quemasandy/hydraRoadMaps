/**
 * EN: First OpenAI Integration - Basic Chat Completion
 * RU: Первая интеграция с OpenAI - Базовое завершение чата
 *
 * This example demonstrates:
 * - Setting up OpenAI client
 * - Making a simple chat completion request
 * - Handling responses and tokens
 * - Error handling
 * - TypeScript typing
 */

import OpenAI from 'openai';
import 'dotenv/config';

/**
 * EN: Initialize OpenAI client
 * RU: Инициализация клиента OpenAI
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Optional: Configure timeout and retries
  timeout: 30000, // 30 seconds
  maxRetries: 2,
});

/**
 * EN: Basic chat completion example
 * RU: Пример базового завершения чата
 */
async function basicChatCompletion() {
  console.log('🤖 Basic Chat Completion Example\n');

  try {
    const completion = await openai.chat.completions.create({
      // Model selection
      model: 'gpt-4o-mini', // Faster and cheaper for development

      // Messages array (conversation history)
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that explains technical concepts concisely.',
        },
        {
          role: 'user',
          content: 'What is a REST API? Explain in 2 sentences.',
        },
      ],

      // Parameters
      temperature: 0.7, // Creativity (0.0 = deterministic, 2.0 = very creative)
      max_tokens: 100, // Maximum tokens in response
      top_p: 1, // Nucleus sampling
      frequency_penalty: 0, // Penalize frequent tokens
      presence_penalty: 0, // Penalize already mentioned topics
    });

    // Extract response
    const message = completion.choices[0].message;
    const content = message.content || '';

    // Log results
    console.log('Response:', content);
    console.log('\n--- Metadata ---');
    console.log('Model:', completion.model);
    console.log('Tokens used:', completion.usage?.total_tokens);
    console.log('Prompt tokens:', completion.usage?.prompt_tokens);
    console.log('Completion tokens:', completion.usage?.completion_tokens);
    console.log('Finish reason:', completion.choices[0].finish_reason);
  } catch (error) {
    handleError(error);
  }
}

/**
 * EN: Multi-turn conversation example
 * RU: Пример многоходовой беседы
 */
async function multiTurnConversation() {
  console.log('\n\n🔄 Multi-turn Conversation Example\n');

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are a helpful coding assistant.',
    },
  ];

  try {
    // Turn 1
    messages.push({
      role: 'user',
      content: 'Write a TypeScript function to reverse a string.',
    });

    let completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    let assistantMessage = completion.choices[0].message.content || '';
    messages.push({
      role: 'assistant',
      content: assistantMessage,
    });

    console.log('Turn 1 - User: Write a TypeScript function to reverse a string.');
    console.log('Turn 1 - Assistant:', assistantMessage.substring(0, 100) + '...');

    // Turn 2
    messages.push({
      role: 'user',
      content: 'Now add JSDoc comments to that function.',
    });

    completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    assistantMessage = completion.choices[0].message.content || '';

    console.log('\nTurn 2 - User: Now add JSDoc comments to that function.');
    console.log('Turn 2 - Assistant:', assistantMessage.substring(0, 100) + '...');

    console.log('\n--- Conversation Stats ---');
    console.log('Total messages:', messages.length);
    console.log('Total tokens:', completion.usage?.total_tokens);
  } catch (error) {
    handleError(error);
  }
}

/**
 * EN: Different temperature comparison
 * RU: Сравнение разных значений температуры
 */
async function temperatureComparison() {
  console.log('\n\n🌡️ Temperature Comparison Example\n');

  const prompt = 'Write a creative name for a coffee shop.';

  const temperatures = [0.0, 0.7, 1.5];

  for (const temp of temperatures) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: temp,
        max_tokens: 20,
      });

      const response = completion.choices[0].message.content;
      console.log(`Temperature ${temp}: ${response}`);
    } catch (error) {
      console.error(`Error with temperature ${temp}:`, error);
    }
  }
}

/**
 * EN: JSON mode example
 * RU: Пример режима JSON
 */
async function jsonModeExample() {
  console.log('\n\n📋 JSON Mode Example\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You extract information and return valid JSON.',
        },
        {
          role: 'user',
          content: 'Extract name, email, and phone from: "Contact John Doe at john@example.com or call 555-1234"',
        },
      ],
      response_format: { type: 'json_object' },
    });

    const jsonResponse = completion.choices[0].message.content || '{}';
    const parsed = JSON.parse(jsonResponse);

    console.log('Extracted data:', JSON.stringify(parsed, null, 2));
  } catch (error) {
    handleError(error);
  }
}

/**
 * EN: Error handling
 * RU: Обработка ошибок
 */
function handleError(error: unknown) {
  if (error instanceof OpenAI.APIError) {
    console.error('OpenAI API Error:');
    console.error('- Status:', error.status);
    console.error('- Message:', error.message);
    console.error('- Code:', error.code);
    console.error('- Type:', error.type);
  } else if (error instanceof Error) {
    console.error('General Error:', error.message);
  } else {
    console.error('Unknown Error:', error);
  }
}

/**
 * EN: Main execution
 * RU: Основное выполнение
 */
async function main() {
  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    console.log('\nPlease create a .env file with:');
    console.log('OPENAI_API_KEY=sk-...\n');
    process.exit(1);
  }

  console.log('================================');
  console.log('OpenAI Integration Examples');
  console.log('================================\n');

  // Run examples
  await basicChatCompletion();
  await multiTurnConversation();
  await temperatureComparison();
  await jsonModeExample();

  console.log('\n✅ All examples completed!');
}

// Execute if run directly
if (require.main === module) {
  main().catch(console.error);
}

export { openai, basicChatCompletion, multiTurnConversation };
