"use client"

import { StoreCard } from "@/components/component/distribuidoras/store-card"

export function StoreList({ stores, onStoreClick, onStoreHover }) {
  return (
    <div className="space-y-3 pb-24 px-4">
      {stores.length === 0 ? (
        <div className="text-center py-12 px-4">
          <p className="text-muted-foreground text-lg">No se encontraron tiendas con los filtros seleccionados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stores.map((store) => (
            <div key={store.id} onMouseEnter={() => onStoreHover(store.id)} onMouseLeave={() => onStoreHover(null)}>
              <StoreCard store={store} onClick={() => onStoreClick(store)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
