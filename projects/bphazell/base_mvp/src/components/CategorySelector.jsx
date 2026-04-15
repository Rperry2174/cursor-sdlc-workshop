function CategorySelector({ categories, selectedCategory, onSelect }) {
  return (
    <div className="category-list">
      {categories.map((category) => (
        <button
          className={`category ${selectedCategory === category ? "selected" : ""}`}
          key={category}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategorySelector;
