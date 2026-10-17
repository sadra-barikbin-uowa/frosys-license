import { useLayoutEffect, useRef, useState } from "react";

export const BADGE_WIDTH = 342;
export const BADGE_HEIGHT = 216;

// يصغّر البطاقة (بنفس النسبة) لتناسب عرض الحاوية على الشاشات الصغيرة بدل أن تتجاوزها.
// البطاقة نفسها تبقى بحجمها الحقيقي 342×216، وإنما يُطبَّق عليها transform: scale
const ScaledBadge = ({ children }) => {
	const ref = useRef(null);
	const [scale, setScale] = useState(1);

	useLayoutEffect(() => {
		const element = ref.current;
		const update = () => setScale(Math.min(1, element.clientWidth / BADGE_WIDTH));
		update();
		const observer = new ResizeObserver(update);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			dir="ltr"
			className="w-full mx-auto"
			style={{ maxWidth: BADGE_WIDTH, height: BADGE_HEIGHT * scale }}
		>
			<div
				style={{
					width: BADGE_WIDTH,
					height: BADGE_HEIGHT,
					transform: `scale(${scale})`,
					transformOrigin: "top left",
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default ScaledBadge;
