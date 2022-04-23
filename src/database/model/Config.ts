import { Column, Entity } from "typeorm";

export abstract class ConfigType {
  @Column("text", {
    primary: true,
    unique: true,
  })
  key: string;

  @Column("text")
  value: string;

  @Column("text")
  name: string;

  @Column("text", { nullable: true })
  description: string | null;

  @Column("boolean", { default: true })
  canEdit: boolean;

  @Column("text", { nullable: true })
  options: string | null;
}

@Entity("config")
export class Config extends ConfigType {
  
}
