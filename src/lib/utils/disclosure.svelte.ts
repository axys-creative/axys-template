/** Which items of an accordion are open. `singleOpen` is read on every toggle, so it can be a prop. */
export function createDisclosure(count: () => number, singleOpen: () => boolean) {
	let open = $state<number[]>([]);

	return {
		isOpen: (index: number) => open.includes(index),
		get allOpen() {
			return count() > 0 && open.length >= count();
		},
		get noneOpen() {
			return open.length === 0;
		},
		toggle(index: number) {
			if (open.includes(index)) open = open.filter((item) => item !== index);
			else open = singleOpen() ? [index] : [...open, index];
		},
		openAll() {
			open = Array.from({ length: count() }, (_, index) => index);
		},
		closeAll() {
			open = [];
		}
	};
}
