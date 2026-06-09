'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MapPin, Landmark, Building2, Globe2, Sparkles, RefreshCw,
  ChevronRight, SquarePen, Trash2, Plus, Image, Video,
  Save, X, Check, AlertCircle, Loader2,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Region  { id: string; name: string; slug: string; latitude: number | null; longitude: number | null; description?: string; history?: string; photos?: string[]; videos?: string[]; mainCultureId?: string | null; provinces: { id: string; name: string; slug: string }[]; }
interface Province{ id: string; name: string; slug: string; latitude: number | null; longitude: number | null; description?: string; history?: string; photos?: string[]; videos?: string[]; mainCultureId?: string | null; districts: { id: string; name: string; slug: string }[]; region?: { id: string; name: string; slug: string } | null; }
interface District{ id: string; name: string; slug: string; history?: string; description?: string; howToGetThere: string; latitude: number | null; longitude: number | null; photos: string[]; videos?: string[]; mainCultureId?: string | null; }
interface Festivity{ id: string; name: string; description: string; youtubeVideos: string[]; images: string[]; }
interface Culture  { id: string; name: string; slug: string; description: string; images: string[]; }

type View = 'regions' | 'region-edit' | 'region-create' | 'provinces' | 'province-edit' | 'districts' | 'district-edit' | 'festivities' | 'festivity-edit' | 'cultures' | 'culture-edit';

