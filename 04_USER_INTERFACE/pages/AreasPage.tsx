import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@infrastructure/database';
import { Plus, Search, MapPin, ExternalLink, FileSpreadsheet, X, Map, List, Ruler, Fence, Filter, Trash2 } from 'lucide-react';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Skeleton } from '@ui/components/ui/skeleton';
import { Badge } from '@ui/components/ui/badge';
import { OKRES_NAMES } from '@infrastructure/database/types/database';
import type { OkresCode, TypArealu } from '@infrastructure/database/types/database';
import { exportAreasToExcel } from '@infrastructure/export';
import { toast } from 'sonner';
import { AreasMap } from '@ui/components/map/AreasMap';
import { RoutePlanner } from '@ui/components/route/RoutePlanner';
import { useAuth } from '@infrastructure/auth';
import { getTypeConfig } from '@ui/components/map/AreaMarkerIcon';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/components/ui/select';

export default function AreasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterTyp, setFilterTyp] = useState<string>('all');
  const [filterOkres, setFilterOkres] = useState<string>('all');
  const [areaToDelete, setAreaToDelete] = useState<{ id: string; nazev: string } | null>(null);
  const [routeAreas, setRouteAreas] = useState<any[]>([]);

  const { isAdmin, isTechnik } = useAuth();
  const queryClient = useQueryClient();
  const canDelete = isAdmin || isTechnik;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('arealy').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas-full'] });
      toast.success('Areál byl smazán');
      setAreaToDelete(null);
    },
    onError: (error: any) => {
      toast.error('Chyba při mazání areálu: ' + error.message);
    },
  });

  const { data: areas, isLoading } = useQuery({
    queryKey: ['areas-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('arealy')
        .select(`
          *,
          stroje (vyrobni_cislo, model)
        `)
        .order('nazev');
      if (error) throw error;
      return data;
    },
  });

  const filteredAreas = useMemo(() => {
    if (!areas) return [];
    return areas.filter(area => {
      const matchesSearch = !searchQuery ||
        area.nazev.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.okres?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTyp = filterTyp === 'all' || area.typ === filterTyp;
      const matchesOkres = filterOkres === 'all' || area.okres === filterOkres;
      return matchesSearch && matchesTyp && matchesOkres;
    });
  }, [areas, searchQuery, filterTyp, filterOkres]);

  const totalArea = areas?.reduce((sum, a) => sum + (a.plocha_m2 || 0), 0) || 0;
  const totalFence = areas?.reduce((sum, a) => sum + (a.obvod_oploceni_m || 0), 0) || 0;

  const uniqueTypes = useMemo(() => {
    if (!areas) return [];
    return [...new Set(areas.map(a => a.typ).filter(Boolean))].sort();
  }, [areas]);

  const uniqueOkresy = useMemo(() => {
    if (!areas) return [];
    return [...new Set(areas.map(a => a.okres).filter(Boolean))].sort() as string[];
  }, [areas]);

  const handleExportExcel = async () => {
    if (!areas?.length) { toast.error('Žádné areály k exportu'); return; }
    try {
      await exportAreasToExcel(areas);
      toast.success('Excel byl úspěšně stažen');
    } catch { toast.error('Chyba při exportu'); }
  };

  const handleToggleRoute = useCallback((area: any) => {
    setRouteAreas(prev => {
      const exists = prev.find((a: any) => a.id === area.id);
      if (exists) return prev.filter((a: any) => a.id !== area.id);
      return [...prev, area];
    });
  }, []);

  const routeAreaIds = useMemo(() => routeAreas.map((a: any) => a.id), [routeAreas]);

  return (
    <div className="space-y-4">
      {/* Header with inline view toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Areály</h1>
            <p className="text-xs text-muted-foreground">
              {areas?.length || 0} objektů · {totalArea.toLocaleString('cs-CZ')} m² · {totalFence.toLocaleString('cs-CZ')} bm
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle inline */}
          <div className="flex rounded-lg border border-border">
            <button
              onClick={() => setViewMode('list')}
              className={`flex h-10 w-10 items-center justify-center rounded-l-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
              aria-label="Zobrazit seznam"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex h-10 w-10 items-center justify-center rounded-r-lg transition-colors ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
              aria-label="Zobrazit mapu"
            >
              <Map className="h-4 w-4" />
            </button>
          </div>
          <Button variant="outline" onClick={handleExportExcel} size="icon" className="h-10 w-10" aria-label="Export">
            <FileSpreadsheet className="h-4 w-4" />
          </Button>
          <Button asChild size="icon" className="h-10 w-10">
            <Link to="/arealy/novy" aria-label="Nový areál">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Search + Filters in one row */}
      <div className="flex gap-2">
        <div className="relative flex-1" role="search">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Hledat areály..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-9 pr-8 text-sm"
            aria-label="Hledat v areálech"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground" aria-label="Vymazat">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Select value={filterTyp} onValueChange={setFilterTyp}>
          <SelectTrigger className="h-11 w-[130px] text-xs">
            <Filter className="mr-1 h-3 w-3" />
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všechny typy</SelectItem>
            {uniqueTypes.map(t => (
              <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterOkres} onValueChange={setFilterOkres}>
          <SelectTrigger className="hidden h-11 w-[140px] text-xs sm:flex">
            <SelectValue placeholder="Okres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všechny okresy</SelectItem>
            {uniqueOkresy.map(o => (
              <SelectItem key={o} value={o}>
                {OKRES_NAMES[o as OkresCode] || o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(filterTyp !== 'all' || filterOkres !== 'all') && (
          <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={() => { setFilterTyp('all'); setFilterOkres('all'); }}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Compact stats bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2">
          <span className="font-mono text-sm font-bold text-primary">{filteredAreas?.length || 0}</span>
          <span className="text-[10px] text-muted-foreground">areálů</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2">
          <Ruler className="h-3 w-3 text-success" />
          <span className="font-mono text-sm font-bold text-success">{totalArea.toLocaleString('cs-CZ')}</span>
          <span className="text-[10px] text-muted-foreground">m²</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-info/10 px-3 py-2">
          <Fence className="h-3 w-3 text-info" />
          <span className="font-mono text-sm font-bold text-info">{(totalFence / 1000).toFixed(1)}</span>
          <span className="text-[10px] text-muted-foreground">km</span>
        </div>
      </div>

      {/* Route planner */}
      {filteredAreas && filteredAreas.length > 0 && (
        <RoutePlanner
          areas={filteredAreas}
          routeAreas={routeAreas}
          setRouteAreas={setRouteAreas}
        />
      )}

      {/* Map view */}
      {viewMode === 'map' && filteredAreas && (
        <AreasMap
          areas={filteredAreas}
          routeAreaIds={routeAreaIds}
          onToggleRoute={handleToggleRoute}
          showRoute={routeAreas.length >= 2}
          showMachinePosition={true}
        />
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <>
          {isLoading && (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          )}

          {!isLoading && filteredAreas && filteredAreas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Žádné areály</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || filterTyp !== 'all' || filterOkres !== 'all'
                  ? 'Zkuste změnit filtry nebo vyhledávání'
                  : 'Začněte přidáním prvního areálu'}
              </p>
              {!searchQuery && filterTyp === 'all' && filterOkres === 'all' && (
                <Button asChild className="mt-4">
                  <Link to="/arealy/novy">
                    <Plus className="mr-2 h-4 w-4" />
                    Přidat areál
                  </Link>
                </Button>
              )}
            </div>
          )}

          {!isLoading && filteredAreas && filteredAreas.length > 0 && (
            <div className="space-y-2">
              {filteredAreas.map((area: any) => {
                const typeConfig = getTypeConfig(area.typ);
                const isInRoute = routeAreaIds.includes(area.id);
                return (
                  <div
                    key={area.id}
                    className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${isInRoute ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                  >
                    <Link to={`/arealy/${area.id}`} className="block p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeConfig.bgColor}`}>
                            <typeConfig.icon className={`h-5 w-5 ${typeConfig.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold leading-tight">{area.nazev}</h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="capitalize">
                                {area.typ}
                              </Badge>
                              {area.okres && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {OKRES_NAMES[area.okres as OkresCode] || area.okres}
                                </span>
                              )}
                              {area.plocha_m2 && (
                                <span className="flex items-center gap-1">
                                  <Ruler className="h-3 w-3" />
                                  {area.plocha_m2.toLocaleString('cs-CZ')} m²
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {area.google_maps_link && (
                            <a
                              href={area.google_maps_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label="Otevřít v Google Maps"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {canDelete && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAreaToDelete({ id: area.id, nazev: area.nazev });
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                              aria-label="Smazat areál"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!areaToDelete} onOpenChange={(open) => !open && setAreaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Smazat areál?</AlertDialogTitle>
            <AlertDialogDescription>
              Opravdu chcete smazat areál <strong>{areaToDelete?.nazev}</strong>?
              Tato akce je nevratná.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušit</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => areaToDelete && deleteMutation.mutate(areaToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Smazat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
