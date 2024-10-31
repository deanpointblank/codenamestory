import "@testing-library/jest-dom";

// @ts-ignore
beforeAll(() => {
	(HTMLElement.prototype as any).createEl = function (
		tagName: string,
		options?: any,
	): HTMLElement {
		const el = document.createElement(tagName);
		if (options) {
			if (options.text) el.textContent = options.text;
			if (options.cls) el.className = options.cls;
			// Add other options as necessary
		}
		this.appendChild(el);
		return el;
	};
});
