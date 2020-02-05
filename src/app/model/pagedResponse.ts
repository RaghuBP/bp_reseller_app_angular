export class PagedResponse<T> {
  numberOfElements: number;
  totalElements: string;
  content: T;

  constructor(numberOfElements: number, totalElements: string,
    content: T){
      this.numberOfElements = numberOfElements;
      this.totalElements = totalElements;
      this.content = content;
    }
}
