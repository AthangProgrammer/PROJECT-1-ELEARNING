// Optional: adds sample courses if the collection is empty.  Run: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const sample = [
  { name: 'Full Stack Web Development', description: 'Master modern web development from HTML, CSS, JavaScript to React and Node.js.', category: 'Web Development', price: 3499 },
  { name: 'Data Structures and Algorithms', description: 'Learn core algorithmic thinking, complexity analysis, trees, graphs, and dynamic programming.', category: 'Computer Science', price: 2999 },
  { name: 'Python for Data Science', description: 'Comprehensive introduction to Python, NumPy, Pandas, and data visualization tools.', category: 'Data Science', price: 2499 },
  { name: 'UI/UX Design Fundamentals', description: 'Understand user interface design principles, wireframing, usability testing, and Figma.', category: 'Design', price: 1999 },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  if ((await Course.countDocuments()) === 0) {
    await Course.insertMany(sample);
    console.log(`Inserted ${sample.length} courses`);
  } else {
    console.log('Courses already exist, nothing inserted');
  }
  await mongoose.disconnect();
})();
