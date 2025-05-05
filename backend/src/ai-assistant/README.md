# AqshaTracker AI Assistant

## Overview

The AI Assistant module provides intelligent financial assistance to users through:

1. A conversational interface for answering questions about financial data
2. Automated generation of financial reports
3. Analysis of spending patterns, income, and financial goals
4. Personalized financial advice based on user behavior

## Components

- **AiAssistantModule**: Centralizes all AI assistant functionality
- **AiAssistantService**: Implements core processing logic and report generation 
- **AiAssistantController**: Exposes REST API endpoints for the frontend

## Features

### Conversational Interface
- Process natural language requests about finances
- Maintain context across multiple messages
- Provide tailored responses based on user data

### Financial Reports
- Monthly spending breakdown by category
- Income vs expenses analysis
- Cash flow tracking and analysis
- Goal progress tracking
- Category trend analysis over time

### Data Analysis
- Spending pattern recognition
- Goal progress evaluation
- Budget planning assistance
- Category-based insights

## Usage Examples

### Chat with AI
```typescript
// Send a message
POST /api/ai-assistant/chat
{
  "message": "How much did I spend on groceries last month?",
  "contextId": "optional-existing-context-id"
}
```

### Generate Reports
```typescript
// Generate a report
POST /api/ai-assistant/reports
{
  "type": "MONTHLY_SPENDING",
  "startDate": "2023-10-01",
  "endDate": "2023-10-31",
  "format": "JSON"
}
```

### Quick Analyses
```typescript
// Get spending analysis
GET /api/ai-assistant/analyze/spending?startDate=2023-10-01&endDate=2023-10-31

// Get income vs expenses
GET /api/ai-assistant/analyze/income-expenses?startDate=2023-10-01&endDate=2023-10-31

// Get goal progress
GET /api/ai-assistant/analyze/goals?goalIds=goal1,goal2

// Get category trends
GET /api/ai-assistant/analyze/categories?startDate=2023-10-01&endDate=2023-10-31&categoryIds=cat1,cat2
```

## Configuration

The AI assistant requires an OpenAI API key configured in the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
```

## Dependencies

- OpenAI API for natural language processing
- @paralleldrive/cuid2 for ID generation
- NestJS core modules for API structure 