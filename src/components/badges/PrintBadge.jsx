import BadgePreview from "./BadgePreview";

const PrintBadge = ({ data }) => (
	<div id="print-badge-area" className="hidden print-badge-sheet">
		<BadgePreview data={data} id="print-badge-front" side="front" />
		<BadgePreview data={data} id="print-badge-back" side="back" />
	</div>
);

const waitForImage = (image) => {
	if (image.complete) return Promise.resolve();
	return new Promise((resolve) => {
		image.addEventListener("load", resolve, { once: true });
		image.addEventListener("error", resolve, { once: true });
	});
};

export default PrintBadge;

export const printBadge = async (
	element = document.getElementById("print-badge-area"),
) => {
	if (!element) return;

	await Promise.all([...element.querySelectorAll("img")].map(waitForImage));
	await new Promise((resolve) =>
		requestAnimationFrame(() => requestAnimationFrame(resolve)),
	);
	window.print();
};
