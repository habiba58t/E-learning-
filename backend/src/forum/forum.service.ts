import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { threadDocument, Threads } from './threads.schema';
import { Reply, replyDocument } from './reply.schema';
import { courseDocument, Courses } from 'src/courses/courses.schema';
import { CreateReplyDto } from './dto/create-reply-dto';
import { CreateThreadDto } from './dto/create-thread-dto';
import { userDocument, Users } from 'src/users/users.schema';
import { NotificationService } from 'src/notification/notification.service';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { notificationDocument, Notification } from 'src/notification/notification.schema';
//import { Notification } from 'src/notification/notification.service';
@Injectable()
export class ForumService {
  constructor(
   @InjectModel(Threads.name) private  ThreadsModel: Model<threadDocument>,
   @InjectModel(Reply.name) private  replyModel: Model<replyDocument>,
 @InjectModel(Courses.name) private  courseModel: Model<courseDocument>,
 @InjectModel(Users.name) private  userModel: Model<userDocument>,
 @InjectModel(Notification.name) private  notificationModel: Model<notificationDocument>,
// @Inject(NotificationService) private readonly notificationService:NotificationService
  @Inject(forwardRef(() => NotificationService)) private readonly notificationService: NotificationService,
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

  // // Update the user's threads array with the new thread ID
  // const updatedUser = await this.userModel.findOneAndUpdate(
  //   { _id: user._id },
  //   { $push: { threads: savedThread._id } },
  //   { new: true }
  // );
  const message = `A Forum has been created by ${user.username} in course: ${courseUpdate.title}`
  await this.notificationService.createForumNotification(user.username, courseUpdate.course_code, {message})

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



  //update
  async updateForum(course_code:string,threadId: mongoose.Types.ObjectId,updateThreadDto:UpdateThreadDto
  ): Promise<threadDocument> {
    // Fetch the course and populate threads
    
    const course = await this.courseModel
      .findOne({course_code})
      .populate<{ threads: HydratedDocument<Threads>[] }>('threads')
      .exec();
  
    if (!course || !course.threads || course.threads.length === 0) {
      throw new Error('Course or threads not found'); // Throwing an error instead of returning null
    }
  
    // Find the index of the thread to update
    const threadIndex = course.threads.findIndex((thread) =>
      thread._id.equals(threadId)
    );
  
    // if (threadIndex === -1) {
    //   throw new Error('Thread not found in the course');
    // }
  
    // Update the thread with the new data
    const updatedThread = await this.ThreadsModel.findByIdAndUpdate(
      threadId,
      { $set: updateThreadDto },
      { new: true } // Ensures the updated document is returned
    ).exec();
  
    if (!updatedThread) {
      throw new Error('Failed to update the thread');
    }
  
    return updatedThread;
  }
  
  async deleteThread(
    course_code: string,
    threadId: mongoose.Types.ObjectId
  ): Promise<threadDocument | null> {
    // Find the course by course_code and populate threads
    const course = await this.courseModel
      .findOne({ course_code })
      .populate<{ threads: HydratedDocument<Threads>[] }>('threads')
      .exec();
  
    // Handle case where course or threads are not found
    if (!course || !course.threads || course.threads.length === 0) {
      throw new Error('Course not found or has no threads');
    }
  
    // Find the thread in the course's threads array
    const threadIndex = course.threads.findIndex((thread) =>
      thread._id.equals(threadId)
    );
  
    if (threadIndex === -1) {
      throw new Error('Thread not found in the course');
    }
  
    // Remove the thread from the course's threads array
    const [removedThread] = course.threads.splice(threadIndex, 1);
  
    // Save the updated course
    await course.save();
    
    const replies = removedThread.replies;
    for( const reply of replies){
    // Delete replies associated with the thread
    await this.replyModel.findByIdAndDelete(reply)
    }
    // Delete the thread document from the database
    const deletedThread = await this.ThreadsModel.findByIdAndDelete(threadId);
  
    if (!deletedThread) {
      throw new Error('Thread deletion failed');
    }
  
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

    // async getAllReplies(threadId: string): Promise<Reply[]> {
    //   // Validate threadId format
    //   if (!mongoose.Types.ObjectId.isValid(threadId)) {
    //     throw new BadRequestException('Invalid thread ID format');
    //   }
    
    //   // Find the thread by ID and populate replies with additional user details (if needed)
    //   const thread = await this.ThreadsModel.findById(threadId)
    //     .populate({
    //       path: 'replies', // populate replies
    //       select: 'message createdAt', // select required fields
    //       populate: {
    //         path: 'userId', // Populate user reference if needed
    //         select: 'username', // Select only the username field
    //       },
    //     })
    //     .exec();
    
    //   if (!thread) {
    //     throw new NotFoundException('Thread not found');
    //   }
    
    //   return thread.replies; // Return populated replies
    // }
    
    // Fetch thread by ID and populate the replies
  // Fetch thread by ID and populate the replies
  async getRepliesByThreadId(threadId: string): Promise<mongoose.Types.ObjectId[]> {
    const tId = new mongoose.Types.ObjectId(threadId);
  
    // Fetch the thread, and select only the 'replies' field
    const thread = await this.ThreadsModel.findById(tId)
      .select('replies')  // Only select the replies field (which contains ObjectIds)
      .exec();
  
    if (!thread) {
      throw new Error('Thread not found');
    }
  
    // Return the 'replies' field, which is an array of ObjectIds
    return thread.replies;
  }


  
  
//get reply by its id
async getReplyById(replyId: string): Promise<replyDocument> {
  const rId = new mongoose.Types.ObjectId(replyId);
  
  // Query the Reply model for the reply by its ID
  const reply = await this.replyModel.findById(rId).exec();

  if (!reply) {
    throw new Error('Reply not found');
  }

  return reply;  // Return the full reply object
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