import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { threadDocument, Threads } from './threads.schema';
import { Reply, replyDocument } from './reply.schema';
import { courseDocument, Courses } from 'src/courses/courses.schema';
import { CreateReplyDto } from './dto/create-reply-dto';
import { CreateThreadDto } from './dto/create-thread-dto';

@Injectable()
export class ForumService {
  constructor(
   @InjectModel(Threads.name) private  ThreadsModel: Model<threadDocument>,
   @InjectModel(Reply.name) private  replyModel: Model<replyDocument>,
 @InjectModel(Courses.name) private  courseModel: Model<courseDocument>,
  ) {}


  //create a Thread and add it in array of threads in course
  async createForum(createThreadDto: CreateThreadDto):Promise<threadDocument>{
      const newThread = new this.ThreadsModel(createThreadDto);
      const savedThread = await newThread.save();
      await this.courseModel.findOneAndUpdate( { $push: { threads: savedThread._id } }, { new: true });
      return savedThread;
  }

 // get thread by courseId and thread title
 async findThread(courseId: mongoose.Types.ObjectId, title: string): Promise<Threads | null> {
  const course = await this.courseModel.findById(courseId).populate<{ threads: Threads[] }>('threads').exec();
  //if the thread does not exisit in the course
  if (!course || !course.threads || course.threads.length === 0){ 
      return null;
  }
  const matchingThread = course.threads.find((thread) =>
      thread.title.toLowerCase().includes(title.toLowerCase())
  );
  return matchingThread || null;
}

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
  async createReply(createReplyDto: CreateReplyDto):Promise<Reply>{
      const newReply = new this.replyModel(createReplyDto);
      await newReply.save();
      await this.ThreadsModel.findOneAndUpdate( 
        { $push: { replies: newReply._id } }, 
        { new: true } 
    );
    return newReply.save(); 
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
        thread.replies.splice(replyIndex, 1);
        await thread.save();
        await this.replyModel.findByIdAndDelete(replyId).exec();
        return thread; 

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
