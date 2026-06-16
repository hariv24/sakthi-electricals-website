import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  FileText, ChevronRight,
  Gauge, Shield, Zap, Cpu, BarChart2, Cable,
  Factory, Wrench, Activity, Sun, Wind, Package, Layers, Settings,
} from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import {
  getCatalogTree,
  findBySlugPath,
  getBreadcrumb,
  getAllSlugPaths,
  type CatalogNode,
} from '@/lib/catalog';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/* ── constants ──────────────────────────────────────────────────────────────── */

const MAX_PHOTOS = 8;
const PLACEHOLDER = '/placeholder-product.svg';

/* ── types ──────────────────────────────────────────────────────────────────── */

type AppItem = { icon: React.ReactNode; title: string; body: string };

/* ── static params ──────────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const root = await getCatalogTree();
  return getAllSlugPaths(root).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const root = await getCatalogTree();
  const node = findBySlugPath(root, slug);
  if (!node) return {};
  return { title: `${node.display} — Sakthi Electricals` };
}

/* ── helpers ────────────────────────────────────────────────────────────────── */

function imgUrl(relPath: string, img: string) {
  return encodeURI('/' + relPath + '/' + img);
}

function toYouTubeEmbed(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : '';
}

async function fetchDBData(nodeId: string) {
  try {
    const sb = await createSupabaseServerClient();
    const [{ data: specs }, { data: overview }, { data: apps }, { data: videos }, { data: images }] = await Promise.all([
      sb.from('product_specs').select('label,value').eq('node_id', nodeId).order('order_index'),
      sb.from('product_overview').select('heading,paragraph_1,paragraph_2').eq('node_id', nodeId).maybeSingle(),
      sb.from('product_applications').select('title,body,icon_name').eq('node_id', nodeId).order('order_index'),
      sb.from('product_videos').select('youtube_url').eq('node_id', nodeId).order('order_index').limit(1),
      sb.from('product_images').select('url').eq('node_id', nodeId).order('order_index'),
    ]);
    return {
      specs: specs?.length ? (specs as {label:string;value:string}[]).map(r => [r.label, r.value] as [string,string]) : null,
      overview: overview ?? null,
      apps: apps?.length ? (apps as {title:string;body:string;icon_name?:string}[]) : null,
      videoUrl: videos?.[0]?.youtube_url ?? null,
      images: images?.length ? (images as {url:string}[]).map(r => r.url) : null,
    };
  } catch {
    return null;
  }
}

function isUnlimited(slugPath: string[]) {
  return slugPath[0] === 'customer-requirement-designs';
}

/* ── Spec lookup ────────────────────────────────────────────────────────────── */

