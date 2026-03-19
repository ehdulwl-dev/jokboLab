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
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className={large ? "w-5 h-5" : "w-4 h-4"} />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="성씨 또는 이름으로 검색하세요"
        className={`w-full bg-card shadow-card border border-border rounded-2xl outline-none transition-all focus:ring-2 focus:ring-accent/20 focus:border-accent/30 ${
          large ? "pl-14 pr-28 py-5 text-lg" : "pl-12 pr-24 py-3.5 text-sm"
        }`}
      />
      <button
        type="submit"
        className={`absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-all active:scale-[0.97] ${
          large ? "px-6 py-3" : "px-5 py-2 text-sm"
        }`}
      >
        검색
      </button>
    </form>
  );
}
