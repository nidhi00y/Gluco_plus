import { useState } from 'react'
import { motion } from 'framer-motion'

const modules = [
  {
    id: 1,
    title: 'Understanding Type 1 Diabetes',
    description: 'Learn about what Type 1 Diabetes is and how it affects your body.',
    lessons: [
      {
        title: 'What is Type 1 Diabetes?',
        content: 'Type 1 diabetes is an autoimmune condition where your body stops producing insulin...',
        duration: '15 mins',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
      },
      {
        title: 'The Role of Insulin',
        content: 'Insulin is a hormone that helps your body use glucose for energy...',
        duration: '20 mins',
        image: 'https://images.unsplash.com/photo-1579684453377-8d2678f2b257?w=400',
      },
      {
        title: 'Managing Blood Sugar',
        content: 'Learn how to monitor and control your blood sugar levels...',
        duration: '25 mins',
        image: 'https://images.unsplash.com/photo-1579684453403-f4f7c1c5e8c1?w=400',
      },
    ],
  },
  {
    id: 2,
    title: 'Insulin Management',
    description: 'Master the art of insulin dosing and timing.',
    lessons: [
      {
        title: 'Types of Insulin',
        content: 'Understanding different insulin types and their action profiles...',
        duration: '20 mins',
        image: 'https://images.unsplash.com/photo-1579684453423-f84349ef60b0?w=400',
      },
      {
        title: 'Calculating Insulin Doses',
        content: 'Learn how to calculate insulin doses based on carbs and blood sugar...',
        duration: '30 mins',
        image: 'https://images.unsplash.com/photo-1579684453437-1f65c6305d3e?w=400',
      },
      {
        title: 'Injection Techniques',
        content: 'Proper insulin injection methods and site rotation...',
        duration: '15 mins',
        image: 'https://images.unsplash.com/photo-1579684453447-1f65c6305d3e?w=400',
      },
    ],
  },
  {
    id: 3,
    title: 'Nutrition and Exercise',
    description: 'Essential tips for diet and physical activity.',
    lessons: [
      {
        title: 'Carbohydrate Counting',
        content: 'Learn how to count carbs and estimate portions...',
        duration: '25 mins',
        image: 'https://images.unsplash.com/photo-1579684453457-1f65c6305d3e?w=400',
      },
      {
        title: 'Exercise Guidelines',
        content: 'Safe exercise practices and blood sugar management during activity...',
        duration: '20 mins',
        image: 'https://images.unsplash.com/photo-1579684453467-1f65c6305d3e?w=400',
      },
      {
        title: 'Meal Planning',
        content: 'Creating balanced meals and snacks for optimal blood sugar control...',
        duration: '30 mins',
        image: 'https://images.unsplash.com/photo-1579684453477-1f65c6305d3e?w=400',
      },
    ],
  },
]

const quickTips = [
  {
    title: 'Blood Sugar Testing',
    tips: [
      'Test before meals and 2 hours after',
      'Keep a log of your readings',
      'Clean hands before testing',
      'Rotate testing sites',
    ],
  },
  {
    title: 'Insulin Storage',
    tips: [
      'Store insulin in the refrigerator',
      'Don\'t freeze insulin',
      'Keep in-use insulin at room temperature',
      'Check expiration dates',
    ],
  },
  {
    title: 'Emergency Preparedness',
    tips: [
      'Always carry fast-acting sugar',
      'Wear medical ID',
      'Have glucagon available',
      'Keep emergency contacts updated',
    ],
  },
]

export default function Education() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:flex md:items-center md:justify-between"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Education Center
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Master Type 1 Diabetes management with our comprehensive learning modules
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {modules.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
            className="card hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => setSelectedModule(moduleIndex)}
          >
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
              <img
                src={module.lessons[0].image}
                alt={module.title}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.title}</h3>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="space-y-2">
              {module.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className={`p-3 rounded-lg transition-colors duration-200 ${
                    selectedModule === moduleIndex && selectedLesson === lessonIndex
                      ? 'bg-primary-50 border-l-4 border-primary-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedModule(moduleIndex)
                    setSelectedLesson(lessonIndex)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                    <span className="text-sm text-gray-500">{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedModule !== null && selectedLesson !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {modules[selectedModule].lessons[selectedLesson].title}
            </h3>
            <span className="text-gray-500">
              {modules[selectedModule].lessons[selectedLesson].duration}
            </span>
          </div>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
            <img
              src={modules[selectedModule].lessons[selectedLesson].image}
              alt={modules[selectedModule].lessons[selectedLesson].title}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-gray-600 leading-relaxed">
            {modules[selectedModule].lessons[selectedLesson].content}
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickTips.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <h4 className="text-lg font-medium text-gray-900 mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.tips.map((tip) => (
                  <li key={tip} className="flex items-start">
                    <svg
                      className="h-6 w-6 text-primary-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}