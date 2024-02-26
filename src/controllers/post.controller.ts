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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PostService } from 'src/services/post.service';
import { CreatePostDto, UpdatePostDto } from 'src/dto/post.dto';
import { Post as PostModel } from '../schemas/post.schema';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  private readonly logger = new Logger(PostController.name);

  // Create new post in the database
  @ApiOperation({ summary: 'Create a new post in the database' })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Return all posts from the database' })
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
  @ApiOperation({ summary: 'Return a post by its id' })
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
  @ApiOperation({ summary: 'Find a user posts' })
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
  @ApiOperation({ summary: 'Update a post by its id' })
  @ApiBearerAuth()
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ): Promise<PostModel | object> {
    const userId = req['userId'];
    try {
      const result = await this.postService.updatePost(
        userId,
        postId,
        updatePostDto,
      );
      this.logger.log(`Post updated in the database ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      this.logger.error(`Error updating the posts: ${err.stack}`);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Soft delete a post by its ID
  @ApiOperation({ summary: 'Soft delete a post by its id' })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(200)
  async deletePost(
    @Param('id') postId: string,
    @Req() req: Request,
  ): Promise<object> {
    const userId = req['userId'];
    try {
      const result = await this.postService.softDeletePost(userId, postId);
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
