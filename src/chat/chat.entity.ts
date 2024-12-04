import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  content: string;

  @Column()
  timestamp: Date;
}
