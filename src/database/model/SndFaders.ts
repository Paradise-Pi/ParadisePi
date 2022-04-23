import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sndFaders")
export class SndFaders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("integer", { nullable: true })
  channel: number | null;

  @Column("boolean")
  enabled: boolean;
}
