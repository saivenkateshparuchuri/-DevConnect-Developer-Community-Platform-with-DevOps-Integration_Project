const mongoose = require('mongoose');
require('dotenv').config();
const Article = require('./models/Article');
const Challenge = require('./models/Challenge');

const articles = [
  {
    title: "Mastering React 19: New Components & Patterns",
    author: "Sarah J.",
    readTime: "8 min read",
    category: "Tutorial",
    description: "Deep dive into the latest React features including server components, actions, and the new compiler optimizations.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80",
    color: "primary"
  },
  {
    title: "Why Rust is the Future of Infrastructure",
    author: "Alex M.",
    readTime: "12 min read",
    category: "Insights",
    description: "An analysis of how Rust's memory safety and performance are redefining systems programming and cloud infrastructure.",
    image: "https://images.unsplash.com/photo-1629904853716-f0bc54ea481c?auto=format&fit=crop&w=400&q=80",
    color: "danger"
  },
  {
    title: "Implementing GraphQL Subscriptions",
    author: "Varun R.",
    readTime: "15 min read",
    category: "Backend",
    description: "Step-by-step guide to building real-time event-driven APIs using Apollo Server and GraphQL subscriptions.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
    color: "success"
  }
];

const challenges = [
  {
    title: "Build a Real-time Chat UI",
    level: "Medium",
    points: 150,
    tech: ["React", "CSS", "Socket.io"],
    deadline: "2 days left",
    color: "primary",
    category: "Frontend"
  },
  {
    title: "Optimize MongoDB Aggregation",
    level: "Hard",
    points: 300,
    tech: ["Node.js", "MongoDB"],
    deadline: "5 days left",
    color: "danger",
    category: "Backend"
  },
  {
    title: "AI Prompt Engineering Lab",
    level: "Medium",
    points: 200,
    tech: ["GPT-4", "NLP"],
    deadline: "3 days left",
    color: "warning",
    category: "AI"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Seeding dynamic content...');
    
    await Article.deleteMany({});
    await Challenge.deleteMany({});
    
    await Article.insertMany(articles);
    await Challenge.insertMany(challenges);
    
    console.log('Successfully seeded Articles and Challenges!');
    process.exit();
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
