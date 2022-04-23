import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class PresetType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("boolean", {
    default: true
  })
  enabled: boolean;

}
