const { collection, getNextId } = require('../db');

async function getTimetable() {
  const timetable = await collection('timetable').find().sort({ id: 1 }).toArray();
  const courses = await collection('courses').find().toArray();
  return timetable.map((slot) => ({
    ...slot,
    courseTitle: courses.find((course) => course.id === slot.courseId)?.title || 'General Lecture'
  }));
}

async function createTimetable(payload, instructorName) {
  const { courseId, topic, date, time, link } = payload;
  if (!courseId || !topic || !date || !time || !link) {
    const error = new Error('Please provide all class schedule fields.');
    error.status = 400;
    throw error;
  }

  const id = await getNextId('timetable');
  await collection('timetable').insertOne({
    id,
    courseId: Number(courseId),
    topic,
    date,
    time,
    instructor: instructorName,
    link
  });

  return { id, courseId: Number(courseId), topic, message: 'Timetable class slot scheduled.' };
}

module.exports = {
  getTimetable,
  createTimetable
};
