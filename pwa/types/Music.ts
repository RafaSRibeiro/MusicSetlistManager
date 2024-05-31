import { MediaObject } from "./MediaObject";
import { Item } from "./item";

export class Music implements Item {
  public "@id"?: string;

  constructor(
    public _id: string,
    public name: string,
    public image: MediaObject
  ) {
    this["@id"] = _id;
  }
}
