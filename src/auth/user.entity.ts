import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsIn } from 'class-validator';
import { Task } from 'src/tasks/task.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'new' })
  @IsIn(['new', 'active', 'suspended', 'deleted'])
  status: string;

  @Column()
  password: string;

  // One to Many relationship: a user has many tasks
  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    return (await bcrypt.hash(password, this.salt)) === this.password;
  }
}
