'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TimeBlock {
  time: string
  activity?: string
  notes?: string
}

// Generate all 15-minute time blocks for a day
const generateTimeBlocks = (): TimeBlock[] => {
  const blocks: TimeBlock[] = []
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      blocks.push({
        time: timeString,
        activity: getMockActivity(hour, minute),
        notes: getMockNotes(hour, minute)
      })
    }
  }
  
  return blocks
}

// Mock data generator
const getMockActivity = (hour: number, minute: number): string => {
  const activities = [
    'Deep Work', 'Meeting', 'Email', 'Break', 'Exercise', 'Lunch', 
    'Reading', 'Planning', 'Coding', 'Review', 'Research', 'Admin'
  ]
  
  // Generate some realistic mock data based on time
  if (hour >= 0 && hour < 6) return 'Sleep'
  if (hour === 6 && minute === 0) return 'Wake up'
  if (hour === 7) return 'Morning routine'
  if (hour === 8) return 'Breakfast'
  if (hour >= 9 && hour < 12) return activities[Math.floor(Math.random() * 4)]
  if (hour === 12) return 'Lunch'
  if (hour >= 13 && hour < 17) return activities[Math.floor(Math.random() * activities.length)]
  if (hour >= 17 && hour < 19) return 'Personal time'
  if (hour >= 19 && hour < 21) return 'Dinner & family'
  if (hour >= 21) return 'Evening routine'
  
  return ''
}

const getMockNotes = (hour: number, minute: number): string => {
  const notes = [
    'Focus session', 'Productive', 'Need follow-up', 'Good progress',
    'Interrupted', 'Completed task', 'Planning needed', 'Break needed'
  ]
  
  // Add notes randomly for some time slots
  if (Math.random() > 0.7) {
    return notes[Math.floor(Math.random() * notes.length)]
  }
  
  return ''
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function TimeboxingPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const timeBlocks = generateTimeBlocks()

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Timeboxing Schedule</CardTitle>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousDay}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium min-w-[200px] text-center">
                  {formatDate(currentDate)}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextDay}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[70vh] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead className="w-20">Time</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeBlocks.map((block, index) => (
                  <TableRow 
                    key={`${block.time}-${index}`}
                    className="hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell className="font-mono text-sm">
                      {block.time}
                    </TableCell>
                    <TableCell>
                      {block.activity && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                          {block.activity}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {block.notes}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}