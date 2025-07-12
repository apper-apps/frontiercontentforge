export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      retries++;
      
      if (retries === maxRetries) {
        // Enhanced error reporting for network issues
        if (error.name === 'AbortError') {
          throw new Error(`Network timeout after ${30000}ms. Please check your connection and try again.`);
        }
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          throw new Error(`Network error: Unable to connect to server. Please check your internet connection and try again.`);
        }
        throw error;
      }
      
      // Exponential backoff with increased base delay for CDN issues
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
    }
  }
}

// Enhanced retry function with exponential backoff
export async function fetchWithRetry(operation, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = (error) => {
      return error.message && (
        error.message.includes('Network Error') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('timeout') ||
        error.message.includes('ERR_NETWORK') ||
        error.message.includes('CONNECTION_ERROR')
      );
    }
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if it's the last attempt or if retry condition is not met
      if (attempt === maxRetries || !retryCondition(error)) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
      
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`, error.message);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Utility function to check if SDK is loaded
export function isSDKLoaded() {
  return typeof window !== 'undefined' && 
         window.ApperSDK && 
         window.ApperSDK.ApperClient && 
         window.ApperSDK.ApperUI;
}

// Utility function to wait for SDK with timeout
export function waitForSDKLoad(timeout = 30000) {
  return new Promise((resolve, reject) => {
    if (isSDKLoaded()) {
      resolve();
      return;
    }
    
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (isSDKLoaded()) {
        clearInterval(checkInterval);
        resolve();
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error('Apper SDK failed to load within timeout period'));
      }
    }, 100);
  });
}