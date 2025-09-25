export interface TimeBlock {
  id: string
  user_id: string
  time_block: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface TimeBlockResponse {
  data: TimeBlock[]
}

export interface SingleTimeBlockResponse {
  data: TimeBlock
  message?: string
}

export interface TimeBlockError {
  error: string
  details?: string
}

export const fetchTimeBlocks = async (date?: string): Promise<TimeBlock[]> => {
  const url = new URL('/api/timeboxes', window.location.origin);
  if (date) {
    url.searchParams.set('date', date);
  }

  const response = await fetch(url.toString());
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch time blocks');
  }

  return result.data;
};

export interface CreateTimeBlockData {
  time_block: string
  description?: string
}

export const createTimeBlock = async (timeBlockData: CreateTimeBlockData): Promise<TimeBlock> => {
  const response = await fetch('/api/timeboxes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(timeBlockData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create time block');
  }

  return result.data;
};

export interface UpdateTimeBlockData {
  time_block: string
  description?: string
}

export const updateTimeBlock = async (timeBlockData: UpdateTimeBlockData): Promise<TimeBlock> => {
  const response = await fetch('/api/timeboxes', {
    method: 'POST', // Using POST as it's an upsert operation
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(timeBlockData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update time block');
  }

  return result.data;
};

export const deleteTimeBlock = async (timeBlockId: string): Promise<void> => {
  const url = new URL('/api/timeboxes', window.location.origin);
  url.searchParams.set('id', timeBlockId);

  const response = await fetch(url.toString(), {
    method: 'DELETE',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to delete time block');
  }
};

// Helper function to format date for API calls
export const formatDateForAPI = (date: Date): string => {
  // Use local date components to avoid timezone shifting
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to create a time block timestamp
export const createTimeBlockTimestamp = (date: Date, hour: number, minute: number): string => {
  // Create the timestamp in UTC to ensure consistent date handling
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const timeBlock = new Date(Date.UTC(year, month, day, hour, minute, 0, 0));
  return timeBlock.toISOString();
};

// Helper function to parse time block timestamp
export const parseTimeBlockTimestamp = (timestamp: string): { hour: number, minute: number } => {
  const date = new Date(timestamp);
  return {
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes()
  };
};

// Helper function to format time for display
export const formatTimeForDisplay = (timestamp: string): string => {
  const { hour, minute } = parseTimeBlockTimestamp(timestamp);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};