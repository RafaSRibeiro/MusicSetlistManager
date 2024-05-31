import { Music } from "./Music";
import { Item } from "./item";

export class Playlist implements Item {
  public "@id"?: string;

  constructor(_id: string, public name: string, public musics?: Music[]) {
    this["@id"] = _id;
  }
}
