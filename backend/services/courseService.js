const { collection, getNextId } = require('../db');

function buildCoursePayload(data, authorName) {
  const title = (data.title || '').trim();
  const category = (data.category || '').trim();
  if (!title || !category) {
    const error = new Error('Title and category are required.');
    error.status = 400;
    throw error;
  }

  return {
    title,
    category,
    instructor: (data.instructor || authorName).trim(),
    rating: 5.0,
    students: 0,
    price: Number(data.price) || 0,
    originalPrice: Number(data.price) ? Number(data.price) * 2 : 0,
    level: data.level || 'Beginner',
    duration: data.duration || '12 hours',
    lessons: 6,
    image: data.image || '',
    featured: 1
  };
}

async function getCourses() {
  const courses = await collection('courses').find().sort({ id: -1 }).toArray();
  const modules = await collection('modules').find().toArray();

  return courses.map((course) => ({
    ...course,
    featured: Boolean(course.featured),
    modules: modules.filter((module) => module.courseId === course.id)
  }));
}

async function createCourse(data, authorName) {
  const coursePayload = buildCoursePayload(data, authorName);
  const courseId = await getNextId('courses');
  await collection('courses').insertOne({ id: courseId, ...coursePayload });

  const defaultModules = [
    { title: 'Course Introduction & Syllabus Review', duration: '2h' },
    { title: 'Getting Started & Core Setup', duration: '4h' },
    { title: 'Theory & Foundation Principles', duration: '6h' },
    { title: 'Practical Application Exercises', duration: '8h' },
    { title: 'Real-world Project Implementation', duration: '10h' },
    { title: 'Final Exam & Certification Path', duration: '4h' }
  ];

  for (const module of defaultModules) {
    const moduleId = await getNextId('modules');
    await collection('modules').insertOne({ id: moduleId, courseId, ...module });
  }

  return { id: courseId, title: coursePayload.title, message: 'Course created.' };
}

async function getProgress(user, studentIdQuery) {
  const targetId =
    (['teacher', 'admin'].includes(user.role) && studentIdQuery)
      ? Number(studentIdQuery)
      : Number(user.id);

  const rows = await collection('progress').find({ userId: targetId }).toArray();
  const progressMap = {};
  rows.forEach((entry) => {
    progressMap[entry.courseId] = {
      percent: entry.percent,
      grade: entry.grade,
      remarks: entry.remarks
    };
  });
  return progressMap;
}

async function updateProgress({ studentId, courseId, percent, grade, remarks }) {
  if (!studentId || !courseId) {
    const error = new Error('Missing student or course parameters.');
    error.status = 400;
    throw error;
  }

  const existing = await collection('progress').findOne({ userId: Number(studentId), courseId: Number(courseId) });
  if (existing) {
    await collection('progress').updateOne(
      { userId: Number(studentId), courseId: Number(courseId) },
      { $set: { percent: Number(percent), grade, remarks } }
    );
  } else {
    const id = await getNextId('progress');
    await collection('progress').insertOne({
      id,
      userId: Number(studentId),
      courseId: Number(courseId),
      percent: Number(percent),
      grade,
      remarks
    });
  }

  return { message: 'Progress updated successfully.' };
}

function calculateGrade(percent) {
  if (percent >= 90) return 'A+';
  if (percent >= 80) return 'A';
  if (percent >= 70) return 'B+';
  if (percent >= 50) return 'B';
  return 'C';
}

async function completeModule(userId, courseId) {
  if (!courseId) {
    const error = new Error('Course ID required.');
    error.status = 400;
    throw error;
  }

  const modules = await collection('modules').find({ courseId: Number(courseId) }).toArray();
  const totalModules = modules.length || 6;
  const step = Math.round(100 / totalModules);

  const existing = await collection('progress').findOne({ userId: Number(userId), courseId: Number(courseId) });
  let newPercent = step;
  let previousRemarks = 'Started learning.';

  if (existing) {
    newPercent = existing.percent + step;
    previousRemarks = existing.remarks || previousRemarks;
  }
  if (newPercent > 100) newPercent = 100;

  const newGrade = calculateGrade(newPercent);
  const finalRemarks = newPercent === 100 ? 'Course complete! Excellent work!' : previousRemarks;

  if (existing) {
    await collection('progress').updateOne(
      { userId: Number(userId), courseId: Number(courseId) },
      { $set: { percent: newPercent, grade: newGrade, remarks: finalRemarks } }
    );
  } else {
    const id = await getNextId('progress');
    await collection('progress').insertOne({
      id,
      userId: Number(userId),
      courseId: Number(courseId),
      percent: newPercent,
      grade: newGrade,
      remarks: finalRemarks
    });
  }

  return { percent: newPercent, grade: newGrade, remarks: finalRemarks };
}

async function getAllProgress() {
  const rows = await collection('progress').find().toArray();
  const grouped = {};

  rows.forEach((entry) => {
    if (!grouped[entry.userId]) grouped[entry.userId] = {};
    grouped[entry.userId][entry.courseId] = {
      percent: entry.percent,
      grade: entry.grade,
      remarks: entry.remarks
    };
  });

  return grouped;
}

async function enroll(userId, courseId) {
  if (!courseId) {
    const error = new Error('Course ID required.');
    error.status = 400;
    throw error;
  }

  const existing = await collection('progress').findOne({ userId: Number(userId), courseId: Number(courseId) });
  if (!existing) {
    const id = await getNextId('progress');
    await collection('progress').insertOne({
      id,
      userId: Number(userId),
      courseId: Number(courseId),
      percent: 0,
      grade: 'B',
      remarks: 'Enrolled.'
    });
  }

  return { success: true };
}

async function deleteCourse(courseId) {
  await collection('courses').deleteOne({ id: Number(courseId) });
  await collection('modules').deleteMany({ courseId: Number(courseId) });
  await collection('progress').deleteMany({ courseId: Number(courseId) });
  return { message: 'Course deleted successfully.' };
}

module.exports = {
  getCourses,
  createCourse,
  getProgress,
  updateProgress,
  completeModule,
  getAllProgress,
  enroll,
  deleteCourse
};
