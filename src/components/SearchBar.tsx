import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  large?: boolean;
  onSearch?: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({ large, onSearch, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl gap-0">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className={large ? "w-4 h-4" : "w-3.5 h-3.5"} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="성씨 또는 이름으로 검색하세요"
          className={`w-full bg-card border border-border border-r-0 outline-none transition-colors focus:border-primary ${
            large ? "pl-10 pr-4 py-3 text-sm" : "pl-9 pr-4 py-2.5 text-sm"
          }`}
        />
      </div>
      <button
        type="submit"
        className={`bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity shrink-0 ${
          large ? "px-6 py-3 text-sm" : "px-5 py-2.5 text-sm"
        }`}
      >
        검색
      </button>
    </form>
  );
}
