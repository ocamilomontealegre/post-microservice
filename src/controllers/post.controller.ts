import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Req,
  Body,
  Logger,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from 'src/services/post.service';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import { Post as PostModel } from '../schemas/post.schema';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  private readonly logger = new Logger(PostController.name);

  // Create new post in the database
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostModel | object> {
    const userId = req['userId'];
    createPostDto.userId = userId;
    try {
      const result = await this.postService.createPost(createPostDto);
      this.logger.log(`Post created with data: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error creating post: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Return all the posts
  @Get()
  async findAll(): Promise<PostModel | object> {
    try {
      const result = await this.postService.findAll();
      this.logger.log(
        `Posts fetched from the database ${JSON.stringify(result)}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Error fetching the posts: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Find post by Id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<PostModel | object> {
    try {
      const result = await this.postService.findPostById(id);
      this.logger.log(
        `Post fetched from the database ${JSON.stringify(result)}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Error fetching the posts: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Find all user's posts
  @Get()
  async findUserPosts(
    @Query('UserId') userId: string,
  ): Promise<PostModel[] | object> {
    try {
      const result = await this.postService.findUserPosts(userId);
      this.logger.log(
        `Posts fetched from the database ${JSON.stringify(result)}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Error fetching the posts: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update a post data
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostModel | object> {
    try {
      const result = await this.postService.updatePost(id, updatePostDto);
      this.logger.log(`Post updated in the database ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error updating the posts: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Soft delete a post by its ID
  @Delete(':id')
  @HttpCode(200)
  async deletePost(@Param('id') id: string): Promise<object> {
    try {
      const result = await this.postService.softDeletePost(id);
      this.logger.log(
        `Post deleted from the database ${JSON.stringify(result)}`,
      );
      return result;
    } catch (err) {
      this.logger.error(`Error deleting the posts: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
