import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IsIn } from 'class-validator';

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

  @Column()
  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    return (await bcrypt.hash(password, this.salt)) === this.password;
  }
}
