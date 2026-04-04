import { useState, useEffect } from 'react';
import { useProducts } from '@starcoex-frontend/products';
import { EntitySearchInput } from './entity-search-input';
import { SelectedEntityCard } from './selected-entity-card';
import type { EntitySearchProps, SelectedEntity } from './entity-search.types';

interface Props extends EntitySearchProps {
  selected: SelectedEntity | null;
  onClear: () => void;
}

export function EntitySearchProduct({ selected, onSelect, onClear }: Props) {
  const { products, fetchProducts, isLoading } = useProducts();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, []);

  const results = products
    .filter((p) => {
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    })
    .slice(0, 10)
    .map((p) => ({
      key: String(p.id),
      primary: p.name,
      secondary: `SKU: ${p.sku} · ID: #${p.id}`,
    }));

  const handleSelect = (key: string) => {
    const product = products.find((p) => String(p.id) === key);
    if (!product) return;
    onSelect({
      id: product.id,
      displayId: `#${product.id}`,
      label: product.name,
      path: `/admin/products/${product.id}`,
    });
    setQuery('');
  };

  if (selected) {
    return (
      <SelectedEntityCard
        entity={selected}
        typeLabel="제품"
        onClear={onClear}
      />
    );
  }

  return (
    <EntitySearchInput
      placeholder="제품명 또는 SKU로 검색"
      query={query}
      onQueryChange={setQuery}
      results={results}
      onSelect={handleSelect}
      isLoading={isLoading}
    />
  );
}
