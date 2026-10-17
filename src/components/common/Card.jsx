const Card = ({ children, className = "", padding = "p-5" }) => (
	<div className={`surface ${padding} ${className}`}>
		{children}
	</div>
);

export default Card;
