import { createPortal } from "react-dom";
import BadgePreview from "./BadgePreview";

// منطقة الطباعة تُرسم مباشرة داخل <body> (خارج #root). وفي CSS الطباعة نُخفي #root كاملًا،
// فتُطبع البطاقة وحدها على صفحة واحدة دون صفحات فارغة ناتجة عن بقية عناصر الصفحة.
const PrintBadge = ({ data }) =>
	createPortal(
		<div id="print-badge-area" aria-hidden="true">
			<BadgePreview data={data} id="print-badge-front" side="front" />
			<BadgePreview data={data} id="print-badge-back" side="back" />
		</div>,
		document.body,
	);

export default PrintBadge;
