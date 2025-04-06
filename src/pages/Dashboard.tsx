import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { format, subDays } from 'date-fns'
import { supabase } from '../lib/supabase'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import { motion } from 'framer-motion'
import type { BloodSugarReading, MedicineLog } from '../types/database'
import { useAuth } from '../hooks/useAuth'
import 'chartjs-adapter-date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

// Enhanced insulin dose calculator
const calculateInsulinDose = (bloodSugar: number, readingType: string): number => {
  const targetBloodSugar = 120;
  const correctionFactor = 50; // 1 unit lowers blood sugar by 50 mg/dL
  const carbRatio = 15; // 1 unit covers 15g of carbs

  let dose = 0;

  // Correction dose
  if (bloodSugar > targetBloodSugar) {
    dose += Math.round((bloodSugar - targetBloodSugar) / correctionFactor);
  }

  // Meal-time dose
  if (readingType === 'before_meal') {
    // Assuming average meal of 45g carbs
    dose += Math.round(45 / carbRatio);
  }

  return dose;
};

const insulinTypes = {
  rapid: [
    { name: 'Fiasp', onset: '2-5 min', peak: '1-3 hrs', duration: '3-5 hrs', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400' },
    { name: 'NovoRapid', onset: '10-20 min', peak: '1-3 hrs', duration: '3-5 hrs', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
    { name: 'Humalog', onset: '15-30 min', peak: '1-2 hrs', duration: '4-6 hrs', image: 'https://images.unsplash.com/photo-1583912267550-d6cc3c410d1c?w=400' },
  ],
  long: [
    { name: 'Lantus', onset: '1-2 hrs', peak: 'No peak', duration: '20-24 hrs', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
    { name: 'Levemir', onset: '1-2 hrs', peak: '6-8 hrs', duration: '16-24 hrs', image: 'https://images.unsplash.com/photo-1583912267550-d6cc3c410d1c?w=400' },
    { name: 'Tresiba', onset: '30-90 min', peak: 'No peak', duration: '42+ hrs', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400' },
  ],
}

export default function Dashboard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [newReading, setNewReading] = useState({
    blood_sugar_level: '',
    reading_type: 'before_meal',
    insulin_type: '',
    insulin_name: '',
    insulin_dose: '',
    notes: '',
  })

  // Get readings for the last 7 days
  const sevenDaysAgo = subDays(new Date(), 7).toISOString()

  const { data: bloodSugarReadings, isLoading: readingsLoading } = useQuery<BloodSugarReading[]>(
    ['bloodSugarReadings', user?.id],
    async () => {
      if (!user?.id) throw new Error('User not authenticated')
      
      const { data, error } = await supabase
        .from('blood_sugar_readings')
        .select('*')
        .eq('user_id', user.id)
        .gte('reading_time', sevenDaysAgo)
        .order('reading_time', { ascending: true })
      
      if (error) throw error
      return data
    },
    {
      enabled: !!user?.id,
      refetchInterval: 1000, // Real-time updates every second
    }
  )

  const { data: medicineLogs } = useQuery<MedicineLog[]>(
    ['medicineLogs', user?.id],
    async () => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('medicine_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false })
        .limit(5)
      
      if (error) throw error
      return data
    },
    {
      enabled: !!user?.id,
    }
  )

  const addReadingMutation = useMutation(
    async (reading: typeof newReading) => {
      if (!user?.id) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('blood_sugar_readings')
        .insert([
          {
            user_id: user.id,
            blood_sugar_level: parseFloat(reading.blood_sugar_level),
            reading_type: reading.reading_type,
            insulin_type: reading.insulin_type || null,
            insulin_name: reading.insulin_name || null,
            insulin_dose: reading.insulin_dose ? parseFloat(reading.insulin_dose) : null,
            notes: reading.notes || null,
            reading_time: new Date().toISOString(), // Add current timestamp
          },
        ])
        .select()
      
      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bloodSugarReadings', user?.id])
        setNewReading({
          blood_sugar_level: '',
          reading_type: 'before_meal',
          insulin_type: '',
          insulin_name: '',
          insulin_dose: '',
          notes: '',
        })
      },
    }
  )

  // Automatically calculate insulin dose when blood sugar or reading type changes
  useEffect(() => {
    if (newReading.blood_sugar_level) {
      const suggestedDose = calculateInsulinDose(
        parseFloat(newReading.blood_sugar_level),
        newReading.reading_type
      );
      setNewReading(prev => ({
        ...prev,
        insulin_dose: suggestedDose.toString(),
      }));
    }
  }, [newReading.blood_sugar_level, newReading.reading_type]);

  const chartData = {
    datasets: [
      {
        label: 'Blood Sugar Level',
        data: bloodSugarReadings?.map(reading => ({
          x: new Date(reading.reading_time),
          y: reading.blood_sugar_level
        })) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'MMM d, h:mm a'
          }
        },
        title: {
          display: true,
          text: 'Date and Time'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Blood Sugar Level (mg/dL)'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const date = new Date(context[0].raw.x)
            return format(date, 'PPpp')
          }
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addReadingMutation.mutateAsync(newReading)
    } catch (error) {
      console.error('Error adding reading:', error)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to DiabetesTracker</h1>
          <p className="text-xl text-blue-100">
            Your intelligent companion for managing Type 1 Diabetes. Track your journey to better health with real-time monitoring and smart insights.
          </p>
          {bloodSugarReadings && bloodSugarReadings[bloodSugarReadings.length - 1] && (
            <div className="mt-6 inline-flex items-center rounded-lg bg-blue-500/20 px-6 py-3 text-white">
              <span className="text-sm">Latest Reading:</span>
              <span className="ml-2 text-2xl font-bold">
                {bloodSugarReadings[bloodSugarReadings.length - 1].blood_sugar_level} mg/dL
              </span>
              <span className="ml-2 text-sm opacity-75">
                ({format(new Date(bloodSugarReadings[bloodSugarReadings.length - 1].reading_time), 'MMM d, h:mm a')})
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Blood Sugar Reading</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="blood_sugar_level" className="block text-sm font-medium text-gray-700">
                  Blood Sugar Level (mg/dL)
                </label>
                <input
                  type="number"
                  id="blood_sugar_level"
                  className="input-field mt-1"
                  value={newReading.blood_sugar_level}
                  onChange={(e) => setNewReading(prev => ({ ...prev, blood_sugar_level: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="reading_type" className="block text-sm font-medium text-gray-700">
                  Reading Type
                </label>
                <select
                  id="reading_type"
                  className="input-field mt-1"
                  value={newReading.reading_type}
                  onChange={(e) => setNewReading(prev => ({ ...prev, reading_type: e.target.value }))}
                >
                  <option value="before_meal">Before Meal</option>
                  <option value="after_meal">After Meal</option>
                  <option value="bedtime">Bedtime</option>
                  <option value="fasting">Fasting</option>
                </select>
              </div>
              <div>
                <label htmlFor="insulin_type" className="block text-sm font-medium text-gray-700">
                  Insulin Type
                </label>
                <select
                  id="insulin_type"
                  className="input-field mt-1"
                  value={newReading.insulin_type}
                  onChange={(e) => {
                    setNewReading(prev => ({
                      ...prev,
                      insulin_type: e.target.value,
                      insulin_name: '', // Reset insulin name when type changes
                    }))
                  }}
                >
                  <option value="">Select Insulin Type</option>
                  <option value="rapid">Rapid-Acting</option>
                  <option value="long">Long-Acting</option>
                </select>
              </div>
              {newReading.insulin_type && (
                <div>
                  <label htmlFor="insulin_name" className="block text-sm font-medium text-gray-700">
                    Insulin Name
                  </label>
                  <select
                    id="insulin_name"
                    className="input-field mt-1"
                    value={newReading.insulin_name}
                    onChange={(e) => setNewReading(prev => ({ ...prev, insulin_name: e.target.value }))}
                  >
                    <option value="">Select Insulin</option>
                    {insulinTypes[newReading.insulin_type as keyof typeof insulinTypes].map(insulin => (
                      <option key={insulin.name} value={insulin.name}>
                        {insulin.name}
                      </option>
                    ))}
                  </select>
                  {newReading.insulin_name && (
                    <div className="mt-2">
                      {insulinTypes[newReading.insulin_type as keyof typeof insulinTypes].find(
                        i => i.name === newReading.insulin_name
                      )?.onset && (
                        <div className="flex items-center space-x-4">
                          <img
                            src={insulinTypes[newReading.insulin_type as keyof typeof insulinTypes].find(
                              i => i.name === newReading.insulin_name
                            )?.image}
                            alt={newReading.insulin_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <span className="block text-sm text-gray-500">
                              Onset: {insulinTypes[newReading.insulin_type as keyof typeof insulinTypes].find(
                                i => i.name === newReading.insulin_name
                              )?.onset}
                            </span>
                            <span className="block text-sm text-gray-500">
                              Duration: {insulinTypes[newReading.insulin_type as keyof typeof insulinTypes].find(
                                i => i.name === newReading.insulin_name
                              )?.duration}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div>
                <label htmlFor="insulin_dose" className="block text-sm font-medium text-gray-700">
                  Insulin Dose (units)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="insulin_dose"
                    className="input-field mt-1"
                    value={newReading.insulin_dose}
                    onChange={(e) => setNewReading(prev => ({ ...prev, insulin_dose: e.target.value }))}
                  />
                  {newReading.blood_sugar_level && (
                    <div className="absolute right-0 top-0 mt-2 mr-2 text-sm text-primary-600">
                      Suggested: {calculateInsulinDose(parseFloat(newReading.blood_sugar_level), newReading.reading_type)} units
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                className="input-field mt-1"
                value={newReading.notes}
                onChange={(e) => setNewReading(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={addReadingMutation.isLoading}
            >
              {addReadingMutation.isLoading ? 'Adding...' : 'Add Reading'}
            </button>
            {addReadingMutation.isError && (
              <p className="text-red-600 text-sm mt-2">
                Error adding reading. Please try again.
              </p>
            )}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Blood Sugar Trends (Last 7 Days)</h3>
          <div className="h-80">
            {readingsLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Blood Sugar Readings</h3>
          <div className="space-y-4">
            {bloodSugarReadings?.slice(-5).map((reading) => (
              <div
                key={reading.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
              >
                <div>
                  <p className="text-sm text-gray-500">{format(new Date(reading.reading_time), 'PPpp')}</p>
                  <p className="font-medium text-lg">{reading.blood_sugar_level} mg/dL</p>
                  <p className="text-sm text-gray-500">{reading.reading_type.replace('_', ' ')}</p>
                  {reading.insulin_name && (
                    <div className="flex items-center mt-2">
                      {insulinTypes[reading.insulin_type as keyof typeof insulinTypes]?.find(
                        i => i.name === reading.insulin_name
                      )?.image && (
                        <img
                          src={insulinTypes[reading.insulin_type as keyof typeof insulinTypes].find(
                            i => i.name === reading.insulin_name
                          )?.image}
                          alt={reading.insulin_name}
                          className="w-8 h-8 rounded-full object-cover mr-2"
                        />
                      )}
                      <p className="text-sm text-primary-600">
                        {reading.insulin_name} - {reading.insulin_dose} units
                      </p>
                    </div>
                  )}
                </div>
                {reading.notes && (
                  <p className="text-sm text-gray-500 max-w-xs">{reading.notes}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Medicine Logs</h3>
          <div className="space-y-4">
            {medicineLogs?.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
              >
                <div>
                  <p className="text-sm text-gray-500">{format(new Date(log.taken_at), 'PPpp')}</p>
                  <p className="font-medium">{log.medicine_name}</p>
                  <p className="text-sm text-gray-500">Dosage: {log.dosage}</p>
                </div>
                {log.notes && (
                  <p className="text-sm text-gray-500 max-w-xs">{log.notes}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}