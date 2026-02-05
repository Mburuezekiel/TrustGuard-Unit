 const express = require('express');
 const router = express.Router();
 
 // Sample blog posts (in production, fetch from database)
 const blogPosts = [
   {
     id: '1',
     title: '5 Warning Signs of a Phishing Scam',
     excerpt: 'Learn how to identify phishing attempts before they steal your information.',
     author: 'Security Team',
     date: 'Feb 3, 2026',
     readTime: '5 min read',
     category: 'Security Tips',
     image: '',
     content: 'Full article content here...',
   },
   {
     id: '2',
     title: 'How AI is Fighting Financial Fraud',
     excerpt: 'Discover how machine learning algorithms detect scams in milliseconds.',
     author: 'Tech Team',
     date: 'Feb 1, 2026',
     readTime: '8 min read',
     category: 'Technology',
     image: '',
     content: 'Full article content here...',
   },
   {
     id: '3',
     title: 'Protecting Elderly Users from Mobile Scams',
     excerpt: 'Tips for helping your parents and grandparents stay safe online.',
     author: 'Community Team',
     date: 'Jan 28, 2026',
     readTime: '6 min read',
     category: 'Community',
     image: '',
     content: 'Full article content here...',
   },
 ];
 
 // @desc    Get all blog posts
 // @route   GET /api/v1/blog/posts
 router.get('/posts', (req, res) => {
   const { category, search, page = 1, limit = 10 } = req.query;
   
   let filtered = [...blogPosts];
   
   if (category) {
     filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
   }
   
   if (search) {
     const searchLower = search.toLowerCase();
     filtered = filtered.filter(p => 
       p.title.toLowerCase().includes(searchLower) ||
       p.excerpt.toLowerCase().includes(searchLower)
     );
   }
   
   const startIndex = (page - 1) * limit;
   const endIndex = startIndex + parseInt(limit);
   const paginated = filtered.slice(startIndex, endIndex);
   
   res.status(200).json({
     success: true,
     data: paginated,
     pagination: {
       total: filtered.length,
       page: parseInt(page),
       limit: parseInt(limit),
       pages: Math.ceil(filtered.length / limit),
     },
   });
 });
 
 // @desc    Get single blog post
 // @route   GET /api/v1/blog/posts/:id
 router.get('/posts/:id', (req, res) => {
   const post = blogPosts.find(p => p.id === req.params.id);
   
   if (!post) {
     return res.status(404).json({
       success: false,
       error: 'Post not found',
     });
   }
   
   res.status(200).json({
     success: true,
     data: post,
   });
 });
 
 module.exports = router;