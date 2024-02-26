import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  userId: string;
}

export class UpdatePostDto {
  @MinLength(1)
  title?: string;

  @MinLength(1)
  content?: string;
}
