import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

const questions = [
  {
    id: 1,
    question: 'Are you experiencing increased thirst and frequent urination?',
    info: 'These are common early symptoms of Type 1 Diabetes',
  },
  {
    id: 2,
    question: 'Have you noticed unexplained weight loss recently?',
    info: 'Unexplained weight loss can be a sign of Type 1 Diabetes',
  },
  {
    id: 3,
    question: 'Do you feel unusually tired or weak?',
    info: 'Fatigue is a common symptom of Type 1 Diabetes',
  },
  {
    id: 4,
    question: 'Have you experienced blurred vision?',
    info: 'High blood sugar can affect your vision',
  },
  {
    id: 5,
    question: 'Do you have a family history of Type 1 Diabetes?',
    info: 'Genetic factors can increase your risk',
  },
]

const foodRecommendations = {
  include: [
    { name: 'Leafy Greens', description: 'Low in carbs, high in nutrients', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400' },
    { name: 'Whole Grains', description: 'Complex carbohydrates for steady energy', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
    { name: 'Lean Proteins', description: 'Essential for muscle maintenance', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400' },
    { name: 'Healthy Fats', description: 'Important for hormone balance', image: 'https://images.unsplash.com/photo-1519051733127-12680d9ab958?w=400' },
  ],
  avoid: [
    { name: 'Sugary Beverages', description: 'Can cause rapid blood sugar spikes', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400' },
    { name: 'Processed Foods', description: 'Often high in hidden sugars', image: 'https://images.unsplash.com/photo-1621887348744-6b0444f4aa9a?w=400' },
    { name: 'High-Glycemic Foods', description: 'Can cause blood sugar instability', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
    { name: 'Excessive Alcohol', description: 'Can interfere with blood sugar control', image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400' },
  ],
}

export default function HealthInsights() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  const calculateRisk = () => {
    const positiveAnswers = answers.filter(a => a).length
    if (positiveAnswers >= 4) return 'High'
    if (positiveAnswers >= 2) return 'Moderate'
    return 'Low'
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:flex md:items-center md:justify-between"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Health Insights
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-6">Type 1 Diabetes Assessment</h3>
          {!showResults ? (
            <div className="space-y-6">
              <div className="text-center mb-4">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h4>
                <p className="text-sm text-gray-600 mb-6">{questions[currentQuestion].info}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="btn-primary"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="btn-primary bg-gray-500 hover:bg-gray-600"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-xl font-medium mb-2">Assessment Complete</h4>
                <p className="text-gray-600">Based on your answers, your risk level is:</p>
                <p className="text-2xl font-bold mt-4 text-primary-600">{calculateRisk()}</p>
              </div>
              <div className="flex justify-center">
                <button onClick={resetQuiz} className="btn-primary">
                  Take Quiz Again
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Recommended Foods</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foodRecommendations.include.map((food) => (
                <div key={food.name} className="relative group">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      {food.name}
                    </h4>
                    <p className="text-sm text-gray-600">{food.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Foods to Limit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {foodRecommendations.avoid.map((food) => (
                <div key={food.name} className="relative group">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium flex items-center">
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                      {food.name}
                    </h4>
                    <p className="text-sm text-gray-600">{food.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}