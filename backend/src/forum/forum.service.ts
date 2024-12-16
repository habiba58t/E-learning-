import { forwardRef, Inject, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { threadDocument, Threads } from './threads.schema';
import { Reply, replyDocument } from './reply.schema';
import { courseDocument, Courses } from 'src/courses/courses.schema';
import { CreateReplyDto } from './dto/create-reply-dto';
import { CreateThreadDto } from './dto/create-thread-dto';
import { userDocument, Users } from 'src/users/users.schema';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ForumService {
  constructor(
   @InjectModel(Threads.name) private  ThreadsModel: Model<threadDocument>,
   @InjectModel(Reply.name) private  replyModel: Model<replyDocument>,
 @InjectModel(Courses.name) private  courseModel: Model<courseDocument>,
 @InjectModel(Users.name) private  userModel: Model<userDocument>,
  //@Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
  ) {}


// //   create a Thread and add it in array of threads in course
//   async createForum(user: any, createThreadDto: CreateThreadDto): Promise<threadDocument> {
//     if (!user || !user.username) {
//       throw new Error('User is not authenticated or has no username');
//     }
  
//     // Create a new thread with the user as the creator
//     const newThread = new this.ThreadsModel(createThreadDto);
//     newThread.created_by = user.username;
//     const savedThread = await newThread.save();
  
//     const userthread = await this.userModel.findOne({ username: user.username }).exec();
//     if (!userthread) {
//       throw new Error('User not found');
//     }
  
//     // Update the course's threads array with the new thread ID
//     const courseUpdate = await this.courseModel.findOneAndUpdate(
//       { _id: createThreadDto.courseId },
//       { $push: { threads: savedThread._id } },
//       { new: true }
//     );
  
//     console.log('Course Update:', courseUpdate); // Debug course update
  
//     // Update the user's threads array with the new thread ID
//     const updatedUser = await this.userModel.findOneAndUpdate(
//       { _id: user._id },
//       { $push: { threads: savedThread._id } },
//       { new: true }
//     );
  
//     // console.log('User Update:', updatedUser); // Debug user update
//     // const NotificationDto = {
//     //   message: createThreadDto.message
//     // };
//     //  await this.notificationService.CreateNotificationDto(createThreadDto.courseId,NotificationDto );
  
//     return savedThread;
//   }

async createForum(user: any, createThreadDto: CreateThreadDto): Promise<threadDocument> {
  if (!user || !user.username) {
    throw new Error('User is not authenticated or has no username');
  }

  // Create a new thread with the user as the creator
  const newThread = new this.ThreadsModel(createThreadDto);
  newThread.created_by = user.username;
  const savedThread = await newThread.save();

  const userthread = await this.userModel.findOne({ username: user.username }).exec();
  if (!userthread) {
    throw new Error('User not found');
  }

  // Update the course's threads array with the new thread ID by querying with course_code
  const courseUpdate = await this.courseModel.findOneAndUpdate(
    { course_code: createThreadDto.courseId },  // Use course_code to find the course
    { $push: { threads: savedThread._id } },
    { new: true }
  );

  console.log('Course Update:', courseUpdate); // Debug course update

  // Update the user's threads array with the new thread ID
  const updatedUser = await this.userModel.findOneAndUpdate(
    { _id: user._id },
    { $push: { threads: savedThread._id } },
    { new: true }
  );

  return savedThread;
}


//get all forums
  async findAllForums():Promise<threadDocument[]>{
    const threads = await this.ThreadsModel.find();
     return threads;
  }

  
//get forums by course code 
async findThreadByCourseCode(courseCode: string): Promise<threadDocument[]> {
  // Find the course by its code
  const course = await this.courseModel
    .findOne({ course_code: courseCode })
    .populate<{ threads: threadDocument[] }>('threads')
    .exec();
  if (!course) {
    throw new NotFoundException(`Course with code ${courseCode} not found`);
  }
  return course.threads || [];
}



//get forum by title 
async findThreadByTitle(courseCode: string, title: string): Promise<threadDocument> {
  const threads = await this.findThreadByCourseCode(courseCode);

  if (!threads || threads.length === 0) {
    throw new NotFoundException(`No threads found for course with code ${courseCode}`);
  }
  const matchingThread = threads.find(thread => thread.title === title);

  if (!matchingThread) {
    throw new NotFoundException(`Thread with title "${title}" not found in course with code ${courseCode}`);
  }
  return matchingThread;
}

//update thread 

  

 // get thread by courseId and thread title
//  async findThreadByCourseCodeT(courseCode: string, title: string): Promise<Threads | null> {
//     const course = await this.courseModel.findOne({ course_code: courseCode }).exec();

//     if (!course) {
//       throw new NotFoundException(`Course with code ${courseCode} not found`);
//     }
//     const populatedCourse = await this.courseModel
//       .findById(course._id)
//       .populate<{ threads: Threads[] }>('threads')
//       .exec();

//     if (!populatedCourse || !populatedCourse.threads || populatedCourse.threads.length === 0) {
//       return null;
//     }
//     const matchingThread = populatedCourse.threads.find((thread) =>
//       thread.title.toLowerCase().includes(title.toLowerCase())
//     );

//     return matchingThread || null;
//   }

  //delete thread from array of threads in courses/user
  async deleteThread(courseId: mongoose.Types.ObjectId, threadId: mongoose.Types.ObjectId): Promise<threadDocument | null> {
    // Find the course and populate threads as HydratedDocument<Threads>
    const course = await this.courseModel
        .findById(courseId)
        .populate<{ threads: HydratedDocument<Threads>[] }>('threads') // Populate as HydratedDocument<Threads>
        .exec();
    // If the course or threads array is empty
    if (!course || !course.threads || course.threads.length === 0) {
        return null; // Or throw an appropriate error
    }
    const threadIndex = course.threads.findIndex((thread) =>
        thread._id.equals(threadId)
    );
    if (threadIndex === -1) {
        return null;
    }
    // Remove the thread from the course's threads array
    const [removedThread] = course.threads.splice(threadIndex, 1); 
    await course.save(); 
    const deletedThread = await this.ThreadsModel.findByIdAndDelete(threadId);

    return deletedThread; 
}

  //create replay:
  async createReply(createReplyDto: CreateReplyDto, user: any): Promise<Reply> {
    // Create a new reply with the provided details
    const newReply = new this.replyModel(createReplyDto);
    newReply.username = user.username; // Optionally, assign the username to the reply
  
    // Save the reply to the database
    await newReply.save();
  
    // Update the specific thread by pushing the reply into the replies array
    await this.ThreadsModel.findOneAndUpdate(
      { _id: createReplyDto.threadId },  // Match the thread by its ID
      { $push: { replies: newReply._id } },  // Add the new reply to the replies array
      { new: true } // Return the updated thread document
    );
  
    // Return the newly created reply
    return newReply;
  }
  
  //delete replay from array of replies in threads 
    async deleteReplay(threadId:mongoose.Types.ObjectId,replyId: mongoose.Types.ObjectId,):Promise<threadDocument>{
        const thread =await this.ThreadsModel.findById(threadId).exec();
        if(!thread)
        {
            throw new NotFoundException('Thread not found');
        }

        const replyIndex = thread.replies.findIndex((replyId) => replyId.equals(replyId));
        if (replyIndex === -1)
        {
            throw new NotFoundException('Reply not found in the thread');
        }
        const reply = await this.replyModel.findById(replyId);
        
        thread.replies.splice(replyIndex, 1);
        await thread.save();
        await this.replyModel.findByIdAndDelete(replyId).exec();
        return thread; 

    }

    async getAllReplies(threadId: mongoose.Types.ObjectId): Promise<Reply[]> {
      // Find the thread by its ID and populate the replies field
          const thread = await this.ThreadsModel.findById(threadId)
          .populate<{ replies: Reply[] }>('replies')  // Specify that replies will be populated as Reply[] 
          .exec();

          if (!thread) {
          throw new NotFoundException('Thread not found');
          }

          return thread.replies;  // Now thread.replies will be of type Reply[]
    }
    
    

  

  // Add a reply to a thread
  // async addReply(
  //   threadId: string,
  //   userId: string,
  //   message: string,
  // ): Promise<ForumThread> {
  //   const thread = await this.forumModel.findById(threadId);
  //   if (!thread) throw new Error('Thread not found');

  //   thread.replies.push({ userId, message, timestamp: new Date() });
  //   const updatedThread = await thread.save();

  //   // Notify participants (creator and all repliers except the current user)
  //   const participants = new Set(
  //     thread.replies.map((reply) => reply.userId).concat(thread.creatorId),
  //   );
  //   participants.delete(userId); // Exclude the current replier

  //   for (const participant of participants) {
  //     await this.notificationService.createNotification(
  //       `${userId} replied to the thread titled: "${thread.title}".`,
  //       participant,
  //     );
  //   }

  //   return updatedThread;
  // }

  // // Get threads by course name
  // async getThreadsByCourseName(courseName: string): Promise<ForumThread[]> {
  //   const threads = await this.forumModel.find({ courseName }).sort({ timestamp: 1 }).exec();
  //   if (!threads.length) throw new Error(`No threads found for course: ${courseName}`);
  //   return threads;
  // }

  // // Get a thread by its ID
  // async getThreadById(threadId: string): Promise<ForumThread> {
  //   const thread = await this.forumModel.findById(threadId).exec();
  //   if (!thread) throw new Error('Thread not found');
  //   return thread;
  // }
}
