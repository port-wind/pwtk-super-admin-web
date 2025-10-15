# Spider Logic Refactor

## Overview

The spider functionality has been refactored to improve maintainability and code organization. Previously, all spider-related logic was mixed into the Vue component, making it difficult to understand and maintain.

## What was changed

### Before

- All spider logic was in the Vue component (`src/views/PhotosSys/newsPaperIssue/spiderCheck/index.vue`)
- Complex polling logic mixed with UI logic
- Hard to test and reuse
- Multiple state variables scattered throughout the component

### After

- Spider logic extracted into a reusable composable (`src/composables/useSpiderLogic.ts`)
- Clean separation of concerns
- Easier to test and maintain
- Type-safe interfaces

## New Structure

### `useSpiderLogic` Composable

Located in `src/composables/useSpiderLogic.ts`

**Exported interfaces:**

- `SpiderParams` - Parameters for spider operations
- `SpiderResponse` - API response structure
- `SpiderStatus` - Status information

**Key features:**

- **Polling Management**: Automatically handles status polling with configurable intervals
- **Error Handling**: Robust error handling with retry logic
- **State Management**: Centralized loading and polling states
- **Cleanup**: Automatic cleanup on component unmount

**Main functions:**

- `runSpider()` - Start the spider process and begin polling
- `checkSpiderStatus()` - Check current spider status
- `stopPolling()` - Stop the polling process

### Usage in Components

```typescript
import { useSpiderLogic } from '@/composables/useSpiderLogic'

const { runSpider, isSpiderLoading } = useSpiderLogic()

// Run spider with callbacks
const handleSpiderRun = async () => {
  const params = {
    issue: 'some-issue',
    baseUrl: 'some-url',
    gameType: 'some-game-type'
  }

  const success = await runSpider(
    params,
    // On completion
    () => {
      console.log('Spider completed successfully!')
      // Refresh data, show success message, etc.
    },
    // On no data (optional)
    () => {
      console.log('Spider completed but no data found')
    }
  )

  if (!success) {
    // Handle error
  }
}
```

## Benefits

1. **Maintainability**: Spider logic is now isolated and easier to understand
2. **Reusability**: The composable can be used in other components
3. **Testability**: Logic can be tested independently of UI components
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Error Handling**: Centralized error handling and retry logic
6. **Clean UI**: Component focuses on UI logic only

## Configuration

The composable allows configuration of polling behavior:

- `pollingInterval`: Time between polls (default: 3000ms)
- `maxPollingAttempts`: Maximum polling attempts (default: 10)

## Migration Notes

If you need to use spider functionality in other components:

1. Import the composable: `import { useSpiderLogic } from '@/composables/useSpiderLogic'`
2. Use the `runSpider` function with appropriate callbacks
3. Use `isSpiderLoading` for loading states
4. The composable handles all cleanup automatically
