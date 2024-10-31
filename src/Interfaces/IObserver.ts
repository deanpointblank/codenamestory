import { ISubject } from "./ISubject";

export interface IObserver {
	update(subject: ISubject, data?: any): void;
}
