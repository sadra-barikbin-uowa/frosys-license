const Card = ({ children, className = "", padding = "p-5" }) => (
	<div className={`bg-white rounded-xl ring-1 ring-slate-100 shadow-sm ${padding} ${className}`}>
		{children}
	</div>
);

export default Card;
