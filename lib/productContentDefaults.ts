/**
 * Default specs/overview/applications content, keyed by product name and
 * slug-path pattern matching. Used as a fallback on the public product page
 * when a product has no admin-entered content in the database, and as the
 * seed content for the one-time migration script that backfills the
 * database so these become editable per-product in the admin dashboard.
 */

export type ContentNode = { display: string; slugPath: string[] };

export type AppDefault = { title: string; body: string; icon_name: string };
export type OverviewDefault = { heading: string; paragraphs: string[] };

/* ── Spec lookup ────────────────────────────────────────────────────────────── */

export function getSpecRowsDefault(node: ContentNode): [string, string][] {
  const n = node.display.toUpperCase();
  const p = node.slugPath.join(' ').toLowerCase();

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

/* ── Applications lookup ───────────────────────────────────────────────────── */

export function getApplicationsDefault(node: ContentNode): AppDefault[] {
  const n = node.display.toUpperCase();
  const p = node.slugPath.join(' ').toLowerCase();

  if (p.includes('high-voltage') || (p.includes('current-transformer') && (n.includes('11 KV') || n.includes('33 KV') || n.includes('OIL') || n.includes('OILCOOLED') || p.includes('cast-resin-ht')))) {
    return [
      { icon_name: 'Zap', title: 'HT Substations', body: 'Installed in 11 kV and 33 kV indoor and outdoor substations to feed metering and protection systems from high-voltage busbars.' },
      { icon_name: 'Shield', title: 'Protection Relay Circuits', body: 'Drives over-current, earth fault, and differential relays protecting HT feeders, power transformers, and bus sections.' },
      { icon_name: 'Gauge', title: 'HT Consumer Metering (TNEB)', body: 'Used in CPRI-approved HT metering panels for accurate 3-phase energy billing of industrial and commercial HT consumers.' },
      { icon_name: 'Cable', title: 'Grid Interconnection Points', body: 'Deployed at grid interconnection and HT feeder junction points for energy measurement and power flow monitoring.' },
    ];
  }

  if (n.includes(' PT') && (n.includes('11 KV') || n.includes('33 KV'))) {
    return [
      { icon_name: 'Zap', title: 'HT Substation Metering', body: 'Provides stepped-down voltage signals to energy meters and protection relays in 11 kV and 33 kV substation panels.' },
      { icon_name: 'Shield', title: 'Distance & Differential Protection', body: 'Supplies accurate voltage to distance relays, differential relays, and bus-zone protection schemes.' },
      { icon_name: 'Gauge', title: 'Revenue Metering (TNEB)', body: 'Used with CPRI-approved CT in HT metering cubicles for time-of-day (TOD) and maximum demand (MD) energy billing.' },
      { icon_name: 'Activity', title: 'Power Quality Monitoring', body: 'Connected to power quality analysers and SCADA systems for real-time voltage monitoring and harmonic measurement at HT buses.' },
    ];
  }

  if (n.includes('CT PT UNIT') || n.includes('METRING SET') || n.includes('METERING SET')) {
    return [
      { icon_name: 'Gauge', title: 'HT Consumer Billing', body: 'Complete 11 kV metering set for TNEB HT service connections — CT and PT matched for 0.2S class billing accuracy.' },
      { icon_name: 'Shield', title: 'CEA Regulation Compliance', body: 'Manufactured and tested to meet CEA Metering Regulation 2006, mandatory for all HT consumers above 100 kW.' },
      { icon_name: 'Activity', title: 'Maximum Demand Monitoring', body: 'Provides current and voltage inputs to multi-function meters for MD recording and TOD tariff billing.' },
      { icon_name: 'Cable', title: 'Substation Integration', body: 'Installed in HT metering cubicles, ring main units (RMUs), and compact secondary substations for grid-connected consumers.' },
    ];
  }

  if (
    p.includes('low-voltage') || n.includes('RESIN CAST') || n.includes('PVC') ||
    n.includes('COTTON TYPE') || n.includes('RING TYPE') || n.includes('RECTANGULAR CT') ||
    n.includes('WPL CT') || n.includes('KERALA EB') || n.includes('TNEB SERVICE CT') ||
    n.includes('HEATING TRANSFORMER')
  ) {
    return [
      { icon_name: 'Gauge', title: 'TNEB LT Metering', body: 'Fitted in LT service panels for billing and energy measurement in consumer metering cubicles per CEA regulation.' },
      { icon_name: 'Shield', title: 'Motor & Feeder Protection', body: 'Feeds protection relay inputs for thermal overload and earth fault detection in LT motor starters and feeder panels.' },
      { icon_name: 'Layers', title: 'Distribution Boards & MCCs', body: 'Installed inside distribution boards and motor control centres to monitor feeder currents across manufacturing facilities.' },
      { icon_name: 'BarChart2', title: 'MSME Energy Auditing', body: 'Clamped onto existing feeders during energy audits to measure load profiles and demand patterns for tariff optimisation.' },
    ];
  }

  if (n.includes('VARIABLE') || n.includes('VARIAC')) {
    return [
      { icon_name: 'Gauge', title: 'Laboratory & Test Benches', body: 'Provides continuously variable AC voltage for component testing, calibration, and high-pot testing in R&D labs.' },
      { icon_name: 'Settings', title: 'Industrial Process Heating', body: 'Adjusts heating element power in industrial ovens, furnaces, and soldering stations by controlling applied voltage smoothly.' },
      { icon_name: 'Cpu', title: 'Speed & Dimming Control', body: 'Controls single-phase fan and motor speed, and lamp brightness in workshops, test setups, and lighting labs.' },
      { icon_name: 'Activity', title: 'Power Quality Testing', body: 'Used by power quality engineers to simulate voltage sag and swell conditions for equipment immunity and compliance testing.' },
    ];
  }

  if (p.includes('auto-transformer') || n.includes('AUTO TRANSFORMER') || n.includes('STATER') || n.includes('STARTER')) {
    return [
      { icon_name: 'Zap', title: 'Reduced Voltage Motor Starting', body: 'Steps down supply voltage to 50–80% to limit starting current of large squirrel-cage induction motors where DOL is not permitted.' },
      { icon_name: 'Factory', title: 'Pumps & Compressors', body: 'Used to start high-inertia loads like centrifugal pumps, blowers, and air compressors in industrial plants and waterworks.' },
      { icon_name: 'Wind', title: 'HVAC & Ventilation', body: 'Reduces starting torque and current surge for large HVAC fans, chillers, and cooling tower motors.' },
      { icon_name: 'Cpu', title: 'Automatic Starter Panels', body: 'Integrated into automatic reduced-voltage starter panels with timers and contactors for fully automatic starting cycles.' },
    ];
  }

  if (n.includes('HT') && n.includes('CONTROL')) {
    return [
      { icon_name: 'Zap', title: 'HT Switchgear Control Supply', body: 'Steps down 11 kV or 33 kV to safe 110V/240V control supply for HT breaker trip coils, relays, and interlocking circuits.' },
      { icon_name: 'Shield', title: 'Protection & Trip Circuits', body: 'Powers protection relay panels, trip circuits, and annunciator systems in 11 kV and 33 kV substations.' },
      { icon_name: 'Cpu', title: 'Substation Automation', body: 'Supplies auxiliary power to RTUs, IEDs, and SCADA interfaces in automated 11 kV and 33 kV substations.' },
      { icon_name: 'Layers', title: 'HT Panel Builders', body: 'Standard component for HT switchgear manufacturers, ring main unit (RMU) assemblies, and compact substation builders.' },
    ];
  }

  if (
    p.includes('control-transformer') || p.includes('1-phase') || p.includes('3-phase') ||
    n.includes('S-PH') || n.includes('1 - PHASE') || n.includes('3 - PHASE') ||
    n.includes('DRY TYPE') || n.includes('ENCLOSURE TYPE') || n.includes('RESIN CAST TRANSFORMER')
  ) {
    return [
      { icon_name: 'Cpu', title: 'PLC & Automation Panels', body: 'Powers PLC racks, contactors, solenoid valves, and relay panels by stepping 415V mains to safe 110V or 24V control voltages.' },
      { icon_name: 'Wrench', title: 'Motor Control Centres', body: 'Supplies 110V/48V control supply to motor starters, soft starters, and VFD bypass panels in LT switchgear assemblies.' },
      { icon_name: 'Shield', title: 'Isolation & Surge Protection', body: 'Provides galvanic isolation between mains and low-voltage control circuits, protecting instruments from conducted voltage surges.' },
      { icon_name: 'Layers', title: 'LT Panel Builders & OEMs', body: 'Standard component for LT switchgear manufacturers, MCC builders, and machine tool OEMs requiring isolated control supply.' },
    ];
  }

  if (n.includes('HEA')) {
    return [
      { icon_name: 'Zap', title: 'Energy-Efficient Power Supply', body: 'Used where efficiency is critical — CRGO core minimises iron losses for 24/7 operation in industrial and utility applications.' },
      { icon_name: 'Factory', title: 'Industrial Plants', body: 'Powers auxiliary circuits, control panels, and LV distribution from medium-voltage mains with minimum heat and losses.' },
      { icon_name: 'Cpu', title: 'Control & Automation Supply', body: 'Supplies stable isolated voltage to PLC racks, instrumentation, and SCADA systems requiring low-ripple power.' },
      { icon_name: 'Shield', title: 'Isolation & EMI Protection', body: 'Provides galvanic isolation protecting sensitive electronics from HV transients and conducted electromagnetic interference.' },
    ];
  }

  if (n.includes('CHOKE') || n.includes('REACTOR')) {
    return [
      { icon_name: 'Activity', title: 'Harmonic Filtering', body: 'Installed as line reactors at VFD inputs to reduce 5th and 7th harmonic currents and limit total harmonic distortion (THD).' },
      { icon_name: 'Zap', title: 'Current Limiting', body: 'Limits fault current at the interconnection point in LT panels, reducing available fault level and protecting switchgear.' },
      { icon_name: 'Cpu', title: 'VFD & Drive Protection', body: 'Protects variable frequency drives from voltage spikes, commutation notches, and high dv/dt from the upstream supply network.' },
      { icon_name: 'BarChart2', title: 'APFC Panel Detuning', body: 'Used as detuned reactors in APFC banks to prevent harmonic resonance between capacitor banks and system impedance.' },
    ];
  }

  if (n.includes('APFC')) {
    return [
      { icon_name: 'BarChart2', title: 'Power Factor Correction', body: 'Automatically maintains power factor above 0.95 lagging to avoid TNEB penalty charges on reactive energy billing.' },
      { icon_name: 'Factory', title: 'Industrial Plants', body: 'Installed at HT/LT incoming panels in textile mills, foundries, and pumping stations with large inductive motor loads.' },
      { icon_name: 'Zap', title: 'Transformer kVA Reduction', body: 'Improves apparent power demand at the distribution transformer, reducing I²R feeder losses and cable heating.' },
      { icon_name: 'Activity', title: 'Harmonic Management', body: 'Detuned reactor-based banks suppress harmonic resonance in facilities with variable frequency drives and UPS systems.' },
    ];
  }

  if (n.includes('ACB')) {
    return [
      { icon_name: 'Layers', title: 'Main Incoming Distribution', body: 'Acts as the main incomer for LT distribution boards, providing LSIG protection and metering for the entire facility.' },
      { icon_name: 'Shield', title: 'High Fault-Level Protection', body: 'Clears short-circuit faults with adjustable LSIG settings for selective coordination without tripping healthy circuits.' },
      { icon_name: 'Factory', title: 'Process Plants & Data Centres', body: 'Installed in LT substations, chemical plants, and data centres requiring high breaking capacity of 25–65 kA.' },
      { icon_name: 'BarChart2', title: 'Demand Monitoring', body: 'Integrated ammeter, voltmeter, and energy meter provide real-time power data for demand management and billing.' },
    ];
  }

  if (n.includes('HT METERING') || (n.includes('HT') && n.includes('SERVICE'))) {
    return [
      { icon_name: 'Cable', title: 'HT Consumer Billing (TNEB)', body: 'Houses CPRI-approved CT and PT for accurate 3-phase energy metering of industrial HT consumers above 100 kW.' },
      { icon_name: 'Shield', title: 'Tamper-Proof Sealing', body: 'Lead-sealed compartments and lockable enclosures prevent unauthorised access, meeting TNEB anti-tampering requirements.' },
      { icon_name: 'Gauge', title: 'TOD & MD Energy Billing', body: 'Supports time-of-day metering with class 0.2S CTs and 0.5 PTs, fully compliant with CEA Metering Regulation 2006.' },
      { icon_name: 'Activity', title: 'Demand & Power Quality', body: 'Provides maximum demand and power factor inputs for TNEB billing, helping consumers avoid MD overshoot penalties.' },
    ];
  }

  if (n.includes('LTCT') || n.includes('LT CT') || n.includes('LT SERVICE') || n.includes('SERVICE PANEL') || n.includes('COMPARTMENT') || n.includes('SS-316')) {
    return [
      { icon_name: 'Cable', title: 'LT Consumer Metering (TNEB)', body: 'Provides the sealed metering point for LT CT-operated consumers above 80A in 3 or 5 compartment configurations.' },
      { icon_name: 'Gauge', title: 'Energy Measurement', body: 'Houses 3-phase 4-wire digital energy meter with LTCT class 0.5 CTs for precise import/export energy billing.' },
      { icon_name: 'Shield', title: 'Tamper-Proof Enclosure', body: 'MS or SS 316 enclosure with TNEB seal provision ensures tamper-proof metering for agricultural and industrial consumers.' },
      { icon_name: 'Factory', title: 'Industry & Agriculture', body: 'Installed at LT service entry points for motors, irrigation pumps, compressors, and small to medium manufacturing units.' },
    ];
  }

  if (n.includes('SOLAR') || n.includes('NET-METR') || n.includes('NET METR')) {
    return [
      { icon_name: 'Sun', title: 'Rooftop Solar Net Metering', body: 'Provides the bi-directional metering point for TNEB net-metering connections, recording solar export and grid import separately.' },
      { icon_name: 'BarChart2', title: 'Export Energy Tracking', body: 'Monitors kWh exported to the TNEB grid for settlement under the net-metering tariff scheme.' },
      { icon_name: 'Shield', title: 'Anti-Islanding Protection', body: 'Includes protection relay to disconnect solar generation during grid outage, complying with CEA and IEEE 1547 requirements.' },
      { icon_name: 'Cable', title: 'Grid Synchronisation Point', body: 'Interface between rooftop inverter output and the TNEB distribution network for safe and compliant grid connection.' },
    ];
  }

  if (n.includes('DISTRIBUTION') || n.includes('POWER BOX') || n.includes('ERACTION') || n.includes('ARIAL') || n.includes('PLATE')) {
    return [
      { icon_name: 'Layers', title: 'LT Power Distribution', body: 'Distributes 415V incoming supply to multiple outgoing feeders through MCCBs, MCBs, and isolators.' },
      { icon_name: 'Shield', title: 'Selective Fault Protection', body: 'MCCB-based protection on each outgoing feeder provides selective fault isolation without disturbing healthy circuits.' },
      { icon_name: 'Factory', title: 'Manufacturing Plants', body: 'Installed in textile mills, engineering shops, food processing units, and pump houses as main distribution boards.' },
      { icon_name: 'BarChart2', title: 'Sub-Metering', body: 'Optional CT inputs and sub-meters allow energy monitoring of individual production lines or cost centre departments.' },
    ];
  }

  if (n.includes('EPOXY') || n.includes('INSULATOR')) {
    return [
      { icon_name: 'Zap', title: 'HT Switchgear Busbars', body: 'Supports copper and aluminium busbars in 11 kV and 33 kV metal-clad switchgear panels, withstanding rated impulse voltages.' },
      { icon_name: 'Shield', title: 'Isolators & Disconnectors', body: 'Used as post insulators in indoor/outdoor isolators, earthing switches, and gang-operated disconnectors.' },
      { icon_name: 'Layers', title: 'Panel & Board Manufacturing', body: 'Standard component for LT and HT panel builders requiring reliable insulation for busbars, cable entry, and live parts.' },
      { icon_name: 'Cable', title: 'Cable Termination Support', body: 'Supports and separates cables at termination points inside HT switchgear panels and transformer chambers.' },
    ];
  }

  if (n.includes('VIBRATORY') || n.includes('FEEDER')) {
    return [
      { icon_name: 'Package', title: 'Pharmaceutical Manufacturing', body: 'Feeds tablets, capsules, and granules at controlled rates onto conveyors, tablet counters, and blister packing machines.' },
      { icon_name: 'Factory', title: 'Chemical & Powder Processing', body: 'Meters powders, crystals, and granular chemicals into reactors, mixers, and packaging lines with high accuracy and repeatability.' },
      { icon_name: 'Layers', title: 'Food Processing', body: 'SS 304/316 troughs handle food-grade materials including sugar, salt, spices, and processed food ingredients hygienically.' },
      { icon_name: 'Wrench', title: 'Engineering & Foundry', body: 'Feeds bulk raw materials like sand, grit, metal chips, and castings in foundries, machining shops, and engineering workshops.' },
    ];
  }

  if (n.includes('ENERGY AUDITING') || n.includes('MSME')) {
    return [
      { icon_name: 'BarChart2', title: 'Load Survey & Demand Analysis', body: 'Measures electrical load profiles across shifts to identify peak demand, load imbalance, and energy wastage patterns.' },
      { icon_name: 'Activity', title: 'Power Quality Analysis', body: 'Detects harmonics, voltage sag/swell, power factor issues, and unbalance that increase energy bills and damage equipment.' },
      { icon_name: 'Gauge', title: 'Tariff Optimisation', body: 'Analyses TNEB tariff structure against actual consumption to recommend tariff category and contract demand adjustments.' },
      { icon_name: 'Factory', title: 'MSME Manufacturers', body: 'Focused on small and medium manufacturers in Tamil Nadu — identifies savings in motors, lighting, HVAC, and furnaces.' },
    ];
  }

  if (n.includes('TEST BENCH') || n.includes('BENCHSE')) {
    return [
      { icon_name: 'Shield', title: 'Routine CT & PT Testing', body: 'Performs ratio, polarity, winding resistance, and insulation resistance tests per IS 2705/3156 for every outgoing unit.' },
      { icon_name: 'Activity', title: 'Accuracy Class Verification', body: 'Verifies metering and protection accuracy class against a CPRI-calibrated reference standard CT or PT.' },
      { icon_name: 'Zap', title: 'High Voltage Dielectric Testing', body: 'Applies power-frequency and impulse test voltages to verify insulation integrity of CT/PT and panel components.' },
      { icon_name: 'Gauge', title: 'Calibration & Traceability', body: 'Provides calibration traceability for all measuring instruments and transformers dispatched from the Sakthi facility.' },
    ];
  }

  if (n.includes('CUSTOMER REQUIREMENT') || p.includes('customer-requirement')) {
    return [
      { icon_name: 'Zap', title: 'Non-Standard Ratios & Classes', body: 'Custom-wound CTs and PTs for unusual ratios not in standard catalogues — for railway traction, steel plants, and special utilities.' },
      { icon_name: 'Factory', title: 'OEM & Export Orders', body: 'Manufactured to customer drawings and quality plans for OEM transformer manufacturers, EPC contractors, and overseas buyers.' },
      { icon_name: 'Shield', title: 'Revenue-Grade Special Classes', body: 'CT class 0.1 and 0.2S for power trading, state load despatch centres, and inter-utility settlement metering.' },
      { icon_name: 'Cpu', title: 'Digital & IED Integration', body: 'Special low-power instrument transformer (LPIT) and Rogowski coil designs for direct integration with digital protection IEDs.' },
    ];
  }

  return [
    { icon_name: 'Gauge', title: 'Power Metering', body: 'Used in HT/LT metering installations for accurate measurement of energy consumption in utility and industrial connections.' },
    { icon_name: 'Shield', title: 'Protection Relay Circuits', body: 'Provides isolated, scaled signals to protection relays for over-current, earth fault, and differential protection schemes.' },
    { icon_name: 'Zap', title: 'Substation Installations', body: 'Installed in 11 kV and 33 kV substations to step down current and voltage to safe, measurable levels for instrumentation.' },
    { icon_name: 'BarChart2', title: 'Energy Auditing', body: 'Deployed in energy audit setups for MSME manufacturers to monitor demand, power factor, and consumption patterns.' },
  ];
}

/* ── Overview lookup ────────────────────────────────────────────────────────── */

export function getOverviewDefault(node: ContentNode): OverviewDefault {
  const n = node.display.toUpperCase();
  const p = node.slugPath.join(' ').toLowerCase();

  if (n.includes('33 KV') && (n.includes(' CT') || (n.includes('OIL') && !n.includes(' PT')))) {
    return {
      heading: 'Precision measurement at 33 kV — where billing accuracy is non-negotiable.',
      paragraphs: [
        'A 33 kV current transformer operates at the boundary between the high-voltage transmission network and the metering or protection system. Every ampere on the primary side must be reproduced on the 5A or 1A secondary with the exact ratio error and phase displacement demanded by the accuracy class — because errors here translate directly into revenue loss or missed fault detection. Sakthi manufactures 33 kV CTs in both epoxy resin cast (for indoor metalclad switchgear) and oil-cooled (for outdoor substations), with CPRI type test certificates covering metering classes 0.2 and 0.5 and protection classes 5P10 and 5P20.',
        'The oil-cooled design uses transformer-grade mineral oil per IS 335 for thermal management, housed in a robust mild steel tank with provision for oil level monitoring. Resin cast units use a cycloaliphatic epoxy encapsulation that eliminates oil handling, fire risk, and maintenance while meeting the 170 kV BIL requirement for the 33 kV (Um = 36 kV) voltage class. Both types are wound on toroidal CRGO silicon steel cores and tested for ratio, polarity, insulation resistance, and power-frequency voltage withstand before dispatch.',
      ],
    };
  }

  if (n.includes('11 KV') && (n.includes(' CT') || n.includes('OILCOOLED CT') || (n.includes('OIL') && !n.includes(' PT')))) {
    return {
      heading: 'The CT at the heart of every 11 kV substation metering and protection scheme.',
      paragraphs: [
        'At 11 kV — the most common HT distribution voltage in India — the current transformer is the interface between the live network and every instrument, relay, and energy meter connected to it. Its accuracy class determines billing precision; its protection class determines how fast a fault is detected and cleared. Sakthi manufactures 11 kV CTs in resin cast and oil-cooled construction to IS 2705 Part 3 and IEC 61869-2, with CPRI type test certificates for metering (0.2, 0.5, 1.0) and protection (5P10, 5P20) cores.',
        'Resin cast units are the standard choice for indoor switchgear rooms and metalclad panels — the solid epoxy encapsulation requires no maintenance, contains no oil, and handles the 75 kV BIL impulse requirement. Oil-cooled types are preferred for outdoor ring main units and transformer metering sets where higher thermal ratings or compact combined CT-PT assemblies are required. All units are wound on precision CRGO cores, routine-tested at our in-house facility, and dispatched with individual test certificates.',
      ],
    };
  }

  if (n.includes('CT PT UNIT') || n.includes('METRING SET') || n.includes('METERING SET')) {
    return {
      heading: 'A matched CT-PT pair built for the exact accuracy TNEB billing demands.',
      paragraphs: [
        'An 11 kV CT-PT metering set is a matched pair of current transformer and potential transformer selected, assembled, and tested together for HT consumer billing per CEA Metering Regulation 2006. Both units carry CPRI approval — the CT at class 0.2S or 0.5S, the PT at class 0.2 or 0.5 — and their combined error characteristic determines the accuracy of every monthly electricity bill for the HT consumer. An error of even 0.5% on a 500 kW load accumulates to significant over- or under-billing across a year.',
        'Sakthi manufactures matched metering sets where the CT and PT ratios are selected together against the consumer\'s TNEB sanction order. The set is tested as a pair at our in-house facility with traceable reference standards, and a combined test certificate is issued. All sets are manufactured to TNEB HT metering panel specifications and are supplied with installation drawings and wiring diagrams for the panel builder.',
      ],
    };
  }

  if (n.includes('33 KV') && n.includes(' PT')) {
    return {
      heading: 'Accurate voltage measurement and isolation at 33 kV for metering and protection.',
      paragraphs: [
        'A 33 kV potential transformer reduces the system voltage from 33 kV (Um = 36 kV) to a standard 110V secondary for energy meters, protection relays, and power quality instruments. The metering core must reproduce the primary voltage ratio with tight error limits — class 0.2 or 0.5 — because voltage measurement errors compound with CT errors to affect both energy and reactive power billing. The protection core (class 3P) drives voltage elements in distance relays, under/over-voltage relays, and bus-zone protection schemes.',
        'Sakthi manufactures 33 kV PTs in resin cast and oil-cooled designs. The resin cast version uses cycloaliphatic epoxy encapsulation to meet the 170 kV BIL requirement for the 36 kV voltage class without oil, simplifying installation in indoor metalclad switchgear. The oil-cooled version is preferred for outdoor substations and locations with high ambient temperatures. All units are CPRI type-tested to IS 3156 Part 1–4 and IEC 61869-3.',
      ],
    };
  }

  if (n.includes('11 KV') && n.includes(' PT')) {
    return {
      heading: 'The voltage reference for every meter, relay, and analyser in the 11 kV switchgear.',
      paragraphs: [
        'A potential transformer at 11 kV provides a safe, accurately scaled replica of the primary voltage for energy metering, protection relays, and power quality monitors. The metering core — class 0.2 or 0.5 — feeds the voltage input of the energy meter and determines the accuracy of kWh and kVARh billing. The protection core — class 3P — supplies the voltage coils of over/under-voltage relays, directional relays, and synchro-check elements in the protection scheme.',
        'Sakthi manufactures 11 kV resin cast PTs to IS 3156 and IEC 61869-3 with a 75 kV BIL (Um = 12 kV). The solid epoxy encapsulation is maintenance-free, oil-free, and suitable for installation in any orientation inside metalclad switchgear panels and ring main units. Both single-phase and three-phase units are available, in star (residual voltage) and standard metering configurations. Every unit is tested for ratio accuracy, insulation resistance, and power-frequency voltage withstand before dispatch.',
      ],
    };
  }

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

  if (n.includes('VARIABLE') || n.includes('VARIAC')) {
    return {
      heading: 'Stepless AC voltage control — from 0V to full output, with one dial.',
      paragraphs: [
        'A variable auto-transformer — commonly called a variac — uses a rotating carbon brush contact on a toroidal CRGO winding to tap off any fraction of the supply voltage as output. Unlike a fixed-ratio transformer, it gives the user continuous control from 0V up to 270V (single-phase) or 430V (three-phase) without the steps and dead-bands of a tap-changer. This makes it the standard tool for test benches, laboratory power supplies, heating element control, and any process where the exact applied voltage must be dialled in and held stable.',
        'Sakthi manufactures single and three-phase variacs on toroidal CRGO cores — the toroidal form minimises leakage flux and gives a more uniform regulation across the output range than a stack-type winding. The carbon brush is hardened for long contact life, and the winding is enamelled copper for low resistance and efficient operation. Rated current ranges from 2A to 260A per phase, with the thyristor-controlled version available for remote or programmatic voltage setting.',
      ],
    };
  }

  if (p.includes('auto-transformer') || n.includes('AUTO TRANSFORMER') || n.includes('STATER') || n.includes('STARTER')) {
    return {
      heading: 'Reduced-voltage starting for large motors — without the torque penalty of star-delta.',
      paragraphs: [
        'An auto-transformer starter reduces the voltage applied to a large squirrel-cage induction motor at start-up, limiting the inrush current that would otherwise stress the supply network, trip upstream protection, and cause voltage dips that affect other equipment. Standard taps at 50%, 65%, and 80% of supply voltage reduce starting current to 25%, 42%, and 64% of the DOL value respectively. Unlike a star-delta starter, the motor receives voltage from the transformer secondary — not from a re-wired winding — so it can develop full starting torque at any tap position. This makes auto-transformer starting the preferred choice for loaded conveyors, compressors, and high-inertia loads where star-delta starting torque is insufficient.',
        'Sakthi manufactures auto-transformer starters from 5 kVA to 500 kVA with open frame or enclosed construction, wound on CRGO laminated cores with Class F or H insulation. The starter is timed by a contactor-and-timer circuit — after a settable acceleration time, the circuit transitions to direct supply. Custom tap positions and panel-mounted automatic starters with ammeters and timers are available on request.',
      ],
    };
  }

  if (n.includes('HT') && n.includes('CONTROL')) {
    return {
      heading: 'Local control supply straight from the 11 kV or 33 kV busbar — no LT auxiliary needed.',
      paragraphs: [
        'HT control transformers step the high-voltage supply directly from 11 kV or 33 kV busbars to 110V or 240V for powering trip coils, protection relays, annunciators, and auxiliary circuits in high-voltage switchgear. At locations where there is no separately derived LT supply — rural substations, ring main units, compact secondary substations — the HT control transformer is what keeps the protection and control system energised. It is a safety-critical component: if it fails, the circuit breaker cannot trip.',
        'Sakthi manufactures HT control transformers to IS 5142 and IEC 61558 with CRGO cores and Class F/H insulation, in ratings conservatively derated for continuous 24/7 duty in an unattended substation environment. The units are compact by design — space is always at a premium inside HT switchgear panels — and are constructed to withstand the vibration, temperature cycles, and occasional voltage transients that are normal inside an operating substation.',
      ],
    };
  }

  if (p.includes('3-phase') || n.includes('3 - PHASE')) {
    return {
      heading: 'Isolated three-phase control supply for large automation panels and MCCs.',
      paragraphs: [
        'Three-phase control transformers take the 415V mains supply and provide an isolated, reduced voltage for control circuits in motor control centres, process automation panels, and large machinery where the control system itself draws significant current. Unlike single-phase types, three-phase units handle the load of large PLC backplanes, multi-axis servo amplifiers, inverter cooling fans, and SCADA auxiliary power in one compact transformer, replacing multiple single-phase units and simplifying panel wiring.',
        'Sakthi manufactures three-phase control transformers from 500 VA to 50 kVA on CRGO laminated cores with Class F or H insulation, in both open dry-type (for panel builders) and enclosed construction (for direct mounting with IP protection). Custom primary/secondary voltage combinations and multiple secondary tapping arrangements are available for OEM machine tool manufacturers, automation system integrators, and switchgear panel builders who need exactly the output voltages their control system requires.',
      ],
    };
  }

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

  if (n.includes('HEA')) {
    return {
      heading: 'High-efficiency auxiliary power — because transformer losses run every hour of every day.',
      paragraphs: [
        'An auxiliary transformer runs continuously — 24 hours a day, 365 days a year — supplying power to the control systems, instrumentation, lighting, and cooling equipment of a substation or industrial plant. Unlike a distribution transformer that runs at variable load, an auxiliary transformer often runs near-constant load. Every watt of no-load (iron) loss in the core is a watt that burns continuously regardless of what the plant is doing. HEA (High Efficiency Auxiliary) transformers use cold-rolled grain-oriented silicon steel (CRGO) laminations processed to minimise hysteresis and eddy-current losses, giving significantly lower no-load losses than conventional hot-rolled core designs.',
        'Sakthi manufactures HEA transformers to IS 5142 and IEC 61558 in ratings and configurations specified by the customer\'s switchgear or plant engineer. Core joints are step-lapped to reduce reluctance and flux density at the corners. Winding is precision copper conductor with CRGO interleaving. Class F or H insulation is standard, with the option of resin impregnation for humid environments. The result is a transformer that runs cooler, lasts longer, and costs less to operate over its service life than a conventional design.',
      ],
    };
  }

  if (n.includes('CHOKE') || n.includes('REACTOR')) {
    return {
      heading: 'Harmonic suppression and current limiting — the unsung protector of your LT network.',
      paragraphs: [
        'Variable frequency drives, UPS systems, and switched-mode power supplies all draw current in pulses rather than as a smooth sine wave. Those current pulses contain harmonics — primarily 5th and 7th order (250 Hz and 350 Hz in a 50 Hz system) — that flow back into the supply network, heating transformers and cables, causing nuisance relay trips, and interfering with metering and communications equipment. A line reactor (choke) connected in series at the drive input limits the rate of current rise, reducing the harmonic content in the drawn current by 30–50% without any tuning or maintenance.',
        'Sakthi manufactures iron-core chokes on CRGO laminated cores for 415V LT applications and air-core reactors for resonant filter circuits. The inductance, current rating, and percentage impedance are calculated from the drive rating and supply impedance — there is no single standard rating that suits every installation. Sakthi\'s engineering team will calculate the correct reactor specification from the VFD nameplate data and supply transformer impedance; contact us with these details for a quotation.',
      ],
    };
  }

  if (n.includes('APFC')) {
    return {
      heading: 'Stop paying for reactive power — APFC panels recover the cost of every kVAR.',
      paragraphs: [
        'Induction motors, welding machines, fluorescent and HID lighting, and most industrial loads draw reactive current (kVAR) in addition to the active current (kW) that does useful work. The reactive current flows through the supply transformer and cables, generating heat and voltage drop, but appearing in the bill as an inflated kVA demand and — in TNEB\'s tariff structure — as a direct surcharge when the monthly average power factor falls below 0.85. An APFC panel eliminates this by switching capacitor banks automatically to supply the reactive current locally, right at the point of consumption, so the transformer and mains only see active current.',
        'Sakthi\'s APFC panels use a microprocessor-based power factor controller relay to monitor the installation\'s power factor continuously and switch capacitor steps via contactors in 12 to 16 increments — fine enough to maintain power factor within 0.95–1.00 under varying load without hunting. Where the installation has significant variable-frequency drives or other non-linear loads, detuned reactor-capacitor banks are specified to avoid harmonic resonance between the capacitor bank and the supply impedance, which can cause capacitor failure and supply distortion.',
      ],
    };
  }

  if (n.includes('ACB')) {
    return {
      heading: 'The main incomer that protects every circuit downstream — with fully adjustable coordination.',
      paragraphs: [
        'An Air Circuit Breaker panel is the main switching and protection point for large LT installations — factories, hospitals, data centres, and commercial complexes where the incoming current exceeds the rating of an MCCB and the prospective fault current is in the range of 25 to 65 kA. The ACB\'s LSIG (Long-time, Short-time, Instantaneous, Ground-fault) trip unit has independently adjustable settings for each protection function, allowing the protection engineer to set the incomer\'s characteristics to coordinate with every downstream MCCB and MCB in the installation. A properly coordinated incomer trips only on faults that no downstream device can clear — protecting the entire installation without blacking out the whole facility for a minor fault.',
        'Sakthi assembles ACB panels with copper or aluminium busbars sized for the prospective short-circuit current, in compartment-type enclosures to IP42 or IP54 as required. The panel includes a full complement of metering — ammeter, voltmeter, power factor meter, and energy meter — so the facility manager has real-time visibility of the incoming supply. Protection, metering, and communications (Modbus RTU or BACnet) relay options are available for integration with building management or SCADA systems.',
      ],
    };
  }

  if (n.includes('HT METERING') || (n.includes('HT') && n.includes('SERVICE'))) {
    return {
      heading: 'The billing meter for every rupee of HT electricity consumed — built to TNEB specification.',
      paragraphs: [
        'An HT metering service panel houses the complete approved metering system for high-tension consumers billed at 11 kV or 33 kV — the CT, PT, energy meter, and all interconnecting wiring — in a sealed enclosure that the utility can inspect without accessing the energy supply circuit. The CT and PT carry individual CPRI type test certificates at the accuracy class mandated by CEA Metering Regulation 2006 (class 0.2S for the CT, class 0.2 for the PT for consumers above 1 MW). The energy meter is class 0.2S or 0.5S, with time-of-day recording for TOD tariff billing.',
        'Sakthi manufactures HT metering panels to TNEB specification with lead-sealed compartments and a sight glass for meter reading without breaking the seal. The enclosure material is MS powder-coated or SS 304 depending on the installation environment, and the IP rating is IP55 for outdoor metering cubicles. Every panel is tested for metering accuracy, insulation, and wiring continuity before dispatch, and the complete set — CT, PT, meter, and panel — is issued with a single commissioning test report.',
      ],
    };
  }

  if (n.includes('LTCT') || n.includes('LT CT') || n.includes('LT SERVICE') || n.includes('SERVICE PANEL') || n.includes('COMPARTMENT') || n.includes('SS-316')) {
    return {
      heading: 'Sealed LT metering for consumers above 80A — built to TNEB\'s compartment specification.',
      paragraphs: [
        'When an LT consumer\'s load exceeds 80A, TNEB requires CT-operated metering rather than a direct-connection meter. The LT CT service panel provides this metering point in a multi-compartment enclosure that separates the CT chamber, meter chamber, and terminal chamber so that the utility can verify the metering at each TNEB inspection without opening the energy supply circuit. The three-compartment or five-compartment layout follows TNEB\'s standard specification, and each compartment is independently sealable for anti-tampering compliance.',
        'Sakthi manufactures LTCT service panels in MS powder-coated and SS 316 (marine grade for coastal or corrosive environments) enclosures, with copper tinned busbars, class 0.5 or 1.0 LTCTs, and a 3-phase 4-wire digital energy meter. The SS-316 grade panels are produced to the TNEB specification for corrosion-resistant installations and include all standard provisions for TNEB sealing, viewing windows, and inspection access. Panels are tested for wiring continuity and metering accuracy before dispatch.',
      ],
    };
  }

  if (n.includes('SOLAR') || n.includes('NET-METR') || n.includes('NET METR')) {
    return {
      heading: 'The grid connection point for your rooftop solar — metered, protected, and TNEB-approved.',
      paragraphs: [
        'A solar net metering panel is the interface between a rooftop solar inverter and the TNEB distribution network. It houses the bi-directional energy meter that records both the kWh imported from the grid (when solar generation is insufficient) and the kWh exported to the grid (when the solar system generates more than the building consumes). This import/export data is the basis for the net metering settlement — the consumer pays only for the net import, and excess export is credited at the feed-in tariff. The panel also includes anti-islanding protection, which disconnects the solar inverter from the grid within the required time if the grid supply fails, preventing the inverter from energising a dead feeder.',
        'Sakthi manufactures solar net metering panels to TNEB and TNEDCL interconnection standards for LT consumers (1-phase and 3-phase) and HT consumers with large rooftop installations. The enclosure includes provision for TNEB sealing of the meter compartment, surge protection on the incoming and inverter terminals, and a clearly labelled circuit diagram on the inside of the door. Panels are supplied with a wiring diagram and commissioning checklist to assist the electrical contractor at the grid interconnection inspection.',
      ],
    };
  }

  if (n.includes('DISTRIBUTION') || n.includes('POWER BOX') || n.includes('ERACTION') || n.includes('ARIAL') || n.includes('PLATE')) {
    return {
      heading: 'From one incoming supply to every circuit in the building — distribution done right.',
      paragraphs: [
        'A distribution panel is where the incoming 415V supply is divided into the individual circuits that power every machine, lighting zone, socket outlet, and motor in a building or plant. Each outgoing feeder has its own MCCB, MCB, or isolator — sized for the load current and the downstream cable — so that a fault on any circuit is isolated by that feeder\'s device alone, without affecting the rest of the installation. The panel\'s busbar is sized for the prospective short-circuit current at the point of supply, and the incomer is coordinated with the utility\'s main fuse or incoming breaker to clear faults within the required disconnection time.',
        'Sakthi fabricates distribution panels to customer single-line diagrams, from simple pump house boards with three or four outgoing circuits to main distribution boards with 20+ feeders, sub-metering, and power quality meters. Enclosures are MS powder-coated or GI, busbars copper or aluminium, with all switchgear — MCCBs, MCBs, contactors, and earth leakage circuit breakers — from established brands. Every panel is tested for insulation resistance and wiring continuity before dispatch, with a wiring diagram and test certificate supplied.',
      ],
    };
  }

  if (n.includes('EPOXY') || n.includes('INSULATOR')) {
    return {
      heading: 'Electrical isolation you can rely on — moulded from material engineered for high voltage.',
      paragraphs: [
        'Epoxy resin insulators are the structural and electrical isolation components of HT switchgear — the parts that hold live busbars, cable terminations, and switch contacts in position while preventing current from flowing anywhere other than the intended path. The material is cycloaliphatic epoxy resin, chosen over conventional porcelain for its superior resistance to surface tracking (creep current along the surface in humid or polluted conditions), better mechanical strength-to-weight ratio, and the ability to be moulded into precise shapes that cannot be achieved in ceramic. Sakthi manufactures epoxy insulators for 11 kV and 33 kV voltage classes, with BIL ratings of 75 kV and 170 kV respectively, to IEC 60168 and IS 5350.',
        'The insulator profile — particularly the creepage distance (the surface path length from the live terminal to earth) — is designed to IEC 60815 pollution class requirements for the installation environment. A substation near a coastal area or cement plant requires a longer creepage distance than one in a clean industrial environment. Sakthi manufactures standard profiles for indoor and outdoor applications and can produce custom profiles for OEM switchgear builders. All insulators are routine-tested for power-frequency voltage withstand and visually inspected before dispatch.',
      ],
    };
  }

  if (n.includes('VIBRATORY') || n.includes('FEEDER')) {
    return {
      heading: 'Controlled material flow — no moving parts in contact with the product, no speed changes required.',
      paragraphs: [
        'A vibratory feeder conveys bulk materials along a trough by electromagnetic vibration — the drive coil energises at 50 Hz, causing the trough-spring assembly to vibrate at its mechanical resonant frequency. The material rides on this vibration, moving forward in small, rapid hops. Because the only drive element is an electromagnetic coil with no mechanical contact with the product, there are no gears, belts, or rollers to wear, jam, or contaminate the material being handled. Flow rate is controlled by adjusting the drive amplitude via a thyristor controller — continuously variable from near-zero to maximum without stopping or changing any mechanical setting.',
        'Sakthi designs vibratory feeders from first principles for each application — the spring stiffness, mass, and trough geometry are calculated to resonate at 50 Hz for the specific loaded weight. Capacity ranges from 50 kg/hr for fine pharmaceutical powders to 5000 kg/hr for bulk foundry materials. Trough material is mild steel for general industrial use, SS 304 for food-grade and chemical applications, and SS 316 for corrosive or marine-grade environments. The thyristor amplitude controller is supplied as standard, with remote setpoint input available for integration into a process control system.',
      ],
    };
  }

  if (n.includes('ENERGY AUDITING') || n.includes('MSME')) {
    return {
      heading: 'Find out exactly where your electricity bill comes from — and how much you can cut it.',
      paragraphs: [
        'For most MSME manufacturers, electricity is the second-largest operating cost after raw materials — and unlike raw material prices, electricity costs can be actively managed. An energy audit maps exactly what draws power in your plant, when it draws it, and whether that power is being used efficiently. It looks at your TNEB tariff structure and identifies whether you are in the right tariff category, whether your contract demand matches your actual demand, and whether your power factor is costing you a monthly surcharge. The output is not a generic checklist: it is a prioritised list of specific actions — with estimated investment, energy saving, and payback period for each — sized to your plant and your budget.',
        'Sakthi\'s energy auditing service covers electrical load profiling (logging current, voltage, power factor, and demand across shifts), power quality measurement (harmonics, voltage unbalance, sag/swell events), motor efficiency assessment, compressed air audit, and lighting review. We work with MSME manufacturers in Pudukkottai and across Tamil Nadu. The audit report is written in plain language — not engineering jargon — so you can act on the recommendations without needing a consultant to interpret them.',
      ],
    };
  }

  if (n.includes('TEST BENCH') || n.includes('BENCHSE')) {
    return {
      heading: 'Every CT and PT tested before it leaves — not certified on paper, verified on the bench.',
      paragraphs: [
        'An electrical test bench for instrument transformers is not a single instrument — it is a system. Testing a current transformer requires a stable, adjustable high-current source, a precision burden to load the secondary, a reference standard CT with known accuracy, and a comparator to measure the difference in ratio and phase angle between the unit under test and the reference. Testing a potential transformer requires a high-voltage source, a precision voltage divider, and a similar comparison setup. Sakthi\'s in-house test facility covers both, with a high-current source to 3000A for CT testing and a high-voltage source to 33 kV for PT testing, calibrated reference standards traceable to NABL-accredited laboratories.',
        'Every instrument transformer that leaves Sakthi\'s production line passes through this bench: ratio test at 5%, 20%, 100%, and 120% of rated current or voltage; phase displacement check at each accuracy class burden point; insulation resistance measurement; and power-frequency voltage withstand. A test certificate with the actual measured ratio error and phase displacement at each test point is issued with every unit. For customers who specify witnessed factory acceptance testing, our engineers will schedule and conduct testing in the presence of the customer\'s representative.',
      ],
    };
  }

  if (n.includes('CUSTOMER REQUIREMENT') || p.includes('customer-requirement')) {
    return {
      heading: 'When the catalogue doesn\'t have what you need — we design it from scratch.',
      paragraphs: [
        'Most instrument transformer applications are covered by standard catalogue products. But some are not. A steel plant measuring 50 kA primary current needs a CT with a non-standard ratio. A power trading company needs a CT at class 0.1 accuracy — tighter than any standard metering class. An export order specifies IEC test voltages and terminal markings that differ from IS standards. An OEM switchgear builder needs a CT that fits a specific panel dimension not matched by any standard product. These are the applications that Sakthi\'s engineering team works on under Customer Requirement Designs.',
        'The process starts with the customer\'s specification sheet — ratio, accuracy class, burden, system voltage, BIL, insulation medium, mounting, applicable standard, and any dimensional constraints. Sakthi\'s engineers calculate the core cross-section, winding turns, wire gauge, and insulation schedule from first principles to meet that specification exactly, rather than adapting the nearest standard product. Prototype and volume manufacturing are both supported. Full documentation is issued with every order: design calculation sheet, material certificate, dimensional drawing, and individual test report to the specified standard.',
      ],
    };
  }

  return {
    heading: 'Manufactured to standard. Tested before dispatch. Built to last.',
    paragraphs: [
      `Sakthi Electricals manufactures ${node.display} to the relevant IS and IEC standards at our production facility in Pudukkottai, Tamil Nadu. Every unit is tested on our in-house test bench before dispatch, and a test certificate is issued with each unit. Custom ratings, dimensions, and configurations are available — contact our engineering team with your specification.`,
      'All products are manufactured under our ISO 9001:2015 quality management system, with raw material traceability and documented production records maintained for every batch. CPRI type test reports are available for reference for all instrument transformer products.',
    ],
  };
}
