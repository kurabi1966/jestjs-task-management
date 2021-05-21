// import { TaskStatus } from './../task.model';
import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValied(value)) {
      throw new BadRequestException(
        `${value} is not a correct status, it should be ${this.allowedStatuses}`,
      );
    }
    return value;
  }

  private isStatusValied(status: any): boolean {
    return this.allowedStatuses.indexOf(status) !== -1;
  }
}
