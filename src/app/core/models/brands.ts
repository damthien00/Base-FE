export class Brand{
  id!:number;
  name!:string;
  description!:string;
  isDeleted!:number;
  version!: number;
  constructor(){
    this.isDeleted = 0;
  }
}
