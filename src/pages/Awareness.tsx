import { motion } from 'framer-motion'
import { useState } from 'react'

const videos = [
  {
    title: 'Understanding Type 1 Diabetes',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Learn about the basics of Type 1 Diabetes and how it affects your body.',
  },
  {
    title: 'Managing Blood Sugar Levels',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Expert tips on maintaining healthy blood sugar levels throughout the day.',
  },
  {
    title: 'Exercise and Type 1 Diabetes',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Safe exercise guidelines for people with Type 1 Diabetes.',
  },
]

const news = [
  {
    title: 'New Research in Type 1 Diabetes Treatment',
    description: 'Recent studies show promising results in developing new treatment methods for Type 1 Diabetes...',
    image: 'https://images.unsplash.com/photo-1576671081837-49b1a991dd54?w=400',
    link: '#',
  },
  {
    title: 'Upcoming Awareness Programs',
    description: 'Join our community events and learn more about managing Type 1 Diabetes...',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    link: '#',
  },
  {
    title: 'Diet and Nutrition Updates',
    description: 'Latest research on dietary recommendations for Type 1 Diabetes management...',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    link: '#',
  },
]

const relatedConditions = [
  {
    name: 'Celiac Disease',
    description: 'People with Type 1 Diabetes have a higher risk of developing celiac disease...',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    symptoms: ['Digestive issues', 'Fatigue', 'Weight loss', 'Anemia'],
    prevention: ['Gluten-free diet', 'Regular screening', 'Early diagnosis'],
  },
  {
    name: 'Thyroid Disorders',
    description: 'Regular thyroid function tests are important as thyroid disorders are common in Type 1 Diabetes...',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400',
    symptoms: ['Weight changes', 'Fatigue', 'Mood changes', 'Temperature sensitivity'],
    prevention: ['Regular testing', 'Medication compliance', 'Healthy lifestyle'],
  },
  {
    name: 'Diabetic Retinopathy',
    description: 'A condition that affects blood vessels in the retina and can lead to vision problems...',
    image: 'https://images.unsplash.com/photo-1577758231548-cd94c5d23a9c?w=400',
    symptoms: ['Blurred vision', 'Floaters', 'Vision loss', 'Eye pain'],
    prevention: ['Regular eye exams', 'Blood sugar control', 'Blood pressure management'],
  },
]

const lifestyleTips = [
  {
    title: 'Healthy Eating',
    icon: '🥗',
    tips: [
      'Count carbohydrates accurately',
      'Eat regular, balanced meals',
      'Monitor portion sizes',
      'Choose whole grains over refined grains',
    ],
  },
  {
    title: 'Physical Activity',
    icon: '🏃‍♂️',
    tips: [
      'Exercise regularly',
      'Monitor blood sugar before and after activity',
      'Carry fast-acting carbs during exercise',
      'Stay hydrated',
    ],
  },
  {
    title: 'Mental Health',
    icon: '🧘‍♀️',
    tips: [
      'Practice stress management',
      'Join support groups',
      'Get adequate sleep',
      'Maintain work-life balance',
    ],
  },
]

export default function Awareness() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:flex md:items-center md:justify-between"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Diabetes Awareness
          </h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-6">Educational Videos</h3>
        <div className="space-y-6">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src={videos[currentVideoIndex].url}
              title={videos[currentVideoIndex].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          <div>
            <h4 className="text-xl font-medium mb-2">{videos[currentVideoIndex].title}</h4>
            <p className="text-gray-600">{videos[currentVideoIndex].description}</p>
          </div>
          <div className="flex space-x-4">
            {videos.map((video, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`px-4 py-2 rounded-md ${
                  currentVideoIndex === index
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Video {index + 1}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-6">Latest News & Updates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="relative group"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <h4 className="text-xl font-medium text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <a
                href={item.link}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Read more →
              </a>
            </motion.article>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-6">Lifestyle Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lifestyleTips.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-gray-50 rounded-lg p-6"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h4 className="text-xl font-medium text-gray-900 mb-4">{category.title}</h4>
              <ul className="space-y-2">
                {category.tips.map((tip) => (
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-6">Related Conditions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedConditions.map((condition, index) => (
            <motion.div
              key={condition.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="space-y-4"
            >
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img
                  src={condition.image}
                  alt={condition.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">{condition.name}</h4>
                <p className="text-gray-600 mb-4">{condition.description}</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Common Symptoms:</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {condition.symptoms.map((symptom) => (
                        <li key={symptom}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Prevention Tips:</h5>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {condition.prevention.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}