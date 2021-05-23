import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Unique } from 'typeorm';
import { IsIn, IsEmail } from 'class-validator';

@Entity()
@Unique(['email'])
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column({ default: 'user_activate' })
  @IsIn(['user_activation', 'user_forget_password'])
  type: string;

  @Column({ default: 'not_used' })
  @IsIn(['not_used', 'used'])
  status: string;

  @Column()
  token: string; // uuid generated

  @Column() // expires in 15 minutes
  expire: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  // async validatePassword(password: string): Promise<boolean> {
  //   return (await bcrypt.hash(password, this.salt)) === this.password;
  // }
}
