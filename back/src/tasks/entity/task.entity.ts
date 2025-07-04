import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ length: 30 })
  title: string;
  
  @Column({ length: 50 })
  description: string;
  
  @Column({ length: 30 })
  status: string;
  
  @ManyToOne(() => User, (user) => user.tasks)
  user!: User;
  
  @Column({ type: 'int' })
  projectId: number;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;
  // priority: string
  // assigneeId: string
  // tags: string[]
  // comments: string[]
  // attachments: string[]
}
