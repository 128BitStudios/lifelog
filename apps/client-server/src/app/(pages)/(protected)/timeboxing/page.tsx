'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChevronLeft, ChevronRight, Save, X } from 'lucide-react'
import { 
  fetchTimeBlocks, 
  createTimeBlock, 
  updateTimeBlock, 
  deleteTimeBlock,
  formatDateForAPI,
  createTimeBlockTimestamp,
  formatTimeForDisplay,
  type TimeBlock as APITimeBlock 
} from '@/lib/api/timeboxes'

interface TimeSlot {
  time: string
  hour: number
  minute: number
  timeBlock?: APITimeBlock
  isEditing?: boolean
}

// Generate all 15-minute time slots for a day
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      slots.push({
        time: timeString,
        hour,
        minute,
        isEditing: false
      })
    }
  }
  
  return slots
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
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [timeBlocks, setTimeBlocks] = useState<APITimeBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingDescription, setEditingDescription] = useState('')

  const loadTimeBlocks = async (date: Date) => {
    try {
      setLoading(true)
      const dateString = formatDateForAPI(date)
      const blocks = await fetchTimeBlocks(dateString)
      setTimeBlocks(blocks)
      
      // Combine time slots with time blocks
      const slots = generateTimeSlots()
      const combinedSlots = slots.map(slot => {
        const timeBlockTimestamp = createTimeBlockTimestamp(date, slot.hour, slot.minute)
        const matchingBlock = blocks.find(block => 
          new Date(block.time_block).getTime() === new Date(timeBlockTimestamp).getTime()
        )
        return {
          ...slot,
          timeBlock: matchingBlock
        }
      })
      setTimeSlots(combinedSlots)
    } catch (error) {
      console.error('Failed to load time blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTimeBlocks(currentDate)
  }, [currentDate])

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

  const handleSlotClick = (slotIndex: number) => {
    setTimeSlots(prev => prev.map((slot, index) => ({
      ...slot,
      isEditing: index === slotIndex ? !slot.isEditing : false
    })))
    setEditingDescription(timeSlots[slotIndex]?.timeBlock?.description || '')
  }

  const handleSaveTimeBlock = async (slot: TimeSlot) => {
    if (!editingDescription.trim()) return

    try {
      setSaving(true)
      const timeBlockTimestamp = createTimeBlockTimestamp(currentDate, slot.hour, slot.minute)
      
      const timeBlockData = {
        time_block: timeBlockTimestamp,
        description: editingDescription.trim()
      }

      const savedTimeBlock = slot.timeBlock 
        ? await updateTimeBlock(timeBlockData)
        : await createTimeBlock(timeBlockData)

      // Update the time slots with the saved time block
      setTimeSlots(prev => prev.map(s => 
        s.time === slot.time 
          ? { ...s, timeBlock: savedTimeBlock, isEditing: false }
          : s
      ))
      
      setEditingDescription('')
    } catch (error) {
      console.error('Failed to save time block:', error)
      alert('Failed to save time block. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTimeBlock = async (slot: TimeSlot) => {
    if (!slot.timeBlock) return

    try {
      setSaving(true)
      await deleteTimeBlock(slot.timeBlock.id)
      
      // Update the time slots to remove the deleted time block
      setTimeSlots(prev => prev.map(s => 
        s.time === slot.time 
          ? { ...s, timeBlock: undefined, isEditing: false }
          : s
      ))
    } catch (error) {
      console.error('Failed to delete time block:', error)
      alert('Failed to delete time block. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = (slot: TimeSlot) => {
    setTimeSlots(prev => prev.map(s => 
      s.time === slot.time 
        ? { ...s, isEditing: false }
        : s
    ))
    setEditingDescription('')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p>Loading timeboxing schedule...</p>
          </CardContent>
        </Card>
      </div>
    )
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
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((slot, index) => (
                  <TableRow 
                    key={`${slot.time}-${index}`}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">
                      {slot.time}
                    </TableCell>
                    <TableCell>
                      {slot.isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            placeholder="Enter activity description..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveTimeBlock(slot)
                              } else if (e.key === 'Escape') {
                                handleCancelEdit(slot)
                              }
                            }}
                            disabled={saving}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div 
                          className="cursor-pointer min-h-[20px] px-2 py-1 rounded hover:bg-muted"
                          onClick={() => handleSlotClick(index)}
                        >
                          {slot.timeBlock?.description ? (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                              {slot.timeBlock.description}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              Click to add activity...
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {slot.isEditing ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveTimeBlock(slot)}
                            disabled={saving || !editingDescription.trim()}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelEdit(slot)}
                            disabled={saving}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        slot.timeBlock && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTimeBlock(slot)}
                            disabled={saving}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )
                      )}
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