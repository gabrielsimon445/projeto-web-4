'use client';

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, Badge } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import TaskModal from "../dashboard/components/TaskModal";
import { useState } from "react";

const categoryColors = {
  personal: "bg-blue-100 text-blue-700 border-blue-200",
  team: "bg-purple-100 text-purple-700 border-purple-200",
  urgent: "bg-red-100 text-red-700 border-red-200",
};

const priorityDots = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  //   const queryClient = useQueryClient();

  //   const { data: tasks = [], isLoading } = useQuery({
  //     queryKey: ['tasks'],
  //     queryFn: () => base44.entities.Task.list('-due_date'),
  //     initialData: [],
  //   });

  //   const createTaskMutation = useMutation({
  //     mutationFn: (taskData) => base44.entities.Task.create(taskData),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['tasks'] });
  //     },
  //   });

  //   const updateTaskMutation = useMutation({
  //     mutationFn: ({ id, taskData }) => base44.entities.Task.update(id, taskData),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['tasks'] });
  //     },
  //   });

  //   const handleSaveTask = (taskData) => {
  //     if (selectedTask) {
  //       updateTaskMutation.mutate({ id: selectedTask.id, taskData });
  //     } else {
  //       createTaskMutation.mutate(taskData);
  //     }
  //     setSelectedTask(null);
  //   };

  //   const monthStart = startOfMonth(currentDate);
  //   const monthEnd = endOfMonth(currentDate);
  //   const calendarStart = startOfWeek(monthStart);
  //   const calendarEnd = endOfWeek(monthEnd);
  //   const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  //   const getTasksForDay = (day) => {
  //     return tasks.filter(task =>
  //       task.due_date && isSameDay(new Date(task.due_date), day)
  //     );
  //   };

  return (
    <div className="min-h-screen bg-[#FAFAF9] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Calendar View
            </h1>
            <p className="text-gray-600">Visualize your tasks by date</p>
          </div>

          <button
            onClick={() => {
              setSelectedTask(null);
              setShowModal(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task
          </button>
        </div>

        {/* Calendar Header */}
        {/* <Card className="p-6 mb-6 bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button
                // variant="outline"
                // size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                // variant="outline"
                onClick={() => setCurrentDate(new Date())}
                className="px-4"
              >
                Today
              </button>
              <button
                // variant="outline"
                // size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
        {/* <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                {day}
              </div>
            ))}
          </div> */}

        {/* Calendar Grid */}
        {/* <div className="grid grid-cols-7 gap-2">
            <AnimatePresence mode="wait">
              {calendarDays.map((day, index) => {
                const dayTasks = getTasksForDay(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <motion.div
                    key={day.toString()}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className={`min-h-[120px] p-2 rounded-xl border-2 transition-all ${
                      isToday 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 bg-white hover:border-indigo-200'
                    } ${!isCurrentMonth && 'opacity-40'}`}
                  >
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-indigo-600' : 'text-gray-700'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task, idx) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => {
                            setSelectedTask(task);
                            setShowModal(true);
                          }}
                          className={`text-xs p-1.5 rounded-lg cursor-pointer ${categoryColors[task.category]} border hover:shadow-md transition-all`}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${priorityDots[task.priority]}`} />
                            <span className="font-medium truncate">{task.title}</span>
                          </div>
                          {task.assignee && (
                            <div className="text-xs opacity-75 truncate">{task.assignee}</div>
                          )}
                        </motion.div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500 font-medium pl-1.5">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Card> */}

        {/* Legend */}
        {/* <Card className="p-6 bg-white border-0 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge className={categoryColors.personal}>Personal</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={categoryColors.team}>Team</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={categoryColors.urgent}>Urgent</Badge>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${priorityDots.high}`} />
              <span className="text-sm text-gray-600">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${priorityDots.medium}`} />
              <span className="text-sm text-gray-600">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${priorityDots.low}`} />
              <span className="text-sm text-gray-600">Low Priority</span>
            </div>
          </div>
        </Card>
      </div>

      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        task={selectedTask}
      /> */}
      </div>
    </div>
  );
}
