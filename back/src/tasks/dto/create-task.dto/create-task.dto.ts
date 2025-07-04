import {
    IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 50)
  description: string;

  @IsString()
  @IsNotEmpty()
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsDate()
  @IsNotEmpty()   
  dueDate: Date;
  // priority: string
  // assigneeId: string
  // tags: string[]
  // comments: string[]
  // attachments: string[]
}
