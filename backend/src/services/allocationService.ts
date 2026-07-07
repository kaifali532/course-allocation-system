import prisma from '../config/db';
import { logger } from '../utils/logger';

export const runAllocationLogic = async () => {
  logger.info('Starting Allocation Process');
  
  // Reset previous allocations
  await prisma.allocation.deleteMany();
  await prisma.student.updateMany({ data: { status: 'PENDING' } });
  
  // We don't reset availableSeats, we recalculate or just increment allocatedSeats. 
  // Let's reset course allocatedSeats to 0
  await prisma.course.updateMany({ data: { allocatedSeats: 0 } });

  // Fetch all pending students
  // Rule 1: Higher marks receive higher priority
  // Rule 3: If marks identical, earlier application date gets priority
  const students = await prisma.student.findMany({
    orderBy: [
      { marks: 'desc' },
      { applicationDate: 'asc' }
    ]
  });

  const allocations = [];

  for (const student of students) {
    const preferences = [student.preferredCourse1Id, student.preferredCourse2Id, student.preferredCourse3Id].filter(Boolean) as string[];
    let allocated = false;

    // Rule 5: Priority 1 -> Priority 2 -> Priority 3
    for (let i = 0; i < preferences.length; i++) {
      const courseId = preferences[i];
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) continue;

      // Get current allocations for this course to check category limits
      const courseAllocations = await prisma.allocation.findMany({ where: { courseId } });
      const countCat = (cat: string) => courseAllocations.filter(a => a.allocatedCat === cat).length;

      // Try Unreserved (General) seats first, regardless of student's category (standard merit rule)
      let selectedCat: string | null = null;
      if (countCat('General') < course.generalSeats) {
        selectedCat = 'General';
      } 
      // If General is full, and student is from a reserved category, check their specific quota
      else if (student.category !== 'General') {
        if (student.category === 'OBC' && countCat('OBC') < course.obcSeats) selectedCat = 'OBC';
        else if (student.category === 'SC' && countCat('SC') < course.scSeats) selectedCat = 'SC';
        else if (student.category === 'ST' && countCat('ST') < course.stSeats) selectedCat = 'ST';
      }

      if (selectedCat) {
        // Allocate!
        // Rule 4: One student gets only one course
        // Rule 6: Seat counts decrease (allocatedSeats increases)
        const newAllocation = await prisma.allocation.create({
          data: {
            studentId: student.id,
            courseId: course.id,
            allocatedCat: selectedCat,
            preferenceNum: i + 1
          }
        });

        await prisma.student.update({
          where: { id: student.id },
          data: { status: 'ALLOCATED' }
        });

        await prisma.course.update({
          where: { id: course.id },
          data: {
            allocatedSeats: { increment: 1 },
            availableSeats: { decrement: 1 } // assuming availableSeats is pre-calculated correctly originally
          }
        });

        allocations.push(newAllocation);
        allocated = true;
        break; // Stop checking further preferences
      }
    }

    if (!allocated) {
      await prisma.student.update({
        where: { id: student.id },
        data: { status: 'REJECTED' } // Not Allocated
      });
    }
  }

  // Log action
  await prisma.auditLog.create({
    data: {
      action: 'RUN_ALLOCATION',
      details: `Allocated ${allocations.length} students`
    }
  });

  logger.info('Allocation Process Completed');
  return { success: true, allocatedCount: allocations.length };
};

export const resetAllocationLogic = async () => {
  await prisma.allocation.deleteMany();
  await prisma.student.updateMany({ data: { status: 'PENDING' } });
  
  const courses = await prisma.course.findMany();
  for (const c of courses) {
    await prisma.course.update({
      where: { id: c.id },
      data: {
        allocatedSeats: 0,
        availableSeats: c.totalSeats
      }
    });
  }
  
  await prisma.auditLog.create({
    data: {
      action: 'RESET_ALLOCATION',
      details: 'All allocations reset'
    }
  });

  return { success: true };
};
