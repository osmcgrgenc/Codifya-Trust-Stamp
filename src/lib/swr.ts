import useSWR, { SWRConfiguration } from 'swr'

// Fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

// SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 3,
  errorRetryInterval: 5000,
}

// Custom hooks
export function useTestimonials(username: string) {
  const { data, error, isLoading, mutate } = useSWR(
    username ? `/api/testimonials/${username}` : null,
    fetcher,
    {
      ...swrConfig,
      revalidateInterval: 300000, // 5 minutes
    }
  )

  return {
    testimonials: data?.testimonials || [],
    isLoading,
    error,
    mutate,
  }
}

export function useUserProfile(username: string) {
  const { data, error, isLoading, mutate } = useSWR(
    username ? `/api/user-profile/${username}` : null,
    fetcher,
    {
      ...swrConfig,
      revalidateInterval: 600000, // 10 minutes
    }
  )

  return {
    userProfile: data?.userProfile || null,
    isLoading,
    error,
    mutate,
  }
}

// Optimistic updates
export async function optimisticUpdate<T>(
  key: string,
  updater: (data: T | null) => T,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    // Real update
    const newData = await fetcher()
    return newData
  } catch (error) {
    // Revert on error
    throw error
  }
}
