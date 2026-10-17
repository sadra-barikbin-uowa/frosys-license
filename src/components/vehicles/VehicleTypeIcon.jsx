import { createElement } from "react";
import { vehicleTypeIcon } from "../../data/vehicleTypes";

// أيقونة نوع المركبة (تُنشأ عبر createElement لأن المكوّن يُحدَّد ديناميكيًا حسب النوع)
const VehicleTypeIcon = ({ type, ...props }) => createElement(vehicleTypeIcon(type), props);

export default VehicleTypeIcon;
