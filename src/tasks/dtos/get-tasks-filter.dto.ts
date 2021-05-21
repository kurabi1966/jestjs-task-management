import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { TaskStatus } from './../task-status.enum';
export class GetTaskFilterDto {
  @IsOptional()
  @Matches(
    `^${Object.values(TaskStatus)
      .filter((v) => typeof v !== 'number')
      .join('|')}$`,
    'i',
  )
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
