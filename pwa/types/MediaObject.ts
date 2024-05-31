import { Item } from "./item";

export class MediaObject implements Item {
  public "@id"?: string;

  constructor(_id?: string, public contentUrl?: string) {
    this["@id"] = _id;
  }
}
