import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting professional data seeding...');

  // 1. Clear existing data
  await prisma.allocation.deleteMany();
  await prisma.student.deleteMany();
  await prisma.course.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.aiQueryHistory.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data.');

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@university.edu',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user.');

  // 3. Create Courses (Realistic)
  const coursesData = [
    { courseId: 'CS101', courseName: 'Introduction to Computer Science', description: 'Fundamentals of programming and computer systems.', department: 'Computer Science', totalSeats: 120, generalSeats: 60, obcSeats: 32, scSeats: 18, stSeats: 10, availableSeats: 120 },
    { courseId: 'CS201', courseName: 'Data Structures and Algorithms', description: 'Advanced algorithmic problem solving.', department: 'Computer Science', totalSeats: 80, generalSeats: 40, obcSeats: 21, scSeats: 12, stSeats: 7, availableSeats: 80 },
    { courseId: 'CS301', courseName: 'Machine Learning Foundations', description: 'Statistical learning and neural networks.', department: 'Computer Science', totalSeats: 60, generalSeats: 30, obcSeats: 16, scSeats: 9, stSeats: 5, availableSeats: 60 },
    { courseId: 'IT101', courseName: 'Information Technology Essentials', description: 'Networking, databases, and IT infrastructure.', department: 'Information Technology', totalSeats: 100, generalSeats: 50, obcSeats: 27, scSeats: 15, stSeats: 8, availableSeats: 100 },
    { courseId: 'IT201', courseName: 'Cloud Computing', description: 'AWS, Azure, and distributed systems.', department: 'Information Technology', totalSeats: 70, generalSeats: 35, obcSeats: 19, scSeats: 11, stSeats: 5, availableSeats: 70 },
    { courseId: 'EE101', courseName: 'Basic Electrical Engineering', description: 'Circuits, electronics, and power systems.', department: 'Electrical Engineering', totalSeats: 150, generalSeats: 75, obcSeats: 40, scSeats: 23, stSeats: 12, availableSeats: 150 },
    { courseId: 'EE201', courseName: 'Digital Logic Design', description: 'Boolean algebra and digital circuits.', department: 'Electrical Engineering', totalSeats: 90, generalSeats: 45, obcSeats: 24, scSeats: 14, stSeats: 7, availableSeats: 90 },
    { courseId: 'ME101', courseName: 'Engineering Mechanics', description: 'Statics and dynamics of rigid bodies.', department: 'Mechanical Engineering', totalSeats: 120, generalSeats: 60, obcSeats: 32, scSeats: 18, stSeats: 10, availableSeats: 120 },
    { courseId: 'ME201', courseName: 'Thermodynamics', description: 'Laws of thermodynamics and heat transfer.', department: 'Mechanical Engineering', totalSeats: 80, generalSeats: 40, obcSeats: 21, scSeats: 12, stSeats: 7, availableSeats: 80 },
    { courseId: 'CE101', courseName: 'Civil Engineering Materials', description: 'Properties of construction materials.', department: 'Civil Engineering', totalSeats: 100, generalSeats: 50, obcSeats: 27, scSeats: 15, stSeats: 8, availableSeats: 100 },
    { courseId: 'CE201', courseName: 'Structural Analysis', description: 'Analysis of trusses, beams, and frames.', department: 'Civil Engineering', totalSeats: 70, generalSeats: 35, obcSeats: 19, scSeats: 11, stSeats: 5, availableSeats: 70 },
    { courseId: 'MA101', courseName: 'Calculus and Linear Algebra', description: 'Differential equations and matrices.', department: 'Mathematics', totalSeats: 200, generalSeats: 100, obcSeats: 54, scSeats: 30, stSeats: 16, availableSeats: 200 },
    { courseId: 'PH101', courseName: 'Engineering Physics', description: 'Quantum mechanics and solid state physics.', department: 'Physics', totalSeats: 150, generalSeats: 75, obcSeats: 40, scSeats: 23, stSeats: 12, availableSeats: 150 },
    { courseId: 'CH101', courseName: 'Engineering Chemistry', description: 'Chemical kinetics and electrochemistry.', department: 'Chemistry', totalSeats: 150, generalSeats: 75, obcSeats: 40, scSeats: 23, stSeats: 12, availableSeats: 150 },
    { courseId: 'HS101', courseName: 'Professional Communication', description: 'Technical writing and presentation skills.', department: 'Humanities', totalSeats: 100, generalSeats: 50, obcSeats: 27, scSeats: 15, stSeats: 8, availableSeats: 100 },
    { courseId: 'ECO101', courseName: 'Engineering Economics', description: 'Microeconomics and cost analysis.', department: 'Humanities', totalSeats: 80, generalSeats: 40, obcSeats: 21, scSeats: 12, stSeats: 7, availableSeats: 80 },
    { courseId: 'MGT101', courseName: 'Principles of Management', description: 'Organizational behavior and project management.', department: 'Management', totalSeats: 90, generalSeats: 45, obcSeats: 24, scSeats: 14, stSeats: 7, availableSeats: 90 },
    { courseId: 'CS401', courseName: 'Artificial Intelligence', description: 'Search algorithms and knowledge representation.', department: 'Computer Science', totalSeats: 50, generalSeats: 25, obcSeats: 13, scSeats: 8, stSeats: 4, availableSeats: 50 },
    { courseId: 'IT401', courseName: 'Cybersecurity', description: 'Cryptography and network security.', department: 'Information Technology', totalSeats: 60, generalSeats: 30, obcSeats: 16, scSeats: 9, stSeats: 5, availableSeats: 60 },
    { courseId: 'EE401', courseName: 'Power Electronics', description: 'Converters, inverters, and motor drives.', department: 'Electrical Engineering', totalSeats: 70, generalSeats: 35, obcSeats: 19, scSeats: 11, stSeats: 5, availableSeats: 70 },
  ];

  const courses = await Promise.all(
    coursesData.map(course => prisma.course.create({ data: course }))
  );
  console.log(`Created ${courses.length} courses.`);

  // 4. Create Students (Realistic)
  const studentNames = [
    'Aarav Patel', 'Diya Sharma', 'Reyansh Gupta', 'Ishita Singh', 'Vivaan Kumar',
    'Ananya Desai', 'Aditya Joshi', 'Kavya Reddy', 'Vihaan Shah', 'Saanvi Mehta',
    'Arjun Nair', 'Myra Kapoor', 'Sai Iyer', 'Zara Ali', 'Rudra Bose',
    'Avni Das', 'Kabir Verma', 'Navya Rao', 'Dhruv Menon', 'Tara Pillai',
    'Rishi Sen', 'Neha Bhat', 'Aryan Roy', 'Mira Ghosh', 'Dev Anand'
  ];

  const categories = ['General', 'General', 'General', 'OBC', 'OBC', 'SC', 'ST']; // Weighted
  
  const getRandomCourseId = (exclude: string[] = []) => {
    const available = courses.filter(c => !exclude.includes(c.id));
    return available[Math.floor(Math.random() * available.length)].id;
  };

  const studentsData = studentNames.map((name, index) => {
    const pref1 = getRandomCourseId();
    const pref2 = getRandomCourseId([pref1]);
    const pref3 = getRandomCourseId([pref1, pref2]);

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Applied within last 30 days

    return {
      studentId: `STU2026${String(index + 1).padStart(3, '0')}`,
      fullName: name,
      email: `${name.toLowerCase().replace(' ', '.')}@student.university.edu`,
      phone: `+9198${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      gender: index % 2 === 0 ? 'Male' : 'Female',
      marks: Math.floor(Math.random() * (99 - 65 + 1) + 65), // Random marks between 65 and 99
      category: categories[Math.floor(Math.random() * categories.length)],
      applicationDate: date,
      preferredCourse1Id: pref1,
      preferredCourse2Id: pref2,
      preferredCourse3Id: pref3,
      status: 'PENDING',
    };
  });

  const students = await Promise.all(
    studentsData.map(student => prisma.student.create({ data: student }))
  );
  console.log(`Created ${students.length} students.`);

  // 5. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { action: 'SYSTEM_INIT', details: 'Database initialized with professional seed data.' },
      { action: 'COURSES_ADDED', details: '20 courses were successfully imported into the system.' },
      { action: 'STUDENTS_REGISTERED', details: '25 student applications were successfully received.' }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
