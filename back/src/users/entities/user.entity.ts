import { Task } from "src/tasks/entity/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 30 })
    username: string;
    
    @Column({ length: 50 })
    email: string;
    
    @Column({ length: 100 })
    password: string;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @OneToMany(()=>Task, (task) => task.user, {cascade: true})
    tasks: Task[];
}
