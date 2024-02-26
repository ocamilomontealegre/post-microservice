import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import { Post } from '../schemas/post.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Create new post
  async createPost(createPostDto: CreatePostDto): Promise<Post | object> {
    try {
      const createdPost = new this.postModel(createPostDto);
      const savedPost = await createdPost.save();

      const user = await this.userModel.findOneAndUpdate(
        { _id: createPostDto.userId },
        { $push: { posts: savedPost } },
        { new: true },
      );

      if (!user)
        throw new NotFoundException(`User ${createPostDto.userId} not found`);

      return savedPost;
    } catch (err) {
      throw new Error(`Failed to create new post: ${err.message}`);
    }
  }

  // Find all post
  async findAll(): Promise<Post[]> {
    try {
      return await this.postModel.find().exec();
    } catch (err) {
      throw new Error(`Failed to fetch the posts: ${err.message}`);
    }
  }

  // Find post by its ID
  async findPostById(id: string): Promise<Post | object> {
    try {
      const result = await this.postModel.findById(id);
      return !result ? { message: 'Post not found' } : result;
    } catch (err) {
      throw new Error(`Failed to fetch the post: ${err.message}`);
    }
  }

  // Find all user's posts
  async findUserPosts(userId: string): Promise<Post[] | object> {
    try {
      return await this.postModel.find({ userId });
    } catch (err) {
      throw new Error(`Failed to fetch the posts: ${err.message}`);
    }
  }

  // Update post data
  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<Post | object> {
    try {
      const result = await this.postModel.findOneAndUpdate(
        { _id: postId, userId: userId },
        updatePostDto,
        { new: true },
      );
      if (!result) throw new NotFoundException(`Impossible to update post`);
      return result;
    } catch (err) {
      throw new Error(`Failed to update the posts: ${err.message}`);
    }
  }

  // Soft delete post
  async softDeletePost(userId: string, postId: string): Promise<object> {
    try {
      const post = await this.postModel.findOne({
        _id: postId,
        userId: userId,
      });
      if (!post) throw new NotFoundException(`Impossible to delet the post`);
      post.deletedAt = new Date();
      await post.save();
      return { message: 'Post successfully deleted' };
    } catch (err) {
      throw new Error(`Failed to soft delete post: ${err.message}`);
    }
  }
}
