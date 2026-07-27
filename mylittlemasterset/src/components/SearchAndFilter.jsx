import { useEffect, useRef, useState } from "react";
import "../styles/components.css";
import { RARITY_ORDER, RARITY_LABELS } from "../util/rarity.js";

export default function SearchAndFilter({
  searchTerm,
  onSearchTermChange,
  availableSets,
  selectedSets,
  onToggleSet,
  selectedRarities,
  onToggleRarity,
  raritySortDirection,
  onRaritySortDirectionChange,
  onReset
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleDropdown(name) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title h5">Search and Filter</h2>

        <div className="search-filter-bar" ref={containerRef}>
          <div className="search-input-group">
            <label className="form-label" htmlFor="card-search">Search</label>
            <input
              id="card-search"
              type="search"
              className="form-control"
              placeholder="Search by set or character..."
              aria-label="Search cards by set or character"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
          </div>

          <div className="filter-dropdown">
            <span className="form-label">Set</span>
            <button
              type="button"
              className="filter-dropdown-trigger"
              onClick={() => toggleDropdown("set")}
              aria-expanded={openDropdown === "set"}
            >
              <span>{selectedSets.length === 0 ? "All Sets" : `${selectedSets.length} selected`}</span>
              <span>{openDropdown === "set" ? "▲" : "▼"}</span>
            </button>

            {openDropdown === "set" && (
              <div className="filter-dropdown-menu">
                <div className="d-flex flex-wrap gap-2">
                  {availableSets.length === 0 && (
                    <p className="text-muted mb-0">No sets loaded yet.</p>
                  )}
                  {availableSets.map((setName) => (
                    <button
                      key={setName}
                      type="button"
                      className={`btn btn-sm ${selectedSets.includes(setName) ? "btn-primary navbar-theme-color" : "btn-outline-secondary"}`}
                      onClick={() => onToggleSet(setName)}
                      aria-pressed={selectedSets.includes(setName)}
                    >
                      {setName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <span className="form-label">Rarity</span>
            <button
              type="button"
              className="filter-dropdown-trigger"
              onClick={() => toggleDropdown("rarity")}
              aria-expanded={openDropdown === "rarity"}
            >
              <span>{selectedRarities.length === 0 ? "All Rarities" : `${selectedRarities.length} selected`}</span>
              <span>{openDropdown === "rarity" ? "▲" : "▼"}</span>
            </button>

            {openDropdown === "rarity" && (
              <div className="filter-dropdown-menu">
                <div className="btn-group mb-3" role="group" aria-label="Rarity sort direction">
                  <button
                    type="button"
                    className={`btn btn-sm ${raritySortDirection === "asc" ? "btn-primary navbar-theme-color" : "btn-outline-secondary"}`}
                    onClick={() => onRaritySortDirectionChange("asc")}
                  >
                    Ascending
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${raritySortDirection === "desc" ? "btn-primary navbar-theme-color" : "btn-outline-secondary"}`}
                    onClick={() => onRaritySortDirectionChange("desc")}
                  >
                    Descending
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {RARITY_ORDER.map((code) => (
                    <button
                      key={code}
                      type="button"
                      title={RARITY_LABELS[code]}
                      className={`btn btn-sm ${selectedRarities.includes(code) ? "btn-primary navbar-theme-color" : "btn-outline-secondary"}`}
                      onClick={() => onToggleRarity(code)}
                      aria-pressed={selectedRarities.includes(code)}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="button" className="btn btn-outline-danger" onClick={onReset}>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
