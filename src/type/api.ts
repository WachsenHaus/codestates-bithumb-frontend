export interface ResponseVO<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}
