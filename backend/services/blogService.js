const { collection, getNextId } = require('../db');

async function getBlogs() {
  return collection('blogs').find().sort({ id: -1 }).toArray();
}

async function createBlog(payload, authorName) {
  const title = (payload.title || '').trim();
  const category = payload.category || 'General';
  const summary = (payload.summary || '').trim();
  const content = (payload.content || '').trim();
  const image = payload.image || '';

  if (!title || !summary || !content) {
    const error = new Error('Title, summary, and content are required.');
    error.status = 400;
    throw error;
  }

  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const readTime = `${Math.max(3, Math.round(content.split(' ').length / 200))} min read`;

  const id = await getNextId('blogs');
  await collection('blogs').insertOne({
    id,
    title,
    category,
    author: authorName,
    date,
    readTime,
    summary,
    content,
    image
  });

  return { id, title, message: 'Blog post published live!' };
}

async function deleteBlog(blogId) {
  await collection('blogs').deleteOne({ id: Number(blogId) });
  return { message: 'Blog post deleted.' };
}

module.exports = {
  getBlogs,
  createBlog,
  deleteBlog
};