// ─── Shared UI ───────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'ok' | 'err' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-in slide-in-from-bottom-4 duration-300 ${type === 'ok' ? 'bg-emerald-600 text-white' : 'bg-destructive text-destructive-foreground'}`}>
      {type === 'ok' ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

function SectionHeader({ title, icon: Icon, back, onBack, action }: {
  title: string; icon: React.FC<{ size?: number; className?: string }>; back?: string; onBack?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {back && onBack && (
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm cursor-pointer">
            ← {back}
          </button>
        )}
        {back && <ChevronRight size={14} className="text-muted-foreground" />}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon size={16} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Inline editable field ───────────────────────────────────────────────────

function PhotosEditor({ photos, onChange }: { photos: string[]; onChange: (p: string[]) => void }) {
  const [newUrl, setNewUrl] = useState('');
  const add = () => {
    if (newUrl.trim()) { onChange([...photos, newUrl.trim()]); setNewUrl(''); }
  };
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newUrl} onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="https://drive.google.com/uc?export=view&id=FILE_ID"
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1 cursor-pointer hover:bg-primary/90">
          <Plus size={14} /> Agregar
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {photos.map((url, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-border bg-muted/20 aspect-video">
            <img src={url} alt={`foto-${i}`} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
            <button
              onClick={() => onChange(photos.filter((_, j) => j !== i))}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X size={12} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white px-1.5 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              {url.slice(-30)}
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-4 py-6 text-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
            Sin fotos. Agrega URLs de Google Drive arriba.
          </div>
        )}
      </div>
    </div>
  );
}

function YoutubeEditor({ videos, onChange }: { videos: string[]; onChange: (v: string[]) => void }) {
  const [newUrl, setNewUrl] = useState('');
  const add = () => {
    if (newUrl.trim()) { onChange([...videos, newUrl.trim()]); setNewUrl(''); }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={newUrl} onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold flex items-center gap-1 cursor-pointer hover:bg-red-700">
          <Video size={14} /> Agregar
        </button>
      </div>
      {videos.map((url, i) => (
        <div key={i} className="flex items-center gap-2 text-sm bg-muted/30 rounded-lg px-3 py-2 border border-border">
          <Video size={14} className="text-red-500 shrink-0" />
          <span className="flex-1 truncate text-xs">{url}</span>
          <button onClick={() => onChange(videos.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive cursor-pointer"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

// ─── District Editor ─────────────────────────────────────────────────────────

function DistrictEditor({ id, cultures, onBack, onToast }: { id: string; cultures: any[]; onBack: () => void; onToast: (m: string, t: 'ok'|'err') => void }) {
  const [d, setD] = useState<District | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: '', history: '', howToGetThere: '', latitude: '', longitude: '', mainCultureId: '', photos: [] as string[], videos: [] as string[] });

  useEffect(() => {
    apiClient.get(`/admin/mi-peru/districts/${id}`)
      .then(r => { setD(r.data); setForm({ description: r.data.description || '', history: r.data.history || '', howToGetThere: r.data.howToGetThere || '', latitude: r.data.latitude?.toString() || '', longitude: r.data.longitude?.toString() || '', mainCultureId: r.data.mainCultureId || '', photos: r.data.photos || [], videos: r.data.videos || [] }); })
      .catch(() => onToast('Error al cargar distrito', 'err'))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.patch(`/admin/mi-peru/districts/${id}`, { ...form, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null });
      onToast('Distrito actualizado ✓', 'ok');
    } catch { onToast('Error al guardar', 'err'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={18} /> Cargando...</div>;
  if (!d) return null;

  return (
    <div className="space-y-6">
      <SectionHeader title={d.name} icon={MapPin} back="Distritos" onBack={onBack} action={
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
        </button>
      } />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Landmark size={14} className="text-purple-500" /> Información & Historia</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Descripción Breve</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Historia Detallada</label>
              <textarea value={form.history} onChange={e => setForm(f => ({ ...f, history: e.target.value }))} rows={6} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><MapPin size={14} className="text-cyan-500" /> Ubicación & Cultura</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Cultura Principal</label>
              <select value={form.mainCultureId} onChange={e => setForm(f => ({ ...f, mainCultureId: e.target.value }))} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Seleccione cultura principal...</option>
                {cultures.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold mb-1 block">Latitud</label>
                <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} placeholder="-13.5170" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Longitud</label>
                <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} placeholder="-71.9785" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Cómo Llegar</label>
              <textarea value={form.howToGetThere} onChange={e => setForm(f => ({ ...f, howToGetThere: e.target.value }))} rows={4} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Video size={14} className="text-red-500" /> Videos YouTube</CardTitle></CardHeader>
        <CardContent>
          <YoutubeEditor videos={form.videos} onChange={videos => setForm(f => ({ ...f, videos }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Image size={14} className="text-pink-500" /> Fotos (Google Drive)</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Formato: <code className="bg-muted px-1 rounded">https://drive.google.com/uc?export=view&id=FILE_ID</code>
            {' '}· El archivo debe ser <strong>público</strong> en Drive.
          </p>
          <PhotosEditor photos={form.photos} onChange={photos => setForm(f => ({ ...f, photos }))} />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Festivity Editor ─────────────────────────────────────────────────────────

function FestivityEditor({ id, districtId, onBack, onToast }: { id: string | null; districtId?: string; onBack: () => void; onToast: (m: string, t: 'ok'|'err') => void }) {
  const isNew = !id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', youtubeVideos: [] as string[], images: [] as string[] });

  useEffect(() => {
    if (!isNew && id) {
      apiClient.get(`/admin/mi-peru/festivities/${id}`)
        .then(r => setForm({ name: r.data.name, description: r.data.description, youtubeVideos: r.data.youtubeVideos || [], images: r.data.images || [] }))
        .catch(() => onToast('Error al cargar festividad', 'err'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      if (isNew && districtId) {
        await apiClient.post(`/admin/mi-peru/districts/${districtId}/festivities`, form);
        onToast('Festividad creada ✓', 'ok');
      } else {
        await apiClient.patch(`/admin/mi-peru/festivities/${id}`, form);
        onToast('Festividad actualizada ✓', 'ok');
      }
      onBack();
    } catch { onToast('Error al guardar', 'err'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={18} /> Cargando...</div>;

  return (
    <div className="space-y-6">
      <SectionHeader title={isNew ? 'Nueva Festividad' : 'Editar Festividad'} icon={Sparkles} back="Festividades" onBack={onBack} action={
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {isNew ? 'Crear' : 'Guardar'}
        </button>
      } />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Información</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre de la festividad" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={6} placeholder="Descripción..." className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Video size={14} className="text-red-500" /> Videos YouTube</CardTitle></CardHeader>
          <CardContent>
            <YoutubeEditor videos={form.youtubeVideos} onChange={v => setForm(f => ({ ...f, youtubeVideos: v }))} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Image size={14} className="text-pink-500" /> Imágenes (Google Drive)</CardTitle></CardHeader>
        <CardContent>
          <PhotosEditor photos={form.images} onChange={images => setForm(f => ({ ...f, images }))} />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Culture Editor ───────────────────────────────────────────────────────────

function CultureEditor({ id, onBack, onToast }: { id: string; onBack: () => void; onToast: (m: string, t: 'ok'|'err') => void }) {
  const [c, setC] = useState<Culture | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: '', sequence: '', images: [] as string[] });

  useEffect(() => {
    apiClient.get(`/admin/mi-peru/cultures/${id}`)
      .then(r => { setC(r.data); setForm({ description: r.data.description || '', sequence: r.data.sequence || '', images: r.data.images || [] }); })
      .catch(() => onToast('Error al cargar cultura', 'err'))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.patch(`/admin/mi-peru/cultures/${id}`, form);
      onToast('Cultura actualizada ✓', 'ok');
    } catch { onToast('Error al guardar', 'err'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={18} /> Cargando...</div>;
  if (!c) return null;

  return (
    <div className="space-y-6">
      <SectionHeader title={c.name} icon={Globe2} back="Culturas" onBack={onBack} action={
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
        </button>
      } />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Descripción</CardTitle></CardHeader>
          <CardContent>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={7} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Secuencia / Desarrollo</CardTitle></CardHeader>
          <CardContent>
            <textarea value={form.sequence} onChange={e => setForm(f => ({ ...f, sequence: e.target.value }))}
              rows={7} placeholder="Paso 1: ...\nPaso 2: ..." className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Image size={14} className="text-pink-500" /> Imágenes (Google Drive)</CardTitle></CardHeader>
        <CardContent>
          <PhotosEditor photos={form.images} onChange={images => setForm(f => ({ ...f, images }))} />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Region & Province Editors ────────────────────────────────────────────────

function RegionEditor({ id, cultures, onBack, onToast }: { id: string; cultures: any[]; onBack: () => void; onToast: (m: string, t: 'ok'|'err') => void }) {
  const [r, setR] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: '', history: '', latitude: '', longitude: '', mainCultureId: '', photos: [] as string[], videos: [] as string[] });

  useEffect(() => {
    apiClient.get(`/admin/mi-peru/regions/${id}`)
      .then(res => { 
        const data = res.data?.data || res.data;
        setR(data); 
        setForm({ description: data.description || '', history: data.history || '', latitude: data.latitude?.toString() || '', longitude: data.longitude?.toString() || '', mainCultureId: data.mainCultureId || '', photos: data.photos || [], videos: data.videos || [] }); 
      })
      .catch(() => onToast('Error al cargar región', 'err'))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.patch(`/admin/mi-peru/regions/${id}`, { ...form, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null });
      onToast('Región actualizada ✓', 'ok');
    } catch { onToast('Error al guardar', 'err'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={18} /> Cargando...</div>;
  if (!r) return null;

  return (
    <div className="space-y-6">
      <SectionHeader title={r.name} icon={Globe2} back="Regiones" onBack={onBack} action={
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
        </button>
      } />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Landmark size={14} className="text-purple-500" /> Información & Historia</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Descripción Breve</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Historia Detallada</label>
              <textarea value={form.history} onChange={e => setForm(f => ({ ...f, history: e.target.value }))} rows={6} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><MapPin size={14} className="text-cyan-500" /> Ubicación & Cultura</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Cultura Principal</label>
              <select value={form.mainCultureId} onChange={e => setForm(f => ({ ...f, mainCultureId: e.target.value }))} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Seleccione cultura principal...</option>
                {cultures.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold mb-1 block">Latitud</label>
                <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} placeholder="-13.5170" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Longitud</label>
                <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} placeholder="-71.9785" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Video size={14} className="text-red-500" /> Videos YouTube</CardTitle></CardHeader>
        <CardContent>
          <YoutubeEditor videos={form.videos} onChange={videos => setForm(f => ({ ...f, videos }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Image size={14} className="text-pink-500" /> Fotos (Google Drive)</CardTitle></CardHeader>
        <CardContent>
          <PhotosEditor photos={form.photos} onChange={photos => setForm(f => ({ ...f, photos }))} />
        </CardContent>
      </Card>
    </div>
  );
}

function RegionCreator({ onBack, onToast }: { onBack: () => void; onToast: (m: string, t: 'ok'|'err') => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', latitude: '', longitude: '' });

  const save = async () => {
    if (!form.name || !form.slug) {
      onToast('Nombre y slug son obligatorios', 'err');
      return;
    }
    setSaving(true);
    try {
      await apiClient.post(`/admin/mi-peru/regions`, { ...form, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null });
      onToast('Región registrada ✓', 'ok');
      onBack();
    } catch { 
      onToast('Error al registrar región', 'err'); 
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Nueva Región" icon={Globe2} back="Regiones" onBack={onBack} action={
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Registrar
        </button>
      } />
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><MapPin size={14} className="text-cyan-500" /> Datos de la Región</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold">Nombre</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Cusco" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="ej-cusco" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Latitud</label>
              <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))}
                placeholder="-13.5170" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Longitud</label>
              <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))}
                placeholder="-71.9785" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProvinceEditor({ id, cultures, onBack, onToast }: { id: string; cultures: any[]; onBack: () => void; onToast: (m: string, t: 'ok'|'err') => void }) {
  const [p, setP] = useState<Province | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ description: '', history: '', latitude: '', longitude: '', mainCultureId: '', photos: [] as string[], videos: [] as string[] });

  useEffect(() => {
    apiClient.get(`/admin/mi-peru/provinces/${id}`)
      .then(res => { 
        const data = res.data?.data || res.data;
        setP(data); 
        setForm({ description: data.description || '', history: data.history || '', latitude: data.latitude?.toString() || '', longitude: data.longitude?.toString() || '', mainCultureId: data.mainCultureId || '', photos: data.photos || [], videos: data.videos || [] }); 
      })
      .catch(() => onToast('Error al cargar provincia', 'err'))
      .finally(() => setLoading(false));
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.patch(`/admin/mi-peru/provinces/${id}`, { ...form, latitude: form.latitude ? parseFloat(form.latitude) : null, longitude: form.longitude ? parseFloat(form.longitude) : null });
      onToast('Provincia actualizada ✓', 'ok');
    } catch { onToast('Error al guardar', 'err'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={18} /> Cargando...</div>;
  if (!p) return null;

  return (
    <div className="space-y-6">
      <SectionHeader title={p.name} icon={Building2} back="Provincias" onBack={onBack} action={
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:bg-primary/90 disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar
        </button>
      } />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Landmark size={14} className="text-purple-500" /> Información & Historia</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Descripción Breve</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block">Historia Detallada</label>
              <textarea value={form.history} onChange={e => setForm(f => ({ ...f, history: e.target.value }))} rows={6} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><MapPin size={14} className="text-cyan-500" /> Ubicación & Cultura</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-semibold mb-1 block">Cultura Principal</label>
              <select value={form.mainCultureId} onChange={e => setForm(f => ({ ...f, mainCultureId: e.target.value }))} className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Seleccione cultura principal...</option>
                {cultures.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold mb-1 block">Latitud</label>
                <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} placeholder="-13.5170" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">Longitud</label>
                <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} placeholder="-71.9785" className="w-full text-sm px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Video size={14} className="text-red-500" /> Videos YouTube</CardTitle></CardHeader>
        <CardContent>
          <YoutubeEditor videos={form.videos} onChange={videos => setForm(f => ({ ...f, videos }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Image size={14} className="text-pink-500" /> Fotos (Google Drive)</CardTitle></CardHeader>
        <CardContent>
          <PhotosEditor photos={form.photos} onChange={photos => setForm(f => ({ ...f, photos }))} />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MiPeruAdminPage() {
  const [view, setView]             = useState<View>('regions');
  const [regions, setRegions]       = useState<Region[]>([]);
  const [provinces, setProvinces]   = useState<Province[]>([]);
  const [districts, setDistricts]   = useState<any[]>([]);
  const [festivities, setFestivities] = useState<any[]>([]);
  const [cultures, setCultures]     = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedFestivity, setSelectedFestivity] = useState<string | null>(null);
  const [selectedCulture, setSelectedCulture]   = useState<string | null>(null);
  const [newFestDistrictId, setNewFestDistrictId] = useState<string | undefined>();
  const [syncing, setSyncing]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [toast, setToast]           = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  // Drill-down filters
  const [filterRegion, setFilterRegion] = useState<{id: string; name: string} | null>(null);
  const [filterProvince, setFilterProvince] = useState<{id: string; name: string} | null>(null);
  const [filterDistrict, setFilterDistrict] = useState<{id: string; name: string} | null>(null);

  const showToast = useCallback((msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load data by view
  useEffect(() => {
    setLoading(true);
    const fetches: Record<string, () => Promise<any>> = {
      regions:    () => apiClient.get('/admin/mi-peru/regions').then(r => setRegions(Array.isArray(r.data) ? r.data : (r.data?.data || []))),
      provinces:  () => apiClient.get('/admin/mi-peru/provinces').then(r => setProvinces(Array.isArray(r.data) ? r.data : (r.data?.data || []))),
      districts:  () => apiClient.get('/admin/mi-peru/districts').then(r => setDistricts(Array.isArray(r.data) ? r.data : (r.data?.data || []))),
      festivities:() => apiClient.get('/admin/mi-peru/festivities').then(r => setFestivities(Array.isArray(r.data) ? r.data : (r.data?.data || []))),
      cultures:   () => apiClient.get('/admin/mi-peru/cultures').then(r => setCultures(Array.isArray(r.data) ? r.data : (r.data?.data || []))),
    };
    const fn = fetches[view];
    if (fn) fn().catch(() => showToast('Error al cargar datos', 'err')).finally(() => setLoading(false));
    else setLoading(false);
  }, [view]);

  const syncDrive = async () => {
    setSyncing(true);
    try {
      await apiClient.post('/admin/mi-peru/sync');
      showToast('Google Drive sincronizado ✓', 'ok');
      // Reload current view data
      setView(v => v);
    } catch { showToast('Error al sincronizar Drive', 'err'); }
    finally { setSyncing(false); }
  };

  const deleteFestivity = async (id: string) => {
    if (!confirm('¿Eliminar esta festividad?')) return;
    try {
      await apiClient.delete(`/admin/mi-peru/festivities/${id}`);
      setFestivities(fs => fs.filter(f => f.id !== id));
      showToast('Festividad eliminada', 'ok');
    } catch { showToast('Error al eliminar', 'err'); }
  };

  // ── Tab bar ──────────────────────────────────────────────────────────────────
  const tabs: { id: View; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'regions',     label: 'Geografía',    icon: Globe2 },
    { id: 'cultures',    label: 'Culturas',     icon: Landmark },
  ];

  const topLevelViews = ['regions', 'cultures', 'provinces', 'districts', 'festivities'];
  const isEditView = !topLevelViews.includes(view);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-full space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <MapPin className="text-primary" size={22} /> Mi Perú
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestiona regiones, distritos, festividades, fotos de Drive y culturas</p>
        </div>
        <button
          onClick={syncDrive} disabled={syncing}
          id="btn-sync-drive"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/30 text-sm font-semibold hover:bg-muted/60 cursor-pointer disabled:opacity-60 transition-colors"
        >
          {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          Sincronizar Drive
        </button>
      </div>

      {/* Tabs (only show when not in edit view) */}
      {!isEditView && (
        <div className="flex gap-1 p-1 bg-muted/40 rounded-xl w-fit border border-border">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = view === tab.id || (tab.id === 'regions' && ['provinces', 'districts', 'festivities'].includes(view));
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Icon size={14} /> {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      {loading && !isEditView && (
        <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="animate-spin" size={18} /> Cargando...
        </div>
      )}

      {/* ── REGIONS ── */}
      {view === 'regions' && !loading && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setView('region-create')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer">
              <Plus size={16} /> Nueva Región
            </button>
          </div>
          <div className="border rounded-xl bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Provincias</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regions.map(r => (
                  <TableRow key={r.id}>
                    <TableCell><Globe2 size={15} className="text-primary" /></TableCell>
                    <TableCell className="font-semibold text-sm">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r.provinces.length} provincias</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setFilterRegion({ id: r.id, name: r.name }); setView('provinces'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 text-xs font-bold hover:bg-cyan-500/20 cursor-pointer"
                        >
                          <Building2 size={13} /> Ver Provincias
                        </button>
                        <button
                          onClick={() => { setSelectedRegion(r.id); setView('region-edit'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 cursor-pointer"
                        >
                          <SquarePen size={13} /> Editar
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {regions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      Sin datos. Sincroniza Drive primero.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── REGION EDIT ── */}
      {view === 'region-edit' && selectedRegion && (
        <RegionEditor id={selectedRegion} cultures={cultures} onBack={() => setView('regions')} onToast={showToast} />
      )}

      {/* ── REGION CREATE ── */}
      {view === 'region-create' && (
        <RegionCreator onBack={() => { setView('regions'); setSyncing(true); }} onToast={showToast} />
      )}

      {/* ── PROVINCES ── */}
      {view === 'provinces' && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => { setFilterRegion(null); setView('regions'); }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-bold hover:bg-muted/80 cursor-pointer">
              ← Volver a Regiones
            </button>
            {filterRegion && <span className="text-sm font-semibold text-muted-foreground">/ Provincias de {filterRegion.name}</span>}
          </div>
          <div className="border rounded-xl bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Distritos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filterRegion ? provinces.filter(p => p.region?.id === filterRegion.id) : provinces).map(p => (
                  <TableRow key={p.id}>
                    <TableCell><Building2 size={15} className="text-cyan-500" /></TableCell>
                    <TableCell className="font-semibold text-sm">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{p.districts.length} distritos</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setFilterProvince({ id: p.id, name: p.name }); setView('districts'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 text-xs font-bold hover:bg-cyan-500/20 cursor-pointer"
                        >
                          <MapPin size={13} /> Ver Distritos
                        </button>
                        <button
                          onClick={() => { setSelectedProvince(p.id); setView('province-edit'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 cursor-pointer"
                        >
                          <SquarePen size={13} /> Editar
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(filterRegion ? provinces.filter(p => p.region?.id === filterRegion.id) : provinces).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      Sin datos. Sincroniza Drive primero.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── PROVINCE EDIT ── */}
      {view === 'province-edit' && selectedProvince && (
        <ProvinceEditor id={selectedProvince} cultures={cultures} onBack={() => setView('provinces')} onToast={showToast} />
      )}

      {/* ── DISTRICTS LIST ── */}
      {view === 'districts' && !loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => { setFilterProvince(null); setView('provinces'); }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-bold hover:bg-muted/80 cursor-pointer">
              ← Volver a Provincias
            </button>
            {filterProvince && <span className="text-sm font-semibold text-muted-foreground">/ Distritos de {filterProvince.name}</span>}
          </div>
          <div className="border rounded-xl bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Métricas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filterProvince ? districts.filter(d => d.province?.id === filterProvince.id) : districts).map(d => (
                  <TableRow key={d.id}>
                    <TableCell><MapPin size={15} className="text-primary" /></TableCell>
                    <TableCell className="font-semibold text-sm">{d.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{d.province?.region?.name} → {d.province?.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{d._count?.festivities ?? 0} festividades · {d.photos?.length ?? 0} fotos</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setFilterDistrict({ id: d.id, name: d.name }); setView('festivities'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold hover:bg-amber-500/20 cursor-pointer"
                        >
                          <Sparkles size={13} /> Ver Festividades
                        </button>
                        <button
                          id={`btn-edit-district-${d.id}`}
                          onClick={() => { setSelectedDistrict(d.id); setView('district-edit'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 cursor-pointer"
                        >
                          <SquarePen size={13} /> Editar
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(filterProvince ? districts.filter(d => d.province?.id === filterProvince.id) : districts).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                      Sin datos. Sincroniza Drive primero.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── DISTRICT EDIT ── */}
      {view === 'district-edit' && selectedDistrict && (
        <DistrictEditor id={selectedDistrict} cultures={cultures} onBack={() => setView('districts')} onToast={showToast} />
      )}

      {/* ── FESTIVITIES LIST ── */}
      {view === 'festivities' && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => { setFilterDistrict(null); setView('districts'); }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs font-bold hover:bg-muted/80 cursor-pointer">
                ← Volver a Distritos
              </button>
              {filterDistrict && <span className="text-sm font-semibold text-muted-foreground">/ Festividades de {filterDistrict.name}</span>}
            </div>
            <button
              id="btn-new-festivity"
              onClick={() => { setSelectedFestivity(null); setNewFestDistrictId(filterDistrict?.id || districts[0]?.id); setView('festivity-edit'); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold cursor-pointer hover:bg-primary/90 shadow-md"
            >
              <Plus size={14} /> Nueva Festividad
            </button>
          </div>
          <div className="border rounded-xl bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Distrito</TableHead>
                  <TableHead>Métricas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filterDistrict ? festivities.filter(f => f.district?.id === filterDistrict.id) : festivities).map(f => (
                  <TableRow key={f.id}>
                    <TableCell><Sparkles size={15} className="text-amber-500" /></TableCell>
                    <TableCell className="font-semibold text-sm">{f.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{f.district?.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{f.youtubeVideos?.length ?? 0} videos · {f.images?.length ?? 0} fotos</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`btn-edit-festivity-${f.id}`}
                          onClick={() => { setSelectedFestivity(f.id); setView('festivity-edit'); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 cursor-pointer"
                        >
                          <SquarePen size={13} /> Editar
                        </button>
                        <button
                          id={`btn-delete-festivity-${f.id}`}
                          onClick={() => deleteFestivity(f.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(filterDistrict ? festivities.filter(f => f.district?.id === filterDistrict.id) : festivities).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                      Sin festividades registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ── FESTIVITY EDIT / CREATE ── */}
      {view === 'festivity-edit' && (
        <FestivityEditor
          id={selectedFestivity}
          districtId={newFestDistrictId}
          onBack={() => setView('festivities')}
          onToast={showToast}
        />
      )}

      {/* ── CULTURES LIST ── */}
      {view === 'cultures' && !loading && (
        <div className="border rounded-xl bg-card overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Métricas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cultures.map(c => (
                  <TableRow key={c.id}>
                    <TableCell><Landmark size={15} className="text-violet-500" /></TableCell>
                    <TableCell className="font-semibold text-sm">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{c._count?.districts ?? 0} distritos · {c._count?.products ?? 0} productos · {c.images?.length ?? 0} fotos</TableCell>
                    <TableCell className="text-right">
                      <button
                        id={`btn-edit-culture-${c.id}`}
                        onClick={() => { setSelectedCulture(c.id); setView('culture-edit'); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 cursor-pointer"
                      >
                        <SquarePen size={13} /> Editar
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {cultures.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      Sin culturas registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
        </div>
      )}

      {/* ── CULTURE EDIT ── */}
      {view === 'culture-edit' && selectedCulture && (
        <CultureEditor id={selectedCulture} onBack={() => setView('cultures')} onToast={showToast} />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
