import PropTypes from "prop-types";
import { CATEGORY_PATCH } from "../../constants.js";
import "./PatchCard.css";

// A card that looks like a stitched quilt patch, colored by category.
function PatchCard({
  category,
  children,
  as: Tag = "article",
  className = "",
}) {
  // Ken Yong Code Review: Nothing wrong here, just thinking that defining "patch-stone" as a named default constant
  // instead of hardcode it here. This could make the fallback category style easier to find and update later.
  // Your code is still working, so, no big deal. :)

  const patch = CATEGORY_PATCH[category] || "patch-stone";
  return (
    <Tag className={`patch-card ${patch} ${className}`}>
      <span className="patch-card-category">{category}</span>
      {children}
    </Tag>
  );
}

PatchCard.propTypes = {
  category: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  as: PropTypes.elementType,
  className: PropTypes.string,
};

export default PatchCard;
