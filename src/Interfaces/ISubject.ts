import { IObserver } from "./IObserver";

export interface ISubject {
	name: string;
	registerObserver(observer: IObserver): void;

	removeObserver(observer: IObserver): void;

	notifyObservers(): void;
}