function getSpecRows(node: CatalogNode, slugPath: string[]): [string, string][] {
  const n = node.display.toUpperCase();
  const p = slugPath.join(' ').toLowerCase();

  if (n.includes('33 KV') && (n.includes(' CT') || (n.includes('OIL') && !n.includes(' PT')))) {
    return [
      ['Standard', 'IS 2705 Pt 3 / IEC 61869-2'],
      ['Rated System Voltage', '33 kV (Um = 36 kV)'],
      ['Basic Impulse Level', '170 kV (peak)'],
      ['Primary Current', '10 A – 1200 A'],
      ['Secondary Current', '5 A / 1 A'],
      ['Accuracy Class — Metering', '0.2, 0.5, 1.0'],
      ['Accuracy Class — Protection', '5P10, 5P20'],
      ['Burden', '5 VA – 30 VA'],
      ['Insulation', 'Epoxy resin cast / Oil-immersed'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (n.includes('11 KV') && (n.includes(' CT') || n.includes('OILCOOLED CT') || (n.includes('OIL') && !n.includes(' PT')))) {
    return [
      ['Standard', 'IS 2705 Pt 3 / IEC 61869-2'],
      ['Rated System Voltage', '11 kV (Um = 12 kV)'],
      ['Basic Impulse Level', '75 kV (peak)'],
      ['Primary Current', '10 A – 2000 A'],
      ['Secondary Current', '5 A / 1 A'],
      ['Accuracy Class — Metering', '0.2, 0.5, 1.0'],
      ['Accuracy Class — Protection', '5P10, 5P20'],
      ['Burden', '5 VA – 30 VA'],
      ['Insulation', 'Epoxy resin cast / Oil-immersed'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (n.includes('CT PT UNIT') || n.includes('METRING SET') || n.includes('METERING SET')) {
    return [
      ['Standard', 'IS 2705 / IS 3156 / CEA Metering Regulation'],
      ['Application', '11 kV HT Consumer Metering'],
      ['CT Ratio', 'As per TNEB sanction'],
      ['PT Ratio', '11000 / 110 V (or as sanctioned)'],
      ['CT Accuracy Class', '0.2S / 0.5S'],
      ['PT Accuracy Class', '0.2 / 0.5'],
      ['CT Burden', '5 VA – 15 VA'],
      ['PT Burden', '25 VA – 100 VA'],
      ['BIL', '75 kV (peak)'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (n.includes('33 KV') && n.includes(' PT')) {
    return [
      ['Standard', 'IS 3156 Pt 1–4 / IEC 61869-3'],
      ['Rated System Voltage', '33 kV (Um = 36 kV)'],
      ['Basic Impulse Level', '170 kV (peak)'],
      ['Turns Ratio', '33000/110 V or 33000/√3 ÷ 110/√3 V'],
      ['Accuracy Class — Metering', '0.2, 0.5, 1.0'],
      ['Accuracy Class — Protection', '3P'],
      ['Burden', '25 VA – 200 VA'],
      ['Insulation', 'Epoxy resin cast / Oil-immersed'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (n.includes('11 KV') && n.includes(' PT')) {
    return [
      ['Standard', 'IS 3156 Pt 1–4 / IEC 61869-3'],
      ['Rated System Voltage', '11 kV (Um = 12 kV)'],
      ['Basic Impulse Level', '75 kV (peak)'],
      ['Turns Ratio', '11000/110 V or 11000/√3 ÷ 110/√3 V'],
      ['Accuracy Class — Metering', '0.2, 0.5, 1.0'],
      ['Accuracy Class — Protection', '3P'],
      ['Burden', '10 VA – 100 VA'],
      ['Insulation', 'Epoxy resin cast'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (
    p.includes('low-voltage') || n.includes('RESIN CAST') || n.includes('PVC') ||
    n.includes('COTTON TYPE') || n.includes('RING TYPE') || n.includes('RECTANGULAR CT') ||
    n.includes('WPL CT') || n.includes('KERALA EB') || n.includes('TNEB SERVICE CT') ||
    n.includes('HEATING TRANSFORMER')
  ) {
    return [
      ['Standard', 'IS 2705 Pt 1 & 2 / IEC 61869-2'],
      ['System Voltage', 'Up to 1.1 kV'],
      ['Insulation', 'Epoxy resin cast / PVC tape'],
      ['Primary Current', '10 A – 3000 A'],
      ['Secondary Current', '5 A'],
      ['Accuracy Class — Metering', '0.2, 0.5, 1.0, 3'],
      ['Accuracy Class — Protection', '5P10, 10P10'],
      ['Burden', '1 VA – 30 VA'],
      ['Frequency', '50 Hz'],
      ['Custom ratios', 'Available on request'],
    ];
  }

  if (n.includes('VARIABLE') || n.includes('VARIAC')) {
    return [
      ['Type', 'Single / Three phase variable auto-transformer'],
      ['Core', 'Toroidal CRGO silicon steel'],
      ['Input Voltage', '230 V (1-ph) / 415 V (3-ph)'],
      ['Output Voltage', '0 – 270 V (1-ph) / 0 – 430 V (3-ph)'],
      ['Current Rating', '2 A – 260 A per phase'],
      ['Control', 'Rotary carbon brush on toroidal core'],
      ['Insulation Class', 'Class B / F'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (p.includes('auto-transformer') || n.includes('AUTO TRANSFORMER') || n.includes('STATER') || n.includes('STARTER')) {
    return [
      ['Standard', 'IS 5142'],
      ['Type', 'Three-phase auto-transformer starter'],
      ['Capacity', '5 kVA – 500 kVA'],
      ['Input Voltage', '415 V, 3-phase, 50 Hz'],
      ['Voltage Taps', '50%, 65%, 80% (standard)'],
      ['Duty', 'Short-time (motor starting)'],
      ['Insulation Class', 'Class F / H'],
      ['Core Material', 'CRGO silicon steel laminations'],
    ];
  }

  if (n.includes('HT') && n.includes('CONTROL')) {
    return [
      ['Standard', 'IS 5142 / IEC 61558'],
      ['Type', 'HT control transformer'],
      ['Primary Voltage', '11 kV / 33 kV'],
      ['Secondary Voltage', '110 V / 240 V (as per order)'],
      ['Capacity', '1 kVA – 25 kVA'],
      ['Insulation Class', 'Class F / H'],
      ['Core Material', 'CRGO silicon steel'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (p.includes('3-phase') || n.includes('3 - PHASE') || n.includes('THREE PHASE')) {
    return [
      ['Standard', 'IS 5142 / IEC 61558-2-2'],
      ['Type', 'Three-phase, dry-type / enclosure type'],
      ['Capacity', '500 VA – 50 kVA'],
      ['Input Voltage', '415 V, 3-phase, 50 Hz'],
      ['Output Voltage', '110 V / 48 V / 24 V (custom)'],
      ['Insulation Class', 'Class F / H'],
      ['Core Material', 'CRGO silicon steel'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (p.includes('1-phase') || p.includes('control-transformer') || n.includes('S-PH') || n.includes('1 - PHASE') || n.includes('DRY TYPE') || n.includes('ENCLOSURE TYPE') || n.includes('RESIN CAST TRANSFORMER')) {
    return [
      ['Standard', 'IS 5142 / IEC 61558-2-2'],
      ['Type', 'Single-phase, dry-type / resin cast / enclosure type'],
      ['Capacity', '100 VA – 10 kVA'],
      ['Input Voltage', '230 V / 415 V'],
      ['Output Voltage', '110 V / 48 V / 24 V (custom)'],
      ['Insulation Class', 'Class F / H'],
      ['Core Material', 'CRGO silicon steel'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (n.includes('APFC')) {
    return [
      ['Standard', 'IS 13947 / IEC 60831'],
      ['System Voltage', '415 V, 3-phase, 50 Hz'],
      ['Power Factor Range', '0.85 lag – 1.0'],
      ['Controller', 'Auto PFC relay, 12–16 steps'],
      ['Capacitor Switching', 'Contactor-based, stepped'],
      ['CT Input', '5 A secondary'],
      ['Harmonics Protection', 'Detuned reactors (optional)'],
      ['Enclosure', 'Sheet steel, powder coated, IP42'],
    ];
  }

  if (n.includes('ACB')) {
    return [
      ['Standard', 'IS 13947 / IEC 60947-2'],
      ['System Voltage', '415 V, 3-phase, 50 Hz'],
      ['Breaking Capacity', '25 kA – 65 kA (as per order)'],
      ['Protection', 'LSIG (Long, Short, Instantaneous, Ground fault)'],
      ['Busbar', 'Copper / aluminium, tropical grade'],
      ['Enclosure', 'Compartment type, IP42 / IP54'],
      ['Metering', 'Ammeter, voltmeter, energy meter'],
    ];
  }

  if (n.includes('HT METERING') || (n.includes('HT') && n.includes('SERVICE'))) {
    return [
      ['Standard', 'TNEB / CEA Metering Regulation'],
      ['Application', 'HT consumer metering (11 kV / 33 kV)'],
      ['CT Class', '0.2S (CPRI approved)'],
      ['PT Class', '0.2 (CPRI approved)'],
      ['Energy Meter', '3-phase, 4-wire, class 0.2S'],
      ['Enclosure', 'SS 304 / MS powder coated'],
      ['Protection', 'IP55 (outdoor) / IP42 (indoor)'],
      ['Sealing', 'Lead/wire seal for TNEB inspection'],
    ];
  }

  if (n.includes('LTCT') || n.includes('LT CT') || n.includes('LT SERVICE') || n.includes('SERVICE PANEL') || n.includes('COMPARTMENT')) {
    return [
      ['Standard', 'TNEB / CEA specification'],
      ['Application', 'LT consumer metering, 415 V'],
      ['CT', 'LTCT class 0.5 / 1.0, 5 A secondary'],
      ['Energy Meter', '3-phase, 4-wire digital'],
      ['Busbar', 'Copper, tinned'],
      ['Compartments', '3-compartment / 5-compartment (per TNEB spec)'],
      ['Enclosure', 'MS / SS 316, powder coated, IP55'],
      ['Sealing', 'Lead/wire seal for TNEB inspection'],
    ];
  }

  if (n.includes('SOLAR') || n.includes('NET-METR') || n.includes('NET METR')) {
    return [
      ['Standard', 'MNRE / TNEDCL / TNEB specification'],
      ['Application', 'Rooftop solar net metering connection'],
      ['System Voltage', '415 V, 3-phase / 230 V, 1-phase'],
      ['CT', 'Class 0.5, 5 A secondary (bidirectional)'],
      ['Energy Meter', 'Net meter (import/export), TOD type'],
      ['Anti-islanding', 'Per utility requirement'],
      ['Enclosure', 'Sheet steel, IP42 / IP55 outdoor'],
    ];
  }

  if (n.includes('DISTRIBUTION') || n.includes('POWER BOX') || n.includes('ERACTION') || n.includes('ARIAL') || n.includes('PLATE')) {
    return [
      ['Standard', 'IS 13947 / IEC 61439'],
      ['System Voltage', '415 V, 3-phase, 50 Hz'],
      ['Incoming', 'ACB / MCCB (as per SLD)'],
      ['Outgoing Circuits', 'MCCBs / MCBs / Isolators'],
      ['Busbar', 'Copper / aluminium, colour-coded'],
      ['Enclosure', 'MS sheet, powder coated, IP42'],
      ['Protection', 'Earth leakage, short-circuit'],
    ];
  }

  if (n.includes('EPOXY') || n.includes('INSULATOR')) {
    return [
      ['Standard', 'IEC 60168 / IS 5350'],
      ['Material', 'Cycloaliphatic epoxy resin'],
      ['Voltage Rating', '11 kV – 33 kV'],
      ['BIL', '75 kV – 170 kV (per voltage class)'],
      ['1-min Power Frequency Test', '28 kV (11kV) / 70 kV (33kV)'],
      ['Creepage Distance', 'Per IEC 60815 pollution class'],
      ['Colour', 'Light grey (RAL 7035)'],
      ['Application', 'Indoor / outdoor switchgear, busbars'],
    ];
  }

  if (n.includes('HEA')) {
    return [
      ['Type', 'High Efficiency Auto (HEA) transformer'],
      ['Standard', 'IS 5142 / IEC 61558'],
      ['Input Voltage', '415 V / 11 kV (as per order)'],
      ['Output Voltage', 'As per specification'],
      ['Capacity', 'As per order'],
      ['Core', 'CRGO silicon steel, cold-rolled'],
      ['Insulation Class', 'Class F / H'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (n.includes('CHOKE') || n.includes('REACTOR')) {
    return [
      ['Type', 'Air-core / iron-core choke (reactor)'],
      ['Application', 'Harmonic filtering, current limiting, motor control'],
      ['Voltage Rating', '415 V / 11 kV'],
      ['Inductance', 'As per order'],
      ['Current Rating', 'As per order'],
      ['Insulation Class', 'Class F / H'],
      ['Core', 'CRGO laminated / air-core'],
      ['Frequency', '50 Hz'],
    ];
  }

  if (n.includes('VIBRATORY') || n.includes('FEEDER')) {
    return [
      ['Type', 'Electromagnetic vibratory feeder'],
      ['Capacity', '50 kg/hr – 5000 kg/hr'],
      ['Trough Material', 'MS / SS 304 / SS 316'],
      ['Drive', 'Electromagnetic, spring-mounted'],
      ['Controller', 'Variable amplitude thyristor controller'],
      ['Mounting', 'Floor / frame mounted'],
      ['Frequency', '50 Hz (tuned to resonance)'],
      ['Material Handled', 'Bulk solids, powders, granules, tablets'],
    ];
  }

  if (n.includes('ENERGY AUDITING') || n.includes('MSME')) {
    return [
      ['Service', 'Energy audit for MSME manufacturers'],
      ['Scope', 'Load survey, power quality, tariff optimisation'],
      ['Standards', 'BEE (Bureau of Energy Efficiency) guidelines'],
      ['Instruments', 'Power analyser, clamp meter, thermal camera'],
      ['Deliverables', 'Audit report, savings recommendation, payback analysis'],
      ['Coverage', 'Tamil Nadu (Pudukkottai and surrounding districts)'],
    ];
  }

  if (n.includes('TEST BENCH') || n.includes('BENCHSE')) {
    return [
      ['Application', 'Electrical testing of transformers and instruments'],
      ['Test Types', 'Ratio, polarity, accuracy class, dielectric'],
      ['Voltage Range', '0 – 33 kV (HV section)'],
      ['Current Range', '0 – 3000 A (CT burden test)'],
      ['Standards', 'IS 2705 / IS 3156 / IEC 61869'],
      ['Reference Standard', 'CPRI-calibrated reference CT / PT'],
    ];
  }

  return [
    ['Standard', 'IS / IEC (as applicable)'],
    ['Primary Rating', 'As per order'],
    ['Secondary Rating', 'As per order'],
    ['Accuracy Class', 'As per order'],
    ['Burden', 'As per order'],
    ['Frequency', '50 Hz'],
    ['Custom specifications', 'Available on request'],
  ];
}

/* ── Applications lookup (4 per product) ───────────────────────────────────── */

function getApplications(node: CatalogNode, slugPath: string[]): AppItem[] {
  const n = node.display.toUpperCase();
  const p = slugPath.join(' ').toLowerCase();

  // ── HT Current Transformers (11kV / 33kV) ────────────────────
  if (p.includes('high-voltage') || (p.includes('current-transformer') && (n.includes('11 KV') || n.includes('33 KV') || n.includes('OIL') || n.includes('OILCOOLED') || p.includes('cast-resin-ht')))) {
    return [
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'HT Substations', body: 'Installed in 11 kV and 33 kV indoor and outdoor substations to feed metering and protection systems from high-voltage busbars.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Protection Relay Circuits', body: 'Drives over-current, earth fault, and differential relays protecting HT feeders, power transformers, and bus sections.' },
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'HT Consumer Metering (TNEB)', body: 'Used in CPRI-approved HT metering panels for accurate 3-phase energy billing of industrial and commercial HT consumers.' },
      { icon: <Cable size={26} strokeWidth={1.5} />, title: 'Grid Interconnection Points', body: 'Deployed at grid interconnection and HT feeder junction points for energy measurement and power flow monitoring.' },
    ];
  }

  // ── HT Potential Transformers ─────────────────────────────────
  if (n.includes(' PT') && (n.includes('11 KV') || n.includes('33 KV'))) {
    return [
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'HT Substation Metering', body: 'Provides stepped-down voltage signals to energy meters and protection relays in 11 kV and 33 kV substation panels.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Distance & Differential Protection', body: 'Supplies accurate voltage to distance relays, differential relays, and bus-zone protection schemes.' },
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'Revenue Metering (TNEB)', body: 'Used with CPRI-approved CT in HT metering cubicles for time-of-day (TOD) and maximum demand (MD) energy billing.' },
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Power Quality Monitoring', body: 'Connected to power quality analysers and SCADA systems for real-time voltage monitoring and harmonic measurement at HT buses.' },
    ];
  }

  // ── CT PT Metering Set ────────────────────────────────────────
  if (n.includes('CT PT UNIT') || n.includes('METRING SET') || n.includes('METERING SET')) {
    return [
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'HT Consumer Billing', body: 'Complete 11 kV metering set for TNEB HT service connections — CT and PT matched for 0.2S class billing accuracy.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'CEA Regulation Compliance', body: 'Manufactured and tested to meet CEA Metering Regulation 2006, mandatory for all HT consumers above 100 kW.' },
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Maximum Demand Monitoring', body: 'Provides current and voltage inputs to multi-function meters for MD recording and TOD tariff billing.' },
      { icon: <Cable size={26} strokeWidth={1.5} />, title: 'Substation Integration', body: 'Installed in HT metering cubicles, ring main units (RMUs), and compact secondary substations for grid-connected consumers.' },
    ];
  }

  // ── LT Current Transformers ───────────────────────────────────
  if (
    p.includes('low-voltage') || n.includes('RESIN CAST') || n.includes('PVC') ||
    n.includes('COTTON TYPE') || n.includes('RING TYPE') || n.includes('RECTANGULAR CT') ||
    n.includes('WPL CT') || n.includes('KERALA EB') || n.includes('TNEB SERVICE CT') ||
    n.includes('HEATING TRANSFORMER')
  ) {
    return [
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'TNEB LT Metering', body: 'Fitted in LT service panels for billing and energy measurement in consumer metering cubicles per CEA regulation.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Motor & Feeder Protection', body: 'Feeds protection relay inputs for thermal overload and earth fault detection in LT motor starters and feeder panels.' },
      { icon: <Layers size={26} strokeWidth={1.5} />, title: 'Distribution Boards & MCCs', body: 'Installed inside distribution boards and motor control centres to monitor feeder currents across manufacturing facilities.' },
      { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'MSME Energy Auditing', body: 'Clamped onto existing feeders during energy audits to measure load profiles and demand patterns for tariff optimisation.' },
    ];
  }

  // ── Variable Auto Transformer ─────────────────────────────────
  if (n.includes('VARIABLE') || n.includes('VARIAC')) {
    return [
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'Laboratory & Test Benches', body: 'Provides continuously variable AC voltage for component testing, calibration, and high-pot testing in R&D labs.' },
      { icon: <Settings size={26} strokeWidth={1.5} />, title: 'Industrial Process Heating', body: 'Adjusts heating element power in industrial ovens, furnaces, and soldering stations by controlling applied voltage smoothly.' },
      { icon: <Cpu size={26} strokeWidth={1.5} />, title: 'Speed & Dimming Control', body: 'Controls single-phase fan and motor speed, and lamp brightness in workshops, test setups, and lighting labs.' },
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Power Quality Testing', body: 'Used by power quality engineers to simulate voltage sag and swell conditions for equipment immunity and compliance testing.' },
    ];
  }

  // ── Auto Transformer (Starter) ────────────────────────────────
  if (p.includes('auto-transformer') || n.includes('AUTO TRANSFORMER') || n.includes('STATER') || n.includes('STARTER')) {
    return [
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'Reduced Voltage Motor Starting', body: 'Steps down supply voltage to 50–80% to limit starting current of large squirrel-cage induction motors where DOL is not permitted.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'Pumps & Compressors', body: 'Used to start high-inertia loads like centrifugal pumps, blowers, and air compressors in industrial plants and waterworks.' },
      { icon: <Wind size={26} strokeWidth={1.5} />, title: 'HVAC & Ventilation', body: 'Reduces starting torque and current surge for large HVAC fans, chillers, and cooling tower motors.' },
      { icon: <Cpu size={26} strokeWidth={1.5} />, title: 'Automatic Starter Panels', body: 'Integrated into automatic reduced-voltage starter panels with timers and contactors for fully automatic starting cycles.' },
    ];
  }

  // ── HT Control Transformers ───────────────────────────────────
  if (n.includes('HT') && n.includes('CONTROL')) {
    return [
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'HT Switchgear Control Supply', body: 'Steps down 11 kV or 33 kV to safe 110V/240V control supply for HT breaker trip coils, relays, and interlocking circuits.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Protection & Trip Circuits', body: 'Powers protection relay panels, trip circuits, and annunciator systems in 11 kV and 33 kV substations.' },
      { icon: <Cpu size={26} strokeWidth={1.5} />, title: 'Substation Automation', body: 'Supplies auxiliary power to RTUs, IEDs, and SCADA interfaces in automated 11 kV and 33 kV substations.' },
      { icon: <Layers size={26} strokeWidth={1.5} />, title: 'HT Panel Builders', body: 'Standard component for HT switchgear manufacturers, ring main unit (RMU) assemblies, and compact substation builders.' },
    ];
  }

  // ── LT Control Transformers (1-Phase, 3-Phase, Dry, Resin Cast, Enclosure) ──
  if (
    p.includes('control-transformer') || p.includes('1-phase') || p.includes('3-phase') ||
    n.includes('S-PH') || n.includes('1 - PHASE') || n.includes('3 - PHASE') ||
    n.includes('DRY TYPE') || n.includes('ENCLOSURE TYPE') || n.includes('RESIN CAST TRANSFORMER')
  ) {
    return [
      { icon: <Cpu size={26} strokeWidth={1.5} />, title: 'PLC & Automation Panels', body: 'Powers PLC racks, contactors, solenoid valves, and relay panels by stepping 415V mains to safe 110V or 24V control voltages.' },
      { icon: <Wrench size={26} strokeWidth={1.5} />, title: 'Motor Control Centres', body: 'Supplies 110V/48V control supply to motor starters, soft starters, and VFD bypass panels in LT switchgear assemblies.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Isolation & Surge Protection', body: 'Provides galvanic isolation between mains and low-voltage control circuits, protecting instruments from conducted voltage surges.' },
      { icon: <Layers size={26} strokeWidth={1.5} />, title: 'LT Panel Builders & OEMs', body: 'Standard component for LT switchgear manufacturers, MCC builders, and machine tool OEMs requiring isolated control supply.' },
    ];
  }

  // ── HEA Transformers ──────────────────────────────────────────
  if (n.includes('HEA')) {
    return [
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'Energy-Efficient Power Supply', body: 'Used where efficiency is critical — CRGO core minimises iron losses for 24/7 operation in industrial and utility applications.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'Industrial Plants', body: 'Powers auxiliary circuits, control panels, and LV distribution from medium-voltage mains with minimum heat and losses.' },
      { icon: <Cpu size={26} strokeWidth={1.5} />, title: 'Control & Automation Supply', body: 'Supplies stable isolated voltage to PLC racks, instrumentation, and SCADA systems requiring low-ripple power.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Isolation & EMI Protection', body: 'Provides galvanic isolation protecting sensitive electronics from HV transients and conducted electromagnetic interference.' },
    ];
  }

  // ── Chokes ────────────────────────────────────────────────────
  if (n.includes('CHOKE') || n.includes('REACTOR')) {
    return [
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Harmonic Filtering', body: 'Installed as line reactors at VFD inputs to reduce 5th and 7th harmonic currents and limit total harmonic distortion (THD).' },
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'Current Limiting', body: 'Limits fault current at the interconnection point in LT panels, reducing available fault level and protecting switchgear.' },
      { icon: <Cpu size={26} strokeWidth={1.5} />, title: 'VFD & Drive Protection', body: 'Protects variable frequency drives from voltage spikes, commutation notches, and high dv/dt from the upstream supply network.' },
      { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'APFC Panel Detuning', body: 'Used as detuned reactors in APFC banks to prevent harmonic resonance between capacitor banks and system impedance.' },
    ];
  }

  // ── APFC Panels ───────────────────────────────────────────────
  if (n.includes('APFC')) {
    return [
      { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'Power Factor Correction', body: 'Automatically maintains power factor above 0.95 lagging to avoid TNEB penalty charges on reactive energy billing.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'Industrial Plants', body: 'Installed at HT/LT incoming panels in textile mills, foundries, and pumping stations with large inductive motor loads.' },
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'Transformer kVA Reduction', body: 'Improves apparent power demand at the distribution transformer, reducing I²R feeder losses and cable heating.' },
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Harmonic Management', body: 'Detuned reactor-based banks suppress harmonic resonance in facilities with variable frequency drives and UPS systems.' },
    ];
  }

  // ── ACB Panels ────────────────────────────────────────────────
  if (n.includes('ACB')) {
    return [
      { icon: <Layers size={26} strokeWidth={1.5} />, title: 'Main Incoming Distribution', body: 'Acts as the main incomer for LT distribution boards, providing LSIG protection and metering for the entire facility.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'High Fault-Level Protection', body: 'Clears short-circuit faults with adjustable LSIG settings for selective coordination without tripping healthy circuits.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'Process Plants & Data Centres', body: 'Installed in LT substations, chemical plants, and data centres requiring high breaking capacity of 25–65 kA.' },
      { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'Demand Monitoring', body: 'Integrated ammeter, voltmeter, and energy meter provide real-time power data for demand management and billing.' },
    ];
  }

  // ── HT Metering Service Panels ────────────────────────────────
  if (n.includes('HT METERING') || (n.includes('HT') && n.includes('SERVICE'))) {
    return [
      { icon: <Cable size={26} strokeWidth={1.5} />, title: 'HT Consumer Billing (TNEB)', body: 'Houses CPRI-approved CT and PT for accurate 3-phase energy metering of industrial HT consumers above 100 kW.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Tamper-Proof Sealing', body: 'Lead-sealed compartments and lockable enclosures prevent unauthorised access, meeting TNEB anti-tampering requirements.' },
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'TOD & MD Energy Billing', body: 'Supports time-of-day metering with class 0.2S CTs and 0.5 PTs, fully compliant with CEA Metering Regulation 2006.' },
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Demand & Power Quality', body: 'Provides maximum demand and power factor inputs for TNEB billing, helping consumers avoid MD overshoot penalties.' },
    ];
  }

  // ── LTCT / LT Service Panels ──────────────────────────────────
  if (n.includes('LTCT') || n.includes('LT CT') || n.includes('LT SERVICE') || n.includes('SERVICE PANEL') || n.includes('COMPARTMENT') || n.includes('SS-316')) {
    return [
      { icon: <Cable size={26} strokeWidth={1.5} />, title: 'LT Consumer Metering (TNEB)', body: 'Provides the sealed metering point for LT CT-operated consumers above 80A in 3 or 5 compartment configurations.' },
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'Energy Measurement', body: 'Houses 3-phase 4-wire digital energy meter with LTCT class 0.5 CTs for precise import/export energy billing.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Tamper-Proof Enclosure', body: 'MS or SS 316 enclosure with TNEB seal provision ensures tamper-proof metering for agricultural and industrial consumers.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'Industry & Agriculture', body: 'Installed at LT service entry points for motors, irrigation pumps, compressors, and small to medium manufacturing units.' },
    ];
  }

  // ── Solar / Net Metering Panels ───────────────────────────────
  if (n.includes('SOLAR') || n.includes('NET-METR') || n.includes('NET METR')) {
    return [
      { icon: <Sun size={26} strokeWidth={1.5} />, title: 'Rooftop Solar Net Metering', body: 'Provides the bi-directional metering point for TNEB net-metering connections, recording solar export and grid import separately.' },
      { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'Export Energy Tracking', body: 'Monitors kWh exported to the TNEB grid for settlement under the net-metering tariff scheme.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Anti-Islanding Protection', body: 'Includes protection relay to disconnect solar generation during grid outage, complying with CEA and IEEE 1547 requirements.' },
      { icon: <Cable size={26} strokeWidth={1.5} />, title: 'Grid Synchronisation Point', body: 'Interface between rooftop inverter output and the TNEB distribution network for safe and compliant grid connection.' },
    ];
  }

  // ── Distribution / Power Box / Arial Plate / Cable Tray ──────
  if (n.includes('DISTRIBUTION') || n.includes('POWER BOX') || n.includes('ERACTION') || n.includes('ARIAL') || n.includes('PLATE')) {
    return [
      { icon: <Layers size={26} strokeWidth={1.5} />, title: 'LT Power Distribution', body: 'Distributes 415V incoming supply to multiple outgoing feeders through MCCBs, MCBs, and isolators.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Selective Fault Protection', body: 'MCCB-based protection on each outgoing feeder provides selective fault isolation without disturbing healthy circuits.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'Manufacturing Plants', body: 'Installed in textile mills, engineering shops, food processing units, and pump houses as main distribution boards.' },
      { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'Sub-Metering', body: 'Optional CT inputs and sub-meters allow energy monitoring of individual production lines or cost centre departments.' },
    ];
  }

  // ── Epoxy Insulators ──────────────────────────────────────────
  if (n.includes('EPOXY') || n.includes('INSULATOR')) {
    return [
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'HT Switchgear Busbars', body: 'Supports copper and aluminium busbars in 11 kV and 33 kV metal-clad switchgear panels, withstanding rated impulse voltages.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Isolators & Disconnectors', body: 'Used as post insulators in indoor/outdoor isolators, earthing switches, and gang-operated disconnectors.' },
      { icon: <Layers size={26} strokeWidth={1.5} />, title: 'Panel & Board Manufacturing', body: 'Standard component for LT and HT panel builders requiring reliable insulation for busbars, cable entry, and live parts.' },
      { icon: <Cable size={26} strokeWidth={1.5} />, title: 'Cable Termination Support', body: 'Supports and separates cables at termination points inside HT switchgear panels and transformer chambers.' },
    ];
  }

  // ── Vibratory Feeder ──────────────────────────────────────────
  if (n.includes('VIBRATORY') || n.includes('FEEDER')) {
    return [
      { icon: <Package size={26} strokeWidth={1.5} />, title: 'Pharmaceutical Manufacturing', body: 'Feeds tablets, capsules, and granules at controlled rates onto conveyors, tablet counters, and blister packing machines.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'Chemical & Powder Processing', body: 'Meters powders, crystals, and granular chemicals into reactors, mixers, and packaging lines with high accuracy and repeatability.' },
      { icon: <Layers size={26} strokeWidth={1.5} />, title: 'Food Processing', body: 'SS 304/316 troughs handle food-grade materials including sugar, salt, spices, and processed food ingredients hygienically.' },
      { icon: <Wrench size={26} strokeWidth={1.5} />, title: 'Engineering & Foundry', body: 'Feeds bulk raw materials like sand, grit, metal chips, and castings in foundries, machining shops, and engineering workshops.' },
    ];
  }

  // ── Energy Auditing ───────────────────────────────────────────
  if (n.includes('ENERGY AUDITING') || n.includes('MSME')) {
    return [
      { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'Load Survey & Demand Analysis', body: 'Measures electrical load profiles across shifts to identify peak demand, load imbalance, and energy wastage patterns.' },
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Power Quality Analysis', body: 'Detects harmonics, voltage sag/swell, power factor issues, and unbalance that increase energy bills and damage equipment.' },
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'Tariff Optimisation', body: 'Analyses TNEB tariff structure against actual consumption to recommend tariff category and contract demand adjustments.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'MSME Manufacturers', body: 'Focused on small and medium manufacturers in Tamil Nadu — identifies savings in motors, lighting, HVAC, and furnaces.' },
    ];
  }

  // ── Test Benches ──────────────────────────────────────────────
  if (n.includes('TEST BENCH') || n.includes('BENCHSE')) {
    return [
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Routine CT & PT Testing', body: 'Performs ratio, polarity, winding resistance, and insulation resistance tests per IS 2705/3156 for every outgoing unit.' },
      { icon: <Activity size={26} strokeWidth={1.5} />, title: 'Accuracy Class Verification', body: 'Verifies metering and protection accuracy class against a CPRI-calibrated reference standard CT or PT.' },
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'High Voltage Dielectric Testing', body: 'Applies power-frequency and impulse test voltages to verify insulation integrity of CT/PT and panel components.' },
      { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'Calibration & Traceability', body: 'Provides calibration traceability for all measuring instruments and transformers dispatched from the Sakthi facility.' },
    ];
  }

  // ── Customer Requirement Designs ──────────────────────────────
  if (n.includes('CUSTOMER REQUIREMENT') || p.includes('customer-requirement')) {
    return [
      { icon: <Zap size={26} strokeWidth={1.5} />, title: 'Non-Standard Ratios & Classes', body: 'Custom-wound CTs and PTs for unusual ratios not in standard catalogues — for railway traction, steel plants, and special utilities.' },
      { icon: <Factory size={26} strokeWidth={1.5} />, title: 'OEM & Export Orders', body: 'Manufactured to customer drawings and quality plans for OEM transformer manufacturers, EPC contractors, and overseas buyers.' },
      { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Revenue-Grade Special Classes', body: 'CT class 0.1 and 0.2S for power trading, state load despatch centres, and inter-utility settlement metering.' },
      { icon: <Cpu size={26} strokeWidth={1.5} />, title: 'Digital & IED Integration', body: 'Special low-power instrument transformer (LPIT) and Rogowski coil designs for direct integration with digital protection IEDs.' },
    ];
  }

  // ── Fallback for all other instrument transformer family pages ─
  return [
    { icon: <Gauge size={26} strokeWidth={1.5} />, title: 'Power Metering', body: 'Used in HT/LT metering installations for accurate measurement of energy consumption in utility and industrial connections.' },
    { icon: <Shield size={26} strokeWidth={1.5} />, title: 'Protection Relay Circuits', body: 'Provides isolated, scaled signals to protection relays for over-current, earth fault, and differential protection schemes.' },
    { icon: <Zap size={26} strokeWidth={1.5} />, title: 'Substation Installations', body: 'Installed in 11 kV and 33 kV substations to step down current and voltage to safe, measurable levels for instrumentation.' },
    { icon: <BarChart2 size={26} strokeWidth={1.5} />, title: 'Energy Auditing', body: 'Deployed in energy audit setups for MSME manufacturers to monitor demand, power factor, and consumption patterns.' },
  ];
}

/* ── SubfolderCard ──────────────────────────────────────────────────────────── */

function SubfolderCard({ node }: { node: CatalogNode }) {
  const href = '/products/' + node.slugPath.join('/');
  return (
    <Link
      href={href}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)', overflow: 'hidden', textDecoration: 'none',
        transition: 'transform 180ms var(--ease), box-shadow 180ms var(--ease), border-color 180ms var(--ease)',
      }}
      className="subfolder-card"
    >
      <span style={{
        display: 'block', aspectRatio: '16 / 10',
        background: 'var(--steel-50)', position: 'relative',
        overflow: 'hidden', borderBottom: '1px solid var(--border)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={node.coverImage ?? PLACEHOLDER}
          alt={node.display}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: 16 }}
        />
      </span>
      <span style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--fg1)', lineHeight: 1.25 }}>
          {node.display}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg3)' }}>
            {node.children.length > 0
              ? `${node.children.length} type${node.children.length !== 1 ? 's' : ''}`
              : 'View product'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: 'var(--se-red)' }}>
            View <ChevronRight size={13} />
          </span>
        </span>
      </span>
    </Link>
  );
}

/* ── PhotoGrid ──────────────────────────────────────────────────────────────── */

function PhotoGrid({ node, limit }: { node: CatalogNode; limit?: number }) {
  if (!node.images.length) return null;
  const images = limit ? node.images.slice(0, limit) : node.images;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
      {images.map(img => (
        <div key={img} style={{
          aspectRatio: '4 / 3', background: 'var(--steel-50)',
          border: '1px solid var(--border)', borderRadius: 8,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgUrl(node.relPath, img)} alt="" loading="lazy" decoding="async"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

/* ── Overview content lookup ────────────────────────────────────────────────── */

type OverviewContent = { heading: string; paragraphs: string[] };

function getOverview(node: CatalogNode, slugPath: string[]): OverviewContent {
  const n = node.display.toUpperCase();
  const p = slugPath.join(' ').toLowerCase();

  // ── 33 kV CT ─────────────────────────────────────────────────
  if (n.includes('33 KV') && (n.includes(' CT') || (n.includes('OIL') && !n.includes(' PT')))) {
    return {
      heading: 'Precision measurement at 33 kV — where billing accuracy is non-negotiable.',
      paragraphs: [
        'A 33 kV current transformer operates at the boundary between the high-voltage transmission network and the metering or protection system. Every ampere on the primary side must be reproduced on the 5A or 1A secondary with the exact ratio error and phase displacement demanded by the accuracy class — because errors here translate directly into revenue loss or missed fault detection. Sakthi manufactures 33 kV CTs in both epoxy resin cast (for indoor metalclad switchgear) and oil-cooled (for outdoor substations), with CPRI type test certificates covering metering classes 0.2 and 0.5 and protection classes 5P10 and 5P20.',
        'The oil-cooled design uses transformer-grade mineral oil per IS 335 for thermal management, housed in a robust mild steel tank with provision for oil level monitoring. Resin cast units use a cycloaliphatic epoxy encapsulation that eliminates oil handling, fire risk, and maintenance while meeting the 170 kV BIL requirement for the 33 kV (Um = 36 kV) voltage class. Both types are wound on toroidal CRGO silicon steel cores and tested for ratio, polarity, insulation resistance, and power-frequency voltage withstand before dispatch.',
      ],
    };
  }

  // ── 11 kV CT ─────────────────────────────────────────────────
  if (n.includes('11 KV') && (n.includes(' CT') || n.includes('OILCOOLED CT') || (n.includes('OIL') && !n.includes(' PT')))) {
    return {
      heading: 'The CT at the heart of every 11 kV substation metering and protection scheme.',
      paragraphs: [
        'At 11 kV — the most common HT distribution voltage in India — the current transformer is the interface between the live network and every instrument, relay, and energy meter connected to it. Its accuracy class determines billing precision; its protection class determines how fast a fault is detected and cleared. Sakthi manufactures 11 kV CTs in resin cast and oil-cooled construction to IS 2705 Part 3 and IEC 61869-2, with CPRI type test certificates for metering (0.2, 0.5, 1.0) and protection (5P10, 5P20) cores.',
        'Resin cast units are the standard choice for indoor switchgear rooms and metalclad panels — the solid epoxy encapsulation requires no maintenance, contains no oil, and handles the 75 kV BIL impulse requirement. Oil-cooled types are preferred for outdoor ring main units and transformer metering sets where higher thermal ratings or compact combined CT-PT assemblies are required. All units are wound on precision CRGO cores, routine-tested at our in-house facility, and dispatched with individual test certificates.',
      ],
    };
  }

  // ── CT PT Metering Set ────────────────────────────────────────
  if (n.includes('CT PT UNIT') || n.includes('METRING SET') || n.includes('METERING SET')) {
    return {
      heading: 'A matched CT-PT pair built for the exact accuracy TNEB billing demands.',
      paragraphs: [
        'An 11 kV CT-PT metering set is a matched pair of current transformer and potential transformer selected, assembled, and tested together for HT consumer billing per CEA Metering Regulation 2006. Both units carry CPRI approval — the CT at class 0.2S or 0.5S, the PT at class 0.2 or 0.5 — and their combined error characteristic determines the accuracy of every monthly electricity bill for the HT consumer. An error of even 0.5% on a 500 kW load accumulates to significant over- or under-billing across a year.',
        'Sakthi manufactures matched metering sets where the CT and PT ratios are selected together against the consumer\'s TNEB sanction order. The set is tested as a pair at our in-house facility with traceable reference standards, and a combined test certificate is issued. All sets are manufactured to TNEB HT metering panel specifications and are supplied with installation drawings and wiring diagrams for the panel builder.',
      ],
    };
  }

  // ── 33 kV PT ─────────────────────────────────────────────────
  if (n.includes('33 KV') && n.includes(' PT')) {
    return {
      heading: 'Accurate voltage measurement and isolation at 33 kV for metering and protection.',
      paragraphs: [
        'A 33 kV potential transformer reduces the system voltage from 33 kV (Um = 36 kV) to a standard 110V secondary for energy meters, protection relays, and power quality instruments. The metering core must reproduce the primary voltage ratio with tight error limits — class 0.2 or 0.5 — because voltage measurement errors compound with CT errors to affect both energy and reactive power billing. The protection core (class 3P) drives voltage elements in distance relays, under/over-voltage relays, and bus-zone protection schemes.',
        'Sakthi manufactures 33 kV PTs in resin cast and oil-cooled designs. The resin cast version uses cycloaliphatic epoxy encapsulation to meet the 170 kV BIL requirement for the 36 kV voltage class without oil, simplifying installation in indoor metalclad switchgear. The oil-cooled version is preferred for outdoor substations and locations with high ambient temperatures. All units are CPRI type-tested to IS 3156 Part 1–4 and IEC 61869-3.',
      ],
    };
  }

  // ── 11 kV PT ─────────────────────────────────────────────────
  if (n.includes('11 KV') && n.includes(' PT')) {
    return {
      heading: 'The voltage reference for every meter, relay, and analyser in the 11 kV switchgear.',
      paragraphs: [
        'A potential transformer at 11 kV provides a safe, accurately scaled replica of the primary voltage for energy metering, protection relays, and power quality monitors. The metering core — class 0.2 or 0.5 — feeds the voltage input of the energy meter and determines the accuracy of kWh and kVARh billing. The protection core — class 3P — supplies the voltage coils of over/under-voltage relays, directional relays, and synchro-check elements in the protection scheme.',
        'Sakthi manufactures 11 kV resin cast PTs to IS 3156 and IEC 61869-3 with a 75 kV BIL (Um = 12 kV). The solid epoxy encapsulation is maintenance-free, oil-free, and suitable for installation in any orientation inside metalclad switchgear panels and ring main units. Both single-phase and three-phase units are available, in star (residual voltage) and standard metering configurations. Every unit is tested for ratio accuracy, insulation resistance, and power-frequency voltage withstand before dispatch.',
      ],
    };
  }

  // ── LT Current Transformers ───────────────────────────────────
  if (
    p.includes('low-voltage') || n.includes('RESIN CAST') || n.includes('PVC') ||
    n.includes('COTTON TYPE') || n.includes('RING TYPE') || n.includes('RECTANGULAR CT') ||
    n.includes('WPL CT') || n.includes('KERALA EB') || n.includes('TNEB SERVICE CT') ||
    n.includes('HEATING TRANSFORMER')
  ) {
    return {
      heading: 'The LT current transformer — small in size, critical in function.',
      paragraphs: [
        'Low-tension current transformers operate at system voltages up to 1.1 kV and reduce high primary currents — anything from 10A to 3000A — to a standard 5A secondary for energy meters, protection relays, and panel instruments. Sakthi manufactures LT CTs in several construction types suited to different installation requirements: ring type (for passing a busbar or cable through the window), rectangular type (for flat copper busbar in switchboards), and WPL type (where the primary conductor is threaded through a window from the side). PVC tape and cotton tape wound types are produced for applications where resin cast construction is not required.',
        'All types are wound on toroidal CRGO silicon steel cores with low exciting current to minimise ratio error and phase displacement. Accuracy class (0.2 to 3 for metering, 5P10 and 10P10 for protection) and burden (1 VA to 30 VA) are selected at order stage to match the connected meter or relay. Every unit is routine-tested for ratio, polarity, insulation resistance, and power-frequency withstand to IS 2705 Part 1 & 2 before dispatch.',
      ],
    };
  }

  // ── Variable Auto Transformer ─────────────────────────────────
  if (n.includes('VARIABLE') || n.includes('VARIAC')) {
    return {
      heading: 'Stepless AC voltage control — from 0V to full output, with one dial.',
      paragraphs: [
        'A variable auto-transformer — commonly called a variac — uses a rotating carbon brush contact on a toroidal CRGO winding to tap off any fraction of the supply voltage as output. Unlike a fixed-ratio transformer, it gives the user continuous control from 0V up to 270V (single-phase) or 430V (three-phase) without the steps and dead-bands of a tap-changer. This makes it the standard tool for test benches, laboratory power supplies, heating element control, and any process where the exact applied voltage must be dialled in and held stable.',
        'Sakthi manufactures single and three-phase variacs on toroidal CRGO cores — the toroidal form minimises leakage flux and gives a more uniform regulation across the output range than a stack-type winding. The carbon brush is hardened for long contact life, and the winding is enamelled copper for low resistance and efficient operation. Rated current ranges from 2A to 260A per phase, with the thyristor-controlled version available for remote or programmatic voltage setting.',
      ],
    };
  }

  // ── Auto Transformer (Starter) ────────────────────────────────
  if (p.includes('auto-transformer') || n.includes('AUTO TRANSFORMER') || n.includes('STATER') || n.includes('STARTER')) {
    return {
      heading: 'Reduced-voltage starting for large motors — without the torque penalty of star-delta.',
      paragraphs: [
        'An auto-transformer starter reduces the voltage applied to a large squirrel-cage induction motor at start-up, limiting the inrush current that would otherwise stress the supply network, trip upstream protection, and cause voltage dips that affect other equipment. Standard taps at 50%, 65%, and 80% of supply voltage reduce starting current to 25%, 42%, and 64% of the DOL value respectively. Unlike a star-delta starter, the motor receives voltage from the transformer secondary — not from a re-wired winding — so it can develop full starting torque at any tap position. This makes auto-transformer starting the preferred choice for loaded conveyors, compressors, and high-inertia loads where star-delta starting torque is insufficient.',
        'Sakthi manufactures auto-transformer starters from 5 kVA to 500 kVA with open frame or enclosed construction, wound on CRGO laminated cores with Class F or H insulation. The starter is timed by a contactor-and-timer circuit — after a settable acceleration time, the circuit transitions to direct supply. Custom tap positions and panel-mounted automatic starters with ammeters and timers are available on request.',
      ],
    };
  }

  // ── HT Control Transformers ───────────────────────────────────
  if (n.includes('HT') && n.includes('CONTROL')) {
    return {
      heading: 'Local control supply straight from the 11 kV or 33 kV busbar — no LT auxiliary needed.',
      paragraphs: [
        'HT control transformers step the high-voltage supply directly from 11 kV or 33 kV busbars to 110V or 240V for powering trip coils, protection relays, annunciators, and auxiliary circuits in high-voltage switchgear. At locations where there is no separately derived LT supply — rural substations, ring main units, compact secondary substations — the HT control transformer is what keeps the protection and control system energised. It is a safety-critical component: if it fails, the circuit breaker cannot trip.',
        'Sakthi manufactures HT control transformers to IS 5142 and IEC 61558 with CRGO cores and Class F/H insulation, in ratings conservatively derated for continuous 24/7 duty in an unattended substation environment. The units are compact by design — space is always at a premium inside HT switchgear panels — and are constructed to withstand the vibration, temperature cycles, and occasional voltage transients that are normal inside an operating substation.',
      ],
    };
  }

  // ── 3-Phase Control Transformers ─────────────────────────────
  if (p.includes('3-phase') || n.includes('3 - PHASE')) {
    return {
      heading: 'Isolated three-phase control supply for large automation panels and MCCs.',
      paragraphs: [
        'Three-phase control transformers take the 415V mains supply and provide an isolated, reduced voltage for control circuits in motor control centres, process automation panels, and large machinery where the control system itself draws significant current. Unlike single-phase types, three-phase units handle the load of large PLC backplanes, multi-axis servo amplifiers, inverter cooling fans, and SCADA auxiliary power in one compact transformer, replacing multiple single-phase units and simplifying panel wiring.',
        'Sakthi manufactures three-phase control transformers from 500 VA to 50 kVA on CRGO laminated cores with Class F or H insulation, in both open dry-type (for panel builders) and enclosed construction (for direct mounting with IP protection). Custom primary/secondary voltage combinations and multiple secondary tapping arrangements are available for OEM machine tool manufacturers, automation system integrators, and switchgear panel builders who need exactly the output voltages their control system requires.',
      ],
    };
  }

  // ── 1-Phase Control Transformers ─────────────────────────────
  if (
    p.includes('1-phase') || p.includes('control-transformer') || n.includes('S-PH') ||
    n.includes('1 - PHASE') || n.includes('DRY TYPE') || n.includes('ENCLOSURE TYPE') ||
    n.includes('RESIN CAST TRANSFORMER')
  ) {
    return {
      heading: 'Safe, isolated control voltage for every relay, PLC input, and solenoid in the panel.',
      paragraphs: [
        'A single-phase control transformer steps down the mains supply to the control voltage that runs the logic of a machine or panel — typically 110V, 48V, or 24V AC. Every contactor coil, relay coil, PLC input module, solenoid valve, and indicator lamp in the panel draws current from this secondary winding. The transformer must hold its output voltage stable during the highest instantaneous load — the moment when multiple contactors energise simultaneously at machine start — and must handle the inrush current of contactor coils, which can be 10× their running current for the first few cycles.',
        'Sakthi manufactures single-phase control transformers from 100 VA to 10 kVA in three construction types: open frame dry-type for panel builders who need the most compact and economical unit; enclosure type for direct wall or panel mounting with basic IP protection; and resin cast for humid, dusty, or corrosive industrial environments where an open winding would quickly degrade. All types use CRGO laminated cores and Class F or H insulation, and are tested for insulation resistance and turns ratio before dispatch.',
      ],
    };
  }

  // ── HEA Transformers ──────────────────────────────────────────
  if (n.includes('HEA')) {
    return {
      heading: 'High-efficiency auxiliary power — because transformer losses run every hour of every day.',
      paragraphs: [
        'An auxiliary transformer runs continuously — 24 hours a day, 365 days a year — supplying power to the control systems, instrumentation, lighting, and cooling equipment of a substation or industrial plant. Unlike a distribution transformer that runs at variable load, an auxiliary transformer often runs near-constant load. Every watt of no-load (iron) loss in the core is a watt that burns continuously regardless of what the plant is doing. HEA (High Efficiency Auxiliary) transformers use cold-rolled grain-oriented silicon steel (CRGO) laminations processed to minimise hysteresis and eddy-current losses, giving significantly lower no-load losses than conventional hot-rolled core designs.',
        'Sakthi manufactures HEA transformers to IS 5142 and IEC 61558 in ratings and configurations specified by the customer\'s switchgear or plant engineer. Core joints are step-lapped to reduce reluctance and flux density at the corners. Winding is precision copper conductor with CRGO interleaving. Class F or H insulation is standard, with the option of resin impregnation for humid environments. The result is a transformer that runs cooler, lasts longer, and costs less to operate over its service life than a conventional design.',
      ],
    };
  }

  // ── Chokes ────────────────────────────────────────────────────
  if (n.includes('CHOKE') || n.includes('REACTOR')) {
    return {
      heading: 'Harmonic suppression and current limiting — the unsung protector of your LT network.',
      paragraphs: [
        'Variable frequency drives, UPS systems, and switched-mode power supplies all draw current in pulses rather than as a smooth sine wave. Those current pulses contain harmonics — primarily 5th and 7th order (250 Hz and 350 Hz in a 50 Hz system) — that flow back into the supply network, heating transformers and cables, causing nuisance relay trips, and interfering with metering and communications equipment. A line reactor (choke) connected in series at the drive input limits the rate of current rise, reducing the harmonic content in the drawn current by 30–50% without any tuning or maintenance.',
        'Sakthi manufactures iron-core chokes on CRGO laminated cores for 415V LT applications and air-core reactors for resonant filter circuits. The inductance, current rating, and percentage impedance are calculated from the drive rating and supply impedance — there is no single standard rating that suits every installation. Sakthi\'s engineering team will calculate the correct reactor specification from the VFD nameplate data and supply transformer impedance; contact us with these details for a quotation.',
      ],
    };
  }

  // ── APFC Panels ───────────────────────────────────────────────
  if (n.includes('APFC')) {
    return {
      heading: 'Stop paying for reactive power — APFC panels recover the cost of every kVAR.',
      paragraphs: [
        'Induction motors, welding machines, fluorescent and HID lighting, and most industrial loads draw reactive current (kVAR) in addition to the active current (kW) that does useful work. The reactive current flows through the supply transformer and cables, generating heat and voltage drop, but appearing in the bill as an inflated kVA demand and — in TNEB\'s tariff structure — as a direct surcharge when the monthly average power factor falls below 0.85. An APFC panel eliminates this by switching capacitor banks automatically to supply the reactive current locally, right at the point of consumption, so the transformer and mains only see active current.',
        'Sakthi\'s APFC panels use a microprocessor-based power factor controller relay to monitor the installation\'s power factor continuously and switch capacitor steps via contactors in 12 to 16 increments — fine enough to maintain power factor within 0.95–1.00 under varying load without hunting. Where the installation has significant variable-frequency drives or other non-linear loads, detuned reactor-capacitor banks are specified to avoid harmonic resonance between the capacitor bank and the supply impedance, which can cause capacitor failure and supply distortion.',
      ],
    };
  }

  // ── ACB Panels ────────────────────────────────────────────────
  if (n.includes('ACB')) {
    return {
      heading: 'The main incomer that protects every circuit downstream — with fully adjustable coordination.',
      paragraphs: [
        'An Air Circuit Breaker panel is the main switching and protection point for large LT installations — factories, hospitals, data centres, and commercial complexes where the incoming current exceeds the rating of an MCCB and the prospective fault current is in the range of 25 to 65 kA. The ACB\'s LSIG (Long-time, Short-time, Instantaneous, Ground-fault) trip unit has independently adjustable settings for each protection function, allowing the protection engineer to set the incomer\'s characteristics to coordinate with every downstream MCCB and MCB in the installation. A properly coordinated incomer trips only on faults that no downstream device can clear — protecting the entire installation without blacking out the whole facility for a minor fault.',
        'Sakthi assembles ACB panels with copper or aluminium busbars sized for the prospective short-circuit current, in compartment-type enclosures to IP42 or IP54 as required. The panel includes a full complement of metering — ammeter, voltmeter, power factor meter, and energy meter — so the facility manager has real-time visibility of the incoming supply. Protection, metering, and communications (Modbus RTU or BACnet) relay options are available for integration with building management or SCADA systems.',
      ],
    };
  }

  // ── HT Metering Service Panels ────────────────────────────────
  if (n.includes('HT METERING') || (n.includes('HT') && n.includes('SERVICE'))) {
    return {
      heading: 'The billing meter for every rupee of HT electricity consumed — built to TNEB specification.',
      paragraphs: [
        'An HT metering service panel houses the complete approved metering system for high-tension consumers billed at 11 kV or 33 kV — the CT, PT, energy meter, and all interconnecting wiring — in a sealed enclosure that the utility can inspect without accessing the energy supply circuit. The CT and PT carry individual CPRI type test certificates at the accuracy class mandated by CEA Metering Regulation 2006 (class 0.2S for the CT, class 0.2 for the PT for consumers above 1 MW). The energy meter is class 0.2S or 0.5S, with time-of-day recording for TOD tariff billing.',
        'Sakthi manufactures HT metering panels to TNEB specification with lead-sealed compartments and a sight glass for meter reading without breaking the seal. The enclosure material is MS powder-coated or SS 304 depending on the installation environment, and the IP rating is IP55 for outdoor metering cubicles. Every panel is tested for metering accuracy, insulation, and wiring continuity before dispatch, and the complete set — CT, PT, meter, and panel — is issued with a single commissioning test report.',
      ],
    };
  }

  // ── LTCT / LT Service Panels ──────────────────────────────────
  if (n.includes('LTCT') || n.includes('LT CT') || n.includes('LT SERVICE') || n.includes('SERVICE PANEL') || n.includes('COMPARTMENT') || n.includes('SS-316')) {
    return {
      heading: 'Sealed LT metering for consumers above 80A — built to TNEB\'s compartment specification.',
      paragraphs: [
        'When an LT consumer\'s load exceeds 80A, TNEB requires CT-operated metering rather than a direct-connection meter. The LT CT service panel provides this metering point in a multi-compartment enclosure that separates the CT chamber, meter chamber, and terminal chamber so that the utility can verify the metering at each TNEB inspection without opening the energy supply circuit. The three-compartment or five-compartment layout follows TNEB\'s standard specification, and each compartment is independently sealable for anti-tampering compliance.',
        'Sakthi manufactures LTCT service panels in MS powder-coated and SS 316 (marine grade for coastal or corrosive environments) enclosures, with copper tinned busbars, class 0.5 or 1.0 LTCTs, and a 3-phase 4-wire digital energy meter. The SS-316 grade panels are produced to the TNEB specification for corrosion-resistant installations and include all standard provisions for TNEB sealing, viewing windows, and inspection access. Panels are tested for wiring continuity and metering accuracy before dispatch.',
      ],
    };
  }

  // ── Solar / Net Metering Panels ───────────────────────────────
  if (n.includes('SOLAR') || n.includes('NET-METR') || n.includes('NET METR')) {
    return {
      heading: 'The grid connection point for your rooftop solar — metered, protected, and TNEB-approved.',
      paragraphs: [
        'A solar net metering panel is the interface between a rooftop solar inverter and the TNEB distribution network. It houses the bi-directional energy meter that records both the kWh imported from the grid (when solar generation is insufficient) and the kWh exported to the grid (when the solar system generates more than the building consumes). This import/export data is the basis for the net metering settlement — the consumer pays only for the net import, and excess export is credited at the feed-in tariff. The panel also includes anti-islanding protection, which disconnects the solar inverter from the grid within the required time if the grid supply fails, preventing the inverter from energising a dead feeder.',
        'Sakthi manufactures solar net metering panels to TNEB and TNEDCL interconnection standards for LT consumers (1-phase and 3-phase) and HT consumers with large rooftop installations. The enclosure includes provision for TNEB sealing of the meter compartment, surge protection on the incoming and inverter terminals, and a clearly labelled circuit diagram on the inside of the door. Panels are supplied with a wiring diagram and commissioning checklist to assist the electrical contractor at the grid interconnection inspection.',
      ],
    };
  }

  // ── Distribution / Power Box / Panels ────────────────────────
  if (n.includes('DISTRIBUTION') || n.includes('POWER BOX') || n.includes('ERACTION') || n.includes('ARIAL') || n.includes('PLATE')) {
    return {
      heading: 'From one incoming supply to every circuit in the building — distribution done right.',
      paragraphs: [
        'A distribution panel is where the incoming 415V supply is divided into the individual circuits that power every machine, lighting zone, socket outlet, and motor in a building or plant. Each outgoing feeder has its own MCCB, MCB, or isolator — sized for the load current and the downstream cable — so that a fault on any circuit is isolated by that feeder\'s device alone, without affecting the rest of the installation. The panel\'s busbar is sized for the prospective short-circuit current at the point of supply, and the incomer is coordinated with the utility\'s main fuse or incoming breaker to clear faults within the required disconnection time.',
        'Sakthi fabricates distribution panels to customer single-line diagrams, from simple pump house boards with three or four outgoing circuits to main distribution boards with 20+ feeders, sub-metering, and power quality meters. Enclosures are MS powder-coated or GI, busbars copper or aluminium, with all switchgear — MCCBs, MCBs, contactors, and earth leakage circuit breakers — from established brands. Every panel is tested for insulation resistance and wiring continuity before dispatch, with a wiring diagram and test certificate supplied.',
      ],
    };
  }

  // ── Epoxy Insulators ──────────────────────────────────────────
  if (n.includes('EPOXY') || n.includes('INSULATOR')) {
    return {
      heading: 'Electrical isolation you can rely on — moulded from material engineered for high voltage.',
      paragraphs: [
        'Epoxy resin insulators are the structural and electrical isolation components of HT switchgear — the parts that hold live busbars, cable terminations, and switch contacts in position while preventing current from flowing anywhere other than the intended path. The material is cycloaliphatic epoxy resin, chosen over conventional porcelain for its superior resistance to surface tracking (creep current along the surface in humid or polluted conditions), better mechanical strength-to-weight ratio, and the ability to be moulded into precise shapes that cannot be achieved in ceramic. Sakthi manufactures epoxy insulators for 11 kV and 33 kV voltage classes, with BIL ratings of 75 kV and 170 kV respectively, to IEC 60168 and IS 5350.',
        'The insulator profile — particularly the creepage distance (the surface path length from the live terminal to earth) — is designed to IEC 60815 pollution class requirements for the installation environment. A substation near a coastal area or cement plant requires a longer creepage distance than one in a clean industrial environment. Sakthi manufactures standard profiles for indoor and outdoor applications and can produce custom profiles for OEM switchgear builders. All insulators are routine-tested for power-frequency voltage withstand and visually inspected before dispatch.',
      ],
    };
  }

  // ── Vibratory Feeder ──────────────────────────────────────────
  if (n.includes('VIBRATORY') || n.includes('FEEDER')) {
    return {
      heading: 'Controlled material flow — no moving parts in contact with the product, no speed changes required.',
      paragraphs: [
        'A vibratory feeder conveys bulk materials along a trough by electromagnetic vibration — the drive coil energises at 50 Hz, causing the trough-spring assembly to vibrate at its mechanical resonant frequency. The material rides on this vibration, moving forward in small, rapid hops. Because the only drive element is an electromagnetic coil with no mechanical contact with the product, there are no gears, belts, or rollers to wear, jam, or contaminate the material being handled. Flow rate is controlled by adjusting the drive amplitude via a thyristor controller — continuously variable from near-zero to maximum without stopping or changing any mechanical setting.',
        'Sakthi designs vibratory feeders from first principles for each application — the spring stiffness, mass, and trough geometry are calculated to resonate at 50 Hz for the specific loaded weight. Capacity ranges from 50 kg/hr for fine pharmaceutical powders to 5000 kg/hr for bulk foundry materials. Trough material is mild steel for general industrial use, SS 304 for food-grade and chemical applications, and SS 316 for corrosive or marine-grade environments. The thyristor amplitude controller is supplied as standard, with remote setpoint input available for integration into a process control system.',
      ],
    };
  }

  // ── Energy Auditing ───────────────────────────────────────────
  if (n.includes('ENERGY AUDITING') || n.includes('MSME')) {
    return {
      heading: 'Find out exactly where your electricity bill comes from — and how much you can cut it.',
      paragraphs: [
        'For most MSME manufacturers, electricity is the second-largest operating cost after raw materials — and unlike raw material prices, electricity costs can be actively managed. An energy audit maps exactly what draws power in your plant, when it draws it, and whether that power is being used efficiently. It looks at your TNEB tariff structure and identifies whether you are in the right tariff category, whether your contract demand matches your actual demand, and whether your power factor is costing you a monthly surcharge. The output is not a generic checklist: it is a prioritised list of specific actions — with estimated investment, energy saving, and payback period for each — sized to your plant and your budget.',
        'Sakthi\'s energy auditing service covers electrical load profiling (logging current, voltage, power factor, and demand across shifts), power quality measurement (harmonics, voltage unbalance, sag/swell events), motor efficiency assessment, compressed air audit, and lighting review. We work with MSME manufacturers in Pudukkottai and across Tamil Nadu. The audit report is written in plain language — not engineering jargon — so you can act on the recommendations without needing a consultant to interpret them.',
      ],
    };
  }

  // ── Test Benches ──────────────────────────────────────────────
  if (n.includes('TEST BENCH') || n.includes('BENCHSE')) {
    return {
      heading: 'Every CT and PT tested before it leaves — not certified on paper, verified on the bench.',
      paragraphs: [
        'An electrical test bench for instrument transformers is not a single instrument — it is a system. Testing a current transformer requires a stable, adjustable high-current source, a precision burden to load the secondary, a reference standard CT with known accuracy, and a comparator to measure the difference in ratio and phase angle between the unit under test and the reference. Testing a potential transformer requires a high-voltage source, a precision voltage divider, and a similar comparison setup. Sakthi\'s in-house test facility covers both, with a high-current source to 3000A for CT testing and a high-voltage source to 33 kV for PT testing, calibrated reference standards traceable to NABL-accredited laboratories.',
        'Every instrument transformer that leaves Sakthi\'s production line passes through this bench: ratio test at 5%, 20%, 100%, and 120% of rated current or voltage; phase displacement check at each accuracy class burden point; insulation resistance measurement; and power-frequency voltage withstand. A test certificate with the actual measured ratio error and phase displacement at each test point is issued with every unit. For customers who specify witnessed factory acceptance testing, our engineers will schedule and conduct testing in the presence of the customer\'s representative.',
      ],
    };
  }

  // ── Customer Requirement Designs ──────────────────────────────
  if (n.includes('CUSTOMER REQUIREMENT') || p.includes('customer-requirement')) {
    return {
      heading: 'When the catalogue doesn\'t have what you need — we design it from scratch.',
      paragraphs: [
        'Most instrument transformer applications are covered by standard catalogue products. But some are not. A steel plant measuring 50 kA primary current needs a CT with a non-standard ratio. A power trading company needs a CT at class 0.1 accuracy — tighter than any standard metering class. An export order specifies IEC test voltages and terminal markings that differ from IS standards. An OEM switchgear builder needs a CT that fits a specific panel dimension not matched by any standard product. These are the applications that Sakthi\'s engineering team works on under Customer Requirement Designs.',
        'The process starts with the customer\'s specification sheet — ratio, accuracy class, burden, system voltage, BIL, insulation medium, mounting, applicable standard, and any dimensional constraints. Sakthi\'s engineers calculate the core cross-section, winding turns, wire gauge, and insulation schedule from first principles to meet that specification exactly, rather than adapting the nearest standard product. Prototype and volume manufacturing are both supported. Full documentation is issued with every order: design calculation sheet, material certificate, dimensional drawing, and individual test report to the specified standard.',
      ],
    };
  }

  // ── Fallback ──────────────────────────────────────────────────
  return {
    heading: 'Manufactured to standard. Tested before dispatch. Built to last.',
    paragraphs: [
      `Sakthi Electricals manufactures ${node.display} to the relevant IS and IEC standards at our production facility in Pudukkottai, Tamil Nadu. Every unit is tested on our in-house test bench before dispatch, and a test certificate is issued with each unit. Custom ratings, dimensions, and configurations are available — contact our engineering team with your specification.`,
      'All products are manufactured under our ISO 9001:2015 quality management system, with raw material traceability and documented production records maintained for every batch. CPRI type test reports are available for reference for all instrument transformer products.',
    ],
  };
}

/* ── Shared section components ──────────────────────────────────────────────── */

function OverviewSection({ node, slugPath, dbContent }: { node: CatalogNode; slugPath: string[]; dbContent?: { heading: string; paragraph_1: string; paragraph_2?: string | null } | null }) {
  const { heading, paragraphs } = dbContent
    ? { heading: dbContent.heading, paragraphs: [dbContent.paragraph_1, dbContent.paragraph_2].filter(Boolean) as string[] }
    : getOverview(node, slugPath);
  return (
    <div style={{ background: 'var(--steel-50)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="band">
        <div className="wrap-wide" style={{ maxWidth: 820 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>
            Overview
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
            {heading}
          </h2>
          {paragraphs.map((para, i) => (
            <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: i === 0 ? 16 : 15.5, color: i === 0 ? 'var(--fg1)' : 'var(--fg2)', lineHeight: 1.75, marginBottom: i < paragraphs.length - 1 ? 16 : 0 }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ApplicationsSection({ items }: { items: AppItem[] }) {
  return (
    <div className="band">
      <div className="wrap-wide">
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
            Where it&apos;s used
          </div>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Typical applications
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {items.map(app => (
            <div key={app.title as string} style={{
              background: '#fff', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '24px 22px 26px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ color: 'var(--se-red)', lineHeight: 1 }}>{app.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, color: 'var(--fg1)', marginBottom: 8 }}>{app.title as string}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg2)', lineHeight: 1.65, margin: 0 }}>{app.body as string}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Dark hero ──────────────────────────────────────────────────────────────── */

function DarkHero({
  node, crumbs, label, separatorStyle,
}: {
  node: CatalogNode;
  crumbs: { display: string; href: string }[];
  label: string;
  separatorStyle: CSSProperties;
}) {
  return (
    <section style={{
      background: 'var(--se-navy-900, #0a0716)', padding: '80px 0 56px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: .35,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
        backgroundSize: '56px 56px',
      }} />
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>Home</Link>
          {crumbs.map((c, i) => (
            <span key={c.href} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={separatorStyle}>/</span>
              {i === crumbs.length - 1 ? (
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,.9)' }}>{c.display}</span>
              ) : (
                <Link href={c.href} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none' }}>{c.display}</Link>
              )}
            </span>
          ))}
        </nav>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', color: 'var(--se-gold-300, #ffd466)', textTransform: 'uppercase', marginBottom: 12 }}>
          {label}
        </div>
        <h1 style={{ color: '#fff', fontSize: 'clamp(26px, 4vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.02em', maxWidth: '28ch', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          {node.display}
        </h1>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--se-red) 0%,var(--se-red) 38%,var(--se-gold,#FFC400) 38%,var(--se-gold,#FFC400) 50%,transparent 50%)' }} />
    </section>
  );
}

/* ── CTA band ───────────────────────────────────────────────────────────────── */

function CTABand() {
  return (
    <section className="band-tight band-ink" style={{ marginTop: 40 }}>
      <div className="wrap-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div className="eyebrow eb">Need a custom specification?</div>
          <h2 style={{ marginTop: 10 }}>Tell us your spec. We&apos;ll build to it.</h2>
          <p className="muted" style={{ marginTop: 8, maxWidth: '54ch' }}>
            Share your ratio, accuracy class, burden and standard — our engineering team will quote the right unit.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn btn-primary btn-lg"><FileText size={18} /> Request a quote</Link>
          <Link href="/contact" className="btn btn-on-dark btn-lg">Talk to engineering</Link>
        </div>
      </div>
    </section>
  );
}

/* ── Leaf product page ──────────────────────────────────────────────────────── */

function LeafProductPage({
  node, crumbs, separatorStyle, unlimited, slug,
  dbImages, dbSpecs, dbOverview, dbApps, dbVideoUrl,
}: {
  node: CatalogNode;
  crumbs: { display: string; href: string }[];
  separatorStyle: CSSProperties;
  unlimited: boolean;
  slug: string[];
  dbImages?: string[];
  dbSpecs?: [string, string][];
  dbOverview?: { heading: string; paragraph_1: string; paragraph_2?: string | null } | null;
  dbApps?: { title: string; body: string; icon_name?: string }[];
  dbVideoUrl?: string | null;
}) {
  const limit = unlimited ? undefined : MAX_PHOTOS;
  const fsImages = (limit ? node.images.slice(0, limit) : node.images).map(img => imgUrl(node.relPath, img));
  const galleryImages = (dbImages && dbImages.length > 0 ? dbImages : fsImages.length > 0 ? fsImages : [PLACEHOLDER]);
  const specRows: [string, string][] = dbSpecs && dbSpecs.length > 0 ? dbSpecs : getSpecRows(node, slug);
  const ICON_MAP: Record<string, React.ReactNode> = {
    Zap: <Zap size={26} strokeWidth={1.5}/>, Gauge: <Gauge size={26} strokeWidth={1.5}/>,
    Shield: <Shield size={26} strokeWidth={1.5}/>, BarChart2: <BarChart2 size={26} strokeWidth={1.5}/>,
    Cable: <Cable size={26} strokeWidth={1.5}/>, Factory: <Factory size={26} strokeWidth={1.5}/>,
    Wrench: <Wrench size={26} strokeWidth={1.5}/>, Cpu: <Cpu size={26} strokeWidth={1.5}/>,
    Activity: <Activity size={26} strokeWidth={1.5}/>, Sun: <Sun size={26} strokeWidth={1.5}/>,
    Layers: <Layers size={26} strokeWidth={1.5}/>, Settings: <Settings size={26} strokeWidth={1.5}/>,
    Package: <Package size={26} strokeWidth={1.5}/>, Wind: <Wind size={26} strokeWidth={1.5}/>,
  };
  const apps: AppItem[] = dbApps && dbApps.length > 0
    ? dbApps.map(a => ({ icon: ICON_MAP[a.icon_name ?? 'Zap'] ?? <Zap size={26} strokeWidth={1.5}/>, title: a.title, body: a.body }))
    : getApplications(node, slug);
  const embedUrl = dbVideoUrl ? toYouTubeEmbed(dbVideoUrl) : null;

  return (
    <>
      <main style={{ flex: 1 }}>

        <DarkHero node={node} crumbs={crumbs} label="Product" separatorStyle={separatorStyle} />

        {/* Block 1: Gallery LEFT | Specs RIGHT */}
        <div className="band">
          <div className="wrap-wide">
            <div style={{ display: 'grid', gridTemplateColumns: '55% 1fr', gap: 48, alignItems: 'start' }} className="product-detail-grid">

              {/* Left: hero image + optional video + thumbnails */}
              <div>
                <ProductGallery images={galleryImages} productName={node.display} embedUrl={embedUrl ?? undefined} />
              </div>

              {/* Right: specs table + CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', background: 'var(--steel-50)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                      Specifications
                    </div>
                  </div>
                  {specRows.map(([label, value]) => (
                    <div key={label} style={{ display: 'grid', gridTemplateColumns: '44% 56%', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ padding: '11px 16px', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg2)', borderRight: '1px solid var(--border)' }}>
                        {label}
                      </div>
                      <div style={{ padding: '11px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg1)' }}>
                        {value}
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 16px', background: 'rgba(216,24,24,.04)' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg3)', margin: 0 }}>
                      Exact specifications depend on the variant and order. Contact us for a detailed datasheet.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Block 2: Overview — full width */}
        <OverviewSection node={node} slugPath={slug} dbContent={dbOverview} />

        {/* Block 3: Applications — full width, 4 items */}
        <ApplicationsSection items={apps} />

        <CTABand />
      </main>
      <style>{`
        @media(max-width: 860px) { .product-detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

/* ── Folder (category) page ─────────────────────────────────────────────────── */

function FolderPageContent({
  node, crumbs, slug, separatorStyle, unlimited,
}: {
  node: CatalogNode;
  crumbs: { display: string; href: string }[];
  slug: string[];
  separatorStyle: CSSProperties;
  unlimited: boolean;
}) {
  const depthLabel = slug.length === 1 ? 'Product Family' : slug.length === 2 ? 'Category' : 'Sub-category';
  const apps = getApplications(node, slug);

  return (
    <>
      <main style={{ flex: 1 }}>

        <DarkHero node={node} crumbs={crumbs} label={depthLabel} separatorStyle={separatorStyle} />

        <div className="band" style={{ paddingTop: 40 }}>
          <div className="wrap-wide">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 20 }}>
              Browse by type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }} className="subfolder-grid">
              {node.children.map(child => (
                <SubfolderCard key={child.slugPath.join('/')} node={child} />
              ))}
            </div>

            {node.images.length > 0 && (
              <div style={{ marginTop: 48 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                  Images in this category
                </div>
                <PhotoGrid node={node} limit={unlimited ? undefined : MAX_PHOTOS} />
              </div>
            )}
          </div>
        </div>

        <ApplicationsSection items={apps} />
        <CTABand />
      </main>
      <style>{`
        .subfolder-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--border-strong) !important; }
        @media(max-width: 640px) { .subfolder-grid { grid-template-columns: 1fr 1fr !important; } }
        @media(max-width: 400px) { .subfolder-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}

/* ── Page entry point ───────────────────────────────────────────────────────── */

type DBSlice = { id: string; name: string; slug: string; is_leaf: boolean; cover_image_url: string | null };

function makeNode(n: DBSlice, path: string[], kids: CatalogNode[] = []): CatalogNode {
  return {
    name: n.name, display: n.name, slug: n.slug,
    slugPath: path, relPath: path.join('/'),
    images: [], coverImage: n.cover_image_url,
    totalImages: 0, children: kids,
  };
}

export default async function FolderPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const sb = await createSupabaseServerClient();

  // Traverse catalog_nodes by slug path — works for both existing and newly created nodes
  let parentId: string | null = null;
  const trail: DBSlice[] = [];
  for (const s of slug) {
    const { data } = (parentId !== null
      ? await sb.from('catalog_nodes').select('id,name,slug,is_leaf,cover_image_url').eq('slug', s).eq('parent_id', parentId).maybeSingle()
      : await sb.from('catalog_nodes').select('id,name,slug,is_leaf,cover_image_url').eq('slug', s).is('parent_id', null).maybeSingle()
    ) as { data: DBSlice | null };
    if (!data) notFound();
    trail.push(data);
    parentId = data.id;
  }

  const dbNode = trail[trail.length - 1];
  const crumbs = trail.map((t, i) => ({
    display: t.name,
    href: '/products/' + slug.slice(0, i + 1).join('/'),
  }));
  const unlimited = isUnlimited(slug);
  const separatorStyle: CSSProperties = { color: 'var(--fg3)', margin: '0 6px', fontSize: 13 };

  if (dbNode.is_leaf) {
    const db = await fetchDBData(dbNode.id);
    return (
      <LeafProductPage
        node={makeNode(dbNode, slug)} crumbs={crumbs} separatorStyle={separatorStyle}
        unlimited={unlimited} slug={slug}
        dbImages={db?.images ?? undefined}
        dbSpecs={db?.specs ?? undefined}
        dbOverview={db?.overview ?? undefined}
        dbApps={db?.apps ?? undefined}
        dbVideoUrl={db?.videoUrl ?? undefined}
      />
    );
  }

  // Folder: load direct children
  const { data: rawChildren } = await sb
    .from('catalog_nodes').select('id,name,slug,is_leaf,cover_image_url')
    .eq('parent_id', dbNode.id).order('order_index');
  const kids = (rawChildren ?? []) as DBSlice[];

  // Load grandchild counts in one query so subfolder cards show "N types"
  const kidIds = kids.map(k => k.id);
  const { data: gcRows } = kidIds.length
    ? await sb.from('catalog_nodes').select('parent_id').in('parent_id', kidIds)
    : { data: [] as { parent_id: string }[] };
  const gcCount = new Map<string, number>();
  for (const g of gcRows ?? []) gcCount.set(g.parent_id, (gcCount.get(g.parent_id) ?? 0) + 1);

  const childNodes: CatalogNode[] = kids.map(k =>
    makeNode(k, [...slug, k.slug], Array.from({ length: gcCount.get(k.id) ?? 0 }) as CatalogNode[])
  );

  return (
    <FolderPageContent
      node={makeNode(dbNode, slug, childNodes)}
      crumbs={crumbs} slug={slug} separatorStyle={separatorStyle} unlimited={unlimited}
    />
  );
}
